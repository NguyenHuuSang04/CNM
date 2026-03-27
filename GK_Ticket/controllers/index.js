const TicketModel = require("../models");
const { uploadFile, deleteFileByUrl } = require("../service/file.service");

const CATEGORY_OPTIONS = ["Standard", "VIP", "VVIP"];
const STATUS_OPTIONS = ["Upcoming", "Sold", "Cancelled"];
const ADDON_OPTIONS = ["Nuoc", "Giu xe", "Qua tang"];

const getTodayDate = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60 * 1000;
    return new Date(now.getTime() - offset).toISOString().split("T")[0];
};

const normalizeDate = value => {
    const raw = (value || "").trim();
    if (!raw) return "";

    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString().split("T")[0];
};

const normalizeArray = value => {
    if (Array.isArray(value)) return value;
    return value ? [value] : [];
};

const getFormMeta = () => ({
    categories: CATEGORY_OPTIONS,
    statuses: STATUS_OPTIONS,
    addOnOptions: ADDON_OPTIONS,
});

const calculateBusiness = payload => {
    const quantity = Number(payload.quantity) || 0;
    const price = Number(payload.pricePerTicket) || 0;
    const totalAmount = quantity * price;

    let discountRate = 0;
    if (payload.category === "VIP" && quantity >= 4) discountRate = 0.1;
    if (payload.category === "VVIP" && quantity >= 2) discountRate = 0.15;

    const finalAmount = Math.round(totalAmount * (1 - discountRate));

    return {
        totalAmount,
        finalAmount,
        discountApplied: discountRate > 0,
    };
};

const buildPayload = (body, imageUrl = "") => ({
    eventName: (body.eventName || "").trim(),
    holderName: (body.holderName || "").trim(),
    category: (body.category || "").trim(),
    quantity: (body.quantity || "").trim(),
    pricePerTicket: (body.pricePerTicket || "").trim(),
    eventDate: normalizeDate(body.eventDate),
    status: (body.status || "Upcoming").trim(),
    addOns: normalizeArray(body.addOns),
    imageUrl,
});

const validatePayload = payload => {
    const errors = [];

    if (!payload.eventName) errors.push("Ten su kien khong duoc de trong.");
    if (!payload.holderName) errors.push("Ten nguoi so huu ve khong duoc de trong.");

    const quantity = Number(payload.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
        errors.push("So luong phai la so nguyen > 0.");
    }

    const price = Number(payload.pricePerTicket);
    if (!Number.isFinite(price) || price <= 0) {
        errors.push("Gia ve phai > 0.");
    }

    if (!payload.eventDate) {
        errors.push("Ngay su kien khong hop le.");
    } else if (payload.eventDate < getTodayDate()) {
        errors.push("Ngay su kien khong duoc nho hon ngay hien tai.");
    }

    if (!CATEGORY_OPTIONS.includes(payload.category)) {
        errors.push("Category chi nhan Standard / VIP / VVIP.");
    }

    if (!STATUS_OPTIONS.includes(payload.status)) {
        errors.push("Status chi nhan Upcoming / Sold / Cancelled.");
    }

    if (payload.addOns.some(item => !ADDON_OPTIONS.includes(item))) {
        errors.push("Quyen loi chon khong hop le.");
    }

    return errors;
};

const Controller = {};

Controller.get = async (req, res) => {
    try {
        const q = (req.query.q || "").trim().toLowerCase();
        const status = (req.query.status || "").trim();

        const messageMap = {
            created: "Them ve thanh cong.",
            updated: "Cap nhat ve thanh cong.",
            deleted: "Xoa ve thanh cong.",
        };

        let tickets = await TicketModel.getTickets();

        if (q) {
            tickets = tickets.filter(item => {
                const eventName = (item.eventName || "").toLowerCase();
                const holderName = (item.holderName || "").toLowerCase();
                return eventName.includes(q) || holderName.includes(q);
            });
        }

        if (status && STATUS_OPTIONS.includes(status)) {
            tickets = tickets.filter(item => item.status === status);
        }

        tickets.sort((a, b) => {
            const aTime = new Date(a.createdAt || 0).getTime();
            const bTime = new Date(b.createdAt || 0).getTime();
            return bTime - aTime;
        });

        return res.render("index", {
            tickets,
            q: req.query.q || "",
            status,
            statuses: STATUS_OPTIONS,
            alertMessage: messageMap[req.query.msg] || "",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Loi khi lay danh sach ve.");
    }
};

Controller.getOne = async (req, res) => {
    try {
        const ticket = await TicketModel.getTicketById(req.params.id);
        if (!ticket) return res.status(404).send("Khong tim thay ve.");
        return res.render("detail", { ticket });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Loi khi lay chi tiet ve.");
    }
};

Controller.showCreateForm = (_req, res) => {
    return res.render("create", {
        errors: [],
        oldData: {
            category: "Standard",
            status: "Upcoming",
            eventDate: getTodayDate(),
            addOns: [],
        },
        formMeta: getFormMeta(),
    });
};

Controller.create = async (req, res) => {
    const payload = buildPayload(req.body);
    const errors = validatePayload(payload);

    if (!req.file) errors.push("Vui long chon anh ve.");

    if (errors.length) {
        return res.status(400).render("create", {
            errors,
            oldData: payload,
            formMeta: getFormMeta(),
        });
    }

    try {
        const business = calculateBusiness(payload);
        payload.totalAmount = business.totalAmount;
        payload.finalAmount = business.finalAmount;
        payload.discountApplied = business.discountApplied;

        payload.imageUrl = await uploadFile(req.file);
        await TicketModel.createTicket(payload);

        return res.redirect("/tickets?msg=created");
    } catch (error) {
        console.error(error);
        return res.status(500).render("create", {
            errors: ["Khong the them ve. Vui long thu lai."],
            oldData: payload,
            formMeta: getFormMeta(),
        });
    }
};

Controller.showEditForm = async (req, res) => {
    try {
        const ticket = await TicketModel.getTicketById(req.params.id);
        if (!ticket) return res.status(404).send("Khong tim thay ve.");

        return res.render("edit", {
            ticket,
            errors: [],
            formMeta: getFormMeta(),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Loi khi tai form sua.");
    }
};

Controller.update = async (req, res) => {
    try {
        const current = await TicketModel.getTicketById(req.params.id);
        if (!current) return res.status(404).send("Khong tim thay ve.");

        const payload = buildPayload(req.body, current.imageUrl || "");
        const errors = validatePayload(payload);

        if (errors.length) {
            return res.status(400).render("edit", {
                ticket: { ...current, ...payload },
                errors,
                formMeta: getFormMeta(),
            });
        }

        let newImageUrl = "";
        if (req.file) {
            newImageUrl = await uploadFile(req.file);
            payload.imageUrl = newImageUrl;
        }

        const business = calculateBusiness(payload);
        payload.totalAmount = business.totalAmount;
        payload.finalAmount = business.finalAmount;
        payload.discountApplied = business.discountApplied;

        await TicketModel.updateTicket(req.params.id, payload);

        if (newImageUrl && current.imageUrl) {
            await deleteFileByUrl(current.imageUrl);
        }

        return res.redirect("/tickets?msg=updated");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Khong the cap nhat ve.");
    }
};

Controller.delete = async (req, res) => {
    try {
        const current = await TicketModel.getTicketById(req.params.id);
        if (!current) return res.status(404).send("Khong tim thay ve.");

        await TicketModel.deleteTicket(req.params.id);
        if (current.imageUrl) {
            await deleteFileByUrl(current.imageUrl);
        }

        return res.redirect("/tickets?msg=deleted");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Khong the xoa ve.");
    }
};

module.exports = Controller;

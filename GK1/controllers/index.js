const SubjectModel = require("../models/index");
const { uploadFile, deleteFileByUrl } = require("../service/file.service");
const Controller = {};

const DELIVERY_OPTIONS = ["offline", "online", "hybrid"];
const CREDIT_OPTIONS = [2, 3, 4, 5];
const FEATURE_OPTIONS = ["lab", "project", "slide"];

const normalizeFeatures = value => {
    if (Array.isArray(value)) {
        return value;
    }

    return value ? [value] : [];
};

const getFormOptions = () => ({
    deliveryOptions: DELIVERY_OPTIONS,
    creditOptions: CREDIT_OPTIONS,
    featureOptions: FEATURE_OPTIONS,
});

const validateSubjectData = data => {
    const errors = [];

    if (!data.name || !data.name.trim()) {
        errors.push("Ten mon hoc khong duoc de trong.");
    }

    if (!data.type || !data.type.trim()) {
        errors.push("Loai mon hoc khong duoc de trong.");
    }

    const semesterNumber = Number(data.semester);
    if (!data.semester || !Number.isInteger(semesterNumber) || semesterNumber < 1 || semesterNumber > 12) {
        errors.push("Hoc ky phai la so nguyen tu 1 den 12.");
    }

    if (!data.faculty || !data.faculty.trim()) {
        errors.push("Khoa khong duoc de trong.");
    }

    if (!DELIVERY_OPTIONS.includes(data.delivery)) {
        errors.push("Hinh thuc hoc khong hop le.");
    }

    const creditNumber = Number(data.credits);
    if (!CREDIT_OPTIONS.includes(creditNumber)) {
        errors.push("So tin chi chi duoc chon 2, 3, 4 hoac 5.");
    }

    if (!Array.isArray(data.features) || data.features.some(item => !FEATURE_OPTIONS.includes(item))) {
        errors.push("Tien ich mon hoc khong hop le.");
    }

    return errors;
};

// method get sẽ thực hiện lấy all các subject từ table Subject
// B1: Thực hiện lấy tất cả các subject từ table Subject bằng method getSubject của SubjectModel mà ta đã tạo
// B2: trả về thông tin của các subject đã lấy
Controller.get = async (req, res) => {
    try {
        const keyword = (req.query.q || "").trim().toLowerCase();
        const messageMap = {
            created: "Them mon hoc thanh cong.",
            updated: "Cap nhat mon hoc thanh cong.",
            deleted: "Xoa mon hoc thanh cong.",
        };
        const alertMessage = messageMap[req.query.msg] || "";
        let subjects = await SubjectModel.getSubjects();

        if (keyword) {
            subjects = subjects.filter(subject => {
                const subjectName = (subject.name || "").toLowerCase();
                return subjectName.includes(keyword);
            });
        }

        // return res.status(200).json(subjects);
        return res.render("index", {
            subjects: Array.isArray(subjects) ? subjects : [],
            q: req.query.q || "",
            alertMessage,
        }); // truyền thông tin của các subject đã lấy vào file index.ejs
    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi khi đang lấy danh sách môn học");
    }
};

// method getone sẽ thực hiện lấy thông tin của Subject dựa vào id
// B1: lấy id của subject từ param của request
// B2: thực hiện lấy thông tin của subject dựa vào id bằng method getOneSubject của SubjectModel mà ta đã tạo
// B3: nếu subject tồn tại thì trả về thông tin cảu subject
// B4: Xử lý lỗi nếu có
Controller.getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await SubjectModel.getOneSubject(id);
        if (subject) {
            return res.render("edit", {
                subject: {
                    ...subject,
                    delivery: subject.delivery || "offline",
                    credits: subject.credits || "3",
                    features: normalizeFeatures(subject.features),
                },
                errors: [],
                formOptions: getFormOptions(),
            });
        }

        return res.status(404).send("Khong tim thay mon hoc.");
    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi khi lấy 1 môn học");
    }

}

Controller.showCreateForm = (req, res) => {
    return res.render("create", {
        errors: [],
        oldData: {
            delivery: "offline",
            credits: "3",
            features: [],
        },
        formOptions: getFormOptions(),
    });
};

Controller.create = async (req, res) => {
    const payload = {
        name: (req.body.name || "").trim(),
        type: (req.body.type || "").trim(),
        semester: (req.body.semester || "").trim(),
        faculty: (req.body.faculty || "").trim(),
        delivery: (req.body.delivery || "offline").trim(),
        credits: (req.body.credits || "3").trim(),
        features: normalizeFeatures(req.body.features),
        image: "",
    };

    const errors = validateSubjectData(payload);
    if (!req.file) {
        errors.push("Vui long chon hinh anh.");
    }

    if (errors.length > 0) {
        return res.status(400).render("create", {
            errors,
            oldData: payload,
            formOptions: getFormOptions(),
        });
    }

    try {
        payload.image = await uploadFile(req.file);
        await SubjectModel.createSubject(payload);
        return res.redirect("/subjects?msg=created");
    } catch (error) {
        console.log(error);
        return res.status(500).render("create", {
            errors: ["Khong the them mon hoc. Vui long thu lai."],
            oldData: payload,
            formOptions: getFormOptions(),
        });
    }
};

Controller.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const subject = await SubjectModel.getOneSubject(id);
        if (!subject) {
            return res.status(404).send("Khong tim thay mon hoc.");
        }

        if (subject.image) {
            await deleteFileByUrl(subject.image);
        }

        await SubjectModel.deleteSubject(id, subject.name);

        return res.redirect("/subjects?msg=deleted");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Khong the xoa mon hoc.");
    }
};

Controller.update = async (req, res) => {
    const { id } = req.params;

    try {
        const currentSubject = await SubjectModel.getOneSubject(id);
        if (!currentSubject) {
            return res.status(404).send("Khong tim thay mon hoc.");
        }

        const payload = {
            name: currentSubject.name,
            type: (req.body.type || "").trim(),
            semester: (req.body.semester || "").trim(),
            faculty: (req.body.faculty || "").trim(),
            delivery: (req.body.delivery || "offline").trim(),
            credits: (req.body.credits || "3").trim(),
            features: normalizeFeatures(req.body.features),
            image: currentSubject.image || "",
        };

        const errors = validateSubjectData(payload);
        if (errors.length > 0) {
            return res.status(400).render("edit", {
                subject: { ...currentSubject, ...payload },
                errors,
                formOptions: getFormOptions(),
            });
        }

        let newImageUrl = "";
        if (req.file) {
            newImageUrl = await uploadFile(req.file);
            payload.image = newImageUrl;
        }

        await SubjectModel.updateSubject(id, currentSubject.name, payload);

        if (newImageUrl && currentSubject.image) {
            await deleteFileByUrl(currentSubject.image);
        }

        return res.redirect("/subjects?msg=updated");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Khong the cap nhat mon hoc.");
    }
};

module.exports = Controller;
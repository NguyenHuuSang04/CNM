const { randomUUID } = require("crypto");
const { dynamodb } = require("../utils/aws-helper");

const TABLE_NAME = process.env.TABLE_NAME || "EventTickets";

const TicketModel = {
    async createTicket(data) {
        const now = new Date().toISOString();

        const item = {
            ticketId: randomUUID(),
            eventName: data.eventName,
            holderName: data.holderName,
            category: data.category,
            quantity: Number(data.quantity),
            pricePerTicket: Number(data.pricePerTicket),
            totalAmount: Number(data.totalAmount),
            finalAmount: Number(data.finalAmount),
            discountApplied: Boolean(data.discountApplied),
            eventDate: data.eventDate,
            status: data.status,
            addOns: Array.isArray(data.addOns) ? data.addOns : [],
            imageUrl: data.imageUrl,
            createdAt: now,
            updatedAt: now,
        };

        await dynamodb.put({ TableName: TABLE_NAME, Item: item }).promise();
        return item;
    },



    async getTickets() {
        const result = await dynamodb.scan({ TableName: TABLE_NAME }).promise();
        return result.Items || [];
    },

    async getTicketById(ticketId) {
        const result = await dynamodb.get({
            TableName: TABLE_NAME,
            Key: { ticketId },
        }).promise();

        return result.Item || null;
    },

    async updateTicket(ticketId, data) {
        const result = await dynamodb.update({
            TableName: TABLE_NAME,
            Key: { ticketId },
            UpdateExpression: "set eventName=:eventName, holderName=:holderName, category=:category, quantity=:quantity, pricePerTicket=:pricePerTicket, totalAmount=:totalAmount, finalAmount=:finalAmount, discountApplied=:discountApplied, eventDate=:eventDate, #status=:status, addOns=:addOns, imageUrl=:imageUrl, updatedAt=:updatedAt",
            ExpressionAttributeNames: {
                "#status": "status",
            },
            ExpressionAttributeValues: {
                ":eventName": data.eventName,
                ":holderName": data.holderName,
                ":category": data.category,
                ":quantity": Number(data.quantity),
                ":pricePerTicket": Number(data.pricePerTicket),
                ":totalAmount": Number(data.totalAmount),
                ":finalAmount": Number(data.finalAmount),
                ":discountApplied": Boolean(data.discountApplied),
                ":eventDate": data.eventDate,
                ":status": data.status,
                ":addOns": Array.isArray(data.addOns) ? data.addOns : [],
                ":imageUrl": data.imageUrl,
                ":updatedAt": new Date().toISOString(),
            },
            ReturnValues: "ALL_NEW",
        }).promise();

        return result.Attributes || null;
    },

    async deleteTicket(ticketId) {
        await dynamodb.delete({
            TableName: TABLE_NAME,
            Key: { ticketId },
        }).promise();
    },
};

module.exports = TicketModel;

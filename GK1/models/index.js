const { dynamodb } = require("../utils/aws-helper"); // import DynamoDB service đã khởi tạo từ file aws-helper.js
const { v4: uuidv4 } = require("uuid"); // Import thư viện uuid để tạo unique ID cho subject 

const tableName = "SN_OnTapGK"; // Tên của table đã tạo trong DynamoDB

// Tạo 1 object SubjectModel chứa các method CRUD thao tác với dynamoDB
const SubjectModel = {

    // Method thêm 1 môn học vào table dynamo
    createSubject: async subjectData => {
        const subjectId = uuidv4();// b1: tạo unique Id cho subject
        const params = { // b2: tạo object param chứa thông tin của object
            TableName: tableName, // lấy tên của table trong dynamo
            Item: {
                // Thông tin của subject cần thêm
                id: subjectId,
                name: subjectData.name,
                type: subjectData.type,
                semester: subjectData.semester,
                faculty: subjectData.faculty,
                delivery: subjectData.delivery,
                credits: subjectData.credits,
                features: subjectData.features,
                image: subjectData.image
            }
        };
        try {
            await dynamodb.put(params).promise(); // B3: thêm subject vào table subject
            return { id: subjectId, ...subjectData };
        } catch (error) {
            console.error("Lỗi khi tạo subject: ", error);
            throw error;
        }
    },

    // Method lấy danh sách môn học từ table
    // B1: tạo 1 object params chứa thông tin của table subject
    // B2: Thực hiện lấy all subject từ table subject bằng method scan
    // B3: trả thong tin của các môn học đã lấy
    getSubjects: async () => {
        const params = {
            TableName: tableName,
        };
        try {
            const subject = await dynamodb.scan(params).promise();
            return subject.Items;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách môn học", error);
            throw error;
        }
    },

    //Update môn học 
    // B1: tạo 1 object param chứa thông tin của subject cần update
    // B2: thực hiện cập nhật thông tin của subject bằng method update
    // B3: Trả về thông tin của subject đã cập nhật
    // B4: Xử lý lỗi nếu có
    updateSubject: async (subjectId, oldName, subjectData) => {
        const params = {
            TableName: tableName,
            Key: {
                id: subjectId,
                name: oldName,
            },
            UpdateExpression: "set #t = :type, #s = :semester, #f = :faculty, #d = :delivery, #c = :credits, #ft = :features, #i = :image", // cập nhật các trường
            ExpressionAttributeNames: {
                "#t": "type",
                "#s": "semester",
                "#f": "faculty",
                "#d": "delivery",
                "#c": "credits",
                "#ft": "features",
                "#i": "image"
            },
            //Giá trị mới của các trường cần update
            ExpressionAttributeValues: {
                ":type": subjectData.type,
                ":semester": subjectData.semester,
                ":faculty": subjectData.faculty,
                ":delivery": subjectData.delivery,
                ":credits": subjectData.credits,
                ":features": subjectData.features,
                ":image": subjectData.image,
            },
            ReturnValues: "ALL_NEW", // trả về thông tin của subject sau khi cập nhật
        };

        try {
            const updatedSubject = await dynamodb.update(params).promise();
            return updatedSubject.Attributes; // trả về thông tin của môn học sau khi cập nhật
        } catch (error) {
            console.error("Lỗi khi cập nhật môn học", error);
            throw error;
        }
    },

    // Method delete xóa môn học khỏi table
    // B1: tạo 1 object params chứa thông tin của subject cần xóa
    // B2: thực hiện xóa bằng method delete
    // B3: trả về thông tin của subject đã xóa 
    // b4: xử lý lỗi nếu có
    deleteSubject: async (subjectId, name) => {
        const params = {
            TableName: tableName,
            Key: {
                id: subjectId, // id là partition key
                name: name, // có thêm sort key nên cần thêm name vào key
            },
        };
        try {
            await dynamodb.delete(params).promise();
            return { id: subjectId }; // trả về thông tin của subject sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xóa môn học", error);
            throw error;
        }
    },

    // Get 1 môn học theo id
    // B1: tạo 1 object params chứa thông tin của subject cần lấy
    // B2: Thực hiện lấy thông tin của subject bằng method query
    // B3: Trả về thông tin của subject đã lấy
    // B4: xử lý lỗi nếu có
    getOneSubject: async subjectId => {
        const params = {
            TableName: tableName,
            KeyConditionExpression: "id = :id", // điều kiện để lấy subject là dựa trên subjectId
            //Giá trị của điều kiện trên
            ExpressionAttributeValues: {
                ":id": subjectId,
            }
        };
        try {
            const data = await dynamodb.query(params).promise(); // lấy thông tin subject dựa trên subjectId trên dynamo
            return data.Items[0]; // trả về thông tin subject đã lấy ( chỉ có 1 )
        } catch (error) {
            console.error("Lỗi khi lấy môn học bằng id: ", error);
            throw error;
        }
    }
}

module.exports = SubjectModel;
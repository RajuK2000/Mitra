const mongoose = require("mongoose")
const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_LOACL);
        console.log("Database Connected!");

    } catch (error) {
        console.log("STATUS:", error?.response?.status);
        console.log("SERVER RESPONSE:", error?.response?.data);
        console.log("REQUEST:", error?.config?.data);
    }
}
module.exports = ConnectDB
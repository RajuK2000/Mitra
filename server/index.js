const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const userRoutes = require("./routes/userRoutes");
const userLogin = require("./routes/userlogin");
const messagesRoutes = require("./routes/messagesRoute")
const ConnectDB = require("./config/db");

app.use(cors())

ConnectDB()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api",userRoutes);
app.use("/api",userLogin);
app.use("/api",messagesRoutes);


app.listen(port, () => {
    console.log("App running on port", port);
});

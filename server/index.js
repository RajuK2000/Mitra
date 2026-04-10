const express = require("express");
const app = express();
const port = 3000;
const userRoutes = require("./routes/userRoutes");
const ConnectDB = require("./config/db");

ConnectDB()
app.use(express.json());
app.use("/api",userRoutes);

app.listen(port, () => {
    console.log("App running on port", port);
});

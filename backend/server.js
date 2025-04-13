const express = require('express');
const cors = require('cors');
const mongoose=require('mongoose');
const mysql = require('mysql2');
require("dotenv").config();
const bodyParser= require("body-parser");
const path = require("path");

const signupRoutes = require("./routes/signupRoutes");
const contactRoutes = require("./routes/contactRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const loginRoutes = require("./routes/loginRoutes");
const submitRoutes = require("./routes/submitRoutes");
const adminLogin = require("./routes/adminLogin");
//const eventRoutes = require("./routes/eventRoutes");
const viewReportRoutes = require("./routes/viewReportRoutes");
const dispEventRoutes = require("./routes/dispEventRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/files", express.static(path.join(__dirname, "./public/pdfFiles")));
app.use("/", signupRoutes); //we can give anything instead of /
app.use("/", loginRoutes);
app.use("/", submitRoutes);
app.use("/", downloadRoutes);
app.use("/", adminLogin);
//app.use("/",eventRoutes);
app.use("/",contactRoutes);
app.use("/",viewReportRoutes);
app.use("/",dispEventRoutes);

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`The server is running at the port ${PORT}`)
});
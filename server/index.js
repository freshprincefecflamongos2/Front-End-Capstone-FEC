require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");


app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/dist")));

const PORT = process.env.PORT || 3000;

app.listen(PORT);
console.log(`Listening at http://localhost:${PORT}`);

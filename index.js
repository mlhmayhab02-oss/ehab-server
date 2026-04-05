const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "ehab" && password === "1234") {
        res.send("success");
    } else {
        res.send("error");
    }
});

app.get("/", (req, res) => {
    res.send("Server is working 🚀");
});

app.listen(3000);

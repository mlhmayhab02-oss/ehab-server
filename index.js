const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   MONGO DB CONNECTION
========================= */

mongoose.connect("mongodb+srv://<db_username>:miPbzmZrX7G1HEO7@cluster0.gga5zue.mongodb.net/?appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* =========================
   USER MODEL
========================= */

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String
});

const User = mongoose.model("User", UserSchema);

/* =========================
   REGISTER
========================= */

app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const exists = await User.findOne({ username });

    if (exists) {
        return res.json({ success: false, message: "المستخدم موجود" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hashed
    });

    await user.save();

    res.json({ success: true, message: "تم إنشاء الحساب" });
});

/* =========================
   LOGIN
========================= */

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.json({ success: false, message: "غير موجود" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.json({ success: false, message: "كلمة المرور خطأ" });
    }

    res.json({ success: true, message: "تم الدخول" });
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});

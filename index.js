const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;

const SECRET = "snowchat_secret_key";

app.use(cors());
app.use(express.json());

/* ================== MONGO ================== */

const mongoURI =
"mongodb+srv://mlhmayhab02_db_user:miPbzmZrX7G1HEO7@cluster0.gga5zue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ Mongo Error:", err));

/* ================== USER MODEL ================== */

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // 🔥 بيانات البروفايل
    name: { type: String, default: "User Account" },
    avatar: { type: String, default: "" }
});

const User = mongoose.model("User", userSchema);

/* ================== AUTH MIDDLEWARE ================== */

function auth(req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ message: "No token" });
    }

    try {
        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

/* ================== HOME ================== */

app.get("/", (req, res) => {
    res.send("SNOWCHAT SERVER WORKING");
});

/* ================== REGISTER ================== */

app.post("/api/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        const exists = await User.findOne({ username });

        if (exists) {
            return res.json({
                success: false,
                message: "اسم المستخدم موجود"
            });
        }

        const user = new User({ username, password });
        await user.save();

        res.json({
            success: true,
            message: "تم إنشاء الحساب"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

/* ================== LOGIN ================== */

app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username, password });

        if (!user) {
            return res.json({
                success: false,
                message: "خطأ في البيانات"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "تم تسجيل الدخول",
            token
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

/* ================== GET USER ================== */

app.get("/api/me", auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json(user);
});

/* ================== UPDATE NAME ================== */

app.post("/api/update-name", auth, async (req, res) => {
    const { name } = req.body;

    await User.findByIdAndUpdate(req.user.id, { name });

    res.json({ success: true });
});

/* ================== UPDATE AVATAR ================== */

app.post("/api/update-avatar", auth, async (req, res) => {
    const { avatar } = req.body;

    await User.findByIdAndUpdate(req.user.id, { avatar });

    res.json({ success: true });
});

/* ================== START ================== */

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

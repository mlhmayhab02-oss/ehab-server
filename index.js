const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

// لكي يستطيع السيرفر قراءة البيانات القادمة من Sketchware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// اتصال بقاعدة البيانات MongoDB
const MONGO_URI = "mongodb+srv://ehab:ehab123456@cluster0.xm4kwks.mongodb.net/test";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ المتصل بقاعدة البيانات بنجاح"))
    .catch(err => console.log("❌ فشل الاتصال:", err));

// تعريف شكل بيانات المستخدم
const User = mongoose.model("User", {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// --- [ 1. مسار إنشاء الحساب ] ---
app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // التأكد إذا كان المستخدم موجوداً
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.send("exists"); // سيرد بكلمة exists
        }

        const newUser = new User({ username, password });
        await newUser.save();
        res.send("success"); // سيرد بكلمة success

    } catch (error) {
        res.status(500).send("error");
    }
});

// --- [ 2. مسار تسجيل الدخول ] ---
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // البحث عن المستخدم ببياناته
        const user = await User.findOne({ username, password });
        
        if (user) {
            res.send("success"); // بيانات صحيحة
        } else {
            res.send("error"); // بيانات خاطئة
        }

    } catch (error) {
        res.status(500).send("error");
    }
});

// اختبار عمل السيرفر
app.get("/", (req, res) => {
    res.send("Server is running! 🚀");
});

app.listen(port, () => {
    console.log(`🚀 السيرفر يعمل على المنفذ ${port}`);
});

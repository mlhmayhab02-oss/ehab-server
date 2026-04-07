const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

// مهم جداً لـ Render
app.set("trust proxy", 1);

// قراءة البيانات
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🔥 رابط MongoDB
const MONGO_URI = "mongodb+srv://ehab:ehab123456@cluster0.xm4kwks.mongodb.net/test";

// اتصال سريع ومستقر
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ Error:", err));

// نموذج المستخدم
const User = mongoose.model("User", {
    username: String,
    password: String
});

// نموذج الرسائل
const Message = mongoose.model("Message", {
    room: String,
    msg: String,
    time: { type: Date, default: Date.now }
});

// تسجيل
app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.send("exists");

        await new User({ username, password }).save();
        res.send("success");

    } catch {
        res.send("error");
    }
});

// تسجيل دخول
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username, password });
        res.send(user ? "success" : "error");

    } catch {
        res.send("error");
    }
});

// 🔥 إرسال رسالة + حذف تلقائي بعد 5 ثواني
app.post("/send", async (req, res) => {
    try {
        const { room, msg } = req.body;

        const savedMsg = await new Message({ room, msg }).save();

        // حذف بعد 5 ثواني بدون تعليق السيرفر
        setTimeout(() => {
            Message.findByIdAndDelete(savedMsg._id).exec();
        }, 5000);

        res.send("sent");

    } catch {
        res.send("error");
    }
});

// 🔥 جلب الرسائل (سريع جداً)
app.get("/messages", async (req, res) => {
    try {
        const room = req.query.room;
        const after = parseInt(req.query.after || "0");

        const msgs = await Message.find({
            room: room,
            time: { $gt: new Date(after) }
        }).sort({ time: 1 }).lean(); // 🔥 lean = أسرع

        res.json(msgs);

    } catch {
        res.send("error");
    }
});

// منع النوم (اختياري لكن قوي)
app.get("/ping", (req, res) => {
    res.send("pong");
});

// الصفحة الرئيسية
app.get("/", (req, res) => {
    res.send("Server is working 🚀");
});

// تشغيل
app.listen(port, () => {
    console.log("🚀 Server running on port " + port);
});

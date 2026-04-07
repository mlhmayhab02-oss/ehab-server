const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

// قراءة البيانات
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🔥 رابط MongoDB
const MONGO_URI = "mongodb+srv://ehab:ehab123456@cluster0.xm4kwks.mongodb.net/test";

// اتصال بقاعدة البيانات
mongoose.connect(MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ Error:", err));

// نموذج المستخدم
const User = mongoose.model("User", {
    username: String,
    password: String
});

// ✅ نموذج الرسائل
const Message = mongoose.model("Message", {
    room: String,
    msg: String,
    time: { type: Date, default: Date.now }
});


// ✅ تسجيل حساب جديد
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.send("exists");
        }

        const newUser = new User({ username, password });
        await newUser.save();

        res.send("success");

    } catch (err) {
        res.send("error");
    }
});


// ✅ تسجيل الدخول
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });

        if (user) {
            res.send("success");
        } else {
            res.send("error");
        }

    } catch (err) {
        res.send("error");
    }
});


// 🔥 إرسال رسالة
app.post("/send", async (req, res) => {
    const { room, msg } = req.body;

    try {
        const newMsg = new Message({ room, msg });
        await newMsg.save();

        res.send("sent");

    } catch (err) {
        res.send("error");
    }
});


// 🔥🔥🔥 جلب الرسائل (المعدل الصح)
app.get("/messages", async (req, res) => {
    const room = req.query.room;
    const after = req.query.after || 0;

    try {
        const msgs = await Message.find({
            room: room,
            time: { $gt: new Date(parseInt(after)) }
        }).sort({ time: 1 });

        res.json(msgs); // 🔥 يرجع JSON

    } catch (err) {
        res.send("error");
    }
});


// اختبار السيرفر
app.get("/", (req, res) => {
    res.send("Server is working 🚀");
});


// تشغيل السيرفر
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

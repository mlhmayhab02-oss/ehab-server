
const express = require("express"); // استيراد مكتبة Express
const app = express(); // إنشاء تطبيق Express جديد
const port = process.env.PORT || 3000; // تحديد المنفذ الذي سيعمل عليه السيرفر (3000 بشكل افتراضي)

// لتعامل السيرفر مع البيانات المرسلة عبر POST بشكل صحيح
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// إعداد نقطة النهاية لتسجيل الدخول عبر POST
app.post("/login", (req, res) => {
    const { username, password } = req.body; // استلام اسم المستخدم وكلمة المرور من التطبيق

    // التحقق من اسم المستخدم وكلمة المرور
    if (username === "ehab" && password === "1234") {
        res.send("success"); // إذا كانت البيانات صحيحة، يتم إرسال "success"
    } else {
        res.send("error"); // إذا كانت البيانات خاطئة، يتم إرسال "error"
    }
});

// إعداد نقطة النهاية الأساسية للسيرفر (اختبار أن السيرفر يعمل)
app.get("/", (req, res) => {
    res.send("Server is working 🚀"); // إرسال رسالة بسيطة لتأكيد أن السيرفر يعمل
});

// تشغيل السيرفر على المنفذ المحدد
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

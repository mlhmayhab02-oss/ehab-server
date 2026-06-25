const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// تفعيل حزمة CORS للسماح لتطبيق الهاتف بالاتصال بالسيرفر بدون مشاكل أمنية
app.use(cors());
// تفعيل استقبال البيانات بصيغة JSON القادمة من الواجهة
app.use(express.json());

// رابط المونجو الخاص بك المتصل بـ Cluster0
const mongoURI = "mongodb+srv://mlhmayhab02_db_user:w1PhzmZrY7G1HEG7@cluster0.ggs1zue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح! 🚀'))
  .catch(err => console.log('خطأ في الاتصال بمونجو:', err));

// إنشاء هيكل جدول المستخدمين (Schema) داخل قاعدة البيانات
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// الصفحة الرئيسية للسيرفر للتأكد من أنه يعمل بالمتصفح
app.get('/', (req, res) => {
  res.send('سيرفر SNOWCHAT يعمل بنجاح وقاعدة البيانات متصلة! 🚀');
});

// المسار (API Route) الخاص باستقبال بيانات التسجيل وحفظها
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // التأكد من أن اسم المستخدم غير محجوز مسبقاً
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'اسم المستخدم مسجل مسبقاً' });
    }

    // حفظ المستخدم الجديد في قاعدة البيانات
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ success: true, message: 'تم إنشاء الحساب بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'حدث خطأ في السيرفر داخلي' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

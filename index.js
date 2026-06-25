const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// إعداد الـ CORS بشكل مفتوح تماماً وموثوق للمتصفحات
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// رابط المونجو الخاص بك
const mongoURI = "mongodb+srv://mlhmayhab02_db_user:w1PhzmZrY7G1HEG7@cluster0.ggs1zue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح! 🚀'))
  .catch(err => console.log('خطأ في الاتصال بمونجو:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.send('سيرفر SNOWCHAT يعمل بنجاح وقاعدة البيانات متصلة! 🚀');
});

// استقبال الطلب وحفظه
app.post('/api/register', async (req, res) => {
  // تفعيل الـ Headers يدوياً لضمان تخطي أي حظر من المتصفح
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  try {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'اسم المستخدم مسجل مسبقاً' });
    }

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

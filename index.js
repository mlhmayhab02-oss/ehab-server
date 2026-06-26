const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

/* ======================
   MIDDLEWARE
====================== */

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

/* ======================
   MONGO DB CONNECTION
====================== */

const mongoURI = "mongodb+srv://mlhmayhab02_db_user:w1PhzmZrY7G1HEG7@cluster0.ggs1zue.mongodb.net/snowchat?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log('✅ تم الاتصال بقاعدة البيانات بنجاح'))
  .catch(err => console.log('❌ خطأ في MongoDB:', err));

/* ======================
   USER MODEL
====================== */

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

/* ======================
   TEST ROUTE
====================== */

app.get('/', (req, res) => {
  res.send('🚀 SNOWCHAT SERVER IS RUNNING');
});

/* ======================
   REGISTER ROUTE
====================== */

app.post('/api/register', async (req, res) => {

  try {

    console.log("📩 Request Body:", req.body);

    const { username, password } = req.body;

    // تحقق من البيانات
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "البيانات ناقصة"
      });
    }

    // تحقق من التكرار
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "اسم المستخدم موجود مسبقاً"
      });
    }

    // إنشاء المستخدم
    const newUser = new User({ username, password });
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "تم إنشاء الحساب بنجاح"
    });

  } catch (error) {

    // 🔴 مهم جداً لمعرفة المشكلة الحقيقية
    console.log("❌ SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/* ======================
   START SERVER
====================== */

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

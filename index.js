const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// MongoDB URI
const mongoURI = "mongodb+srv://mlhmayhab02_db_user:w1PhzmZrX7G1HEG7@cluster0.gga5zue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected Successfully 🚀'))
  .catch(err => console.log('MongoDB Error:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// اختبار السيرفر
app.get('/', (req, res) => {
  res.send('SNOWCHAT SERVER WORKING 🚀');
});


// ================= REGISTER =================
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'اسم المستخدم موجود مسبقاً'
      });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في السيرفر'
    });
  }
});


// ================= LOGIN =================
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'ليس لديك حساب'
      });
    }

    res.json({
      success: true,
      message: 'تم تسجيل الدخول'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في السيرفر'
    });
  }
});


// تشغيل السيرفر
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})

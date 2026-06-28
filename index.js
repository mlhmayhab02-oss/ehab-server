const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('MongoDB error:', err));

// 👤 إنشاء هيكل بيانات المستخدم (User Schema)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// 🚀 1. مسار إنشاء حساب جديد (Register)
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'اسم المستخدم مأخوذ بالفعل' });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    
    res.json({ success: true, message: 'تم إنشاء الحساب بنجاح!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر أثناء التسجيل' });
  }
});

// 🔑 2. مسار تسجيل الدخول (Login)
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'اسم المستخدم أو كلمة المرور خطأ' });
    }

    res.json({ success: true, message: 'تم تسجيل الدخول بنجاح!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في السيرفر أثناء تسجيل الدخول' });
  }
});

app.get('/', (req, res) => {
  res.send('Backend Server is running with Auth APIs!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

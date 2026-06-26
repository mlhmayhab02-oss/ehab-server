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

/* ======================
   MONGO DB
====================== */

const mongoURI = "mongodb+srv://mlhmayhab02_db_user:miPbzmZrX7G1HEO7@cluster0.gga5zue.mongodb.net/snowchat?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.log('❌ MongoDB Error:', err));

/* ======================
   MODEL
====================== */

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

/* ======================
   ROUTES
====================== */

app.get('/', (req, res) => {
  res.send('🚀 SNOWCHAT SERVER IS RUNNING');
});

app.post('/api/register', async (req, res) => {
  try {

    console.log("📩 DATA:", req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "البيانات ناقصة"
      });
    }

    const exists = await User.findOne({ username });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "اسم المستخدم مستخدم"
      });
    }

    await new User({ username, password }).save();

    res.status(201).json({
      success: true,
      message: "تم إنشاء الحساب بنجاح"
    });

  } catch (err) {
    console.log("❌ ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

/* ======================
   START SERVER
====================== */

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

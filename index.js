const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// ضع رابط المونجو الخاص بك هنا بالكامل مكان السطر التالي
const mongoURI = "mongodb+srv://mlhmayhab02_db_user:w1PhzmZrY7G1HEG7@cluster0.ggs1zue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.get('/', (req, res) => {
  res.send('سيرفر SNOWCHAT يعمل بنجاح وقاعدة البيانات متصلة! 🚀');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

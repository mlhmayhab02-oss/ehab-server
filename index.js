const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/*
ضع كلمة مرور MongoDB مكان YOUR_PASSWORD

مثال:
mongodb+srv://mlhmayhab02_db_user:YOUR_PASSWORD@cluster0.gga5zue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
*/

const mongoURI =
"mongodb+srv://mlhmayhab02_db_user:miPbzmZrX7G1HEO7@cluster0.gga5zue.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
.then(() => {
    console.log("✅ MongoDB Connected Successfully");
})
.catch((err) => {
    console.log("❌ MongoDB Error:", err);
});

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});

const User = mongoose.model("User", userSchema);

app.get("/", (req,res)=>{
    res.send("SNOWCHAT SERVER WORKING");
});

/* ================= REGISTER ================= */

app.post("/api/register", async(req,res)=>{

    try{

        const {username,password}=req.body;

        const exists=await User.findOne({username});

        if(exists){
            return res.json({
                success:false,
                message:"اسم المستخدم موجود مسبقاً"
            });
        }

        const user=new User({
            username,
            password
        });

        await user.save();

        res.json({
            success:true,
            message:"تم إنشاء الحساب بنجاح"
        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:"حدث خطأ في السيرفر"
        });

    }

});

/* ================= LOGIN ================= */

app.post("/api/login", async(req,res)=>{

    try{

        const {username,password}=req.body;

        const user=await User.findOne({
            username,
            password
        });

        if(!user){
            return res.json({
                success:false,
                message:"ليس لديك حساب"
            });
        }

        res.json({
            success:true,
            message:"تم تسجيل الدخول"
        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:"حدث خطأ في السيرفر"
        });

    }

});

app.listen(PORT,()=>{
    console.log(`🚀 Server running on port ${PORT}`);
});

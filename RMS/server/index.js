const express = require('express');
const cors = require('cors');
const mongoose =require("mongoose");
// const {connectToDatabase} = require('./db/db.js');
const dotenv =require('dotenv');
const User = require('./models/userModel.js')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
dotenv.config();

// Import the createRouter functions
const createAuthRouter = require('./routes/auth.js');
const collaborationRoutes = require('./routes/collaborationRoutes.js');
const notificationRoutes = require('./routes/notificationRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const royaltyRoutes = require('./routes/royaltyRoutes.js');
const transactionRoutes = require('./routes/transactionRoutes.js');

// Connect to the database
// console.log(connectToDatabase,"connectToAdtabase")

const connectToDatabase = ()=>{
    try{
        
        mongoose.connect(process.env.MONGODB_URL)
        
    }
    catch(error){
        console.log(error)
    }
}
connectToDatabase();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', createAuthRouter); // Ensure you call the function
app.use('/api/collaborations', collaborationRoutes);
app.use('/api/notifications', notificationRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/royalty', royaltyRoutes);
app.use('/api/transactions', transactionRoutes);

app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
        const user = await User.findOne({ email });
  
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
  
        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: '1d' });
  
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
  
        const resetLink = `http://localhost:5173/reset-password/${user._id}/${token}`;
  
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset your Password',
            text: `Click on the link to reset your password: ${resetLink}`
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email error:", error);
                return res.status(500).json({ success: false, message: "Error sending email" });
            } else {
                return res.json({ success: true, message: "Password reset email sent successfully" });
            }
        });
  
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.post('/api/auth/reset-password/:id/:token', async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        if (!decoded) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(id, { password: hashedPassword },{ new: true });
        await User.findByIdAndUpdate(id, {isFirstLogin:false},{ new: true });

        res.json({ success: true, message: "Password reset successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const jwt =require('jsonwebtoken');
const User =require('../models/userModel.js');
// const Song =require('../models/SongModel.js');
const bcrypt =require('bcrypt');
const saltRounds = 12; // 2^12 = 4096 rounds

const login = async (req, res) => {

    console.log("this is auhtController error")
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' }); // Stop further execution
        }

        // Check if the user is active
        if (!user.isActive) {
            return res.status(403).json({ success: false, error: 'User is not active' });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password); // Don't forget the 'await' here
        if (!isMatch) {
            return res.status(404).json({ success: false, error: 'Wrong password' }); // Stop further execution
        }

        // Generate a JWT token
        const token = jwt.sign(
            { _id: user._id, role: user.role, email:user.email },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );

        // Send the response with the token and user details
        return res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.username,
                email:user.email,
                role: user.role,
                isActive:user.isActive,
                isFirstLogin:user.isFirstLogin
            },
        });
    } catch (error) {
        // Handle server errors
        return res.status(500).json({ success: false, error: error.message });
    }
};

// const login = (req, res) => {
//     console.log("this is auhtController error")
//              return res.status(200).json({
//             success: true,
//         });
// }

const verify = (req,res) =>{
    return res.status(200).json({success: true, user: req.user})
} 

// const getUsers = async (req, res) => {
//     try {
//         const users = await User.find({}).select('-password');
//         return res.status(200).json({ success: true, users });
//     } catch (error) {
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };


// const getSongs = async (req, res) => {
//     try {
//         const songs = await Song.find({});
//         return res.status(200).json({ success: true, songs });
//     } catch (error) {
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };


// const toggleUserStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { isActive } = req.body;

//         const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
//         if (!user) {
//             return res.status(404).json({ success: false, error: 'User not found' });
//         }

//         return res.status(200).json({ success: true, user });
//     } catch (error) {
//         return res.status(500).json({ success: false, error: error.message });
//     }
// };



module.exports= { login, verify};


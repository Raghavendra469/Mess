const User = require('../models/userModel');
const Manager = require('../models/managerModel');
const Artist = require('../models/artistModel');
const bcrypt=require('bcrypt');
// const{v4:uuidv4}=require('uuid');
const mongoose=require('mongoose');

// const createUser = async (userData) => {
//     // console.log("userData in service",userData)
    
//   const { username, password,email, role, ...rest } = userData;
//   console.log(rest,"rest in service")
//   console.log(role,"role in service")
//   console.log(username,"username in service")
//   console.log(password,"password in service")
//   const session = await User.startSession();
//   session.startTransaction();

//   try {
//     const user = new User({ username, password,email, role });
//     console.log(user,"user")
//     // console.log(session,"session in service")
//     await user.save({ session });

//     if (role === 'Manager') {
//       const manager = new Manager({
//         managerId: user._id,
//         fullName:rest.fullName,
//         email: rest.email,
//         mobileNo: rest.mobileNo,
//         address: rest.address,
        
//       });
//       await manager.save({ session });
//     } else if (role === 'Artist') {
//       const artist = new Artist({
//         artistId: user._id,
//         ...rest,
//       });
//       await artist.save({ session });
//     }

//     await session.commitTransaction();
//     session.endSession();
//     // return user;
//     return "created successfully"
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

const createUser = async (userData) => {
  const { username, password, email, role, ...rest } = userData;

  // console.log(username);
  // console.log(password);
  // console.log(email);
  // console.log(role);
  console.log(rest);
  const session = await User.startSession();
  session.startTransaction();

  try {
    // hashedPassword=password.bcrypt();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username,password:hashedPassword, email, role });
    // console.log(user);
    await user.save({ session });

    if (role === 'Manager') {
      const manager = new Manager({
        managerId: user._id,
        username:username,
        email:email,
        ...rest,
      });
      await manager.save({ session });
    } else if (role === 'Artist') {
      const artist = new Artist({
        artistId: user._id,
        username:username,
        email:email,
        ...rest,
      });
      await artist.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    return user;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getUserByUsername = async (username) => {
  const user = await User.findOne({username:username});
  // console.log(user,"user",username,"userId");
  
  if (!user) {
    throw new Error('User not found');
  }
  let userProfile;
  
  if (user.role === 'Artist') {
    userProfile = await Artist.findOne({artistId: user._id}).populate('songs').populate('manager').lean();
    console.log(user._id,"user._id")
    console.log(userProfile,"user profile")
  }
  else if(user.role==='Manager'){
    userProfile = await Manager.findOne({managerId: user._id}).populate('managedArtists').lean();
  }
  else
  {
    throw new Error('Invalid role for user profile');
  }
  if (!userProfile) {
    throw new Error(`${user.role} details not found`);
  }
  return userProfile;
};

const updateUser = async (username, updateData) => {
    const user = await User.findOne({username:username});
    if (!user) {
      throw new Error('User not found');
    }
  
    let updatedProfile;
    console.log(updateData,"updateData")
  
    // Update based on role
    if (user.role === 'Artist') {
      updatedProfile = await Artist.findOneAndUpdate(
        { artistId: user._id },
        updateData,
        { new: true } // Return the updated document
      );
    } else if (user.role === 'Manager') {
      updatedProfile = await Manager.findOneAndUpdate(
        { managerId: user._id },
        updateData,
        { new: true }
      );
    } else {
      throw new Error('Invalid role for updating data');
    }
  
    if (!updatedProfile) {
      throw new Error(`${user.role} details not found`);
    }
  
    return updatedProfile;
  };


const deleteUser = async (username) => {
  const session = await User.startSession();
  session.startTransaction();

  try {
    const user = await User.findOne({username:username}).session(session);
    if (!user) throw new Error('User not found');

    if (user.role === 'Manager') {
      await Manager.deleteOne({ managerId: user._id }).session(session);
    } else if (user.role === 'Artist') {
      await Artist.deleteOne({ artistId: user._id }).session(session);
    }

    await User.deleteOne({ _id: user._id }).session(session);

    await session.commitTransaction();
    session.endSession();
    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllUsers = async (role) => {
  // console.log(role,'role')
  if(role==='Artist')
  {
    var out = await Artist.find()
    // console.log(out,"artists out")
  
  return out;
  }
  else if(role==='Manager')
  {
    var manOut = await Manager.find();
    // console.log(manOut,"manager out")


    return manOut;
  }
  else if(role='User')
  {
    return await User.find();
  }

};

module.exports = {
  createUser,
  getUserByUsername,
  updateUser,
  deleteUser,
  getAllUsers,
};
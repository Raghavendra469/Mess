const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/userRepository');

class UserService {

  constructor() {
    this.userRepository = new UserRepository();
  }
  // Business logic for creating a user
  async createUser(userData) {
  
    const { password, ...rest } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDataWithHashedPassword = { ...rest, password: hashedPassword };

    let newUser=await this.userRepository.createUser(userDataWithHashedPassword);
 


    // Save to Manager or Artist collection based on role by calling repository methods
    if (newUser.role === 'Manager') {
      const managerData = { managerId: newUser._id, username:newUser.username, email:newUser.email, ...rest };
      await this.userRepository.createManager(managerData);
    } else if (newUser.role === 'Artist') {
  
      const artistData = { artistId: newUser._id, username:newUser.username, email:newUser.email, ...rest };
     
      await this.userRepository.createArtist(artistData);
    }

    return newUser;
  }

  // Business logic for getting user profile
  async getUserProfileByUsername(username) {
    console.log(username,"inside userService!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }

    const userProfile = await this.userRepository.findUserProfileByRole(user._id, user.role);
    if (!userProfile) {
      throw new Error(`${user.role} details not found`);
    }

    return userProfile;
  }

  // Business logic for updating user details
  async updateUserProfile(username, updateData) {
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedProfile = await this.userRepository.updateUserProfile(user._id, user.role, updateData);
    if (!updatedProfile) {
      throw new Error(`${user.role} details not found`);
    }

    return updatedProfile;
  }

  // Business logic for deleting a user
  async deleteUser(username) {
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.deleteUser(user._id, user.role);
    return true;
  }

  // Business logic for getting all users by role
  async getAllUsers(role) {
    return await this.userRepository.getAllUsersByRole(role);
  }

  async toggleUserStatus(userId, isActive) {
    const user = await this.userRepository.updateUserStatusById(userId, isActive);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

}

module.exports = UserService;

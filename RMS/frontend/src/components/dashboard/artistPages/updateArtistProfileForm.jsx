import React, { useEffect, useState } from "react";
import { useAuth } from "./../../../context/authContext";
import axios from "axios";
import { FiUser, FiPhone, FiHome, FiFileText } from "react-icons/fi"; // Import icons

const UpdateArtistProfileForm = () => {
    const { user,userData, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        fullName: "",
        mobileNo: "",
        address: "",
        description: "",
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Fetch existing artist details
    useEffect(() => {
        if (!authLoading && user) {
            const fetchArtistDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/api/users/${user.username}`);
                    // console.log("update------",response.data.user);
                    setFormData({
                        fullName: response.data.user.fullName|| "",
                        mobileNo: response.data.user.mobileNo || "",
                        address: response.data.user.address || "",
                        description: response.data.user.description || "",
                    });
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching artist data:", error);
                    setMessage("Failed to load artist data.");
                    setLoading(false);
                }
            };

            fetchArtistDetails();
        }
    }, [user, authLoading]);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            await axios.put(`http://localhost:3000/api/users/${user.username}`, formData);
            setMessage("Profile updated successfully!");

            const notificationData = {
                userId: userData.manager.managerId, // Send to manager
                message: `${userData.fullName} updated their profile.`,
                type: "profileUpdate",
              };
        
              await axios.post("http://localhost:3000/api/notifications/", notificationData);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Failed to update profile.");
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-200 to-gray-100 min-h-screen flex justify-center items-center p-6">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg border border-gray-300">
                
                {/* Profile Image */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-3xl font-semibold text-white">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mt-3">Update Profile</h1>
                </div>

                {loading ? (
                    <p className="text-center text-gray-600">Loading...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div className="flex items-center gap-3 border-b pb-2">
                            <FiUser className="text-gray-500 text-lg" />
                            <div className="w-full">
                                <label className="block text-gray-600 text-sm font-semibold">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full bg-transparent text-gray-900 font-medium text-lg focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Mobile Number */}
                        <div className="flex items-center gap-3 border-b pb-2">
                            <FiPhone className="text-gray-500 text-lg" />
                            <div className="w-full">
                                <label className="block text-gray-600 text-sm font-semibold">Mobile Number</label>
                                <input
                                    type="text"
                                    name="mobileNo"
                                    value={formData.mobileNo}
                                    onChange={handleChange}
                                    className="w-full bg-transparent text-gray-900 font-medium text-lg focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-center gap-3 border-b pb-2">
                            <FiHome className="text-gray-500 text-lg" />
                            <div className="w-full">
                                <label className="block text-gray-600 text-sm font-semibold">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-transparent text-gray-900 font-medium text-lg focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex items-center gap-3 border-b pb-2">
                            <FiFileText className="text-gray-500 text-lg" />
                            <div className="w-full">
                                <label className="block text-gray-600 text-sm font-semibold">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full bg-transparent text-gray-900 font-medium text-lg focus:outline-none"
                                    rows="1"
                                ></textarea>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg w-full transition duration-200"
                        >
                            Update Profile
                        </button>

                        {/* Message */}
                        {message && <p className="text-center text-sm font-semibold text-gray-600 mt-2">{message}</p>}
                    </form>
                )}
            </div>
        </div>
    );
};

export default UpdateArtistProfileForm;

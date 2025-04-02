import React, { useEffect, useState } from "react";
import { useAuth } from "./../../../context/authContext";
import { FiUser, FiPhone, FiHome, FiFileText } from "react-icons/fi";
import { useNotifications } from "../../../context/NotificationContext";
import {  updateUserProfile } from "../../../services/userService";

const UpdateArtistProfileForm = () => {
    const { user, userData } = useAuth();
    const [formData, setFormData] = useState({
        fullName: "",
        mobileNo: "",
        address: "",
        description: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const { sendNotification } = useNotifications();

    useEffect(() => {
        if (userData) {
            setFormData({
                fullName: userData.fullName || "",
                mobileNo: userData.mobileNo || "",
                address: userData.address || "",
                description: userData.description || "",
            });
            setLoading(false);
        }
    }, [userData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.fullName.trim() || formData.fullName.length < 3) {
            newErrors.fullName = "Full Name must be at least 3 characters.";
        }

        if (!formData.mobileNo.trim() || !/^\d{10}$/.test(formData.mobileNo)) {
            newErrors.mobileNo = "Enter a valid 10-digit mobile number.";
        }

        if (!formData.address.trim() || formData.address.length < 5) {
            newErrors.address = "Address must be at least 5 characters.";
        }

        if (formData.description.trim() && formData.description.length < 10) {
            newErrors.description = "Description must be at least 10 characters if provided.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!validateForm()) return;

        try {
            await updateUserProfile(user.username, formData);
            setMessage("Profile updated successfully!");

            if (userData?.manager?.managerId) {
                await sendNotification(
                    userData.manager.managerId,
                    `${userData.fullName} updated their profile.`,
                    "profileUpdate"
                );
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Failed to update profile.");
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-200 to-gray-100 min-h-screen flex justify-center items-center p-6">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg border border-gray-300">
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
                        <div className="flex flex-col">
                            <label htmlFor="fullName" className="block text-gray-600 text-sm font-semibold">Full Name</label>
                            <div className="flex items-center gap-3 border-b pb-2">
                                <FiUser className="text-gray-500 text-lg" />
                                <input id="fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-transparent text-gray-900 font-medium text-lg focus:outline-none" />
                            </div>
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="mobileNo" className="block text-gray-600 text-sm font-semibold">Mobile Number</label>
                            <div className="flex items-center gap-3 border-b pb-2">
                                <FiPhone className="text-gray-500 text-lg" />
                                <input id="mobileNo" type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} className="w-full bg-transparent text-gray-900 font-medium text-lg focus:outline-none" />
                            </div>
                            {errors.mobileNo && <p className="text-red-500 text-xs mt-1">{errors.mobileNo}</p>}
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="address" className="block text-gray-600 text-sm font-semibold">Address</label>
                            <div className="flex items-center gap-3 border-b pb-2">
                                <FiHome className="text-gray-500 text-lg" />
                                <input id="address" type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-transparent text-gray-900 font-medium text-lg focus:outline-none" />
                            </div>
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="description" className="block text-gray-600 text-sm font-semibold">Description</label>
                            <div className="flex items-center gap-3 border-b pb-2">
                                <FiFileText className="text-gray-500 text-lg" />
                                <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="w-full bg-transparent text-gray-900 font-medium text-lg focus:outline-none" rows="1"></textarea>
                            </div>
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg w-full transition duration-200 cursor-pointer">Update Profile</button>
                        {message && <p className="text-center text-sm font-semibold text-gray-600 mt-2">{message}</p>}
                    </form>
                )}
            </div>
        </div>
    );
};

export default UpdateArtistProfileForm;

import React, { useEffect, useState } from "react";
import { useAuth } from "./../../../context/authContext";
import { FiUser, FiPhone, FiHome, FiFileText, FiPercent } from "react-icons/fi"; // Import icons
import { useNotifications } from "../../../context/NotificationContext";
import { fetchUserDetails, updateUserProfile } from "../../../services/userService"; // Import the userService functions

const UpdateManagerProfileForm = () => {
    const { user, userData, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        fullName: "",
        mobileNo: "",
        commissionPercentage: "",
        address: "",
        description: "",
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const { sendNotification } = useNotifications();

    // Fetch existing manager details
    useEffect(() => {
        if (!authLoading && user) {
            const fetchArtistDetails = async () => {
                try {
                    const userDetails = await fetchUserDetails(user.username);
                    setFormData({
                        fullName: userDetails.fullName || "",
                        mobileNo: userDetails.mobileNo || "",
                        commissionPercentage: userDetails.commissionPercentage || "",
                        address: userDetails.address || "",
                        description: userDetails.description || "",
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
            await updateUserProfile(user.username, formData);
            setMessage("Profile updated successfully!");

            // Send notification to managed artists
            if (userData.managedArtists) {
                userData.managedArtists.forEach(async (artist) => {
                    // console.log("artistId",artist.artistId)
                    await sendNotification(artist.artistId, `${userData.fullName} updated their profile.`, "profileUpdate");
                });
            }
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

                        {/* Commission Percentage */}
                        <div className="flex items-center gap-3 border-b pb-2">
                            <FiPercent className="text-gray-500 text-lg" />
                            <div className="w-full">
                                <label className="block text-gray-600 text-sm font-semibold">Commission Percentage</label>
                                <input
                                    type="number"
                                    name="commissionPercentage"
                                    value={formData.commissionPercentage}
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

export default UpdateManagerProfileForm;

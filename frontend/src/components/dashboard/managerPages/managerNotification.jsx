import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagerNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      _id: "1",
      message: "Your royalty transaction has been processed.",
      isRead: false,
    },
    {
      _id: "2",
      message: "New artist request received.",
      isRead: false,
    },
    {
      _id: "3",
      message: "Your profile details have been updated successfully.",
      isRead: true,
    },
  ]);
  const managerId = "67a3be671f2927a6985e545f"; // Replace with dynamic manager ID if available

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await axios.get(`/api/notifications/${managerId}`);
//         console.log("API Response:", response.data);

//         setNotifications(Array.isArray(response.data) ? response.data : []);
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//         setNotifications([]);
//       }
//     };

//     fetchNotifications();
//   }, []);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}`, { isRead: true });

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md py-4 px-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
      </header>

      <div className="space-y-4">
        {Array.isArray(notifications) && notifications.length > 0 ? (
          notifications.map((notification) => (
        <div
            key={notification._id}
            className={`p-4 rounded-lg shadow-md transition-colors duration-300 flex justify-between items-center ${
                notification.isRead ? "bg-gray-300" : "bg-white"
            }`}
            >
            {/* Notification Message on the Left */}
            <p className="text-gray-800">{notification.message}</p>

            {/* Button on the Right */}
            <button
                onClick={() => markAsRead(notification._id)}
                className={`px-4 py-2 text-white font-semibold rounded-md transition-all duration-300 ${
                notification.isRead ? "bg-gray-500 cursor-default" : "bg-green-500 hover:bg-green-600"
                }`}
                disabled={notification.isRead}
            >
                {notification.isRead ? "Read" : "Unread"}
            </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default ManagerNotifications;

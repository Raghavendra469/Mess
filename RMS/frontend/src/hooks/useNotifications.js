import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";

const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/notifications/${user._id}`);
      if (response.data.success) {
        const unread = response.data.notifications.filter((notif) => !notif.isRead);
        setNotifications(unread);
        setUnreadCount(unread.length);
      }
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:3000/api/notifications/${notificationId}`, { isRead: true });

      const updatedNotifications = notifications.filter((notif) => notif._id !== notificationId);
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.length);
    } catch (error) {
      console.error("Error updating notification status", error);
    }
  };

  return { notifications, unreadCount, loading, markAsRead, fetchNotifications };
};

export default useNotifications;

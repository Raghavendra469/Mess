import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./authContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user,userData } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/notifications/${user._id}`);
      if (response.data.success) {
        setNotifications(response.data.notifications.filter((notif)=>!notif.isRead));
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

      // Remove the notification from the list
      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  const sendNotification = async (userId,messageToSend,msgType) => {
    const notificationData = {
      userId: userId, // Send to manager
      message: `${messageToSend}`,
      type: msgType,
    };
    try{
      await axios.post("http://localhost:3000/api/notifications/", notificationData);
    }
    catch (error) {
      console.error("Error in sending the notification", error);
    }
    
  };

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifications, loading, markAsRead, unreadCount ,sendNotification}}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
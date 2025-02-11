import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext.jsx"; // Authentication Context
import { NotificationProvider } from "./context/NotificationContext.jsx"; // Notifications Context

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider> 
            <NotificationProvider> {/* Added Notification Provider */}
                <App />
            </NotificationProvider>
        </AuthProvider>
    </StrictMode>
);

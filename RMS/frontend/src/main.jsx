import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext.jsx"; // Authentication Context
import { NotificationProvider } from "./context/NotificationContext.jsx"; // Notifications Context
import { ArtistsManagersProvider } from "./context/ArtistsManagersContext.jsx"; // Artists & Managers Context

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <NotificationProvider>
                <ArtistsManagersProvider> {/* Added Artists & Managers Provider */}
                    <App />
                </ArtistsManagersProvider>
            </NotificationProvider>
        </AuthProvider>
    </StrictMode>
);

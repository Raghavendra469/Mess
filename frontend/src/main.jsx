import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext.jsx"; // Fixed import name

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider> {/* Fixed to PascalCase */}
            <App />
        </AuthProvider>
    </StrictMode>
);

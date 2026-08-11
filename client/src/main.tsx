import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppProvider } from './context/AppContext.tsx';
import { SocketProvider } from './context/SocketContext.tsx';
import "leaflet/dist/leaflet.css"

export const authService = "https://hungryeat-auth.onrender.com";
export const restaurantService = "https://hungryeat-restaurant.onrender.com";
export const utilsService = "https://hungryeat-utils.onrender.com";
export const realTimeService = "https://hungryeat-realtime.onrender.com";
export const riderService = "https://hungryeat-rider.onrender.com";
export const adminService = "https://hungryeat-admin.onrender.com";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AppProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AppProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);

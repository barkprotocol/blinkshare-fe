import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface UserStore {
  token: string | null;
  isUserLoggedIn: () => boolean;
  setToken: (token: string) => void;
  clearUserData: () => void;
  checkTokenExpiry: () => void;
}

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export const useUserStore = create<UserStore>(
  persist(
    (set, get) => ({
      token: null,
      isUserLoggedIn: () => !!get().token,
      setToken: (token) => set({ token }),
      clearUserData: () => set({ token: null }),
      checkTokenExpiry: () => {
        const token = get().token;
        if (token) {
          try {
            const decoded: DecodedToken = jwtDecode(token);
            const expiry = decoded.exp * 1000; // Convert expiry time to milliseconds
            const now = Date.now();
            
            if (now > expiry) {
              console.log("Token has expired.");
              set({ token: null });
            } else {
              console.log("Token is still valid.");
            }
          } catch (error) {
            console.error("Failed to decode token:", error);
          }
        }
      },
    }),
    {
      name: 'user-storage', // The key used for localStorage or sessionStorage
      getStorage: () => localStorage, // Use localStorage
    }
  )
);

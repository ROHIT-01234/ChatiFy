// Zustand use karenge state manage karne ke liye
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const Base_Url = "http://localhost:4000";

export const useAuthStore = create((set, get) => ({
    // states
    authUser: null, // at initial me nahi pata ki user authenticate hai ki nahi
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null, // state of socket

    checkAuth: async () => { // refresh karenge tab check karega ki user aithenticated hai ki nahi
        try {
            const res = await axiosInstance.get("/auth/check"); //Iske jagah  (http://localhost:5173/api/auth/check)  => (/auth/check) ye use kar rahe kyuki axios instance me pehle se hi usse as base Url define kiye hue h, so it's a same thing.
            set({ authUser: res.data });

            get().connectSocket();

        } catch (error) {
            console.log("Error in checkAuth:", error)
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data); // User data sent to backend
            set({ authUser: res.data }); // authenticated after signup
            toast.success("Account Created Successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in Successfully");

            get().connectSocket();// auth me socket linkne ka mtlb h login/sighnup ke baad sidhe socket se connect ho jaye
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },


    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");

            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put("/auth/update", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in the update profile", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false })
        }

    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(Base_Url ,{
            query: {
                userId : authUser._id,
            },
        });
        socket.connect();

        set({socket : socket});

        // jab ye event occur hoga hame userId return hoga aur phir usse onlineuser me update karenge 
        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers : userIds});

        })
    },
    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect(); // disconnect only when connected
    },

}));


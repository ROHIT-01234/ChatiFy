import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null, // user select karne ka bad hi chat box dikhayega
    isUsersLoading: false, // jad true hoga tab loading skeleton side me dikhegaa
    isMessagesLoading: false,


    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false }); //reset loading state
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessages: async (messageData) => {

        const { selectedUser, messages } = get();

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] }); // ...messages-> keep all prev messages and just add the new one at last (res.data)

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => { // listen to the messages
        const { selectedUser } = get();
        if (!selectedUser) return; // means no selected chat

        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (newMessage) => {

            if(newMessage.senderId !== selectedUser._id) return; // check karenga ki message sirf ussi ko jaye jisko bheja gya hai (is messg send from selected user)

            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeToMessages: () => { // situations like when logout/close window
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }), //jis user ko select karenge uska mssg dikhayega, setting the state

}));
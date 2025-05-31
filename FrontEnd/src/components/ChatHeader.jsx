import { XCircle } from 'lucide-react'
import React from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import img from "../assets/react.svg"


const ChatHeader = () => {
    const {selectedUser, setSelectedUser} = useChatStore();
    const {onlineUsers} = useAuthStore();
    return (
        <div className='p-2.5 border-b-3 border-primary'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    {/* Picture */}
                    <div className='avatar'>
                        <div className='size-10 rounded-full relative'>
                            <img
                            src={selectedUser.profilePic || img}
                            alt={selectedUser.fullName} />
                        </div>
                    </div>
                    {/* User Info */}
                    <div>
                        <h3 className='font-medium'>{selectedUser.fullName}</h3>
                        <p className='text-sm text-base-content/70'>{onlineUsers.includes(selectedUser._id)? "Online" : "Offline"} </p>
                    </div>
                </div>
                {/* Close Button */}
                <button onClick={() => setSelectedUser(null)}>
                    <XCircle className='mr-3 size-6 text-base-content/60'/>
                </button>
            </div>
        </div>
    )
}

export default ChatHeader

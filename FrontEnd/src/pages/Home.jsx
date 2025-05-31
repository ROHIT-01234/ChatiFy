import React from 'react'
import { useChatStore } from '../store/useChatStore';
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";




function Home() {

  const { selectedUser } = useChatStore();

  return (
    <div className='h-screen bg-amber-200'>
      <div className='flex items-center justify-center pt-20 px-4'>
        <div className='bg-base-100 rounded-lg shadow-xl w-full max-w-8xl h-[calc(100vh-6rem)]'>
          <div className='flex h-full rounded-lg overflow-hidden'>
          {/* Sidebar + Chat Section */}
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />} {/* Chat secton ki jagah */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

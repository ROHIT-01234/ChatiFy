import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './Skeletons/MessageSkeleton'
import img from "../assets/react.svg"
import { formatMessageTime } from '../lib/utils'
import { useAuthStore } from '../store/useAuthStore'

const ChatContainer = () => {
  const { messages, getMessages, isMessageLoading, selectedUser, subscribeToMessages, unsubscribeToMessages} = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeToMessages(); //cleanup

  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeToMessages]);


  // real time messaging ke samai intant scroll handle karega
  useEffect(() => {
    if(messageEndRef.current && messages){  
      messageEndRef.current.scrollIntoView({ behavior : "smooth"});
    }

  }, [messages]);
  


  if (isMessageLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className='flex flex-1 flex-col overflow-auto'>
      <ChatHeader />

      {/*  Message Area */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4 '>

        {messages.map((message) => (
          <div 
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? 
              "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img
                  src={
                    message.senderId == authUser._id ?
                      authUser.profilePic || img :
                      selectedUser.profilePic || img
                  }
                  alt='Profile-Picture'
                />
              </div>
            </div>

            <div className='chat-header mb-1'>
              <time className='text-xs opacity-50 ml-1'>
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div className='chat-bubble flex flex-col'>
              {message.image && (
                <img
                  src={message.image}
                  alt='Attachment'
                  className='sm:max-w-[200px] rounded-md mb-2' />
              )}

              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}

      </div>

      <MessageInput />

    </div>
  );
};

export default ChatContainer;

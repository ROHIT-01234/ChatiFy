import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { Images, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

function MessageInput() {

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessages } = useChatStore();


  const handleImageChange = (e) => { 
    const file = e.target.files[0]; // image file selected
    // if type of file in not image, select and image
    if(!file.type.startsWith("image/")){
      toast.error("Please select an image file");
      return;
    }

    // if image is selected, set the image preview state
    const reader = new FileReader();
    reader.onloadend = ()=>{
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
   }

  const handlesSendMessage = async (e) => { 
    e.preventDefault(); // default behaviour prevent karenge taki page refresh n kare
    if(!text.trim() && imagePreview) return ; // agar empty message ya image preview h to kuch n kare return kar jaye

    // if user has message, call sendMessage function
  
    try {
      await sendMessages({
        text : text.trim(),
        image : imagePreview,
      });

      // clear form fields
      setText("");
      setImagePreview(null);
      if(fileInputRef.current) fileInputRef.current.value = "";

    } catch (error) {
      console.error("Failed to send message : ", error);
    }
  };

  return (
    <div className='p-4 w-full'>
      {/* image preview will be enable if image uploaded */}
      {
        imagePreview && (
          <div className='mb-3 flex items-center gap-2'>
            <div className='relative'>
              <img
                src={imagePreview}
                alt='Preview'
                className='size-20 object-cover rounded-lg border border-zinc-700' />
              <button
                onClick={removeImage}
                type='button'
                className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center'>
                <X className='size-3' />
              </button>
            </div>
          </div>
        )}

      <form onSubmit={handlesSendMessage} className='flex items-center gap-2'>
        <div className='flex-1 flex gap-2'>
          {/* Write message part */}
          <input
            type='text'
            onChange={(e) => setText(e.target.value)}
            placeholder='Write a message...'
            value={text}
            className='w-full input input-bordered rounded-lg input-sm sm:input-md' 
            />


          {/* Image Upload Part */}
          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden" />

          {/* once the button is clicked ⬇ this input filed is called behind the scene and it's hidden ⬆ */}
          <button
            type='button'
            className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick = {() => fileInputRef.current?.click()}
            >
            
            <Images size={20} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type='submit'
          disabled={!text.trim() && !imagePreview}
          className='btn btn-sm btn-circle'
          >
          <Send size={22} />
        </button>
      </form>

    </div>
  )
}

export default MessageInput

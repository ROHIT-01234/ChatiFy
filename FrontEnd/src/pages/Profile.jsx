import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Camera, Mail, User } from 'lucide-react'
import img from "../assets/react.svg";

function Profile() {


  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; //extraxt the very first file
    if (!file) return;

    const reader = new FileReader(); // read the file and render in the UI.
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result; // convert to base64 format
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };

  };

  return (
    <div className='h-screen pt-20'>
      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-100 rounded-xl p-6 space-y-8 '>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold '>Profile</h1>
            <p className='mt-2'>Your Profile information</p>
          </div>

          {/* Photo Upload part */}
          <div className='flex flex-col items-center gap-4'>
            <div className=' relative'>
              <img
                src={selectedImg || authUser.profilePic
                  || img}
                alt='Profile'
                className='size-32 rounded-full object-cover border-3 border-amber-400 '

              />

              <label
                htmlFor='profile-picture-upload'
                className={`
                absolute bottom-0 right-0
                bg-amber-100 hover:scale-105
                p-2 rounded-full cursor-pointer
                transition-all duration-200
                 border border-secondary
          
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
              `}
              >
                <Camera className='size-5 text-primary' />
                <input
                  type='file'
                  id='profile-picture-upload'
                  className='hidden'
                  accept='image/*'
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile} />
              </label>
            </div>
            <p className='text-sm text-zinc-400'>
              {
                isUpdatingProfile ? "Uploading..." :  "b"
              }
            </p>
          </div>

          {/* Info Section */}
          <div className='space-y-6'>
            <div className='space-y-1.5'>
              <div className='text-sm text-zinc-400 flex items-center gap-2 pl-3'>
                <User className='size-5' /> Full Name
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border border-secondary m-2'>{authUser?.fullName}</p>
            </div>

            <div className='space-y-1.5'>
              <div className=' text-sm text-zinc-400 flex items-center gap-2 pl-3'>
                <Mail className='size-5' /> Email Address
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border border-secondary m-2'>{authUser?.email}</p>
            </div>
          </div>

          {/* Status section */}

          <div className='mt-6 bg-base-200 rounded-xl p-6'>
            <h2 className='text-lg font-medium mb-4 '> Account Information </h2>
            <div className='space-y-3 text-sm'>
              <div className='flex items-center justify-between py-2 border-b border-b-amber-400'>
                <span>Member Since</span>
                <span> {authUser.createdAt?.split("T")[0]}</span>
              </div>

              <div className='flex items-center justify-between py-2 border-b border-b-amber-400'>
                <span>Status</span>
                <span className='text-green-500'> Active </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Profile

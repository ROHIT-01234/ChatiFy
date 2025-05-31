import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom';
import { LogOut, MessageCircleHeart, User } from 'lucide-react';

function Navbar() {

  const { logout, authUser } = useAuthStore();


  return (
    <header
      className='border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/70'>

      <div className='container mx-auto px-4 h-16'>
        <div className='flex items-center justify-between h-full'>
          {/* Left part -> Logo */}
          <div className='flex items-center gap-8'>
            <Link to="/" className='flex items-center gap-2.5 hover:opacity-80 transition-all'>
              <div className='size- rounded-lg bg-primary/10 flex items-center justify-center'>
                <MessageCircleHeart className='size-7' color='#ff9900' absoluteStrokeWidth />
              </div>
              <h1 className='text-lg font-bold'>Chatify</h1>
            </Link>
          </div>

          {/* Right part */}
          <div className='flex items-center gap-2'>


            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className='btn border-3 rounded-lg border-amber-500 btn-sm gap-2'
                >
                  <User className='size-5' />
                  <span className='hidden sm:inline'>Profile</span>
                </Link>

                <button className='btn border-3 rounded-lg border-amber-500 btn-sm flex gap-2 items-center' onClick={logout}>
                  <LogOut className='size-5' />
                  <span className='hidden sm:inline'>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar

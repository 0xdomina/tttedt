import React from 'react';
import { GoogleIcon } from './Icons';

interface WelcomeScreenProps {
  onStartSignUp: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartSignUp }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      <div className="relative md:w-1/2 w-full h-1/3 md:h-full">
        <img
          src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=3474&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Modern home interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-black/60"></div>
      </div>
      
      <div className="flex-1 rounded-t-3xl md:rounded-none -mt-8 md:mt-0 z-10 p-8 flex flex-col text-center justify-center bg-white md:w-1/2">
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-4xl font-bold text-gray-800 leading-tight">
            Discover Your Dream Home here
          </h1>
          <p className="text-gray-500 mt-4">
            The foundational trust layer for African real estate.
          </p>

          <div className="mt-12 space-y-4">
            <button className="w-full flex items-center justify-center gap-3 py-3 px-6 border border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-100 transition-colors">
              <GoogleIcon />
              Continue with Google
            </button>
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <button
              onClick={onStartSignUp}
              className="w-full py-4 px-6 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20"
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
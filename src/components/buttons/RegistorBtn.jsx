import React from 'react';

const RegistorBtn = ({ onClick, children }) => { 
  return (
    <button 
        onClick={onClick}
        
        className=" px-4 py-2 h-10 text-sm rounded-lg
        flex items-center gap-2 justify-center mx-auto
        bg-primary text-white border border-primary
        hover:bg-pink-600 hover:border-pink-600
        transition-all duration-300
        shadow-md"
    >
        {children || 'Registration'}
        
        <svg 
            className="w-6 h-6 justify-end group-hover:rotate-90 group-hover:bg-white-700 text-black ease-linear duration-300 rounded-full border border-white group-hover:border-none p-1 rotate-45" 
            viewBox="0 0 16 19" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z" className="fill-white group-hover:fill-white" />
        </svg>
    </button>
  );
}

export default RegistorBtn;
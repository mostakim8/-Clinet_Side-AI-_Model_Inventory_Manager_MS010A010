import React, { useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import AboutAIModelsSection from './AboutAIModelsSection';
// import { useAuth } from '../../providers/AuthProvider'; 
// import Loader from '../../components/Loader/Loader'; 


const WelcomeScreen = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/login'); 
    };
    

    return (
        <div 
            className="flex flex-col items-center justify-center min-h-screen text-white text-center"
            style={{ backgroundColor: '#0c101d' }}
        >
            <h1 className="text-6xl font-extrabold mb-6 text-indigo-400 sm:pt-12" >
                Welcome to the AI Model Marketplace
            </h1>
            <p className="mb-10 text-xl text-gray-400 max-w-2xl">
               Discover, compare, and integrate the best AI models for your projects. Start your journey here.
            </p>

            <button
                onClick={handleGetStarted}
                className="btn btn-lg bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full shadow-2xl transition duration-300 transform hover:scale-105"
            >
                Get Started
            </button>
            
            

           <AboutAIModelsSection/>
        </div>
    );
};

export default WelcomeScreen;
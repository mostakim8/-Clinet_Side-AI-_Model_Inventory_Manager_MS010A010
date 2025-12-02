import React, { useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import AboutAIModelsSection from './AboutAIModelsSection';
// import { useAuth } from '../../providers/AuthProvider';
// 🔑 যদি লোডার কম্পোনেন্ট ব্যবহার করতে চান, তবে এটি ইম্পোর্ট করুন:
// import Loader from '../../components/Loader/Loader'; 


const WelcomeScreen = () => {
    // const { user, loading } = useAuth(); 
    const navigate = useNavigate();

    // 🔑 1. স্বয়ংক্রিয় রিডাইরেক্ট লজিক (লগড-ইন ইউজারদের জন্য)
    // useEffect(() => {
    //     // যদি লোডিং শেষ হয় এবং ইউজার লগড-ইন থাকে, তবে সরাসরি /app (হোম) এ নিয়ে যাও
    //     if (!loading && user) {
    //         navigate('/app', { replace: true }); 
    //     }
    // }, [user, loading, navigate]);


    const handleGetStarted = () => {
        // if (loading) return; 
        
        // 🔑 2. Get Started ক্লিক করলে এখন শুধুমাত্র /login রুটে নিয়ে যাবে।
        //      লগড-ইন চেক এখানে অপ্রয়োজনীয়, কারণ useEffect ইতিমধ্যেই তা হ্যান্ডেল করছে।
        navigate('/login');
    };

    // 🔑 3. Loading অবস্থায় শুধু একটি বার্তা বা Loader দেখাও
    // if (loading) {
    //     return (
    //         <div 
    //             className="flex items-center justify-center min-h-screen w-full text-white"
    //             style={{ backgroundColor: '#0c101d' }}
    //         >
    //             {/* Loader কম্পোনেন্ট ব্যবহার করতে চাইলে */}
    //             {/* <Loader /> */}
    //             <span className="loading loading-dots loading-lg text-indigo-400"></span>
    //             <p className="ml-4">Verifying user session...</p>
    //         </div>
    //     );
    // }
    
    // 🔑 4. এই কোড ব্লকটি শুধুমাত্র তখনই রেন্ডার হবে যখন loading=false এবং user=null (লগড-আউট)
    return (
        <div 
            className="flex flex-col items-center justify-center min-h-screen text-white text-center"
            style={{ backgroundColor: '#0c101d' }}
        >
            <h1 className="text-6xl font-extrabold mb-6 text-indigo-400">
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
            
            {/* go to about Ai model section */}

           <AboutAIModelsSection/>
        </div>
    );
};

export default WelcomeScreen;
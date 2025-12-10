import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom'; 

const SERVER_BASE_URL = 'http://localhost:5001'; 


// 🌐 সার্ভার থেকে লেটেস্ট মডেল ফেচ করার ফাংশন (এই অংশটি একই থাকবে)
const fetchLatestModels = async () => {
    try {
        const response = await fetch(`${SERVER_BASE_URL}/models/latest?limit=6`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : []; 
    } 
    catch (error) {
        console.error("Error fetching latest models:", error);
        return [];
    }
};


const Slider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slides, setSlides] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);

    // 1. 🌐 ডেটা আনার জন্য useEffect
    useEffect(() => {
        const loadModels = async () => {
            setIsLoading(true);
            const data = await fetchLatestModels();
            setSlides(data);
            setIsLoading(false);
        };

        loadModels();
    }, []); 


    // 2. 🔄 স্লাইড নেভিগেশন লজিক
    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
    };

    // 3. ⏱️ অটো-স্লাইড লজিক
    useEffect(() => {
        if (slides.length <= 1) return;
        
        const interval = setInterval(() => {
            nextSlide();
        }, 5000); 

        return () => clearInterval(interval);
    }, [currentIndex, slides.length]); 


    if (isLoading) {
        return (
            <div className="w-full max-w-6xl mx-auto h-96 mt-8 mb-16 flex items-center justify-center bg-[#1a1a2e] text-gray-400 rounded-lg shadow-2xl">
                Loading latest AI Models...
            </div>
        );
    }
    
    if (slides.length === 0) {
        return (
            <div className="w-full max-w-6xl mx-auto h-96 mt-8 mb-16 flex items-center justify-center bg-[#1a1a2e] text-red-400 rounded-lg shadow-2xl">
                No latest models found.
            </div>
        );
    }
console.log(slides)

    return (
        
        <div className="relative w-full max-w-7xl mx-auto h-96 mt-8 mb-16 overflow-hidden rounded-lg shadow-2xl  border border-[#131a2e]">

            
            
            {/* slide container */}
            <div 
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides.map((slide) => (
                    <div 
                        key={slide._id} 
                        className="w-full shrink-0 h-full relative"
                    >
                        {/* মডেল ইমেজ ব্যাকগ্রাউন্ড হিসেবে */}
                        <img 
                            src={slide.imageUrl || 'https://via.placeholder.com/1200x400?text=Image+Not+Available'} 
                            alt={slide.modelName} 
                            className="w-full h-full  object-cover absolute top-0 left-0"
                        />
                        
                        {/* কন্টেন্ট লেয়ার (ডার্ক ওভারলে সহ) */}
                        <div className="absolute inset-0 bg-black/60 flex flex-col  items-center justify-center text-center p-10 ">
                            
                            {/* মডেলের নাম */}
                            <h1 className="text-6xl font-extrabold   text-indigo-200/70 drop-shadow-lg text-shadow-black">
                                {slide.modelName}
                            </h1>
                            
                            {/* ❌ বর্ণনা অংশটি এখান থেকে রিমুভ করা হয়েছে */}
                            
                            {/* 'View Details' বাটন */}
                            <Link 
                                to={`/app/model-details/${slide._id}`} 
                                className=" btn mt-2 bg-transparent hover:bg-transparent text-white font-bold py-2 px-6 rounded-full transition duration-300 transform hover:scale-105"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* left Arrow  */}
            <button 
                onClick={prevSlide} 
                className="absolute top-1/2 left-4 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/75 transition z-20"
                aria-label="Previous slide"
            >
                <ChevronLeft size={24} />
            </button>

            {/* right Arrow  */}
            <button 
                onClick={nextSlide} 
                className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/75 transition z-20"
                aria-label="Next slide"
            >
                <ChevronRight size={24} />
            </button>

            {/* ডটস নেভিগেশন */}
            {/* <div className="flex justify-center absolute left-0 right-0 space-x-2 z-20 bottom-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                            index === currentIndex ? 'bg-indigo-500' : 'bg-gray-400 hover:bg-gray-200'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div> */}



        </div>
    );
};

export default Slider;
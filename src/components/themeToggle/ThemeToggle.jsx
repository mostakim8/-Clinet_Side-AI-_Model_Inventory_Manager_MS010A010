// src/components/ThemeToggle/ThemeToggle.jsx

import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; // শুধু সূর্য ও চাঁদ আইকন
import { useTheme } from '../../hooks/useTheme'; 

const ThemeToggle = () => {
    // 💡 মনে রাখবেন: useTheme হুকটি তিনটি মোড (light, dark, system) হ্যান্ডেল করে, 
    // কিন্তু এই কম্পোনেন্ট শুধু light ও dark এর মধ্যে টগল করবে।
    const [theme, setTheme] = useTheme();

    // 💡 টগল লজিক: light/system মোডে থাকলে dark-এ যাবে, অন্যথায় light-এ যাবে।
    // "System" মোডটি এই টগল বাটনের মাধ্যমে বেছে নেওয়া সম্ভব নয়, কিন্তু এটি লজিককে সহজ রাখে।
    const toggleTheme = () => {
        // যদি currentTheme dark না হয় (অর্থাৎ light বা system), তবে dark সেট করুন।
        // অন্যথায় (যদি dark হয়), light সেট করুন।
        if (theme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    };
    
    // বর্তমান মোডের উপর ভিত্তি করে ডিসপ্লে আইকন নির্বাচন
    // যদি 'system' থাকে, তবে ধরে নেওয়া হবে যে এটি বর্তমানে ডার্ক মোড বা লাইট মোডের মতোই দেখাচ্ছে।
    const isDarkModeActive = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // যে আইকনটি পরবর্তী থিমকে প্রতিনিধিত্ব করবে (অর্থাৎ বর্তমানে ডার্ক থাকলে সূর্যের আইকন)
    const Icon = isDarkModeActive ? FaSun : FaMoon;
    const nextThemeName = isDarkModeActive ? 'Light' : 'Dark';


    return (
        <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            title={`Switch to ${nextThemeName} Mode`}
        >
            {/* 🔑 আইকনের রং থিম-ভিত্তিক হওয়া উচিত, তাই text-base-content ব্যবহার করুন */}
            <Icon className="w-5 h-5 text-base-content hover:text-primary transition-colors duration-150" />
        </button>
    );
};

export default ThemeToggle;
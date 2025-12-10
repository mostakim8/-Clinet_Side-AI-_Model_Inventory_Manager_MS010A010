import { useState, useEffect } from 'react';


export const useTheme = () => {
    // initial state হিসেবে লোকাল স্টোরেজ বা সিস্টেম প্রেফারেন্স চেক করা
    const [theme, setTheme] = useState(
        // 'system' যদি localStorage এ না থাকে, তবে ডিফল্ট হিসেবে 'system'
        localStorage.getItem('theme') || 'system' 
    );

    useEffect(() => {
        const root = window.document.documentElement;
        
        // 1. বিদ্যমান সকল থিম ক্লাস ও অ্যাট্রিবিউট পরিষ্কার করা
        root.classList.remove('dark');
        root.removeAttribute('data-theme');
        
        let currentTheme; // বর্তমানে কোন থিম প্রয়োগ করা হবে, সেটা ট্র্যাক করার জন্য
        
        if (theme === 'dark') {
            // Tailwind ডার্ক মোড ক্লাস যুক্ত করা
            root.classList.add('dark');
            // DaisyUI data-theme সেট করা
            root.setAttribute('data-theme', 'dark'); 
            localStorage.setItem('theme', 'dark');
            currentTheme = 'dark';
            
        } else if (theme === 'light') {
            // Tailwind ডার্ক মোড ক্লাস অপসারণ করা (অতিরিক্ত নিশ্চয়তা)
            root.classList.remove('dark');
            // DaisyUI data-theme সেট করা
            root.setAttribute('data-theme', 'light'); 
            localStorage.setItem('theme', 'light');
            currentTheme = 'light';
            
        } else { // theme === 'system'
            // সিস্টেম ডিফল্ট চেক করা
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (prefersDark) {
                root.classList.add('dark'); // Tailwind ডার্ক মোড
                root.setAttribute('data-theme', 'dark'); // DaisyUI ডার্ক মোড
                currentTheme = 'dark';
            } else {
                 root.classList.remove('dark'); // Tailwind লাইট মোড (অতিরিক্ত নিশ্চয়তা)
                 root.setAttribute('data-theme', 'light'); // DaisyUI লাইট মোড
                 currentTheme = 'light';
            }
            // 'system' মোডে থাকলে localStorage থেকে থিম রিমুভ করা
            localStorage.removeItem('theme'); 
        }
        
        // 🔑 অতিরিক্ত ফিক্স: সিস্টেম প্রেফারেন্স পরিবর্তন হলে যেন লিসেন করে
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleSystemChange = (e) => {
            if (theme === 'system') {
                if (e.matches) {
                    root.classList.add('dark');
                    root.setAttribute('data-theme', 'dark');
                } else {
                    root.classList.remove('dark');
                    root.setAttribute('data-theme', 'light');
                }
            }
        };

        // শুধু 'system' মোডেই যেন লিসেন করে
        if (theme === 'system') {
            mediaQuery.addEventListener('change', handleSystemChange);
        }

        return () => {
            mediaQuery.removeEventListener('change', handleSystemChange);
        };
        
    }, [theme]); // theme স্টেট পরিবর্তন হলেই useEffect আবার রান করবে

    return [theme, setTheme];
};
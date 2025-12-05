// client/src/providers/AuthProvider.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    onAuthStateChanged, 
    signInWithCustomToken, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    updateProfile, // ✅ updateProfile import করা আছে 
} from 'firebase/auth';

import { auth, db } from '../firebase/firebase.config'; 


// Auth Context তৈরি
const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// AuthProvider কম্পোনেন্ট (এটি Auth লজিক পরিচালনা করে)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Initial Authentication and State Listener
    useEffect(() => {
        // let isCancelled = false;
        
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
            setIsLoading(false)
        });

        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

        const initializeAuth = async () => {
            if (initialAuthToken) {
                try {
                    await signInWithCustomToken(auth, initialAuthToken);
                } catch (error) {
                    console.error("Custom Token Sign-In Failed:", error);
                }
            } 
            
            // if (!isCancelled) {
            //     setIsLoading(false);
            // }
        };

        if (isLoading) {
            initializeAuth();
        }
        
        return () => {
            //  isCancelled = true;
             unsubscribe(); // Cleanup function
        };
    }, []);

    // ... (বাকি ফাংশনগুলি অপরিবর্তিত)
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // 🔑 ফিক্স: updateUserProfile এখন async এবং user.reload() ব্যবহার করছে
    const updateUserProfile = async (name, photoURL) => {
        const currentUser = auth.currentUser;

        if (currentUser && !currentUser.isAnonymous) {
            try {
                // 1. প্রোফাইল আপডেট
                await updateProfile(currentUser, {
                    displayName: name,
                    photoURL: photoURL
                });

                // 2. 🌟 অত্যন্ত গুরুত্বপূর্ণ: ব্যবহারকারীর সেশন ডেটা রিলোড করা
                await currentUser.reload(); 
                
                // 3. স্টেট আপডেট: নতুন user data দিয়ে setUser স্টেট আপডেট করা
                setUser({...auth.currentUser});
                return; 

            } catch (error) {
                // এরর হলে সেটি থ্রো করা যাতে ProfileUpdate এর catch block এ ধরা পড়ে
                console.error("Firebase updateProfile failed:", error);
                throw error;
            }
        }
        // যদি ইউজার লগইন না করে, তবে একটি এরর থ্রো করা
        throw new Error("No user is currently logged in.");
    }

    const logout = () => {
        return signOut(auth); 
    };
    
    const value = {
        user,
        isLoading,
        auth, 
        db,   
        login,
        signup,
        logout,
        updateUserProfile, 
        isLoggedIn: !!user && !user.isAnonymous, 
    };

    return (
        <AuthContext.Provider value={value}>
            {/* 🔑 isLoading স্টেট ব্যবহার করে লোডিং ইউআই দেখানো */}
            {isLoading ? (
                 <div className="flex justify-center items-center min-h-screen">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                 </div>
            ) : (
                children
            )} 
        </AuthContext.Provider>
    );
};
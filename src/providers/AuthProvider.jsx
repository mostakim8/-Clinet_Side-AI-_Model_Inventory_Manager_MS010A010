// client/src/providers/AuthProvider.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    onAuthStateChanged, 
    signInWithCustomToken, 
    // signInAnonymously সরিয়ে দেওয়া হলো
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    updateProfile 
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
        let isCancelled = false;
        
        // onAuthStateChanged লিসেনারটি Firebase থেকে ইউজার স্টেট আপডেট হলে কল হয়।
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // 🔑 এখানে isLoading সেট করা হলেও, initializeAuth এর কারণে এটি দ্রুত আপডেট নাও হতে পারে
            if (!isCancelled) {
                setUser(currentUser);
                // 🔑 onAuthStateChanged যখন প্রথমবার ফায়ার করে, তখন লোডিং বন্ধ করা উচিত।
                // তবে নিচে initializeAuth কল করার কারণে আমরা সেটিকে initializeAuth এর শেষে বন্ধ করব।
            }
        });

        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;


        // কাস্টম টোকেন থাকলে সাইন ইন করা, অন্যথায় কোনো সাইন ইন করা হবে না।
        const initializeAuth = async () => {
            if (initialAuthToken) {
                try {
                    await signInWithCustomToken(auth, initialAuthToken);
                } catch (error) {
                    console.error("Custom Token Sign-In Failed:", error);
                    // টোকেন ফেইল হলে ইউজার null থাকবে
                }
            } 
            
            // 🔑 টোকেন চেক শেষ হওয়ার পর লোডিং বন্ধ করা
            if (!isCancelled) {
                setIsLoading(false);
            }
        };

        // 🔑 শুধু একবার initializeAuth কল করা
        if (isLoading) {
            initializeAuth();
        }
        
        return () => {
             isCancelled = true;
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

    const updateUserProfile = (name, photoURL) => {
        if (auth.currentUser && !auth.currentUser.isAnonymous) {
            return updateProfile(auth.currentUser, {
                displayName: name,
                photoURL: photoURL
            });
        }
        return Promise.reject(new Error("No user is currently logged in."));
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
        // 🔑 isAnonymous চেকটি এখন আরও গুরুত্বপূর্ণ
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
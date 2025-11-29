// client/src/providers/AuthProvider.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    onAuthStateChanged, 
    signInWithCustomToken, 
    signInAnonymously, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    updateProfile // ✅ updateProfile অবশ্যই থাকবে
} from 'firebase/auth';

// ✅ FIX: The initialized services are correctly imported here.
// ধরে নেওয়া হচ্ছে যে আপনার '../firebase/firebase.config' ফাইলে 'auth' এক্সপোর্ট করা হয়েছে।
import { auth, db } from '../firebase/firebase.config'; 


// Auth Context তৈরি
const AuthContext = createContext();

export const useAuth = () => {
    // 🔑 FIX: যদি AuthContext-এর বাইরে useAuth কল করা হয়, তবে একটি error throw করা যেতে পারে
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
        // user state change হলে এই ফাংশনটি কল হবে
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
        });

        // The following variables are likely set in the environment or globals 
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;


        // ক্যানভাস এনভায়রনমেন্ট থেকে প্রাপ্ত কাস্টম টোকেন দিয়ে সাইন ইন করা
        const initializeAuth = async () => {
            if (initialAuthToken) {
                try {
                    await signInWithCustomToken(auth, initialAuthToken);
                } catch (error) {
                    console.error("Custom Token Sign-In Failed, falling back to anonymous:", error);
                    await signInAnonymously(auth);
                }
            } else {
                // টোকেন না থাকলে বেনামী (anonymous) ভাবে সাইন ইন করা
                await signInAnonymously(auth);
            }
        };

        if (isLoading) {
            initializeAuth();
        }
        
        return unsubscribe; // Cleanup function
    }, []);

    // Login function
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Signup function
    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Update Profile function 
    const updateUserProfile = (name, photoURL) => {
        if (auth.currentUser&& !auth.currentUser.isAnonymous) {
            return updateProfile(auth.currentUser, {
                displayName: name,
                photoURL: photoURL
            });
        }
        return Promise.reject(new Error("No user is currently logged in."));
    }

    // Logout function
    const logout = () => {
        // 🔑 CORE LOGIC: সরাসরি Firebase এর signOut ফাংশন কল করা
        return signOut(auth); 
    };
    
    const value = {
        user,
        isLoading,
        auth, 
        db,   
        login,
        signup,
        logout, // ✅ এটিকে Navbar-এর জন্য এক্সপোর্ট করা নিশ্চিত করুন
        updateUserProfile, 
        isLoggedIn: !!user && !user.isAnonymous, 
    };

    return (
        <AuthContext.Provider value={value}>
            {/* isLoading চলাকালীন কোনো ইউআই না দেখানো উচিত নয়, 
               কারণ onAuthStateChanged লোড হওয়ার পরেই children রেন্ডার হওয়া দরকার।
               তবে আপনার PrivateRoute/MainLayout সেই লোডিং হ্যান্ডেল করে বলে এখানে শর্ত যোগ করা হলো না। */}
            {!isLoading && children} 
            {isLoading && (
                 <div className="flex justify-center items-center min-h-screen">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                 </div>
            )}
        </AuthContext.Provider>
    );
};
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider.jsx'; // পাথ সংশোধন করা হয়েছে
import { collection, query, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

// PurchaseHistory কম্পোনেন্টটি এখন named export হিসেবে ব্যবহার করা হয়েছে।
export const PurchaseHistory = () => {
    const { user, isLoading: isAuthLoading, db, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [purchases, setPurchases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // গ্লোবাল App ID ব্যবহার
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

    useEffect(() => {
        if (isAuthLoading) return;

        // যদি লগইন না করা থাকে, তবে লগইন পেজে রিডাইরেক্ট করা
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const fetchPurchases = async () => {
            setIsLoading(true);
            setError(null);
            
            const userId = user?.uid;
            if (!userId) {
                setError("User ID not available. Please ensure you are logged in.");
                setIsLoading(false);
                return;
            }

            // Firestore Path: /artifacts/{appId}/users/{userId}/purchases
            const historyCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/purchases`);
            
            try {
                // আমরা যেহেতু শুধুমাত্র এই ব্যবহারকারীর ডেটা চাই, তাই কোনো 'where' clause এর দরকার নেই।
                // তবে ডেটা নিরাপত্তার জন্য, শুধুমাত্র Authenticated user-এর ডেটা লোড করা হচ্ছে।
                const q = query(historyCollectionRef); 
                const querySnapshot = await getDocs(q);
                
                const fetchedPurchases = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    // Timestamp কে ব্যবহারযোগ্য ফর্মে আনা
                    purchaseDate: doc.data().purchaseDate?.toDate ? doc.data().purchaseDate.toDate().toLocaleDateString() : 'N/A'
                }));
                
                // সর্বশেষ কেনা আইটেমগুলো প্রথমে দেখানোর জন্য সর্ট করা
                setPurchases(fetchedPurchases.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))); 

            } catch (err) {
                console.error("Error fetching purchase history:", err);
                setError("Failed to load purchase history. Check console for details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPurchases();
    }, [isAuthLoading, isLoggedIn, user, db, navigate]);

    if (isAuthLoading || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="ml-3 text-lg text-gray-700">
                    {isAuthLoading ? 'Checking Authentication...' : 'Loading Purchase History...'}
                </p>
            </div>
        );
    }
    
    if (error) {
         return (
            <div className="p-10 min-h-screen bg-gray-50 text-center">
                <h1 className="text-3xl font-bold text-red-600">Error</h1>
                <p className="mt-4 text-gray-700">{error}</p>
                <Link to="/" className="btn btn-primary mt-6">Go to Home</Link>
            </div>
        );
    }

    if (!isLoggedIn) {
         return (
            <div className="p-10 min-h-screen bg-gray-50 text-center">
                <h1 className="text-3xl font-bold text-warning">Access Denied</h1>
                <p className="mt-4 text-gray-700">Please log in to view your purchase history.</p>
                <Link to="/login" className="btn btn-warning mt-6">Log In Now</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-10 min-h-screen">
            <h1 className="text-4xl font-extrabold text-primary mb-8 border-b pb-4">
                My Purchase History
            </h1>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-sm text-gray-600 mb-6">
                    <p>Buyer Email: <strong className="text-primary">{user.email || 'N/A (Anonymous/No Email)'}</strong></p>
                    <p>Your User ID: <strong className="font-mono text-xs text-gray-500">{user.uid}</strong></p>
                </div>
                
                {purchases.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-2xl text-gray-500">No purchases found yet!</p>
                        <p className="mt-2 text-gray-400">Time to explore our <Link to="/" className="text-accent underline">AI Model Market</Link>.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full table-zebra">
                            <thead>
                                <tr className="bg-base-200">
                                    <th>Model Name</th>
                                    <th>Price</th>
                                    <th>Purchase Date</th>
                                    <th>Developer Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.map((p) => (
                                    <tr key={p.id}>
                                        <td className="font-semibold text-gray-800">
                                            <Link to={`/app/model/${p.modelId}`} className="link link-hover text-primary">
                                                {p.modelName}
                                            </Link>
                                        </td>
                                        <td className="text-success font-bold">${p.price.toFixed(2)}</td>
                                        <td>{p.purchaseDate}</td>
                                        <td className="text-gray-600 text-sm">{p.developerEmail}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
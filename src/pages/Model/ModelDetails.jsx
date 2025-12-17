import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider.jsx'; 
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const SERVER_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ModelDetails = () => {
    const { id } = useParams();
    const { user, isLoading: isAuthLoading } = useAuth(); 
    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore();

    const [model, setModel] = useState(null);
    const [isModelLoading, setIsModelLoading] = useState(true); 
    const [hasPurchased, setHasPurchased] = useState(false); 
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // পারচেজ স্ট্যাটাস চেক (একবার কেনা হয়েছে কি না)
    const checkPurchaseStatus = async (modelId) => {
        const userId = auth.currentUser?.uid; 
        if (!userId) return;
        const purchasesRef = collection(db, `purchase/${userId}/history`);
        try {
            const q = query(purchasesRef, where('modelId', '==', modelId));
            const querySnapshot = await getDocs(q);
            setHasPurchased(!querySnapshot.empty);
        } catch (error) { console.error("Purchase check failed:", error); }
    };

    useEffect(() => {
        setIsModelLoading(true);
        fetch(`${SERVER_BASE_URL}/models/${id}`)
            .then(res => res.json())
            .then(data => setModel(data))
            .catch(err => console.error("Fetch error:", err))
            .finally(() => setIsModelLoading(false));
    }, [id]);

    useEffect(() => {
        if (!isModelLoading && model && user) checkPurchaseStatus(model._id);
    }, [isModelLoading, model, user]);

    const handlePurchase = () => {
        if (!user) return navigate('/login');
        if (hasPurchased) return;
        setShowConfirmModal(true);
    };

    const confirmPurchase = async () => {
        setShowConfirmModal(false);
        setIsPurchasing(true);
        try {
            const token = await user.getIdToken();
            const res = await fetch(`${SERVER_BASE_URL}/purchase-model`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ 
                    modelId: model._id, 
                    modelName: model.modelName, 
                    buyerEmail: user.email, 
                    developerEmail: model.developerEmail 
                })
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed");
            }
            setHasPurchased(true);
            setToast({ show: true, message: 'Purchase Successful!', type: 'success' });
        } catch (err) { 
            setToast({ show: true, message: err.message, type: 'error' }); 
        } finally { setIsPurchasing(false); }
    };

    if (isModelLoading || isAuthLoading) return <div className="flex justify-center items-center min-h-[60vh]"><span className="loading loading-spinner loading-lg"></span></div>;
    if (!model) return <div className="text-center p-10">Model not found.</div>;

    const isOwner = user?.email === model.developerEmail;

    return (
        <div className="container mx-auto p-4 md:p-10 min-h-screen bg-base-200">
            {toast.show && (
                <div className="toast toast-top toast-center z-50">
                    <div className={`alert alert-${toast.type} shadow-lg`}>
                        <span>{toast.message}</span>
                        <button onClick={() => setToast({show: false})} className="btn btn-xs">✕</button>
                    </div>
                </div>
            )}

            <div className="bg-base-100 rounded-xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                    {/* Image Section */}
                    <div className="lg:col-span-1">
                        <figure className="aspect-video rounded-lg overflow-hidden shadow-lg mb-6">
                            <img src={model.imageUrl} className="w-full h-full object-cover" alt={model.modelName} />
                        </figure>
                        <div className="bg-primary text-primary-content p-4 rounded-lg text-center font-bold text-xl">
                            One-time Access Fee
                        </div>
                    </div>

                    {/* Details Section (All Assignment Fields) */}
                    <div className="lg:col-span-2">
                        <h1 className="text-4xl font-extrabold mb-4">{model.modelName}</h1>
                        <p className="text-lg opacity-70 mb-6">{model.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div className="bg-base-200 p-4 rounded-lg">
                                <span className="text-xs font-bold opacity-50 uppercase">Use Case</span>
                                <p className="text-lg font-semibold text-secondary">{model.useCase || "N/A"}</p>
                            </div>
                            <div className="bg-base-200 p-4 rounded-lg">
                                <span className="text-xs font-bold opacity-50 uppercase">Dataset</span>
                                <p className="text-lg font-semibold text-secondary">{model.dataset || "N/A"}</p>
                            </div>
                            <div className="bg-base-200 p-4 rounded-lg">
                                <span className="text-xs font-bold opacity-50 uppercase">Framework</span>
                                <p className="text-lg font-semibold text-secondary">{model.framework || model.category}</p>
                            </div>
                            <div className="bg-base-200 p-4 rounded-lg">
                                <span className="text-xs font-bold opacity-50 uppercase">Purchased Count</span>
                                <p className="text-lg font-semibold text-primary">{model.purchased || 0}</p>
                            </div>
                        </div>

                        {/* Button logic */}
                        <button 
                            onClick={handlePurchase} 
                            disabled={hasPurchased || isPurchasing || isOwner}
                            className={`btn btn-lg w-full font-bold ${hasPurchased ? 'btn-success text-white' : 'btn-accent'}`}
                        >
                            {isOwner ? "Owner (Cannot Purchase)" : hasPurchased ? "✓ Purchased" : isPurchasing ? "Processing..." : "Buy Now"}
                        </button>
                        
                        {hasPurchased && (
                            <Link to="/app/purchase-history" className="btn btn-link w-full mt-2">View My Purchase History</Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirm Modal */}
            {showConfirmModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-center">Confirm Your Purchase</h3>
                        <p className="py-4 text-center">Are you sure you want to purchase <b>{model.modelName}</b>? This action cannot be undone.</p>
                        <div className="modal-action flex justify-center gap-4">
                            <button onClick={() => setShowConfirmModal(false)} className="btn btn-outline">Cancel</button>
                            <button onClick={confirmPurchase} className="btn btn-primary">Yes, Purchase</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
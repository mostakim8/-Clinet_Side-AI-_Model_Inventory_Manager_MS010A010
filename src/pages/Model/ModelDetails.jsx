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
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const checkPurchaseStatus = async (modelId) => {
        const userId = auth.currentUser?.uid; 
        if (!userId) return;
        const purchasesRef = collection(db, `purchase/${userId}/history`);
        try {
            const q = query(purchasesRef, where('modelId', '==', modelId));
            const querySnapshot = await getDocs(q);
            setHasPurchased(!querySnapshot.empty);
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        fetch(`${SERVER_BASE_URL}/models/${id}`)
            .then(res => res.json())
            .then(data => setModel(data))
            .finally(() => setIsModelLoading(false));
    }, [id]);

    useEffect(() => {
        if (!isModelLoading && model && user) checkPurchaseStatus(model._id);
    }, [isModelLoading, model, user]);

    const handlePurchase = async () => {
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
                body: JSON.stringify({ modelId: model._id, modelName: model.modelName, buyerEmail: user.email, developerEmail: model.developerEmail })
            });
            if (!res.ok) throw new Error("Failed");
            setHasPurchased(true);
            setToast({ show: true, message: 'Purchase Successful!', type: 'success' });
        } catch (err) { setToast({ show: true, message: 'Failed to purchase', type: 'error' }); }
        finally { setIsPurchasing(false); }
    };

    if (isModelLoading || isAuthLoading) return <div className="text-center p-10">Loading...</div>;
    if (!model) return <div className="text-center p-10">Model not found.</div>;

    return (
        <div className="container mx-auto p-10 min-h-screen">
            {toast.show && <div className={`alert alert-${toast.type} mb-4`}>{toast.message}</div>}
            <div className="bg-base-100 p-8 rounded-xl shadow-xl flex flex-col md:flex-row gap-8">
                <img src={model.imageUrl} className="w-full md:w-1/3 rounded-lg object-cover" alt="" />
                <div className="flex-1">
                    <h1 className="text-4xl font-bold">{model.modelName}</h1>
                    <p className="py-6 opacity-70">{model.description}</p>
                    <button 
                        onClick={handlePurchase} 
                        disabled={hasPurchased || isPurchasing || user?.email === model.developerEmail}
                        className={`btn btn-lg ${hasPurchased ? 'btn-success text-white' : 'btn-primary'}`}
                    >
                        {hasPurchased ? 'You have already bought it' : isPurchasing ? 'Processing...' : 'Buy Now'}
                    </button>
                    {hasPurchased && <Link to="/app/purchase-history" className="block mt-4 text-primary">Go to Purchase History</Link>}
                </div>
            </div>

            {showConfirmModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirm Purchase?</h3>
                        <p className="py-4">Are you sure you want to buy {model.modelName}?</p>
                        <div className="modal-action">
                            <button onClick={() => setShowConfirmModal(false)} className="btn btn-ghost">Cancel</button>
                            <button onClick={confirmPurchase} className="btn btn-primary">Yes, Purchase</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
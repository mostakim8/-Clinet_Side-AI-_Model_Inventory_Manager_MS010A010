import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider.jsx'; 
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const SERVER_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Mock Data Fallback (unchanged)
const MOCK_MODEL = {
    _id: "60f71c4c8e7e1c0c8e7e1c0c",
    modelName: "Mock AI Data Model (Fallback)",
    description: "This is a placeholder model to allow UI testing of the purchase button when the backend server is not reachable.",
    category: "Data Analysis",
    developerEmail: "mock.developer@example.com",
    purchased: 42,
    imageUrl: "https://placehold.co/800x600/60A5FA/ffffff?text=MOCK+DATA",
};

const ToastNotification = ({ show, message, type, onClose }) => {
    if (!show) return null;
    const colorClass = type === 'error' ? 'alert-error' : type === 'warning' ? 'alert-warning' : 'alert-success';
    return (
        <div className="toast toast-top toast-center z-50">
            <div className={`alert ${colorClass} shadow-lg`}>
                <div><span className='font-semibold'>{message}</span></div>
                <button onClick={onClose} className="btn btn-sm btn-ghost ml-4">✕</button>
            </div>
        </div>
    );
};

export const ModelDetails = () => {
    const { id } = useParams();
    const { user, isLoading: isAuthLoading } = useAuth(); 
    const navigate = useNavigate();
    const isLoggedIn = !!user;

    const auth = getAuth();
    const db = getFirestore();

    const [model, setModel] = useState(null);
    const [isModelLoading, setIsModelLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false); 
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); 
    const DESCRIPTION_LIMIT = 200; 

    const checkPurchaseStatus = async (modelId) => {
        const userId = auth.currentUser?.uid; 
        if (!userId) return;

        const purchasesRef = collection(db, `purchase/${userId}/history`);
        
        try {
            const q = query(
                purchasesRef,
                where('modelId', '==', modelId)
            );
            
            const querySnapshot = await getDocs(q);
            setHasPurchased(!querySnapshot.empty); 
        } catch (error) {
            console.error("Error checking purchase status:", error);
            setHasPurchased(false); 
        }
    };
    
    useEffect(() => {
        setIsModelLoading(true);
        fetch(`${SERVER_BASE_URL}/models/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Model could not be found.');
                return res.json();
            })
            .then(data => setModel(data))
            .catch(err => {
                setModel(MOCK_MODEL); 
                setError(`Displaying mock model. (${err.message})`);
            })
            .finally(() => setIsModelLoading(false));
    }, [id]); 

    useEffect(() => {
        if (!isModelLoading && model && user) {
             checkPurchaseStatus(model._id);
        }
    }, [isModelLoading, model, user]); 

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message, type }), 4000);
    };

    const handlePurchase = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        if (hasPurchased) { 
            showToast('You already bought this model.', 'warning');
            return;
        }
        if (user?.email === model.developerEmail) {
            showToast('You cannot purchase your own model.', 'error');
            return;
        }
        setShowConfirmModal(true);
    };

    const confirmPurchase = async () => {
        setShowConfirmModal(false);
        setIsPurchasing(true);
        try {
            const token = await user.getIdToken();
            const transactionData = {
                modelId: model._id,
                modelName: model.modelName,
                buyerEmail: user.email,
                developerEmail: model.developerEmail, 
            };
            
            const res = await fetch(`${SERVER_BASE_URL}/purchase-model`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(transactionData),
            });

            if (!res.ok) throw new Error('Transaction failed.');

            showToast(`Purchase successful!`, 'success');
            setHasPurchased(true); 
        } catch (err) {
            showToast(`Error: ${err.message}`, 'error');
        } finally {
            setIsPurchasing(false);
        }
    };

    let buttonContent;
    let buttonDisabled = isPurchasing || user?.email === model.developerEmail || hasPurchased; 
    let buttonClass = "btn-lg w-full font-bold transition duration-300 ";

    if (!isLoggedIn) {
        buttonContent = 'Login to Purchase'; 
        buttonClass += ' btn-warning';
    } else if (user?.email === model.developerEmail) {
        buttonContent = 'Your Model';
        buttonClass += ' btn-disabled'; 
    } else if (hasPurchased) {
        buttonContent = 'Already Owned'; 
        buttonClass += ' btn-success text-white cursor-not-allowed';
    } else if (isPurchasing) {
        buttonContent = 'Processing...';
        buttonClass += ' btn-accent loading'; 
    } else {
        buttonContent = `Buy Now`;
        buttonClass += ' btn-accent';
    }

    return (
        <div className="container mx-auto p-4 md:p-10 min-h-screen bg-base-200">
            <ToastNotification 
                show={toast.show} 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ ...toast, show: false })} 
            />

            <div className="bg-base-100 rounded-xl shadow-2xl overflow-hidden p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <img src={model.imageUrl} alt={model.modelName} className="rounded-lg shadow-lg" />
                    </div>
                    <div className="lg:col-span-2">
                        <h1 className="text-5xl font-extrabold mb-4">{model.modelName}</h1>
                        <p className="text-lg text-base-content/70 mb-6">{model.description}</p>
                        
                        <button
                            onClick={isLoggedIn ? handlePurchase : () => navigate('/login')}
                            className={`btn ${buttonClass}`}
                            disabled={buttonDisabled}
                        >
                            {buttonContent}
                        </button>

                        {hasPurchased && (
                            <Link to="/app/purchase-history" className="btn btn-sm btn-link mt-4 block text-center">
                                View in Purchase History
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-base-100 p-8 rounded-xl shadow-2xl max-w-sm w-full">
                        <h3 className="text-2xl font-bold mb-4">Confirm?</h3>
                        <p className="mb-6">Buy <strong>{model.modelName}</strong>?</p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setShowConfirmModal(false)} className="btn btn-outline">Cancel</button>
                            <button onClick={confirmPurchase} className="btn btn-primary">Yes, Buy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
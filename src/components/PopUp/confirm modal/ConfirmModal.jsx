// src/components/PopUp/confirm modal/ConfirmModal.jsx

import React from 'react';

const ConfirmModal = ({ email, onConfirm, onCancel }) => {
    return (
        // ১. Outer Container: bg-black যোগ করা হয়েছে এবং opacity কমানো হয়েছে যাতে মোড পরিবর্তনে সমস্যা না হয়
        <div 
            className="fixed inset-0  bg-opacity-60 z-50 flex items-center justify-center p-4" 
            style={{ zIndex: 9999 }} // অতিরিক্ত সুরক্ষা
        >
            {/* ২. Inner Content Box: bg-base-100 এবং text-base-content ব্যবহার করা হয়েছে */}
            <div className="bg-base-100 text-base-content p-6 rounded-lg shadow-2xl max-w-sm w-full">
                
                <h3 className="font-bold text-lg ">Are you confirm?</h3>
                

                <div className="flex justify-end gap-3 mt-4">
                    {/* ৩. Cancel Button: থিম-ফ্রেন্ডলি ক্লাস ব্যবহার */}
                    <button 
                        className="btn btn-sm btn-outline" 
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    {/* ৪. Confirm Button: থিম-ফ্রেন্ডলি ক্লাস ব্যবহার */}
                    <button 
                        className="btn btn-sm btn-primary" 
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
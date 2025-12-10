import { useState } from 'react'; 
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider'; 
import { getAuth } from "firebase/auth";
import { Helmet } from 'react-helmet-async';

const SERVER_BASE_URL = 'http://localhost:5001'; 

const UpdateModel = () => {
    
    const modelToUpdate = useLoaderData();
    
    // model items
    const { 
        _id, 
        modelName, 
        description,  
        category, 
        imageUrl,
        useCase, 
        dataset 
    } = modelToUpdate || {}; 
    
    const { user } = useAuth();
    const navigate = useNavigate();
    const auth = getAuth(); 

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    
    const [modelNameFocused, setModelNameFocused] = useState(false);
    const [imageUrlFocused, setImageUrlFocused] = useState(false);
    const [descriptionFocused, setDescriptionFocused] = useState(false);

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
    };

    // 🔑 ফিক্স ১: Toast Notification কে থিম-ভিত্তিক করা হলো
    const ToastNotification = () => {
        if (!toast.show) return null;
        
        let colorClass = 'alert-info'; // Default info
        if (toast.type === 'success') {
            colorClass = 'alert-success';
        } else if (toast.type === 'error') {
            colorClass = 'alert-error';
        }

        return (
            <div className="toast toast-end z-50">
                <div className={`alert ${colorClass} transition duration-300 shadow-xl`}>
                    <span>{toast.message}</span>
                </div>
            </div>
        );
    };

    if (!modelToUpdate) {
        // 🔑 ফিক্স ২: এরর মেসেজ থিম-ভিত্তিক
        return <div className="text-center py-20 text-xl text-error bg-base-100 min-h-screen">Error: Model data could not be loaded for editing. Please check the URL and server connectivity.</div>;
    }

    const handleUpdateModel = async (e) => { 
        e.preventDefault();
        
        if (!user) {
            showToast('Authentication required to update model.', 'error');
            return;
        }

        setIsSubmitting(true);
        const form = e.target;
        
        const updatedModelName = form.modelName.value;
        const updatedDescription = form.description.value;
        const updatedCategory = form.category.value;
        const updatedImageUrl = form.imageUrl.value; 
        
        const updatedModel = {
            modelName: updatedModelName,
            description: updatedDescription,
            category: updatedCategory,
            imageUrl: updatedImageUrl, 
            useCase: form.useCase?.value || useCase, 
            dataset: form.dataset?.value || dataset,
        };
        
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("User not authenticated.");
            
            const token = await currentUser.getIdToken(); 

            const res = await fetch(`${SERVER_BASE_URL}/models/${_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(updatedModel),
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Server responded with status ${res.status}`);
            }

            const data = await res.json();

            if (data.modifiedCount > 0 || data.modelName) { 
                showToast('Model Updated! Changes saved successfully.', 'success');
                setTimeout(() => navigate('/app/my-models'), 500); 
            } else {
                showToast('No modifications were needed or made.', 'info');
            }

        } catch (error) {
            console.error('Update Error:', error.message);
            showToast(`Update Failed. Details: ${error.message}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // 🔑 ফিক্স ৩: লেবেলের ব্যাকগ্রাউন্ড ক্লাসের জন্য base-100 ব্যবহার (যাতে থিম অনুযায়ী রং পাল্টায়)
    const labelBgClass = ' bg-base-100! '; 
    
    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-base-200" >
            <Helmet>
                <title>Update Model - {modelName}</title>
            </Helmet>
            <ToastNotification /> 
            
            {/* 🔑 ফিক্স ৪: কার্ডের ব্যাকগ্রাউন্ড bg-base-100, টেক্সট text-base-content, এবং থিম-কমপ্লায়েন্ট শ্যাডো */}
            <div className="w-full max-w-4xl mx-auto my-10 p-8 
            bg-base-100 text-base-content rounded-xl border border-base-300 transition duration-500 
            shadow-2xl dark:shadow-[0_0_40px_rgba(109,40,217,0.3)]"
            >
            
                <h1 className="text-4xl font-extrabold text-center mb-2 text-primary">
                    Edit AI Model: <span className="text-secondary">{modelName}</span>
                </h1>
                {/* 🔑 ফিক্স ৫: টেক্সট এবং ব্যাকগ্রাউন্ড থিম-ভিত্তিক */}
                <p className="text-center text-base-content/70 mb-8">
                    Model ID: <span className="font-mono text-sm bg-base-300 px-2 py-1 rounded text-base-content">{_id}</span>
                </p>
                
                <form onSubmit={handleUpdateModel} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
                    
                    {/* Model Name */}
                    <div className="form-control relative mb-2"> 
                        <label 
                            htmlFor="modelName"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out ${labelBgClass} 
                            ${modelNameFocused || modelName 
                                // 🔑 ফিক্স ৬: ফোকাস রং text-secondary
                                ? 'text-secondary -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                // 🔑 ফিক্স ৭: ডিফল্ট রং text-base-content/70
                                : 'text-base-content/70 opacity-80 mt-2 left-3' 
                            }`}
                        >
                            Model Name
                        </label>
                        <input type="text" 
                            name="modelName" 
                            id="modelName"
                            defaultValue={modelName} 
                            placeholder="" 
                            // 🔑 ফিক্স ৮: ইনপুট ক্লাস থিম-ভিত্তিক
                            className="input w-full bg-base-200 border-base-300 text-base-content border rounded-lg transition duration-300 focus:ring-2 focus:ring-primary focus:border-primary focus:shadow-md focus:shadow-primary/30 focus:outline-none pt-4"
                            onFocus={()=> setModelNameFocused(true)}
                            onBlur={(e)=> setModelNameFocused(e.target.value.trim() !== '')}
                            required 
                        />
                    </div>
                    
                    {/* Category */}
                    <div className="form-control -mt-6">
                        {/* 🔑 ফিক্স ৯: লেবেল টেক্সট থিম-ভিত্তিক */}
                        <label className="label"><span className="label-text font-semibold text-base-content/70">Category (Framework)</span></label>
                        <select 
                            name="category" 
                            // 🔑 ফিক্স ১০: সিলেক্ট ক্লাস থিম-ভিত্তিক
                            className="select select-bordered bg-base-200 text-base-content border-base-300 focus:border-primary focus:ring-primary ms-4 lg:ms-0" 
                            defaultValue={category} 
                            required
                        >
                            <option value="LLM">Large Language Model (LLM)</option>
                            <option value="Image Gen">Image Generation</option>
                            <option value="Audio/Speech">Audio/Speech</option>
                            <option value="Data Analysis">Data Analysis</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    {/* Developer Email*/}
                    <div className="form-control">
                        {/* 🔑 ফিক্স ১১: লেবেল টেক্সট থিম-ভিত্তিক */}
                        <label className="label"><span className="label-text font-semibold text-base-content/70 lg:ps-3">Developer Email</span></label>
                        <input 
                            type="email" 
                            name="developerEmail" 
                            defaultValue={user?.email || 'Loading...'} 
                            readOnly 
                            // 🔑 ফিক্স ১২: রিড-অনলি ইনপুট ক্লাস থিম-ভিত্তিক
                            className="input input-bordered bg-base-300 text-base-content/50 cursor-not-allowed border-base-300 ms-5" 
                        />
                    </div>
                    
                    {/* Image URL */}
                    <div className="form-control relative mt-6">
                        <label 
                            htmlFor="imageUrl"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out ${labelBgClass} 
                            ${imageUrlFocused || imageUrl 
                                // 🔑 ফিক্স ১৩: ফোকাস রং text-accent
                                ? 'text-accent -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-base-content/70 opacity-80 pt-4 left-3' 
                            }`}
                        >
                            Image URL (ImgBB Link)
                        </label>
                        <input 
                            type="url" 
                            name="imageUrl" 
                            id="imageUrl"
                            defaultValue={imageUrl} 
                            placeholder=""
                            // 🔑 ফিক্স ১৪: ইনপুট ক্লাস থিম-ভিত্তিক (accent border)
                            className="input w-full bg-base-200 border-accent text-base-content border-2 focus:ring-2 focus:ring-accent focus:border-accent focus:shadow-lg focus:shadow-accent/20 pt-4" 
                            onFocus={()=> setImageUrlFocused(true)}
                            onBlur={(e)=> setImageUrlFocused(e.target.value.trim() !== '')}
                            required 
                        />
                        {/* 🔑 ফিক্স ১৫: ফুটনোট টেক্সট থিম-ভিত্তিক */}
                        <p className="text-xs text-base-content/60 mt-1">
                            A visually appealing image is required for the inventory listing.
                        </p>
                    </div>

                    {/* Description */}
                    <div className="form-control md:col-span-2 relative mb-2">
                        <label 
                            htmlFor="description"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out ${labelBgClass} 
                            ${descriptionFocused || description
                                // 🔑 ফিক্স ১৬: ফোকাস রং text-secondary
                                ? 'text-secondary -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-base-content/70 opacity-80 pt-4 left-3' 
                            }`}
                        >
                            Model Description
                        </label>
                        <textarea 
                            name="description" 
                            id="description"
                            defaultValue={description} 
                            placeholder="" 
                            // 🔑 ফিক্স ১৭: টেক্সটেরিয়া ক্লাস থিম-ভিত্তিক
                            className="textarea textarea-bordered h-32 w-full bg-base-200 border-base-300 text-base-content duration-300 focus:ring-2 focus:ring-primary focus:border-primary focus:shadow-md focus:shadow-primary/30 pt-8" 
                            onFocus={()=> setDescriptionFocused(true)}
                            onBlur={(e)=> setDescriptionFocused(e.target.value.trim() !== '')}
                            required
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="form-control mt-6 md:col-span-2">
                        <button 
                            type="submit" 
                            // 🔑 ফিক্স ১৮: btn-secondary এবং text-secondary-content থিম-ভিত্তিক
                            className={`btn btn-secondary w-full text-secondary-content font-bold rounded-xl transition duration-300 transform hover:scale-[1.01] shadow-lg hover:shadow-secondary/50 ${isSubmitting ? 'loading' : ''}`}
                            disabled={isSubmitting}
                        >
                             {isSubmitting ? 'Saving Changes...' : 'Save Model Updates'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateModel;
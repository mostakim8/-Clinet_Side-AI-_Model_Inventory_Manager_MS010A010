import { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
// ⚠️ IMPORTANT: Firebase Storage imports need to be added here. E.g.:
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// ⚠️ And you must initialize storage instance, e.g.:
// const storage = getStorage(firebaseAppInstance); 

const ProfileUpdate = () => {
    // AuthProvider theke user o updateUserProfile function use kora
    const { user, updateUserProfile } = useAuth();
    
    const [name, setName] = useState(user?.displayName || '');
    // photoURL এখন বর্তমান বা আপলোড করা নতুন URL ধারণ করবে
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
    
    // 🔑 NEW STATES for file upload
    const [imageFile, setImageFile] = useState(null); 
    const [uploading, setUploading] = useState(false); // আপলোড স্ট্যাটাস দেখানোর জন্য

    // User data change hole state update kora
    useEffect(() => {
        setName(user?.displayName || '');
        setPhotoURL(user?.photoURL || '');
    }, [user]);

    // Handle File Selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        } else {
            setImageFile(null);
        }
    };
    
    // ⚠️ CRITICAL: File upload logic must be implemented here using Firebase Storage
    const handleImageUpload = async () => {
        if (!imageFile) {
            toast.error("Please select a file first.");
            return;
        }

        setUploading(true);
        // Toast message start
        toast.loading("Uploading image...", { id: 'uploadToast' }); 

        try {
            // 🛑 IMPLEMENTATION POINT: 
            // 1. Storage Reference তৈরি করুন (e.g., ref(storage, `profiles/${user.uid}/${imageFile.name}`))
            // 2. File টি আপলোড করুন (uploadBytes)
            // 3. আপলোড করা ফাইলের Public Download URL টি নিন (getDownloadURL)
            
            // 🔑 আপনাকে নিচের এই প্লেসহোল্ডার কোডটি আপনার রিয়েল Firebase Storage কোড দিয়ে প্রতিস্থাপন করতে হবে।
            // For now, mocking a successful upload delay and generating a fake URL:
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            const uploadedUrl = `https://yourstorage.com/${user.uid}/${Date.now()}.jpg`; // 🛑 REPLACE THIS LINE

            setPhotoURL(uploadedUrl); // নতুন URL টি photoURL স্টেটে আপডেট করা হলো
            setImageFile(null); // File input টি খালি করা হলো
            toast.success('Image uploaded successfully! Click "Save Changes" to finalize.', { id: 'uploadToast' });

        } catch (error) {
            console.error("Image Upload Error:", error);
            toast.error('Image upload failed. Please check console.', { id: 'uploadToast' });
        } finally {
            setUploading(false);
        }
    };


    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        
        // Form-এর input থেকে নতুন name value নেওয়া
        const newName = e.target.name.value;
        const finalPhotoURL = photoURL; // photoURL state থেকে চূড়ান্ত URL নেওয়া

        if (uploading) {
            toast.error("Please wait for the image upload to complete.");
            return;
        }
        
        try {
            // 🔑 CORE LOGIC: AuthProvider er function call kora
            await updateUserProfile(newName, finalPhotoURL);
            
            // Success toast message
            toast.success('Profile updated successfully! Reloading...');
            
            // Update successful hole page-কে force reload করতে হবে 
            window.location.reload(); 

        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile. ' + error.message);
        }
    };

    return (
        <div className="min-h-[calc(100vh-250px)] flex flex-col items-center justify-center p-4">
             <Helmet>
                <title>AI Market | Update Profile</title>
            </Helmet>
            <div className="w-full max-w-lg p-8 space-y-6 bg-base-100 rounded-lg shadow-xl border border-primary/20">
                <h2 className="text-3xl font-bold text-center text-primary">Update Profile</h2>
                
                {/* Current User Info Card */}
                <div className="flex flex-col items-center p-4 bg-base-200 rounded-lg border border-gray-700/50">
                    <img 
                        // 🔑 photoURL state থেকে current/uploaded URL দেখানো হচ্ছে
                        src={photoURL || 'https://i.ibb.co/6y4tH7v/default-profile.png'} 
                        alt="Current Profile" 
                        className="w-24 h-24 object-cover rounded-full border-4 border-accent"
                    />
                    <p className="mt-4 text-xl font-semibold">{user?.displayName || 'User Name Not Set'}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                </div>

                {/* Profile Update Form */}
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                        <label className="label">
                            <span className="label-text">New Name</span>
                        </label>
                        <input 
                            type="text" 
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter new display name" 
                            className="w-full input input-bordered bg-base-300" 
                            required 
                        />
                    </div>
                    
                    {/* 🔑 NEW: File Input Section */}
                    <div className="space-y-2 p-4 border rounded-lg border-gray-600/50">
                        <label className="label">
                            <span className="label-text font-bold text-lg text-secondary">Update Profile Picture</span>
                        </label>
                        <input 
                            type="file" 
                            name="imageFile"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="file-input file-input-bordered file-input-sm w-full bg-base-300" 
                        />
                        <button 
                            type="button" 
                            onClick={handleImageUpload}
                            // যদি কোনো ফাইল সিলেক্ট না করা হয় বা আপলোড চলছে, তবে বাটনটি নিষ্ক্রিয় থাকবে
                            className={`btn btn-accent w-full btn-sm mt-2 ${uploading ? 'btn-disabled' : ''}`}
                            disabled={!imageFile || uploading}
                        >
                            {uploading ? 'Uploading...' : 'Upload Image'}
                        </button>
                        <p className='text-xs text-gray-400 mt-2'>
                            Select image, click 'Upload Image', then click 'Save Changes'.
                            {photoURL && <span className='text-success block mt-1'>Current/New Photo URL: {photoURL.substring(0, 40)}...</span>}
                        </p>
                    </div>
                    
                    {/* Hidden input to pass the final photoURL for consistency */}
                    <input type="hidden" name="photoURL" value={photoURL} />

                    <button type="submit" className="w-full btn btn-primary mt-6" disabled={uploading}>
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileUpdate;
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
    updateProfile, 
    createUserWithEmailAndPassword, 
    signOut,
    // 🔑 NEW: Gmail Sign-in এর জন্য প্রয়োজনীয় ফাংশন
    signInWithPopup, 
    GoogleAuthProvider 
} from 'firebase/auth';
// ⚠️ আপনার আপলোড করা ফাইল অনুযায়ী:
import auth from '../../firebase/firebase.config'; 

const Register = () => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); 
    const navigate = useNavigate();

    // 🔑 NEW: Google Auth Provider ইনিশিয়ালাইজ করা
    const googleProvider = new GoogleAuthProvider();

    // --- 1. Email/Password Registration Handler ---
    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); 
        setIsLoading(true);
        
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        // 🔑 Photo URL ইনপুট থেকে মান নেওয়া
        const photoURL = form.photoURL.value; 
        
        // --- Password Validation ---
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setIsLoading(false);
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setError('Password must contain at least one capital letter.');
            setIsLoading(false);
            return;
        }
        if (!/[!@#$%^&*()]/.test(password)) {
            setError('Password must contain at least one special character, e.g., !@#$%^&*().');
            setIsLoading(false);
            return;
        }
        
        try {
            // 1. Create User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update Profile (Add Name and Photo URL)
            await updateProfile(user, {
                displayName: name,
                photoURL: photoURL, // Photo URL যুক্ত করা হয়েছে
            });

            // 3. Log out and navigate to login (Standard practice for email/pass registration)
            await signOut(auth);
            navigate('/login');
            window.alert('Registration successful! Please log in.');

        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already in use. Try logging in.');
            } else {
                setError('Registration failed. Please check network and credentials.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- 2. Google Sign-in Handler (NEW) ---
    const handleGoogleSignIn = async () => {
        setError('');
        setIsLoading(true);
        try {
            // Google Sign-in Popup দেখাবে
            await signInWithPopup(auth, googleProvider);
            // সফল হলে, AuthProvider এর মাধ্যমে Home page এ navigate হবে
            navigate('/');
            window.alert('Signed in with Google successfully!');

        } catch (err) {
            console.error("Google Sign-in Error:", err);
            setError("Google sign-in failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className='min-h-[80vh] flex items-center justify-center p-4'>
            <div className="card w-full max-w-md p-6 rounded-lg 
               bg-gray-900 text-white 
               shadow-[0_0_20px_rgba(109,40,217,0.7)] 
               hover:shadow-[0_0_30px_rgba(99,102,241,0.9)] 
               border border-transparent hover:border-indigo-800 transition duration-500 ">
                <h2 className="text-3xl font-bold pt-6 text-center">Create Account</h2>
                
                <form className="card-body" onSubmit={handleRegister}>
                    
                    {error && (
                        <div role="alert" className="alert alert-error mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-control">
                        <label className="label"><span className="label-text">Name</span></label>
                        <input type="text" name="name" placeholder="Your Name" className="input input-bordered" required />
                    </div>
                    
                    <div className="form-control">
                        <label className="label"><span className="label-text">Email</span></label>
                        <input type="email" name="email" placeholder="Your Email" className="input input-bordered" required />
                    </div>

                    {/* 🔑 NEW INPUT FIELD: Photo URL */}
                    <div className="form-control">
                        <label className="label"><span className="label-text">Photo URL (Optional)</span></label>
                        <input 
                            type="url" 
                            name="photoURL" 
                            placeholder="Link to your profile picture" 
                            className="input input-bordered" 
                        />
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Password</span></label>
                        <input type="password" name="password" placeholder="Min 6 characters, uppercase, special char" className="input input-bordered" required />
                        <label className="label">
                            <span className="label-text-alt">Must be 6+ chars, 1 uppercase, 1 special char.</span>
                        </label>
                    </div>

                    <div className="form-control mt-6">
                        <button 
                            type="submit" 
                            className={`btn btn-secondary w-full ${isLoading ? 'btn-disabled' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 
                                <span className="loading loading-spinner"></span> : 
                                'Register with Email'
                            }
                        </button>
                    </div>
                    
                    {/* --- Google Sign-in Option (NEW) --- */}
                    <div className="divider text-sm">OR</div>

                    <div className="form-control">
                        <button 
                            type="button" 
                            onClick={handleGoogleSignIn}
                            className={`btn bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 w-full ${isLoading ? 'btn-disabled' : ''}`}
                            disabled={isLoading}
                        >
                            <svg className="w-5 h-5 mr-2 inline" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.343c-1.29 5.86-5.871 9.874-11.343 9.874-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.156 7.96 3.034l5.657-5.657C34.047 5.795 29.28 4 24 4c-11.05 0-20 8.95-20 20s8.95 20 20 20c11.05 0 20-8.95 20-20c0-1.341-.138-2.65-.389-3.917z" /><path fill="#FF3D00" d="M6.306 14.693l6.571 4.819C14.655 15.108 18.9 12 24 12c3.059 0 5.842 1.156 7.96 3.034l5.657-5.657C34.047 5.795 29.28 4 24 4c-7.963 0-14.836 4.364-18.368 10.693z" /><path fill="#4CAF50" d="M24 44c5.108 0 9.771-1.638 13.313-4.481l-5.657-5.657C29.842 37.844 27.059 39 24 39c-5.448 0-10.129-4.32-11.343-9.874L6.306 33.307C9.838 39.636 16.709 44 24 44z" /><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.343c-.87 4.072-3.6 7.391-7.743 8.746-.232.084-.467.162-.702.234 3.498-3.045 5.735-7.464 5.735-12.28 0-1.341-.138-2.65-.389-3.917z" /></svg>
                            Sign up with Google (Gmail)
                        </button>
                    </div>
                    {/* --- End Google Sign-in Option --- */}

                </form>

                <div className="text-center p-6 pt-0">
                    <p className="mb-4">
                        Already have an account? <Link to="/login" className="link link-primary">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
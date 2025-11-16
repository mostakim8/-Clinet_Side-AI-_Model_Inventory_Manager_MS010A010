import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import auth from '../../firebase/firebase.config'; 
import { useAuth } from '../../providers/AuthProvider';

const Login = () => {
    const { user } = useAuth(); 
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // If the user is already logged in (and not anonymous), redirect to home
    if (user && !user.isAnonymous) {
        navigate('/');
        return null;
    }

    // --- 1. Email/Password Login ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        
        try {
            await signInWithEmailAndPassword(auth, email, password); 
            navigate('/'); 
        } catch (err) {
            console.error(err);
            setError('Login failed. Check your email and password.');
        }
    };

    // --- 2. Google Login ---
    const handleGoogleLogin = async () => {
        const googleProvider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Google login failed.');
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <div className="card w-full max-w-sm shadow-2xl bg-base-100">
                <h2 className="text-3xl font-bold pt-6 text-center">Login</h2>
                
                <form className="card-body" onSubmit={handleLogin}>
                    
                    {error && (
                        <div role="alert" className="alert alert-error mb-4">
                             <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-control">
                        <label className="label"><span className="label-text">Email</span></label>
                        <input type="email" name="email" placeholder="email" className="input input-bordered" required />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Password</span></label>
                        <input type="password" name="password" placeholder="password" className="input input-bordered" required />
                        <label className="label"><a href="#" className="label-text-alt link link-hover">Forgot password?</a></label>
                    </div>

                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                </form>

                <div className="text-center p-6 pt-0">
                    <p className="mb-4">Don't have an account? <Link to="/register" className="link link-primary">Register here</Link></p>
                    
                    <div className="divider">OR</div>
                    
                    <button onClick={handleGoogleLogin} className="btn btn-outline btn-error w-full">
                        Sign In with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
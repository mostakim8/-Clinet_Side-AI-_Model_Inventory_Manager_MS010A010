import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { updateProfile, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import auth from '../../firebase/firebase.config'; 

const Register = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); 
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        
        // --- Password Validation ---
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setError('Password must contain at least one capital letter.');
            return;
        }
        if (!/[!@#$%^&*()]/.test(password)) {
            setError('Password must contain at least one special character, e.g., !@#$%^&*().');
            return;
        }
        
        try {
            // 1. Create User
            await createUserWithEmailAndPassword(auth, email, password);

            // 2. Update Profile (Add Name)
            await updateProfile(auth.currentUser, {
                displayName: name,
            });

            // 3. Log out (navigate to login to prompt the user to sign in normally)
            await signOut(auth);
            navigate('/login');

        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already in use. Try logging in.');
            } else {
                setError('Registration failed. Please check network and credentials.');
            }
        }
    };

    return (
        <div className='min-h-[80vh] flex items-center justify-center p-4'>
            <div className="card w-full max-w-sm shadow-2xl bg-base-100">
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

                    <div className="form-control">
                        <label className="label"><span className="label-text">Password</span></label>
                        <input type="password" name="password" placeholder="Min 6 characters, uppercase, special char" className="input input-bordered" required />
                    </div>

                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-secondary">
                            Register
                        </button>
                    </div>
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
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider.jsx'; 
import { DotLottieReact } from '@lottiefiles/dotlottie-react'; 
import RegistorBtn from '../../components/buttons/RegistorBtn.jsx';
import LogInLoader from '../../components/Loader/LogInLoader/LogInLoader.jsx';
// import ParticlesBackground from '../../component/Form Img/ParticlesBackground.jsx'; 



export const Login = () => {
    const [email, setEmail] = useState('');
    const [emailFocused, setEmailFocused] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth(); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(email, password);
            alertUser('Login successful! Redirecting...', 'success');
            navigate('/app'); 
            
        } catch (err) {
            console.error(err);
            let errorMessage = "An unknown error occurred.";
            if (err.code === 'auth/invalid-email') errorMessage = 'Invalid email address.';
            else if (err.code === 'auth/wrong-password') errorMessage = 'Invalid password.';
            else if (err.code === 'auth/user-not-found') errorMessage = 'No user found with this email.';
            else if (err.code === 'auth/weak-password') errorMessage = 'Password should be at least 6 characters.';

            setError(errorMessage);
            alertUser(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const alertUser = (message, type) => {
        console.log(`[${type.toUpperCase()}] ${message}`); 
    };


    return (
        <div className="relative flex items-center justify-center min-h-screen ">
            {/* <ParticlesBackground /> */}
            {isLoading && <LogInLoader />}
            <div className="card w-full max-w-md p-6 rounded-lg bg-[#131a2e] text-white shadow-[0_0_20px_rgba(109,40,217,0.7)] hover:shadow-[0_0_30px_rgba(99,102,241,0.9)]  border border-transparent hover:border-indigo-80 transition duration-500 z-10">
                
                <form className="card-body" onSubmit={handleSubmit}>
                    
                    {/*Lottie Animation */}
                    <h2 className="card-title text-primary justify-center">
                        <div style={{ 
                            width: '250px', 
                            height: '250px', marginBottom: '-70px', marginTop: '-80px' }}>
                            <DotLottieReact
                                src="https://lottie.host/ad7cb7f5-fa39-4825-bfdb-1aba3b76dc70/bMGjzqthd6.lottie"
                                loop
                                autoplay
                            />
                        </div>
                    </h2>
                
                    {error && (
                        <div role="alert" className="alert alert-error mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Email Input  */}
                    <div className="form-control relative mb-6"> 
                        <label 
                            htmlFor="email-input"
                            className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out bg-[#131a2e]  
                            ${email || emailFocused
                                ? 'text-pink-500 -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-gray-400 opacity-80 pt-4 left-3' 
                            }`}
                        >
                            Email Address
                        </label>

                        <input
                            id="email-input"
                            type="email"
                            placeholder="" 
                            className="input w-full bg-transparent border-gray-700 text-gray-100 placeholder-gray-500 border rounded-lg transition duration-300 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={()=> setEmailFocused(true)}
                            onBlur={()=> setEmailFocused(false)}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="form-control relative mb-2">
                        <label  htmlFor="password-input"
                        className={`absolute top-0 pointer-events-none font-bold transition-all duration-300 ease-in-out bg-[#131a2e]
                            ${password || passwordFocused
                                ? 'text-pink-500 -translate-y-1/2 opacity-100 px-1  z-10 left-3 text-[11px] rounded' 
                                : 'text-gray-400 opacity-80 pt-4 left-3' 
                            }`}
                        >
                            Password
                        </label>

                        <input
                          id='password-input'
                          type="password"
                          placeholder=""
                          className="input w-full pt-2 pb-2 bg-transparent border-gray-700 text-gray-100 placeholder-gray-500 border rounded-lg transition duration-300 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none"

                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            required
                        />
                    </div>

                    <div className="form-control mt-1 mx-auto">
                        <button 
                            type="submit" 
                            className={`btn btn-primary text-white font-bold rounded-xl ${isLoading ? 'btn-disabled' : ''}`}
                            disabled={isLoading}
                        >
                            Log In
                        </button>
                    </div>
                    
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600 mb-4">
                            Don't have an account? 
                        </p>

                         <RegistorBtn onClick={()=>navigate ('/register')} 
                             > Registration
                        </RegistorBtn>  
                    </div>
                </form>
            </div>
        </div>
    );
};
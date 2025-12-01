import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider'; 
// getAuth এবং signOut-এর ইমপোর্ট অপ্রয়োজনীয়, কারণ আমরা useAuth() থেকে logout ব্যবহার করছি।

const Navbar = () => {
    // Auth context থেকে user info এবং logout ফাংশনটি destructure করা হলো
    const { user, logout } = useAuth(); // 'logout' হবে, 'signOut' নয়
    const navigate = useNavigate();

    // Logout handler
    const handleLogout = async () => {
        try {
            await logout(); 
            // Successful sign out er por login page e redirect
            navigate('/login');
        } catch (error) {
            console.error("Logout Error:", error);
            window.alert("Logout failed. Check console for details.");
        }
    };

    // 🔑 UPDATED LOGIC: Common navigation links for both mobile and desktop
    // এখন শুধু Home, View Models, এবং শর্তসাপেক্ষে Add Model থাকবে।
    const navLinks = (
        <>
            <li><Link to="/">Home</Link></li>
            {/* View Models: সকল মডেল দেখার জন্য একটি নতুন লিঙ্ক (ধরে নেওয়া হচ্ছে /models রুটে সমস্ত মডেল দেখা যায়) */}
            <li><Link to="/app/models">View Models</Link></li> 
            
            {/* Add Model: শুধুমাত্র লগইন করা ব্যবহারকারীর জন্য */}
            {user && <li><Link to="/app/add-model">Add Model</Link></li>}
        </>
    );

    return (
        <div className="navbar bg-base-300 shadow-lg sticky top-0 z-40">
            <div className="navbar-start">
                {/* Mobile Dropdown (Hamburger Menu) */}
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navLinks}
                    </ul>
                </div>
                {/* Logo/Brand */}
                <Link to="/" className="btn btn-ghost text-xl font-bold text-primary hover:bg-transparent">
                    AI Model Marketplace
                </Link>
            </div>

            {/* Desktop Links */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 font-semibold">
                    {navLinks}
                </ul>
            </div>

            {/* User/Auth Actions */}
            <div className="navbar-end">
                {user ? (
                    // Authenticated User Dropdown
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                {/* Email er prothom letter athoba user photo */}
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="rounded-full w-full h-full object-cover" />
                                ) : (
                                    user.email ? user.email[0].toUpperCase() : 'U'
                                )}
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {/* 1. User Name/Email (Profile Info) */}
                            <li>
                                <Link to="/app/profile-update" className="justify-between text-sm font-bold text-secondary">
                                    {/* ইউজার নেম বা ইমেল দেখান */}
                                    {user.displayName || user.email}
                                    <span className="badge badge-primary badge-outline text-xs">Profile</span>
                                </Link>
                            </li>
                            
                            {/* 2. My Models Link (Only in Dropdown) */}
                            <li>
                                <Link to="/app/my-models">
                                    My Models
                                </Link>
                            </li>
                            
                            {/* 3. Purchase History Link (Only in Dropdown) */}
                            <li>
                                <Link to="/app/purchasex-history">
                                    Model Purchase History
                                </Link>
                            </li>
                            
                            <div className="divider my-1 h-px bg-gray-200"></div> 
                            
                            {/* 4. Logout Action */}
                            <li>
                                <a onClick={handleLogout} className='text-error font-semibold'>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                ) : (
                    // Guest User Links
                    <Link to="/login" className="btn btn-primary text-white hover:bg-primary-focus transition duration-300">
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
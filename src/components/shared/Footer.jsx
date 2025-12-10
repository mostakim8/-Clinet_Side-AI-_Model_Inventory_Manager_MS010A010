import { Link } from 'react-router-dom';

const Footer = () => {
    // Current year
    const currentYear = new Date().getFullYear();

    return (
        /* 🔑 ফিক্স ১: ফুটার ব্যাকগ্রাউন্ডকে থিম-ভিত্তিক করা হলো (bg-base-300) */
        <footer className="footer mt-16 p-10 bg-base-300 text-base-content border-t border-base-content/10">
            <div className="flex flex-col items-center lg:flex-row lg:items-start lg:justify-between ">

                {/* Left side*/}
                <div className="flex flex-col mx-20 items-center lg:flex-row lg:items-start lg:text-left lg:gap-16 mb-8 lg:mb-0">
                    
                    {/* Logo */}
                    <aside className="mb-8 lg:mb-0 text-center lg:text-left">
            
                        <div className="text-3xl font-bold text-primary">AI Model Market</div>
                        {/* 🔑 ফিক্স ২: টেক্সট রং text-base-content/80 */}
                        <p className='mt-2 text-base-content/80'>
                            AI Model Inventory Manager.
                            Providing reliable technology since 2024.
                        </p>
                       
                    </aside> 
                    
                    
                </div>


                {/* Right side */}
                <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left lg:gap-28">
                    
                    {/*Services*/}
                    {/* 🔑 ফিক্স ৩: নেভিগেশন টেক্সট রং text-base-content/70 */}
                    <nav className='text-center mb-8 lg:mb-0 text-base-content/70'>
                        <h3 className="footer-title text-xl text-base-content">Services</h3> 

                        <Link to="/app/add-model" className="link link-hover no-underline">Upload Model</Link><br />
                        <Link to="/app/all-model" className="link link-hover no-underline">Explore Models</Link><br />
                        <Link to="/purchase-history" className="link link-hover no-underline">Purchase History</Link>
                    </nav> 
                    
                    {/*Company */}
                    {/* 🔑 ফিক্স ৪: নেভিগেশন টেক্সট রং text-base-content/70 */}
                    <nav className="mb-8 lg:mb-0 text-center text-base-content/70">
                        <h3 className="footer-title text-xl text-base-content">Company</h3> 
                        <a href="#about" className="link link-hover no-underline">About Us</a> <br />
                        <Link to="/my-models" className="link link-hover no-underline">My Inventory</Link> <br />
                        <Link to="/register" className="link link-hover no-underline">Join as Developer</Link>
                    </nav> 
                    
                    {/* Legal */}
                    {/* 🔑 ফিক্স ৫: নেভিগেশন টেক্সট রং text-base-content/70 */}
                    <nav className='text-center text-base-content/70  '>
                        <h3 className="footer-title text-xl text-base-content">Legal</h3> 
                        <a href="#" className="link link-hover no-underline">Terms of use</a> <br />
                        <a href="#" className="link link-hover no-underline">Privacy policy</a> <br />
                        <a href="#" className="link link-hover no-underline">Cookie policy</a>
                    </nav>


                </div>
            </div>
             {/* 🔑 ফিক্স ৬: কপিরাইট টেক্সট রং text-base-content/60 */}
             <div className="text-sm mt-4 mx-auto text-center text-base-content/60">
                 Copyright © {currentYear} - All rights reserved.
             </div>
        </footer>
    );
};

export default Footer;
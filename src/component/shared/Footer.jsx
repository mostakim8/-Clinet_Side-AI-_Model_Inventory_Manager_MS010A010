import { Link } from 'react-router-dom';

const Footer = () => {
    // Current year
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer p-10 bg-neutral text-neutral-content mt-16 border-t border-gray-700">
            <div className="flex flex-col items-center  lg:flex-row lg:items-start lg:justify-between ">

                {/* LEFT GROUP: Logo (Aside) + Services (Nav) */}
                <div className="flex flex-col mx-20 items-center  lg:flex-row lg:items-start lg:text-left lg:gap-16 mb-8 lg:mb-0">
                    
                    {/* 1. Logo (Aside) */}
                    <aside className="mb-8 lg:mb-0 text-center lg:text-left">
                        {/* Simple Logo Placeholder */}
                        <div className="text-3xl font-bold text-primary">AI Model Market</div>
                        <p className='mt-2'>
                            AI Model Inventory Manager.
                            Providing reliable technology since 2024.
                        </p>
                       
                    </aside> 
                    
                    
                </div>


                {/* RIGHT GROUP: Company (Nav) + Legal (Nav) */}
                <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left lg:gap-28">
                    {/* 2. Services (Nav) */}
                    <nav className='text-center mb-8 lg:mb-0 text-gray-500'>
                        <h3 className="footer-title text-xl">Services</h3> 

                        <Link to="/add-model" className="link link-hover">Upload Model</Link><br />
                        <Link to="/" className="link link-hover">Explore Models</Link><br />
                        <Link to="/purchase-history" className="link link-hover">Purchase History</Link>
                    </nav> 
                    {/* 3. Company (Nav) */}
                    <nav className="mb-8 lg:mb-0 text-center text-gray-500">
                        <h3 className="footer-title text-xl">Company</h3> 
                        <a href="#about" className="link link-hover">About Us</a> <br />
                        <Link to="/my-models" className="link link-hover">My Inventory</Link> <br />
                        <Link to="/register" className="link link-hover">Join as Developer</Link>
                    </nav> 
                    
                    {/* 4. Legal (Nav) */}
                    <nav className='text-center text-gray-500'>
                        <h3 className="footer-title text-xl">Legal</h3> 
                        <a href="#" className="link link-hover">Terms of use</a> <br />
                        <a href="#" className="link link-hover">Privacy policy</a> <br />
                        <a href="#" className="link link-hover">Cookie policy</a>
                    </nav>



                </div>
            </div>
             <p className="text-sm mt-4 mx-auto    ">
                            Copyright © {currentYear} - All rights reserved.
                        </p>
        </footer>
    );
};

export default Footer;
// client/src/components/shared/Navbar.jsx (Updated for DaisyUI)

import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);

  const navLinks = (
    <>
      <li><Link to="/">Home</Link></li>
      {user && (
        <>
          <li><Link to="/add-model">Add Model</Link></li>
          <li><Link to="/my-models">My Models</Link></li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        {/* Mobile/Small Screen Dropdown */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {navLinks}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">AI Model Manager</Link>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navLinks}
        </ul>
      </div>

      <div className="navbar-end">
        {user ? (
          <div className="flex items-center space-x-2">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  {/* Placeholder for user photo */}
                  <img alt="User Photo" src={user.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <a className="justify-between">{user.displayName || 'User Profile'}</a>
                </li>
                <li><a onClick={logOut}>Logout</a></li>
              </ul>
            </div>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
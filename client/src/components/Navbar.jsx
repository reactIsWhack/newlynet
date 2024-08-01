import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, selectUser } from '../app/features/user/userSlice';
import NavLinks from './ui/NavLinks';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { profilePicture } = useSelector(selectUser);
  const dispatch = useDispatch();
  const [mobile, setMobile] = useState(window.innerWidth <= 550);

  const handleWindowSizeChange = () => {
    setMobile(window.innerWidth <= 500);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return (
    <div className="navbar bg-gray-800 shadow-lg sticky top-0 z-10">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl text-white">
          {mobile ? 'N' : 'NewlyNet'}
        </Link>
      </div>
      <NavLinks />
      <div className="flex-1 gap-2 flex items-center justify-end">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto bg-gray-800 text-gray-200"
          />
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img alt="Tailwind CSS Navbar component" src={profilePicture} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-gray-800 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between text-gray-200">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a className="text-gray-200">Settings</a>
            </li>
            <li>
              <Link
                onClick={() => dispatch(logoutUser())}
                className="text-gray-200"
                to="/"
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

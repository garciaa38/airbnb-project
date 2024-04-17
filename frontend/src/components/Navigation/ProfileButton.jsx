import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css'

function ProfileButton({ user, navigate }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate("/")
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu}>
        <FaUserCircle />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <div className="profile-items">
          <div className="profile-select">
        {user ? (
          <>
          <div className="profile-buttons">
            <li className="signup-options">Hello, {user.firstName}</li>
          </div>
          <div className="profile-buttons">
            <li className="signup-options">{user.email}</li>
          </div>
          <div className="profile-buttons">
            <li className="manage-spots">
              <Link to="/spots/current" onClick={closeMenu}>Manage Spots</Link>
            </li>
          </div>
          <div className="profile-buttons">
            <li className="logout-button">
              <button onClick={logout}>Log Out</button>
            </li>
          </div>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal navigate={navigate} />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal navigate={navigate} />}
              />
          </>
        )}
        </div>
        </div>
      </ul>
    </>
  );
}

export default ProfileButton;
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded, navigate }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className="nav-bar">
      <li className="home">
        <NavLink to="/">Home</NavLink>
      </li>
      <li className="new-spot">
      {sessionUser && <NavLink  to="/spots/new">Create New Spot</NavLink>}
      </li>
      {isLoaded && (
        <li className="profile-button">
          <ProfileButton  user={sessionUser} navigate={navigate} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
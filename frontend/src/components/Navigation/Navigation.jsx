import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded, navigate }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {sessionUser && <NavLink to="/spots/new">Create New Spot</NavLink>}
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} navigate={navigate} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import LandingPadIcon from "../../../../images/landing-pad-icon-full.png";

function Navigation({ isLoaded, navigate }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="nav-bar">
      <div className="nav-bar-left">
        <li className="home">
          <NavLink to="/">
            <img src={LandingPadIcon} alt="landing-pad-logo" />
          </NavLink>
        </li>
      </div>
      <div className="nav-bar-right">
        <li className="new-spot">
          {sessionUser && <NavLink to="/spots/new">Create New Spot</NavLink>}
        </li>
        {isLoaded && (
          <li className="profile-button">
            <ProfileButton user={sessionUser} navigate={navigate} />
          </li>
        )}
      </div>
    </ul>
  );
}

export default Navigation;

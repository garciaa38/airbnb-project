import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal({ navigate }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorHandle = {};
    setErrors({});

    if (password !== confirmPassword) {
      errorHandle.confirmPassword =
        "Confirm Password field must be the same as the Password field";
    }

    return dispatch(
      sessionActions.signup({
        email,
        username,
        firstName,
        lastName,
        password,
      })
    )
      .then(navigate("/"))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          for (const err in data.errors) {
           
            errorHandle[err] = data.errors[err];
          }
          setErrors(errorHandle);
        }
      });
  };

  return (
    <div className="sign-up-form">
      <h1>Sign Up</h1>
      <div className="error-list">
        {errors.email && <p className="errors">{errors.email}</p>}
        {errors.username && <p className="errors">{errors.username}</p>}
        {errors.firstName && <p className="errors">{errors.firstName}</p>}
        {errors.lastName && <p className="errors">{errors.lastName}</p>}
        {errors.password && <p className="errors">{errors.password}</p>}
        {errors.confirmPassword && (
          <p className="errors">{errors.confirmPassword}</p>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="sign-up-email">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="sign-up-username">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="sign-up-firstName">
          <input
            placeholder="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="sign-up-lastName">
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="sign-up-password">
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="sign-up-confirm">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="sign-up-submit">
          <button
            type="submit"
            className={
              email.length <= 0 ||
              username.length <= 3 ||
              firstName.length <= 0 ||
              lastName.length <= 0 ||
              password.length <= 5 ||
              confirmPassword.length <= 5
                ? "disabled-signup"
                : "submit-signup"
            }
            disabled={
              email.length <= 0 ||
              username.length <= 3 ||
              firstName.length <= 0 ||
              lastName.length <= 0 ||
              password.length <= 5 ||
              confirmPassword.length <= 5
            }
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;

import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal({ navigate }) {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await dispatch(sessionActions.login({ credential, password }));
      closeModal();
      navigate("/");
    } catch (err) {
      const data = await err.json();
      console.log("1", data, data.errors)
      if (data && data.errors) {
        console.log("2", data, data.errors)
        setErrors(data.errors);
        console.log("3", data, data.errors, errors)
      }
    }
  };

  return (
    <div className="login">
      <h1>Log In</h1>
      <div className="error-list">
        {errors.message && (
          <p className="errors">{`The provided credentials were invalid`}</p>
        )}
        {errors.credential && <p>{errors.credential}</p>}
      </div>
      <form onSubmit={handleSubmit} className="form">
        <div className="username-email-login">
          <input
            type="text"
            placeholder="Username or Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </div>
        <div className="password-login">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="login-submit">
          <button
            type="submit"
            disabled={credential.length < 4 || password.length < 6}
          >
            Log In
          </button>
        </div>
        <div className="login-demo-user">
          <button
            onClick={() => {
              setCredential("DemoOwner1");
              setPassword("password");
              return dispatch(sessionActions.login({ credential, password }))
                .then(closeModal)
                .then(navigate("/"))
                // .catch(async (res) => {
                //   const data = await res.json();
                //   if (data && data.errors) {
                //     setErrors(data.errors);
                //   }
                // });
            }}
          >
            Demo User
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;

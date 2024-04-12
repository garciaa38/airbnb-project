import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal({navigate}) {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
    .then(closeModal)
    .then(navigate("/"))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });

  };

  return (
    <>
      <h1>Log In</h1>
      {errors.message && <p className='errors'>{`The provided credentials were invalid`}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button
        onClick={() => {
          setCredential("DemoOwner1");
          setPassword("password");
          return dispatch(sessionActions.login({ credential, password }))
                .then(closeModal)
                .then(navigate("/"))
                .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                  setErrors(data.errors);
                }
            });
        }}
        >Demo User</button>
        <button 
        type="submit"
        disabled={credential.length < 4 || password.length < 6}
        >Log In
        </button>
      </form>
    </>
  );
}

export default LoginFormModal;
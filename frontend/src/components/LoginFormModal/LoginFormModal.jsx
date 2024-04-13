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

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});
  
  try {
    await dispatch(sessionActions.login({ credential, password }));
    closeModal();
    navigate("/");
  } catch (err) {
    const data = await err.json();
    if (data && data.errors) {
      setErrors(data.errors);
    }
  }
  };

  return (
    <div className="login">
      <h1>Log In</h1>
      {errors.message && <p className='errors'>{`The provided credentials were invalid`}</p>}
      <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Username or Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button 
        type="submit"
        disabled={credential.length < 4 || password.length < 6}
        >Log In
        </button>
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
      </form>
    </div>
  );
}

export default LoginFormModal;
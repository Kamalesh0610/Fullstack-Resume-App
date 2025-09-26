import React, { useState } from 'react';
import './AuthForm.css';
import { User } from '../types';
import { api } from '../src/api';

interface AuthFormProps {
  initialActive?: boolean;
  onLogin?: (user: User) => void;
  onSignup?: (user: User) => void;
  onNavigateToSignup?: () => void;
  onNavigateToLogin?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  initialActive = false,
  onLogin,
  onSignup,
  onNavigateToSignup,
  onNavigateToLogin
}) => {
  const [isActive, setIsActive] = useState(initialActive);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted:', loginData);
    setLoginError('');

    const result = await api.login(loginData.username, loginData.password);
    if (result.error) {
      setLoginError(result.error);
      return;
    }

    if (result.data) {
      const meResult = await api.getMe();
      if (meResult.data) {
        onLogin?.(meResult.data);
      } else {
        setLoginError('Failed to get user info');
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register submitted:', registerData);

    const result = await api.signup(registerData.email, registerData.password);
    if (result.error) {
      alert(result.error);
      return;
    }

    if (result.data) {
      onSignup?.(result.data);
    }
  };

  return (
    <div className={`container ${isActive ? 'active' : ''}`} style={{ margin: 0 }}>
      <div className="form-box login">
        <form onSubmit={handleLoginSubmit}>
          <h1>Login</h1>
          {loginError && <div style={{ color: 'red', fontSize: '14px', marginBottom: '10px', textAlign: 'center' }}>{loginError}</div>}
          <div className="input-box">
            <input
              type="text"
              placeholder="Email"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              required
            />
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            <i className='bx bxs-lock-alt'></i>
          </div>
          <div className="forgot-link">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="btn">Login</button>
        </form>
      </div>

      <div className="form-box register">
        <form onSubmit={handleRegisterSubmit}>
          <h1>Registration</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={registerData.username}
              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              required
            />
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              required
            />
            <i className='bx bxs-envelope'></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              required
            />
            <i className='bx bxs-lock-alt'></i>
          </div>
          <button type="submit" className="btn">Register</button>
        </form>
      </div>

      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
           <h1>Hello, Welcome!</h1>
           <p>Don't have an account?</p>
           <button className="btn register-btn" onClick={onNavigateToSignup}>Register</button>
         </div>

         <div className="toggle-panel toggle-right">
           <h1>Welcome Back!</h1>
           <p>Already have an account?</p>
           <button className="btn login-btn" onClick={onNavigateToLogin}>Login</button>
         </div>
      </div>
    </div>
  );
};

export default AuthForm;
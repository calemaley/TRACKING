'use client';
import { useState } from 'react';
import './login.css';

export default function AuthenticationPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const toggleForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLogin(!isLogin);
  };

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Handle Login
      console.log('Logging in with:', email, password);
    } else {
      // Handle Sign Up
      console.log('Signing up with:', fullName, email, password);
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <div className="drop">
          <div className="content">
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleAuthAction}>
              {isLogin ? (
                <>
                  <div className="input-box">
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <input type="submit" value="Login" />
                  </div>
                </>
              ) : (
                <>
                  <div className="input-box">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <input type="submit" value="Sign Up" />
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
        <a href="#" className="btn">
          Forgot Password
        </a>
        <a href="#" className="btn signup" onClick={toggleForm}>
          {isLogin ? 'Signup' : 'Login'}
        </a>
      </div>
    </div>
  );
}

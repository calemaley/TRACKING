'use client';
import { useState } from 'react';
import './login.css';

export default function AuthenticationPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLogin(!isLogin);
  };

  return (
    <div className="login-container">
      <div className="container">
        <div className="drop">
          <div className="content">
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form>
              {isLogin ? (
                <>
                  <div className="input-box">
                    <input type="text" placeholder="Username" />
                  </div>
                  <div className="input-box">
                    <input type="password" placeholder="Password" />
                  </div>
                  <div className="input-box">
                    <input type="submit" value="Login" />
                  </div>
                </>
              ) : (
                <>
                   <div className="input-box">
                    <input type="text" placeholder="Full Name" />
                  </div>
                  <div className="input-box">
                    <input type="email" placeholder="Email" />
                  </div>
                  <div className="input-box">
                    <input type="password" placeholder="Password" />
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

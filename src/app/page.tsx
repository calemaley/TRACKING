'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { 
  initiateEmailSignIn, 
  initiateEmailSignUp 
} from '@/firebase/non-blocking-login';
import { sendPasswordResetEmail } from 'firebase/auth';
import './login.css';
import { useToast } from '@/hooks/use-toast';

export default function AuthenticationPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const toggleForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLogin(!isLogin);
  };

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      initiateEmailSignIn(auth, email, password);
    } else {
      // Here you might want to do more with the full name, like creating a user profile
      initiateEmailSignUp(auth, email, password);
    }
  };

  const handlePasswordReset = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address to reset your password.',
        variant: 'destructive',
      });
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast({
          title: 'Password Reset Email Sent',
          description: 'Check your inbox for a link to reset your password.',
        });
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      });
  };

  if (isUserLoading || user) {
    return (
      <div className="login-container">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="container">
        <div className="drop">
          <div className="content">
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleAuthAction}>
              {!isLogin && (
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}
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
                <input type="submit" value={isLogin ? 'Login' : 'Sign Up'} />
              </div>
            </form>
          </div>
        </div>
        <a href="#" className="btn" onClick={handlePasswordReset}>
          Forgot Password
        </a>
        <a href="#" className="btn signup" onClick={toggleForm}>
          {isLogin ? 'Signup' : 'Login'}
        </a>
      </div>
    </div>
  );
}

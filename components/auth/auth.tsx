'use client';

import React, { useState, useCallback, memo, useEffect } from 'react';
import { FcGoogle } from "react-icons/fc";
import { Mail, Lock, User, Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { loginUser, signupUser, loginWithGoogle, resetPassword } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';

const validateEmail = (email: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

const Auth = memo(() => {
  const router = useRouter();
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleLoginChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [formErrors]);

  const handleRegisterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [formErrors]);

  const validateForm = (formData: any, isRegister = false) => {
    const errors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (isRegister) {
      if (!formData.username.trim()) {
        errors.username = "Username is required";
      } else if (formData.username.trim().length < 3) {
        errors.username = "Username must be at least 3 characters";
      }
    }
    
    return errors;
  };

  const handleToggle = useCallback((showReg: boolean) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setShowRegister(showReg);
    setFormErrors({});
    setMessage({ type: '', text: '' });
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  }, [isAnimating]);

  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await loginWithGoogle();
      setMessage({ type: 'success', text: 'Google login successful!' });
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "Google login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLoginSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    const errors = validateForm(loginForm);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }
    
    try {
      await loginUser(loginForm.email, loginForm.password);
      setMessage({ type: 'success', text: 'Login successful!' });
      setLoginForm({ email: '', password: '' });
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "Login failed. Please check your credentials." });
    } finally {
      setIsLoading(false);
    }
  }, [loginForm, router]);

  const handleRegisterSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    const errors = validateForm(registerForm, true);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }
    
    try {
      await signupUser(registerForm.email, registerForm.password);
      setMessage({ type: 'success', text: "Registration successful!" });
      setRegisterForm({ username: '', email: '', password: '' });
      
      setTimeout(() => {
        setShowRegister(false);
      }, 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }, [registerForm]);

  const handleResetPassword = useCallback(async () => {
    if (!loginForm.email || !validateEmail(loginForm.email)) {
      setMessage({ type: 'error', text: "Please enter a valid email address to reset password." });
      return;
    }
    
    setIsLoading(true);
    try {
      await resetPassword(loginForm.email);
      setMessage({ type: 'success', text: `Password reset email sent to ${loginForm.email}` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "Failed to send reset email. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }, [loginForm.email]);

  const MessageAlert = () => {
    if (!message.text) return null;
    
    const bgColor = message.type === 'error' ? 'bg-red-900/20 border-red-700/30' : 
                    message.type === 'success' ? 'bg-green-900/20 border-green-700/30' : 
                    'bg-blue-900/20 border-blue-700/30';
    
    const textColor = message.type === 'error' ? 'text-red-300' : 
                     message.type === 'success' ? 'text-green-300' : 
                     'text-blue-300';
    
    const Icon = message.type === 'error' ? AlertCircle : CheckCircle;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg border ${bgColor} ${textColor} shadow-lg flex items-center gap-3 max-w-md w-full backdrop-blur-sm`}
      >
        <Icon size={20} />
        <span className="font-medium">{message.text}</span>
      </motion.div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {message.text && <MessageAlert />}
      </AnimatePresence>
      
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <style jsx>{`
          .login-container {
            position: relative;
            width: 100%;
            max-width: 850px;
            height: 550px;
            background: #0f172a;
            border-radius: 24px;
            overflow: hidden;
            margin: 20px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
            border: 1px solid rgba(30, 41, 59, 0.5);
          }
          
          .toggle-slider {
            position: absolute;
            left: -250%;
            width: 300%;
            height: 100%;
            background: linear-gradient(135deg, #0c4a6e 0%, #1e40af 50%, #082f49 100%);
            border-radius: 150px;
            z-index: 2;
            transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .login-container.active .toggle-slider {
            left: 50%;
          }
          
          .form-box {
            position: absolute;
            top: 0;
            width: 50%;
            height: 100%;
            background: #0f172a;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 40px;
            z-index: 3;
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 1;
            visibility: visible;
          }
          
          .form-box.login {
            right: 0;
            left: auto;
          }
          
          .form-box.register {
            left: 0;
            right: auto;
            transform: translateX(-100%);
            opacity: 0;
            visibility: hidden;
          }
          
          .login-container.active .form-box.login {
            transform: translateX(100%);
            opacity: 0;
            visibility: hidden;
          }
          
          .login-container.active .form-box.register {
            transform: translateX(0);
            opacity: 1;
            visibility: visible;
          }
          
          .toggle-panel {
            position: absolute;
            width: 50%;
            height: 100%;
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 4;
            padding: 40px;
            text-align: center;
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .toggle-panel.toggle-left {
            left: 0;
          }
          
          .toggle-panel.toggle-right {
            right: -50%;
            opacity: 0;
            visibility: hidden;
          }
          
          .login-container.active .toggle-panel.toggle-left {
            left: -50%;
            opacity: 0;
            visibility: hidden;
          }
          
          .login-container.active .toggle-panel.toggle-right {
            right: 0;
            opacity: 1;
            visibility: visible;
          }
        `}</style>

        <div className={`login-container ${showRegister ? 'active' : ''}`}>
          <div className="toggle-slider"></div>

          {/* Login Form */}
          <div className="form-box login">
            <form onSubmit={handleLoginSubmit} className="w-full max-w-sm">
              <h1 className="text-4xl font-bold text-white mb-8">Welcome Back</h1>
              
              <div className="relative mb-6">
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className={`w-full px-5 py-4 pl-12 bg-slate-800/50 rounded-xl border-2 transition-all text-white placeholder-gray-400 ${
                    formErrors.email ? 'border-red-500/50' : 'border-slate-700/50'
                  } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  disabled={isLoading}
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                {formErrors.email && (
                  <span className="absolute -bottom-5 left-0 text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle size={14} /> {formErrors.email}
                  </span>
                )}
              </div>

              <div className="relative mb-2">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className={`w-full px-5 py-4 pl-12 bg-slate-800/50 rounded-xl border-2 transition-all text-white placeholder-gray-400 ${
                    formErrors.password ? 'border-red-500/50' : 'border-slate-700/50'
                  } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  disabled={isLoading}
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {formErrors.password && (
                  <span className="absolute -bottom-5 left-0 text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle size={14} /> {formErrors.password}
                  </span>
                )}
              </div>

              <div className="mb-6 text-right">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-gray-400 text-sm hover:text-blue-400 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 text-white rounded-xl font-bold hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-900 text-gray-400">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-4 text-white bg-slate-800/50 border border-slate-700 rounded-xl font-bold hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <FcGoogle size={24} /> 
                {isLoading ? 'Connecting...' : 'Continue with Google'}
              </button>
            </form>
          </div>

          {/* Registration Form */}
          <div className="form-box register">
            <form onSubmit={handleRegisterSubmit} className="w-full max-w-sm">
              <h1 className="text-4xl font-bold pb-5 text-white">
                Create Account
              </h1>

              <div className="relative mb-6">
                <input
                  required
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  className={`w-full px-5 py-4 pl-12 bg-slate-800/50 rounded-xl border-2 transition-all text-white placeholder-gray-400 ${
                    formErrors.username ? 'border-red-500/50' : 'border-slate-700/50'
                  } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  value={registerForm.username}
                  onChange={handleRegisterChange}
                  disabled={isLoading}
                />
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                {formErrors.username && (
                  <span className="absolute -bottom-5 left-0 text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle size={14} /> {formErrors.username}
                  </span>
                )}
              </div>

              <div className="relative mb-6">
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className={`w-full px-5 py-4 pl-12 bg-slate-800/50 rounded-xl border-2 transition-all text-white placeholder-gray-400 ${
                    formErrors.email ? 'border-red-500/50' : 'border-slate-700/50'
                  } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  disabled={isLoading}
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                {formErrors.email && (
                  <span className="absolute -bottom-5 left-0 text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle size={14} /> {formErrors.email}
                  </span>
                )}
              </div>

              <div className="relative mb-6">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password (min. 6 characters)"
                  className={`w-full px-5 py-4 pl-12 bg-slate-800/50 rounded-xl border-2 transition-all text-white placeholder-gray-400 ${
                    formErrors.password ? 'border-red-500/50' : 'border-slate-700/50'
                  } focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  disabled={isLoading}
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {formErrors.password && (
                  <span className="absolute -bottom-5 left-0 text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle size={14} /> {formErrors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 text-white rounded-xl font-bold hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Creating account...
                  </>
                ) : (
                  'Register'
                )}
              </button>

              <p className="text-gray-400 text-sm mt-4">
                By registering, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </div>

          {/* Left Toggle Panel */}
          <div className="toggle-panel toggle-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-xs"
            >
              <h1 className="text-4xl font-bold mb-6">New Here?</h1>
              <p className="mb-8 text-lg opacity-90 text-gray-300">
                Create an account to unlock exclusive features and start your journey with us.
              </p>
              <button
                onClick={() => handleToggle(true)}
                className="px-10 py-3 bg-transparent border-2 border-white/30 rounded-xl font-bold hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300 disabled:opacity-50 hover:scale-105 text-white"
                disabled={isLoading || isAnimating}
              >
                Sign Up
              </button>
            </motion.div>
          </div>

          {/* Right Toggle Panel */}
          <div className="toggle-panel toggle-right">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-xs"
            >
              <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
              <p className="mb-8 text-lg opacity-90 text-gray-300">
                Already have an account? Sign in to continue your amazing journey.
              </p>
              <button
                onClick={() => handleToggle(false)}
                className="px-10 py-3 bg-transparent border-2 border-white/30 rounded-xl font-bold hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300 disabled:opacity-50 hover:scale-105 text-white"
                disabled={isLoading || isAnimating}
              >
                Sign In
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
});

Auth.displayName = 'Auth';
export default Auth;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        sender: '',
        email: '',
        password: ''
    });
    const [loginMethod, setLoginMethod] = useState("login");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [activeField, setActiveField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [shake, setShake] = useState(false);

    useEffect(() => {
        setErrors({});
    }, [loginMethod]);

    const validateInputs = () => {
        const newErrors = {};
        
        if (loginMethod === 'signup' && !inputs.sender.trim()) {
            newErrors.sender = 'Name is required';
        }
        
        if (!inputs.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = 'Please enter a valid email';
        }
        
        if (inputs.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length > 0) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
        
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({...prev, [name]: ''}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;
        
        setIsSubmitting(true);
        
        try {
            const url = loginMethod === 'signup' ? 'http://localhost:3001/signup' : 'http://localhost:3001/login';
            const body = loginMethod === 'signup' ? 
                { name: inputs.sender, email: inputs.email, password: inputs.password } :
                { email: inputs.email, password: inputs.password };

                console.log("Dekhte hai jaata hai kya");
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            console.log("gaya to hai");
            console.log(body);
            
            const responseData = await response.json();
                
            if (!response.ok) {
                throw new Error(responseData.message || 'Something went wrong');
            }

            if(responseData.token) {
                localStorage.setItem("token", responseData.token);
                navigate('/dashboard');
                window.dispatchEvent(new Event("login"));
            }
            
        } catch (err) {
            setErrors(prev => ({...prev, form: err.message || 'Something went wrong'}));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSwitch = () => {
        setLoginMethod(prev => prev === 'login' ? 'signup' : 'login');
        setInputs({ sender: '', email: '', password: '' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6 relative overflow-hidden">
            {/* Subtle decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-32 h-32 bg-purple-50 rounded-full opacity-20 animate-float"></div>
                <div className="absolute bottom-40 left-40 w-40 h-40 bg-indigo-50 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-blue-50 rounded-full opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className={`w-full max-w-md relative z-10 transition-all duration-300 ${shake ? 'animate-shake' : ''}`}>
                {/* Clean white card with subtle shadow */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="p-8">
                        {/* Header with gradient text */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                {loginMethod === 'login' ? "Welcome Back" : "Create Account"}
                            </h1>
                            <p className="text-gray-600 font-light">
                                {loginMethod === 'login' 
                                    ? "Sign in to access your account" 
                                    : "Get started with your free account"}
                            </p>
                        </div>
                        
                        {/* Tab switcher */}
                        <div className="flex justify-center mb-8">
                            <div className="inline-flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setLoginMethod('login')}
                                    className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                                        loginMethod === 'login' 
                                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => setLoginMethod('signup')}
                                    className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                                        loginMethod === 'signup' 
                                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>

                        {errors.form && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center animate-fade-in">
                                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {errors.form}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {loginMethod === 'signup' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className={`relative transition-all duration-200 ${activeField === 'sender' ? 'transform scale-[1.01]' : ''}`}>
                                        <input
                                            className={`w-full px-4 py-3 text-gray-800 bg-white border ${errors.sender ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 placeholder-gray-400`}
                                            type="text"
                                            placeholder="Enter your name"
                                            name='sender'
                                            value={inputs.sender}
                                            onChange={handleChange}
                                            onFocus={() => setActiveField('sender')}
                                            onBlur={() => setActiveField(null)}
                                        />
                                    </div>
                                    {errors.sender && (
                                        <p className="mt-1 text-xs text-red-500 flex items-center animate-fade-in">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {errors.sender}
                                        </p>
                                    )}
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className={`relative transition-all duration-200 ${activeField === 'email' ? 'transform scale-[1.01]' : ''}`}>
                                    <input
                                        className={`w-full px-4 py-3 text-gray-800 bg-white border ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 placeholder-gray-400`}
                                        type="email"
                                        placeholder="your@email.com"
                                        name='email'
                                        value={inputs.email}
                                        onChange={handleChange}
                                        onFocus={() => setActiveField('email')}
                                        onBlur={() => setActiveField(null)}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center animate-fade-in">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className={`relative transition-all duration-200 ${activeField === 'password' ? 'transform scale-[1.01]' : ''}`}>
                                    <input
                                        className={`w-full px-4 py-3 text-gray-800 bg-white pr-10 border ${errors.password ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 placeholder-gray-400`}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        name='password'
                                        value={inputs.password}
                                        onChange={handleChange}
                                        onFocus={() => setActiveField('password')}
                                        onBlur={() => setActiveField(null)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors duration-200"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L21.75 21.75m-4.242-4.242L21.75 21.75M15.121 15.121L21.75 21.75" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center animate-fade-in">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                            
                            {loginMethod === 'login' && (
                                <div className="flex justify-end">
                                    <a href="#" className="text-sm text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-200">
                                        Forgot password?
                                    </a>
                                </div>
                            )}
                            
                            <button
                                type='submit'
                                disabled={isSubmitting}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 transform hover:scale-[1.01] ${
                                    isSubmitting 
                                        ? 'bg-purple-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-md hover:shadow-lg'
                                } focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 relative overflow-hidden group`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="relative z-10">
                                        {loginMethod === 'login' ? "Sign In" : "Sign Up"}
                                    </span>
                                )}
                                <span className={`absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 ${isHovered && !isSubmitting ? 'opacity-100' : ''} transition-opacity duration-300`}></span>
                            </button>
                        </form>
                        
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                {loginMethod === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                                <button
                                    onClick={handleSwitch}
                                    className="font-medium text-purple-600 hover:text-purple-700 hover:underline focus:outline-none transition-colors duration-200"
                                >
                                    {loginMethod === 'login' ? "Sign up" : "Sign in"}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add CSS for animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default AuthForm;
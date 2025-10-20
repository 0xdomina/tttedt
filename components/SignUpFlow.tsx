

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from './Icons';
import { logger } from '../utils/logger';

enum SignUpStep {
  AddContact,
  VerifyContact,
  CreatePassword,
  Success,
}

interface SignUpFlowProps {
  onComplete: () => void;
  onBack: () => void;
}

// Step Components defined outside to prevent re-renders
const ProgressIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="flex justify-center items-center gap-2">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <div
        key={index}
        className={`w-3 h-3 rounded-full transition-colors ${index < currentStep ? 'bg-violet-600' : 'bg-gray-200'}`}
      />
    ))}
  </div>
);

const AddContactStep: React.FC<{ onSubmit: (contact: string, method: 'phone' | 'email') => void }> = ({ onSubmit }) => {
    const [signupMethod, setSignupMethod] = useState<'phone' | 'email'>('phone');
    const [phoneInput, setPhoneInput] = useState('');
    const [emailInput, setEmailInput] = useState('');

    const isPhoneValid = phoneInput.length === 10;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (signupMethod === 'phone' && isPhoneValid) {
            onSubmit(`+234${phoneInput}`, 'phone');
        } else if (signupMethod === 'email' && isEmailValid) {
            onSubmit(emailInput, 'email');
        }
    };

    const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 10) {
            setPhoneInput(value);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-grow">
                <div className="flex border-b border-gray-200 mb-4">
                    <button type="button" onClick={() => setSignupMethod('phone')} className={`flex-1 py-2 font-semibold transition-colors ${signupMethod === 'phone' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-600'}`}>Phone</button>
                    <button type="button" onClick={() => setSignupMethod('email')} className={`flex-1 py-2 font-semibold transition-colors ${signupMethod === 'email' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-600'}`}>Email</button>
                </div>

                {signupMethod === 'phone' ? (
                    <div>
                        <label htmlFor="phone" className="font-semibold text-gray-700">Phone Number</label>
                        <div className="flex items-center mt-2 p-4 border border-gray-300 rounded-2xl focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-violet-500 transition bg-white">
                            <span className="font-semibold text-gray-500 pr-2 border-r border-gray-300">+234</span>
                            <input
                                id="phone"
                                type="tel"
                                value={phoneInput}
                                onChange={handlePhoneInputChange}
                                placeholder="801 234 5678"
                                className="w-full pl-2 outline-none bg-transparent text-gray-800"
                                autoFocus
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        <label htmlFor="email" className="font-semibold text-gray-700">Email Address</label>
                         <div className="flex items-center mt-2 p-4 border border-gray-300 rounded-2xl focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-violet-500 transition bg-white">
                            <input
                                id="email"
                                type="email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full outline-none bg-transparent text-gray-800"
                                autoFocus
                            />
                        </div>
                    </div>
                )}
            </div>
            <button
                type="submit"
                disabled={signupMethod === 'phone' ? !isPhoneValid : !isEmailValid}
                className="w-full py-4 px-6 bg-violet-600 text-white rounded-full font-semibold transition-colors disabled:bg-violet-300 disabled:cursor-not-allowed hover:bg-violet-700"
            >
                Continue
            </button>
        </form>
    );
};

const VerifyContactStep: React.FC<{ contact: string; method: 'phone' | 'email'; onVerified: () => void }> = ({ contact, method, onVerified }) => {
    const [code, setCode] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const CODE_LENGTH = 6;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= CODE_LENGTH) {
            setCode(value);
        }
    };

    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    const onVerifiedCallback = useCallback(onVerified, [onVerified]);

    useEffect(() => {
        if (code.length === CODE_LENGTH) {
            setTimeout(() => onVerifiedCallback(), 500);
        }
    }, [code, onVerifiedCallback]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow">
                <p className="text-gray-600 text-center">We just sent a {CODE_LENGTH}-digit code to your {method} <span className="font-semibold text-gray-800">{contact}</span>, enter it below:</p>
                <div className="mt-8">
                    <label className="font-semibold text-gray-700">Code</label>
                    <div
                        className="flex justify-center gap-2 mt-2 cursor-text"
                        onClick={handleContainerClick}
                    >
                        {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                            <div
                                key={index}
                                className={`w-12 h-14 flex items-center justify-center text-2xl font-bold border-2 rounded-xl transition-all ${
                                    code.length > index
                                        ? 'border-violet-600 bg-violet-600 text-white'
                                        : 'border-gray-300 bg-white text-gray-800'
                                }`}
                            >
                                {code[index] || ''}
                            </div>
                        ))}
                    </div>
                    <input
                        ref={inputRef}
                        type="tel"
                        value={code}
                        onChange={handleInputChange}
                        maxLength={CODE_LENGTH}
                        className="absolute opacity-0 w-0 h-0"
                        autoFocus
                    />
                </div>
            </div>
        </div>
    );
};

const CreatePasswordStep: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordValid = password.length >= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPasswordValid) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-grow">
        <label htmlFor="password"  className="font-semibold text-gray-700">Password</label>
        <div className="relative mt-2">
          <input
            id="password"
            type={isPasswordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-4 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition bg-white text-gray-800"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"
          >
            {isPasswordVisible ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={!isPasswordValid}
        className="w-full py-4 px-6 bg-violet-600 text-white rounded-full font-semibold transition-colors disabled:bg-violet-300 disabled:cursor-not-allowed hover:bg-violet-700"
      >
        Continue
      </button>
    </form>
  );
};

const SuccessStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => (
  <div className="flex flex-col h-full text-center justify-center items-center p-4 bg-white">
    <div className="flex-grow flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold text-gray-800">Your account was successfully created!</h2>
      <p className="text-gray-500 mt-4 max-w-xs">Only one click to explore your dream home!</p>
    </div>
    <div className="w-full">
      <button
        onClick={onComplete}
        className="w-full mb-4 py-4 px-6 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700 transition-colors"
      >
        Get Started
      </button>
      <p className="text-xs text-gray-400">
        By using edQorta, you agree to the <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
      </p>
    </div>
  </div>
);

const SignUpFlow: React.FC<SignUpFlowProps> = ({ onComplete, onBack }) => {
  logger.log('Component:SignUpFlow', 'Component rendering or re-rendering.');
  const [step, setStep] = useState<SignUpStep>(SignUpStep.AddContact);
  const [contactInfo, setContactInfo] = useState({ value: '', method: 'phone' as 'phone' | 'email' });
  
  const titles = ["Sign up", "Verify your contact", "Create Password"];
  const currentTitle = titles[step] || '';

  useEffect(() => {
    logger.log('Component:SignUpFlow', 'State changed: step', { step: SignUpStep[step] });
  }, [step]);

  const handleBack = () => {
    if (step === SignUpStep.AddContact) {
      onBack();
    } else if (step > SignUpStep.AddContact && step < SignUpStep.Success) {
      setStep(step - 1);
    }
  };

  const handleContactSubmit = useCallback((submittedContact: string, method: 'phone' | 'email') => {
    logger.log('Component:SignUpFlow', 'Executing handleContactSubmit.');
    setContactInfo({ value: submittedContact, method });
    setStep(SignUpStep.VerifyContact);
  }, []);

  const handleCodeVerified = useCallback(() => {
    logger.log('Component:SignUpFlow', 'Executing handleCodeVerified.');
    setStep(SignUpStep.CreatePassword);
  }, []);

  const handlePasswordSubmit = useCallback(() => {
    logger.log('Component:SignUpFlow', 'Executing handlePasswordSubmit.');
    setStep(SignUpStep.Success);
  }, []);
  
  if (step === SignUpStep.Success) {
    logger.log('Component:SignUpFlow', 'Rendering SuccessStep. onComplete will be called from here.');
    return <SuccessStep onComplete={onComplete} />;
  }

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      <header className="flex items-center justify-between mb-8">
        <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon />
        </button>
        <h2 className="font-bold text-lg text-gray-800">{currentTitle} {step + 1} / 3</h2>
        <div className="w-10"></div>
      </header>

      <ProgressIndicator currentStep={step + 1} totalSteps={3} />

      <main className="mt-8 flex-grow flex flex-col">
        {step === SignUpStep.AddContact && <AddContactStep onSubmit={handleContactSubmit} />}
        {step === SignUpStep.VerifyContact && <VerifyContactStep contact={contactInfo.value} method={contactInfo.method} onVerified={handleCodeVerified} />}
        {step === SignUpStep.CreatePassword && <CreatePasswordStep onSubmit={handlePasswordSubmit} />}
      </main>
    </div>
  );
};

export default SignUpFlow;

import { useEffect, useRef, useState } from "react";
import { useImages } from "./hooks/useImage";
import { useMobile } from "./hooks/useMediaQuery";
import { useNavigate } from "react-router-dom";
import Strings from "./utils/strings";
import { Eye, EyeOff, Info, Loader } from "lucide-react";

interface FormData {
    name: string;
    email: string;
    password: string;
}

function SignUpPage() {
    const isMobile = useMobile();
    const { getImage } = useImages();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: ''
    });

    const validatePassword = (value : string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{9,}$/;
        return regex.test(value);
    };

    const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '' && formData.name.trim() !== '' && validatePassword(formData.password);

    useEffect(() => {
        nameRef.current?.focus();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!isFormValid || isLoading) return;

        setIsLoading(true);
        try {
            // Replace with your actual sign-in logic
            await new Promise(resolve => setTimeout(resolve, 2000));
            navigate(Strings.initialRoute);
        } catch (error) {
            console.error('Sign in failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && isFormValid && !isLoading) {
            handleSubmit();
        }
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center ${isMobile ? 'p-8' : ''}`}>
            <div className={`flex flex-col w-full max-w-md bg-white rounded-2xl shadow-lg ${isMobile ? 'py-8 px-6' : 'py-12 px-20'} border border-gray-dark items-center`}>
                <img
                    src={getImage('appLogo')}
                    alt="App Logo"
                    className="w-40 h-15 mb-5"
                />
                <span className="text-sm font-semibold text-gray-dark mb-10">{Strings.signUpSubText}</span>
                <input
                    ref={nameRef}
                    type="text"
                    autoFocus
                    value={formData.name}
                    placeholder={Strings.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                            emailRef.current?.focus();
                        }
                    }}
                    disabled={isLoading}
                    className="w-full h-10 rounded-lg border border-gray-light placeholder:text-gray-light text-black px-4 outline-none focus:border-black transition-all mb-5"
                />
                <input
                    ref={emailRef}
                    type="text"
                    autoFocus
                    value={formData.email}
                    placeholder={Strings.emailAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                            passwordRef.current?.focus();
                        }
                    }}
                    disabled={isLoading}
                    className="w-full h-10 rounded-lg border border-gray-light placeholder:text-gray-light text-black px-4 outline-none focus:border-black transition-all mb-5"
                />
                <div className="relative w-full mb-3">
                    <input
                        ref={passwordRef}
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        placeholder={Strings.password}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        disabled={isLoading}
                        className="w-full h-10 rounded-lg border border-gray-light placeholder:text-gray-light text-black px-4 pr-10 outline-none focus:border-black transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-light hover:text-gray-dark transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>
                {(formData.password.trim() !== '' && !validatePassword(formData.password)) && (
                    <div className="self-start flex gap-2 text-sm font-semibold text-orange-400 mb-5">
                        <Info
                            className="w-10 h-10"
                        />
                        <span>Password must be at least 9 characters long and include uppercase, lowercase, and a special character.</span>
                    </div>
                )}
                <button
                    ref={buttonRef}
                    disabled={!isFormValid || isLoading}
                    className={`h-10 transition-all flex items-center justify-center font-semibold ${isLoading
                        ? 'w-10 rounded-full bg-primary'
                        : isFormValid
                            ? 'w-full rounded-lg bg-primary hover:bg-primary cursor-pointer'
                            : 'w-full rounded-lg bg-gray-light cursor-not-allowed'
                        }`}
                    onClick={handleSubmit}
                >
                    {isLoading ? (
                        <Loader size={20} className="text-white animate-spin" />
                    ) : (
                        <span className="text-sm font-semibold text-white">{Strings.signUp}</span>
                    )}
                </button>
            </div>
        </div>
    );
}

export default SignUpPage;
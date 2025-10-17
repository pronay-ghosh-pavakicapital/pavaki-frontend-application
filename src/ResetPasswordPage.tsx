import { useEffect, useRef, useState } from "react";
import { useImages } from "./hooks/useImage";
import { useMobile } from "./hooks/useMediaQuery";
import { useNavigate } from "react-router-dom";
import Strings from "./utils/strings";
import { Eye, EyeOff, Loader } from "lucide-react";

interface FormData {
    newPassword: string;
    confirmPassword: string;
}

function ResetPasswordPage () {
    const isMobile = useMobile();
    const { getImage } = useImages();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<FormData>({
        newPassword: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const isFormValid = formData.newPassword.trim() !== '' && formData.confirmPassword.trim() !== '';

    useEffect(() => {
        passwordRef.current?.focus();
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
            await new Promise(resolve => setTimeout(resolve, 2000));
            navigate(Strings.initialRoute);
        } catch (error) {
            console.error('Reset password failed:', error);
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
                <span className="text-sm font-semibold text-gray-dark mb-10">{Strings.resetPasswordSubText}</span>
                <div className="relative w-full mb-3">
                    <input
                        ref={passwordRef}
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={formData.newPassword}
                        placeholder={Strings.newPassword}
                        onChange={handleInputChange}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter') {
                                confirmPasswordRef.current?.focus();
                            }
                        }}
                        disabled={isLoading}
                        className="w-full h-10 rounded-lg border border-gray-light placeholder:text-gray-light text-black px-4 pr-10 outline-none focus:border-black transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-light hover:text-gray-dark transition-colors"
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                        {showNewPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>
                <div className="relative w-full mb-3">
                    <input
                        ref={confirmPasswordRef}
                        type={showNewPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        placeholder={Strings.confirmPassword}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        disabled={isLoading}
                        className="w-full h-10 rounded-lg border border-gray-light placeholder:text-gray-light text-black px-4 pr-10 outline-none focus:border-black transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-light hover:text-gray-dark transition-colors"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                        {showConfirmPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>
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
                        <span className="text-sm font-semibold text-white">{Strings.continue}</span>
                    )}
                </button>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
import { useEffect, useRef, useState } from "react";
import { useImages } from "./hooks/useImage";
import { useNavigate } from "react-router-dom";
import { useMobile } from "./hooks/useMediaQuery";
import Strings from "./utils/strings";
import { Loader } from "lucide-react";

interface FormData {
    email: string;
}

function VerifyEmailPage () {
    const isMobile = useMobile();
    const { getImage } = useImages();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();
    const emailRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<FormData>({
        email: '',
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isFormValid = formData.email.trim() !== '';

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    const handleSubmit = async () => {
        if (!isFormValid || isLoading) return;

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            navigate(Strings.resetPassowrdRoute);
        } catch (error) {
            console.error('Verification email failed:', error);
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
                <span className="text-sm font-semibold text-gray-dark mb-6">{Strings.verifyEmailSubText}</span>
                <input
                    ref={emailRef}
                    type="text"
                    autoFocus
                    value={formData.email}
                    placeholder={Strings.emailAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    onKeyDown={handleKeyPress}
                    disabled={isLoading}
                    className="w-full h-10 rounded-lg border border-gray-light placeholder:text-gray-light text-black px-4 outline-none focus:border-black transition-all mb-5"
                />
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

export default VerifyEmailPage;
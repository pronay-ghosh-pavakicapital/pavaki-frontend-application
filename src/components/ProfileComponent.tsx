import { useRef, useState, useEffect } from "react";
import { useImages } from "../hooks/useImage";
import { useMobile } from "../hooks/useMediaQuery";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Strings from "../utils/strings";
import LogoutConfirmModal from "../models/LogoutConfirmModal";

function ProfileComponent() {
    const [showProfileDropdown, setProfileDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const profileIconRef = useRef<HTMLImageElement>(null);
    const { getImage } = useImages();
    const isMobile = useMobile();
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        localStorage.clear();
        navigate(Strings.initialRoute);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                profileIconRef.current &&
                !profileIconRef.current.contains(event.target as Node)
            ) {
                setProfileDropdown(false);
            }
        };

        if (showProfileDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showProfileDropdown]);   

    return (
        <div>
            <img
                ref={profileIconRef}
                onClick={() => setProfileDropdown(!showProfileDropdown)}
                src={getImage('profileIcon')}
                alt="Profile"
                className={`${isMobile ? 'w-5 h-5' : 'w-7 h-7'} cusror-pointer`}
            />
            {showProfileDropdown && (
                <div
                    ref={dropdownRef}
                    className={`absolute ${isMobile ? 'right-0 mt-2' : 'right-6 mt-2'} w-70 rounded-lg shadow-lg bg-white ring-1 ring-gray-dark ring-opacity-2 z-50`}
                >
                    <div className="flex items-center px-4 py-6 border-b border-gray-light gap-2">
                        <img
                            src={getImage('profileIcon')}
                            alt="Profile"
                            className={`${isMobile ? 'w-5 h-5' : 'w-10 h-10'}`}
                        />
                        <div className="flex flex-1 flex-col">
                            <span className="text-lg font-medium text-gray-dark">Rishav Deb Roy</span>
                            <span className="text-xs font-normal text-gray-dark">debroyrishab@gmail.com</span>
                        </div>
                        <LogOut
                            className="w-4 h-4 cursor-pointer"
                            color="#3568EC"
                            onClick={handleLogoutClick}
                        />
                    </div>
                </div>
            )}
            <LogoutConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleConfirmLogout}
            />
        </div>
    );
}

export default ProfileComponent;
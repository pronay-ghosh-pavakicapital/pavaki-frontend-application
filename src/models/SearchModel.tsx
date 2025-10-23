import { useRef, useState } from "react";
import { useImages } from "../hooks/useImage";
import { useMobile } from "../hooks/useMediaQuery";
import Strings from "../utils/strings";

interface SerachModalProps {
    onClose: () => void;
    onSubmit: (name: string, ticker: string) => void;
    isOpen: boolean;
}

function SearchModal({
    onClose,
    onSubmit,
    isOpen
}: SerachModalProps) {
    const isMobile = useMobile();
    const { getImage } = useImages();
    const searchRef = useRef<HTMLInputElement>(null);
    const [searchValue, setSerachValue] = useState('');
    const dataList = {
        "AAPL": "Apple",
        "MSFT": "Microsoft",
        "NVDA": "Nvidia",
        "TSLA": "Tesla",
        "GOOGL": "Google",
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSubmit(searchValue, searchValue);
            setSerachValue('');
            onClose();
        }
    };

    const handleResultClick = (name: string, ticker: string) => {
        onSubmit(name, ticker);
        setSerachValue('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
            <div
                className={`absolute inset-0 backdrop-blur-xs`}
                onClick={onClose}
            />
            <div className={`relative rounded-lg p-2 md:p-3 max-w-lg w-full ${isMobile ? 'mx-4 max-h-[90vh]' : 'mx-4'} h-120 shadow-xl overflow-y-auto bg-white`}>
                <div className="flex items-end justify-end">
                    <img
                        src={getImage('cross')}
                        className="w-4 h-4 cursor-pointer"
                        onClick={onClose}
                    />
                </div>
                <div className="flex items-center px-4 justify-start rounded-full w-full border-2 border-primary-lightest h-10 mt-5 gap-2">
                    <img
                        src={getImage('searchBlue')}
                        className="w-4 h-4 cursor-pointer"
                        onClick={onClose}
                    />
                    <input
                        placeholder={Strings.searchStock}
                        ref={searchRef}
                        value={searchValue}
                        className="w-full text-sm text-black placeholder:text-gray-light outline-none focus:none"
                        onKeyDown={handleKeyPress}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSerachValue(e.target.value.toUpperCase())}}
                    />
                    <img
                        src={getImage('send')}
                        className="w-8 h-6 cursor-pointer"
                        onClick={() => {onSubmit(searchValue, searchValue)}}
                    />
                </div>
                <div>
                    <p className="text-xs text-gray-light font-semibold px-2 mt-5 mb-2">related search</p>
                    <div className="space-y-2">
                        {Object.entries(dataList).map(([ticker, name]) => (
                            <div
                                key={ticker}
                                className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                                onClick={() => handleResultClick(name, ticker)}
                            >
                                <span className="text-lg font-normal font-roboto text-black">{name}</span>
                                <span className="text-xl font-normal font-roboto text-black">{ticker}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchModal;
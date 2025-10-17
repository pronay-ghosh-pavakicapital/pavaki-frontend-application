import { useImages } from "./hooks/useImage";
import { useMobile } from "./hooks/useMediaQuery";
import Strings from "./utils/strings";

function AddTickerPage() {
    const isMobile = useMobile();
    const { getImage } = useImages();

    return (
        <div className={`flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex ${isMobile ? 'py-4' : 'p-6'}`}>
            <div className="flex items-center justify-between w-full h-15">
                <img
                    src={getImage('appLogo')}
                    alt="App Logo"
                    className={`${isMobile ? 'w-40 h-10' : 'w-40 h-15'}`}
                />
                <div className="flex items-center space-x-4 mr-5">
                    <img
                        src={getImage('searchBlack')}
                        alt="Search"
                        className='w-5 h-5'
                    />
                    <img
                        src={getImage('profileIcon')}
                        alt="Profile"
                        className={`${isMobile ? 'w-5 h-5' : 'w-7 h-7'}`}
                    />
                </div>
            </div>
            <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center">
                    <span className="text-sm font-normal text-gray-lighter text-center max-w-sm px-4">{Strings.multipleTickersText}</span>
                    <div className="border border-gray-light">

                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddTickerPage;
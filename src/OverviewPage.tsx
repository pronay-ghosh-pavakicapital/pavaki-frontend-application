import { useState, useRef, useEffect } from "react";
import ProfileComponent from "./components/ProfileComponent";
import { useImages } from "./hooks/useImage";
import { useMobile } from "./hooks/useMediaQuery";
import { useStocksStorage } from "./hooks/useStockStorgae";
import SearchModal from "./models/SearchModel";
import Strings from "./utils/strings";
import { ChevronDown } from "lucide-react";
import Flag from "react-world-flags";
import LogoutConfirmModal from "./models/LogoutConfirmModal";
import { useNavigate } from "react-router-dom";
import type { FilterModel } from "./data_models/FilterDataModel";
import FilterModal from "./models/FilterModel";

function OverviewPage() {
    const isMobile = useMobile();
    const { getImage } = useImages();
    const navigate = useNavigate();
    const [isModelOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<string>(Strings.pastYear);
    const [isFilterModelOpen, setIsFilterModelOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isCompareMode, setIsCompareMode] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const {
        stocks,
        setStocks
    } = useStocksStorage([]);
    const [selectedStock, setSelectedStock] = useState<number | null>(null);
    const [comparisonStocks, setComparisonStocks] = useState<number[]>([]);
    const [selectedStockIndex, setSelectedStockIndex] = useState<number | null>(null);

    const allTabs = [
        Strings.finalOutput,
        Strings.pastYear,
        Strings.inputSheet,
        Strings.costCapital,
        Strings.valuation,
        Strings.valuationOutput,
        Strings.valuationOutputHistorical,
        Strings.cfoOI,
        Strings.cfoOILFY,
        Strings.cfoOIHistorical,
        Strings.cfoRevenue,
        Strings.cfoRevenueLfy,
        Strings.cfoRevenueHistorical,
        Strings.fcff,
        Strings.fcffLfy,
        Strings.fcffHistorical,
        Strings.companyAnalysis,
        Strings.rdConverter,
        Strings.diagonostics,
        Strings.summarySheet,
        Strings.opreatingLease,
        Strings.countryEquity,
        Strings.syntheticRating,
        Strings.industryAverageUS,
        Strings.industryAverageGlobal,
        Strings.traling12Month,
        Strings.answerKeys,
        Strings.propertyValuation,
        Strings.storiesNumbers,
        Strings.optionValue,
        Strings.simulationSheet,
    ];

    const handleAddStock = (name: string, ticker: string): void => {
        setStocks(prevStocks => {

            // Generate new auto-increment ID
            const maxId = Math.max(
                ...prevStocks
                    .filter(s => s.id !== null)
                    .map(s => s.id as number),
                0
            );
            const newId = maxId + 1;

            // Add new stock to the list
            const updatedStocks = [
                ...prevStocks,
                {
                    id: newId,
                    name,
                    ticker,
                    countryName: 'US',
                    filterData: null
                }
            ];
            console.log('Added new stock:', ticker, 'with ID:', newId);
            return updatedStocks;
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(false);
            }
        };

        if (openDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDropdown]);

    // Handle hardware back button
    useEffect(() => {
        // Push a history state to detect back button
        const unblock = () => {
            // Push a dummy state so back button triggers popstate
            window.history.pushState(null, '', window.location.href);
        };

        // Push initial state
        unblock();

        const handlePopState = () => {
            // User pressed back - show logout modal
            setShowLogoutModal(true);
            // Push state again to keep user on this page
            window.history.pushState(null, '', window.location.href);
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const handleConfirmLogout = () => {
        localStorage.clear();
        navigate(Strings.initialRoute);
    };

    const handleFilterSubmit = (filterData: FilterModel): void => {
        if (selectedStockIndex !== null) {
            setStocks(prevStocks => {
                const updatedStocks = [...prevStocks];
                updatedStocks[selectedStockIndex] = {
                    ...updatedStocks[selectedStockIndex],
                    filterData,
                    countryName: filterData.countryOfIncorpation
                };
                return updatedStocks;
            });

        }
    };

    // Handle stock selection (single for Overview, multiple for Compare)
    const handleStockSelection = (stockId: number) => {
        if (isCompareMode) {
            // Multiple selection for Compare mode
            setComparisonStocks(prev => {
                if (prev.includes(stockId)) {
                    return prev.filter(id => id !== stockId);
                } else {
                    return [...prev, stockId];
                }
            });
        } else {
            // Single selection for Overview mode
            setSelectedStock(stockId);
        }
    };

    // Set first non-null stock as selected
    useEffect(() => {
        const firstStock = stocks.find(stock => stock.id !== null);
        if (firstStock && !selectedStock) {
            setSelectedStock(firstStock.id);
        }
    }, [stocks, selectedStock]);

    const handleFilterClick = (stockId: number): void => {
        const index = stocks.findIndex(s => s.id === stockId);
        if (index !== -1) {
            setSelectedStockIndex(index);
            setIsFilterModelOpen(true);
        }
    };

    // Custom scrollbar styling - only for compare table section
    const scrollbarStyles = `
        .compare-scroll-container::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        .compare-scroll-container::-webkit-scrollbar-track {
            background: transparent;
        }
        .compare-scroll-container::-webkit-scrollbar-thumb {
            background: #AEC1EE;
            border-radius: 5px;
        }
        .compare-scroll-container::-webkit-scrollbar-thumb:hover {
            background: #98b1e6;
        }
        .compare-scroll-container {
            scrollbar-color: #AEC1EE transparent;
        }
    `;

    return (

        <div className={`flex flex-col h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-gray-50 ${isMobile ? 'py-4' : 'p-6'}`}>
            <header className="flex items-center justify-between w-full h-15 flex-shrink-0">
                <img
                    src={getImage('appLogo')}
                    alt="App Logo"
                    className={`${isMobile ? 'w-40 h-10' : 'w-40 h-15'}`}
                />
                <div className="flex gap-4 items-center">
                    <img
                        src={getImage('searchBlack')}
                        alt="App Logo"
                        className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5'}`}
                        onClick={() => { setIsModalOpen(true); }}
                    />
                    <ProfileComponent />
                </div>
                <SearchModal
                    isOpen={isModelOpen}
                    onClose={() => { setIsModalOpen(false); }}
                    onSubmit={handleAddStock}
                />
            </header>

            {/* Tab Bar */}
            <div className="flex gap-4 mt-6 px-6 flex-shrink-0">
                <div ref={dropdownRef} className="relative ">
                    <button
                        onClick={() => setOpenDropdown(!openDropdown)}
                        className={`flex items-center gap-1 px-4 py-2 font-medium transition-colors text-xs ${activeTab !== Strings.compare
                            ? 'text-white rounded-full bg-primary'
                            : 'text-gray-dark rounded-full border border-gray-dark bg-transparent'
                            }`}
                    >
                        {activeTab === Strings.compare ? Strings.overview : activeTab}
                        <ChevronDown
                            size={12}
                            className={`transition-transform ${openDropdown ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {openDropdown && (
                        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg z-50 w-60 h-120 overflow-y-auto px-2">
                            {allTabs.map((tab, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        setOpenDropdown(false);
                                        setIsCompareMode(false);
                                    }}
                                    className={`w-full text-left text-xs px-3 py-2 hover:bg-blue-50 transition-colors block truncate ${activeTab === tab ? 'rounded-full bg-primary text-white font-normal' : 'text-gray-dark hover:text-primary font-normal rounded-full'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => {
                        setActiveTab(Strings.compare);
                        setIsCompareMode(true);
                        setComparisonStocks([]);
                    }}
                    className={`px-4 py-2 font-medium transition-colors text-xs ${activeTab === Strings.compare
                        ? 'text-white rounded-full bg-primary'
                        : 'text-gray-dark rounded-full border border-gray-dark bg-transparent'
                        }`}
                >
                    {Strings.compare}
                </button>
            </div>

            {/* Main Content Section */}
            <div className="flex gap-6 flex-1 mt-6 px-6 min-h-0 overflow-hidden">
                {/* Left Section - Stocks List (Fixed Width) */}
                <div className="w-[15%] flex-shrink-0 flex flex-col gap-3 overflow-y-auto h-full">
                    {stocks.filter(stock => stock.id !== null).length === 0 ? (
                        <div className="flex items-center justify-center h-40">
                            <p className="text-gray-light text-center">No stocks added yet. Please add one</p>
                        </div>
                    ) : (
                        stocks
                            .filter(stock => stock.ticker !== null)
                            .map((stock) => (
                                <div
                                    key={stock.id}
                                    onClick={() => handleStockSelection(stock.id!)}
                                    className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${isCompareMode
                                        ? comparisonStocks.includes(stock.id!)
                                            ? 'border-primary bg-blue-50'
                                            : 'border-dashed border-primary hover:shadow-lg'
                                        : selectedStock === stock.id
                                            ? 'border-primary bg-blue-50'
                                            : 'border-dashed border-primary hover:shadow-lg'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <Flag code={stock.countryName || 'US'} className="w-4 h-4" />
                                        <img
                                            src={getImage('filterBlue')}
                                            className="w-3 h-3 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFilterClick(stock.id!);
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-end gap-2">
                                        <span className="text-sm text-primary font-normal truncate">{stock.name}</span>
                                        <span className="text-lg text-primary font-semibold">{stock.ticker}</span>
                                    </div>
                                </div>
                            ))
                    )}
                </div>

                {/* Right Section - Content (Remaining Width) */}
                <div className="w-[85%] flex-shrink-0 flex flex-col min-h-0 max-h-full">
                    {isCompareMode ? (
                        // COMPARE SECTION
                        <>
                            <h2 className="text-xl font-semibold text-gray-dark mb-10 flex-shrink-0">Financial Metric Comparison</h2>

                            {comparisonStocks.length === 0 ? (
                                <div className="rounded-xl p-8 shadow-sm border border-bg-compare-border flex items-center justify-center flex-1 min-h-0">
                                    <p className="text-gray-light text-center text-lg text-lg">
                                        Select stocks from the left panel to compare metrics
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <style>{scrollbarStyles}</style>
                                    <div className="min-h-0 bg-white rounded-xl shadow-sm border border-bg-compare-border overflow-hidden flex flex-col">
                                        <div className="w-full min-h-0 overflow-x-scroll overflow-y-scroll compare-scroll-container">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr>
                                                        <th className="text-lg text-left px-6 py-4 font-semibold text-gray-dark left-0 z-10 bg-white">
                                                            Metric
                                                        </th>
                                                        {comparisonStocks.map((stockId) => {
                                                            const stock = stocks.find(s => s.id === stockId);
                                                            return (
                                                                <th
                                                                    key={stockId}
                                                                    className="text-lg text-center px-6 py-4 font-semibold text-primary"
                                                                >
                                                                    {stock?.name}
                                                                    <br />
                                                                    <span className="text-xs font-normal text-gray-dark">
                                                                        {stock?.ticker}
                                                                    </span>
                                                                </th>
                                                            );
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[
                                                        'Score',
                                                        'Category',
                                                        'Country',
                                                        'Currency',
                                                        'market cap',
                                                        'Net cost with market cap (both columns)',
                                                        'PP1 (both columns)',
                                                        '%cost',
                                                        '%mkap',
                                                        'PP2 (both columns)',
                                                        '%cost',
                                                        '%mkap',
                                                        'Goodwill/intangible %',
                                                        'Non controlling %',
                                                        'Net debt'
                                                    ].map((metric, idx) => (
                                                        <tr key={idx} >
                                                            <td className="text-left px-6 py-4 font-medium text-gray-dark left-0 z-10 bg-inherit whitespace-nowrap">
                                                                {metric}
                                                            </td>
                                                            {comparisonStocks.map((stockId) => (
                                                                <td
                                                                    key={`${stockId}-${idx}`}
                                                                    className="text-center px-6 py-4 text-gray-dark whitespace-nowrap"
                                                                >
                                                                    -
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        // OVERVIEW SECTION
                        <>
                            {/* Selected Stock Name */}
                            <div className="mb-10 flex-shrink-0">
                                <h2 className="text-2xl font-semibold text-gray-dark">
                                    {selectedStock ? stocks.find(s => s.id === selectedStock)?.name : 'No Stock Selected'}
                                </h2>
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-bg-compare-border overflow-hidden flex flex-col">
                                <div className="overflow-y-auto overflow-x-auto flex-1 min-h-0 p-6">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="text-xl font-medium text-primary">{activeTab}</h3>
                                        <img 
                                            src={getImage('expandLogo')}
                                            className="w-5 h-5"
                                            onClick={() => {}}
                                        />
                                    </div>
                                    
                                    <div className="text-gray-dark">
                                        {/* Tab content will go here */}
                                        Content for {activeTab} tab
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <LogoutConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleConfirmLogout}
            />

            <FilterModal
                isOpen={isFilterModelOpen}
                onClose={() => {
                    setIsFilterModelOpen(false);
                    setSelectedStockIndex(null);
                }}
                onSubmit={handleFilterSubmit}
                initialData={selectedStockIndex !== null ? stocks[selectedStockIndex].filterData : null}
            />
        </div>

    );
}

export default OverviewPage;
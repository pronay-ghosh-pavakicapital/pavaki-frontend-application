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
    const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

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

    // Handle hardware back button for zoom modal
    useEffect(() => {
        if (isZoomModalOpen) {
            const handleZoomPopState = () => {
                setIsZoomModalOpen(false);
                window.history.pushState(null, '', window.location.href);
            };

            window.history.pushState(null, '', window.location.href);
            window.addEventListener('popstate', handleZoomPopState);

            return () => {
                window.removeEventListener('popstate', handleZoomPopState);
            };
        }
    }, [isZoomModalOpen]);

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

    // Custom scrollbar styling - for compare table section and zoom modal
    const scrollbarStyles = `
        .compare-scroll-container::-webkit-scrollbar,
        .zoom-modal-content::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        .compare-scroll-container::-webkit-scrollbar-track,
        .zoom-modal-content::-webkit-scrollbar-track {
            background: transparent;
        }
        .compare-scroll-container::-webkit-scrollbar-thumb,
        .zoom-modal-content::-webkit-scrollbar-thumb {
            background: #AEC1EE;
            border-radius: 5px;
        }
        .compare-scroll-container::-webkit-scrollbar-thumb:hover,
        .zoom-modal-content::-webkit-scrollbar-thumb:hover {
            background: #98b1e6;
        }
        .compare-scroll-container,
        .zoom-modal-content {
            scrollbar-color: #AEC1EE transparent;
            scrollbar-gutter: stable;
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
                            <div className="mb-4 flex-shrink-0">
                                <h2 className="text-2xl font-semibold text-gray-dark">
                                    {selectedStock ? stocks.find(s => s.id === selectedStock)?.name : 'No Stock Selected'}
                                </h2>
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-bg-compare-border overflow-hidden flex flex-col relative">
                                <div className="overflow-y-auto overflow-x-auto flex-1 min-h-0 p-6">
                                    {/* Tab Header with Zoom Icon */}
                                    <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10">
                                        <h3 className="text-xl font-medium text-primary">{activeTab}</h3>
                                        <button
                                            onClick={() => setIsZoomModalOpen(true)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Zoom in"
                                        >
                                            <img
                                                src={getImage('expandLogo')}
                                                className="w-5 h-5"
                                            />
                                        </button>
                                    </div>

                                    {/* Tables Container */}
                                    <div className="space-y-6">
                                        {/* Determine number of tables based on active tab */}
                                        {activeTab === Strings.pastYear ? (
                                            // 1 table for Past Year
                                            <div className="border border-gray-light rounded-lg overflow-x-auto">
                                                <table className="w-full text-sm border-collapse">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="text-left px-4 py-3 font-semibold text-gray-dark border-b">Period</th>
                                                            <th className="text-center px-4 py-3 font-semibold text-gray-dark border-b">Revenue</th>
                                                            <th className="text-center px-4 py-3 font-semibold text-gray-dark border-b">EBIT</th>
                                                            <th className="text-center px-4 py-3 font-semibold text-gray-dark border-b">Net Income</th>
                                                            <th className="text-center px-4 py-3 font-semibold text-gray-dark border-b">EPS</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {[
                                                            { period: 'FY 2024', revenue: '$5.2B', ebit: '$1.8B', ni: '$1.2B', eps: '$4.50' },
                                                            { period: 'FY 2023', revenue: '$4.8B', ebit: '$1.6B', ni: '$1.0B', eps: '$3.85' },
                                                            { period: 'FY 2022', revenue: '$4.2B', ebit: '$1.4B', ni: '$0.9B', eps: '$3.20' },
                                                            { period: 'FY 2021', revenue: '$3.8B', ebit: '$1.2B', ni: '$0.8B', eps: '$2.75' },
                                                        ].map((row, idx) => (
                                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                <td className="text-left px-4 py-3 text-gray-dark border-b">{row.period}</td>
                                                                <td className="text-center px-4 py-3 text-gray-dark border-b">{row.revenue}</td>
                                                                <td className="text-center px-4 py-3 text-gray-dark border-b">{row.ebit}</td>
                                                                <td className="text-center px-4 py-3 text-gray-dark border-b">{row.ni}</td>
                                                                <td className="text-center px-4 py-3 text-gray-dark border-b">{row.eps}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : activeTab === Strings.finalOutput ? (
                                            // 13 tables for Final Output
                                            <>
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((tableNum) => (
                                                    <div key={tableNum} className="border border-gray-light rounded-lg overflow-x-auto">
                                                        <h4 className="bg-gray-50 px-4 py-2 font-semibold text-gray-dark text-sm">
                                                            Table {tableNum}: {['Valuation Summary', 'Cash Flow Analysis', 'Growth Metrics', 'Profitability', 'Market Multiples', 'Financial Ratios', 'Industry Comparison', 'Historical Trends', 'Risk Metrics', 'Capital Structure', 'Dividend Analysis', 'ESG Metrics', 'Investment Score'][tableNum - 1]}
                                                        </h4>
                                                        <table className="w-full text-sm border-collapse">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="text-left px-4 py-3 font-semibold text-gray-dark border-b">Metric</th>
                                                                    <th className="text-center px-4 py-3 font-semibold text-gray-dark border-b">Value</th>
                                                                    <th className="text-center px-4 py-3 font-semibold text-gray-dark border-b">Industry Avg</th>
                                                                    <th className="text-center px-4 py-3 font-semibold text-gray-dark border-b">Rank</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {[
                                                                    { metric: 'Metric A', value: '12.5%', avg: '10.2%', rank: 'Top 15%' },
                                                                    { metric: 'Metric B', value: '$2.1B', avg: '$1.8B', rank: 'Top 20%' },
                                                                    { metric: 'Metric C', value: '8.3x', avg: '9.1x', rank: 'Below Avg' },
                                                                ].map((row, idx) => (
                                                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                        <td className="text-left px-4 py-3 text-gray-dark border-b">{row.metric}</td>
                                                                        <td className="text-center px-4 py-3 text-gray-dark border-b">{row.value}</td>
                                                                        <td className="text-center px-4 py-3 text-gray-dark border-b">{row.avg}</td>
                                                                        <td className="text-center px-4 py-3 text-gray-dark border-b">{row.rank}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            // 4 tables for other tabs
                                            <>
                                                {[1, 2, 3, 4].map((tableNum) => (
                                                    <div key={tableNum} className="border border-gray-light rounded-lg overflow-x-auto">
                                                        <h4 className="bg-gray-50 px-4 py-2 font-semibold text-gray-dark text-sm">
                                                            Table {tableNum}: {activeTab} Analysis
                                                        </h4>
                                                        <table className="w-full text-sm border-collapse">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="text-left px-4 py-3 font-semibold text-gray-dark border-b">Category</th>
                                                                    <th className="text-center px-4 py-3 font-semibold text-gray-dark border-b">2024</th>
                                                                    <th className="text-center px-4 py-3 font-semibold text-gray-dark border-b">2023</th>
                                                                    <th className="text-center px-4 py-3 font-semibold text-gray-dark border-b">Change %</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {[
                                                                    { cat: 'Item 1', val24: '$1.2B', val23: '$1.0B', change: '+20%' },
                                                                    { cat: 'Item 2', val24: '$0.8B', val23: '$0.7B', change: '+14%' },
                                                                    { cat: 'Item 3', val24: '$0.5B', val23: '$0.6B', change: '-17%' },
                                                                ].map((row, idx) => (
                                                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                        <td className="text-left px-4 py-3 text-gray-dark border-b">{row.cat}</td>
                                                                        <td className="text-center px-4 py-3 text-gray-dark border-b">{row.val24}</td>
                                                                        <td className="text-center px-4 py-3 text-gray-dark border-b">{row.val23}</td>
                                                                        <td className={`text-center px-4 py-3 border-b ${row.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                                                                            {row.change}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Fixed Export Buttons - Only show on Final Output */}
                                {activeTab === Strings.finalOutput && (
                                    <div className="fixed right-8 bottom-8 flex flex-col gap-3 z-50">
                                        <button
                                            onClick={() => {}}
                                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-lg"
                                            title="Export to CSV"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            CSV
                                        </button>
                                        <button
                                            onClick={() => {}}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors shadow-lg"
                                            title="Export to PDF"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            PDF
                                        </button>
                                    </div>
                                )}
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

            {/* Zoom Modal */}
            {isZoomModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto backdrop-blur-xs">
                    <style>{scrollbarStyles}</style>
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-[95%] h-[90vh] flex flex-col overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-light flex-shrink-0 bg-white">
                            <h2 className="text-lg font-semibold text-gray-dark">{activeTab}</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsZoomModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Minimize"
                                >
                                    <img
                                        src={getImage('minimize')}
                                        className="w-5 h-5"
                                    />
                                </button>
                                <button
                                    onClick={() => setIsZoomModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Close"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Content with Scrolling */}
                        <div className="zoom-modal-content overflow-y-auto overflow-x-auto flex-1 min-h-0 p-6">
                            <div className="space-y-6">
                                {/* Zoomed Tables - Same as overview but larger */}
                                {activeTab === Strings.pastYear ? (
                                    <div className="border border-gray-light rounded-lg overflow-x-auto">
                                        <table className="w-full text-base border-collapse">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="text-left px-6 py-4 font-semibold text-gray-dark border-b">Period</th>
                                                    <th className="text-center px-6 py-4 font-semibold text-gray-dark border-b">Revenue</th>
                                                    <th className="text-center px-6 py-4 font-semibold text-gray-dark border-b">EBIT</th>
                                                    <th className="text-center px-6 py-4 font-semibold text-gray-dark border-b">Net Income</th>
                                                    <th className="text-center px-6 py-4 font-semibold text-gray-dark border-b">EPS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    { period: 'FY 2024', revenue: '$5.2B', ebit: '$1.8B', ni: '$1.2B', eps: '$4.50' },
                                                    { period: 'FY 2023', revenue: '$4.8B', ebit: '$1.6B', ni: '$1.0B', eps: '$3.85' },
                                                    { period: 'FY 2022', revenue: '$4.2B', ebit: '$1.4B', ni: '$0.9B', eps: '$3.20' },
                                                    { period: 'FY 2021', revenue: '$3.8B', ebit: '$1.2B', ni: '$0.8B', eps: '$2.75' },
                                                ].map((row, idx) => (
                                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                        <td className="text-left px-6 py-4 text-gray-dark border-b">{row.period}</td>
                                                        <td className="text-center px-6 py-4 text-gray-dark border-b">{row.revenue}</td>
                                                        <td className="text-center px-6 py-4 text-gray-dark border-b">{row.ebit}</td>
                                                        <td className="text-center px-6 py-4 text-gray-dark border-b">{row.ni}</td>
                                                        <td className="text-center px-6 py-4 text-gray-dark border-b">{row.eps}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : activeTab === Strings.finalOutput ? (
                                    <>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((tableNum) => (
                                            <div key={tableNum} className="border border-gray-light rounded-lg overflow-x-auto">
                                                <h4 className="bg-gray-50 px-6 py-3 font-semibold text-gray-dark">
                                                    Table {tableNum}: {['Valuation Summary', 'Cash Flow Analysis', 'Growth Metrics', 'Profitability', 'Market Multiples', 'Financial Ratios', 'Industry Comparison', 'Historical Trends', 'Risk Metrics', 'Capital Structure', 'Dividend Analysis', 'ESG Metrics', 'Investment Score'][tableNum - 1]}
                                                </h4>
                                                <table className="w-full text-base border-collapse">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="text-left px-6 py-4 font-semibold text-gray-dark border-b">Metric</th>
                                                            <th className="text-center px-6 py-4 font-semibold text-gray-dark border-b">Value</th>
                                                            <th className="text-center px-6 py-4 font-semibold text-gray-dark border-b">Industry Avg</th>
                                                            <th className="text-center px-6 py-4 font-semibold text-gray-dark border-b">Rank</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {[
                                                            { metric: 'Metric A', value: '12.5%', avg: '10.2%', rank: 'Top 15%' },
                                                            { metric: 'Metric B', value: '$2.1B', avg: '$1.8B', rank: 'Top 20%' },
                                                            { metric: 'Metric C', value: '8.3x', avg: '9.1x', rank: 'Below Avg' },
                                                        ].map((row, idx) => (
                                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                <td className="text-left px-6 py-4 text-gray-dark border-b">{row.metric}</td>
                                                                <td className="text-center px-6 py-4 text-gray-dark border-b">{row.value}</td>
                                                                <td className="text-center px-6 py-4 text-gray-dark border-b">{row.avg}</td>
                                                                <td className="text-center px-6 py-4 text-gray-dark border-b">{row.rank}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {[1, 2, 3, 4].map((tableNum) => (
                                            <div key={tableNum} className="border border-gray-light rounded-lg overflow-x-auto">
                                                <h4 className="bg-gray-50 px-6 py-3 font-semibold text-gray-dark">
                                                    Table {tableNum}: {activeTab} Analysis
                                                </h4>
                                                <table className="w-full text-base border-collapse">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="text-left px-6 py-4 font-semibold text-gray-dark border-b">Category</th>
                                                            <th className="text-center px-6 py-4 font-semibold text-gray-dark border-b">2024</th>
                                                            <th className="text-center px-6 py-4 font-semibold text-gray-dark border-b">2023</th>
                                                            <th className="text-center px-6 py-4 font-semibold text-gray-dark border-b">Change %</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {[
                                                            { cat: 'Item 1', val24: '$1.2B', val23: '$1.0B', change: '+20%' },
                                                            { cat: 'Item 2', val24: '$0.8B', val23: '$0.7B', change: '+14%' },
                                                            { cat: 'Item 3', val24: '$0.5B', val23: '$0.6B', change: '-17%' },
                                                        ].map((row, idx) => (
                                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                <td className="text-left px-6 py-4 text-gray-dark border-b">{row.cat}</td>
                                                                <td className="text-center px-6 py-4 text-gray-dark border-b">{row.val24}</td>
                                                                <td className="text-center px-6 py-4 text-gray-dark border-b">{row.val23}</td>
                                                                <td className={`text-center px-6 py-4 border-b ${row.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                                                                    {row.change}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}

export default OverviewPage;
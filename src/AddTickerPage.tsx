import { useState } from "react";
import { useImages } from "./hooks/useImage";
import { useMobile } from "./hooks/useMediaQuery";
import Strings from "./utils/strings";
import Flag from "react-world-flags";
import type { FilterModel } from "./data_models/FilterDataModel";
import SearchModal from "./models/SearchModel";
import { useStocksStorage } from "./hooks/useStockStorgae";
import FilterModal from "./models/FilterModel";

interface Stock {
    id: string | null;
    name: string | null;
    ticker: string | null;
    countryName: string | null;
    filterData: FilterModel | null;
}

function AddTickerPage() {
    const isMobile = useMobile();
    const { getImage } = useImages();
    const initialStocks: Stock[] = [
        { id: null, name: null, ticker: null, countryName: null, filterData: null },
        { id: null, name: null, ticker: null, countryName: null, filterData: null },
        { id: null, name: null, ticker: null, countryName: null, filterData: null },
    ];
    const [isModelOpen, setIsModalOpen] = useState(false);
    const [isFilterModelOpen, setIsFilterModelOpen] = useState(false);
    const [selectedStockIndex, setSelectedStockIndex] = useState<number | null>(null);
    const {
        stocks,
        setStocks,
    } = useStocksStorage(initialStocks);

    const handleAddStock = (name: string, ticker: string): void => {
        setStocks(prevStocks => {
            const nullIndex = prevStocks.findIndex(stock => stock.id === null);
            if (nullIndex === -1) return prevStocks;
            
            const updatedStocks = [...prevStocks];
            updatedStocks[nullIndex] = {
                id: ticker,
                name,
                ticker,
                countryName: 'US',
                filterData: null
            };
            
            if (nullIndex >= 2) {
                updatedStocks.push({
                    id: null,
                    name: null,
                    ticker: null,
                    countryName: null,
                    filterData: null
                });
            }
            return updatedStocks;
        });
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

    const handleFilterClick = (index: number): void => {
        setSelectedStockIndex(index);
        setIsFilterModelOpen(true);
    };

    return (
        <div className={`flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex ${isMobile ? 'py-4' : 'p-6'}`}>
            <header className="flex items-center justify-between w-full h-15">
                <img
                    src={getImage('appLogo')}
                    alt="App Logo"
                    className={`${isMobile ? 'w-40 h-10' : 'w-40 h-15'}`}
                />
                <img
                    src={getImage('profileIcon')}
                    alt="Profile"
                    className={`${isMobile ? 'w-5 h-5' : 'w-7 h-7'}`}
                />
            </header>
            <main className="flex flex-1 items-center justify-center">
                <div className={`w-full max-w-3xl ${isMobile ? 'px-5' : ''}`}>
                    <div className="text-center mb-8 md:mb-12">
                        {isMobile ? (
                            <p className="text-sm md:text-base text-gray-light font-normal">
                                Track multiple stock tickers, compare real-time metrics, and generate in-depth financial reports with ease.
                            </p>
                        ) : (
                            <>
                                <p className="text-sm md:text-base text-gray-light font-normal">
                                    Track multiple stock tickers, compare real-time metrics,
                                </p>
                                <p className="text-sm md:text-base text-gray-light font-normal">
                                    and generate in-depth financial reports with ease.
                                </p>
                            </>
                        )}

                    </div>
                    <div className="flex gap-2 md:gap-3 mb-8 md:mb-10 p-1 rounded-xl w-full border border-gray-light">
                        <div
                            className="flex bg-primary rounded-lg items-center justify-center py-2 w-[49%] space-x-2 mr-[2%] cursor-pointer"
                            onClick={() => { }}
                        >
                            <img
                                src={getImage('addWhite' as any)}
                                className="w-2 h-2"
                            />
                            <span className="text-sm font-normal">{Strings.manual}</span>
                        </div>
                        <div
                            className="flex bg-primary-light rounded-lg items-center justify-center py-2 w-[49%] space-x-2 cursor-pointer"
                            onClick={() => { }}
                        >
                            <img
                                src={getImage('upload' as any)}
                                className="w-2 h-2"
                            />
                            <span className="text-sm font-normal text-gray-dark">{Strings.csvUpload}</span>
                        </div>
                    </div>
                    {/* Stock Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
                        {stocks.map((stock, index) => (
                            <div
                                key={index}
                                className={`border-2 ${stock.id === null ? 'border-dashed border-primary hover:shadow-lg cursor-pointer' : 'border-primary bg-white'} rounded-xl p-2 md:p-4 transition-shadow duration-200 min-h-[120px] flex items-center justify-center`}
                                onClick={() => {
                                    if (stock.id === null) {
                                        setIsModalOpen(true);
                                    }
                                }}
                            >
                                {stock.ticker === null ? (
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <img
                                            src={getImage('blackAdd')}
                                            className="w-2 h-2"
                                        />
                                        <span className="text-bg-secondary font-semibold">{Strings.addStock}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col justify-between w-full h-full">
                                        <div className="flex justify-between items-start">
                                            <Flag code={stock.countryName!} className="w-5 h-5" />
                                            <img
                                                src={getImage('filterBlue')}
                                                className="w-3 h-3 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleFilterClick(index);
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-xl text-primary font-normal">{stock.name}</span>
                                            <span className="text-2xl text-primary font-semibold">{stock.ticker}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={() => { }}
                            className="w-50 h-10 bg-primary hover:bg-primary text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                        >
                            {Strings.startAnalyzing}
                        </button>
                    </div>
                    <SearchModal
                        isOpen={isModelOpen}
                        onClose={() => { setIsModalOpen(false); }}
                        onSubmit={handleAddStock}
                    />

                    <FilterModal
                        isOpen={true}
                        onClose={() => {
                            setIsFilterModelOpen(false);
                            setSelectedStockIndex(null);
                        }}
                        onSubmit={handleFilterSubmit}
                        initialData={selectedStockIndex !== null ? stocks[selectedStockIndex].filterData : null}
                        stockName={selectedStockIndex !== null ? stocks[selectedStockIndex].name || 'Stock' : 'Stock'}
                    />
                </div>
            </main>
        </div>
    );
}

export default AddTickerPage;
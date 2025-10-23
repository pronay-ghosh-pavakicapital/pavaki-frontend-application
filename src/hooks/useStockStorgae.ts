import { useState, useEffect, useCallback } from "react";
import type { FilterModel } from "../data_models/FilterDataModel";

interface Stock {
    id: string | null;
    name: string | null;
    ticker: string | null;
    countryName: string | null;
    filterData: FilterModel | null;
}

const STORAGE_KEY = "stock_tickers_data";

/**
 * Custom hook for managing stocks with localStorage persistence
 * @param initialStocks - Default stocks if localStorage is empty
 * @returns Object with stocks state and properly typed setter function
 */
export const useStocksStorage = (initialStocks: Stock[]) => {
    const [stocks, setStocksState] = useState<Stock[]>(initialStocks);
    const [error, setError] = useState<string | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsedStocks = JSON.parse(saved) as Stock[];
                setStocksState(parsedStocks);
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load stocks"
            );
        }
    }, []);

    // Save to localStorage whenever stocks change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
    }, [stocks]);

    // Properly typed setter that works with both patterns:
    // 1. Direct value: setStocks([...])
    // 2. Callback pattern: setStocks(prevStocks => [...])
    const setStocks = useCallback(
        (value: Stock[] | ((prev: Stock[]) => Stock[])): void => {
            setStocksState(prevStocks => {
                const newStocks = typeof value === "function" 
                    ? (value as (prev: Stock[]) => Stock[])(prevStocks)
                    : value;
                return newStocks;
            });
        },
        []
    );

    const clearStocks = useCallback((): void => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            setStocksState(initialStocks);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to clear stocks"
            );
        }
    }, [initialStocks]);

    return {
        stocks,
        setStocks,  // ✅ Now properly typed for both patterns
        error,
        clearStocks,
    };
};

/**
 * Custom hook for managing a single stock's filter data
 * @returns Object with filter data and update function
 */
export const useStockFilter = () => {
    const [filterData, setFilterData] = useState<FilterModel | null>(null);

    const updateFilter = useCallback((newData: FilterModel): void => {
        setFilterData(newData);
    }, []);

    const clearFilter = useCallback((): void => {
        setFilterData(null);
    }, []);

    return {
        filterData,
        updateFilter,
        clearFilter,
    };
};

export type { Stock };
import { useState, useEffect } from "react";
import { getData } from "country-list";
import type { FilterModel } from "../data_models/FilterDataModel";
import Strings from "../utils/strings";
import { useMobile } from "../hooks/useMediaQuery";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (filterData: FilterModel) => void;
    initialData: FilterModel | null;
}

const FilterModal: React.FC<FilterModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}) => {
    const countries = getData();
    const [currencyDisplay, setCurrencyDisplay] = useState<{
        [key: string]: string;
    }>({});
    const [percentDisplay, setPercentDisplay] = useState<{
        [key: string]: string;
    }>({});
    const countryOptions = countries
        .map((country) => ({
            code: country.code,
            name: country.name,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    const industries = [
        "Software (System & Application)",
        "Advertising",
        "Aerospace/Defense",
        "Air Transport",
        "Apparel",
        "Auto & Truck",
        "Auto Parts",
        "Bank (Money Center)",
        "Banks (Regional)",
        "Beverage (Alcoholic)",
        "Beverage (Soft)",
        "Broadcasting",
        "Brokerage & Investment Banking",
        "Building Materials",
        "Business & Consumer Services",
        "Cable TV",
        "Chemical (Basic)",
        "Chemical (Diversified)",
        "Chemical (Specialty)",
        "Coal & Related Energy",
        "Computer Services",
        "Computers/Peripherals",
        "Construction Supplies",
        "Diversified",
        "Drugs (Biotechnology)",
        "Drugs (Pharmaceutical)",
        "Education",
        "Electrical Equipment",
        "Electronics (Consumer & Office)",
        "Electronics (General)",
        "Engineering/Construction",
        "Entertainment",
        "Environmental & Waste Services",
        "Farming/Agriculture",
        "Financial Svcs. (Non-bank & Insurance)",
        "Food Processing",
        "Food Wholesalers",
        "Furn/Home Furnishings",
        "Green & Renewable Energy",
        "Healthcare Products",
        "Healthcare Support Services",
        "Heathcare Information and Technology",
        "Homebuilding",
        "Hospitals/Healthcare Facilities",
        "Hotel/Gaming",
        "Household Products",
        "Information Services",
        "Insurance (General)",
        "Insurance (Life)",
        "Insurance (Prop/Cas.)",
        "Investments & Asset Management",
        "Machinery",
        "Metals & Mining",
        "Office Equipment & Services",
        "Oil/Gas (Integrated)",
        "Oil/Gas (Production and Exploration)",
        "Oil/Gas Distribution",
        "Oilfield Svcs/Equip.",
        "Packaging & Container",
        "Paper/Forest Products",
        "Power",
        "Precious Metals",
        "Publishing & Newspapers",
        "R.E.I.T.",
        "Real Estate (Development)",
        "Real Estate (General/Diversified)",
        "Real Estate (Operations & Services)",
        "Recreation",
        "Reinsurance",
        "Restaurant/Dining",
        "Retail (Automotive)",
        "Retail (Building Supply)",
        "Retail (Distributors)",
        "Retail (General)",
        "Retail (Grocery and Food)",
        "Retail (Online)",
        "Retail (Special Lines)",
        "Rubber& Tires",
        "Semiconductor",
        "Semiconductor Equip",
        "Shipbuilding & Marine",
        "Shoe",
        "Software (Entertainment)",
        "Software (Internet)",
        "Steel",
        "Telecom (Wireless)",
        "Telecom. Equipment",
        "Telecom. Services",
        "Tobacco",
        "Transportation",
        "Transportation (Railroads)",
        "Trucking",
        "Utility (General)",
        "Utility (Water)",
    ];

    const [formData, setFormData] = useState<FilterModel>(
        initialData || {
            countryOfIncorpation: "US",
            industryUS: "",
            industryGlobal: "",
            rdExpanses: true,
            operatingLease: true,
            nonOperatingAssets: 12345,
            taxValue: 8.67,
            compoundRevenue: - 3.91,
            convergence: 3.00,
            employeeOutstanding: true,
            optionsOutstanding: 0,
            strikePrice: 0.00,
            maturityPrice: 0.00,
            standardDeviation: 44.54,
            costOfCaptialAssumption: true,
            costOfCaptialAfterTen: 8.00,
            failureAssumption: true,
            probabilityFailure: 12.00,
            failureTie: "V",
            fairValue: 50.00,
            taxRateAssumption: true,
            nolAssumption: false,
            nolCarringValue: 250,
            growthRateAssumption: true,
            growthRatePerpetutity: 1.00,
            trappedCashAssumption: true,
            trappedCashValue: 140000.00,
            taxRateTrappedValue: 250.00,
            comments: "",
        }
    );
    const isMobile = useMobile();

    // Reset form when initialData changes (when user switches between stocks)
    useEffect(() => {
        const defaultFormData = {
            countryOfIncorpation: "US",
            industryUS: "",
            industryGlobal: "",
            rdExpanses: true,
            operatingLease: true,
            nonOperatingAssets: 12345,
            taxValue: 8.67,
            compoundRevenue: -3.91,
            convergence: 3.00,
            employeeOutstanding: true,
            optionsOutstanding: 0,
            strikePrice: 0.00,
            maturityPrice: 0.00,
            standardDeviation: 44.54,
            costOfCaptialAssumption: true,
            costOfCaptialAfterTen: 8.00,
            failureAssumption: true,
            probabilityFailure: 12.00,
            failureTie: "V",
            fairValue: 50.00,
            taxRateAssumption: true,
            nolAssumption: false,
            nolCarringValue: 250,
            growthRateAssumption: true,
            growthRatePerpetutity: 1.00,
            trappedCashAssumption: true,
            trappedCashValue: 140000.00,
            taxRateTrappedValue: 250.00,
            comments: "",
        };

        setFormData(initialData || defaultFormData);
        setCurrencyDisplay({});
        setPercentDisplay({});
    }, [initialData]);

    const handleChange = (field: keyof FilterModel, value: any): void => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (): void => {
        onSubmit(formData);
        onClose();
    };

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    const handleCurrencyChange = (field: keyof FilterModel, displayText: string): void => {
        // Only allow digits and decimal point
        const sanitized = displayText.replace(/[^\d.]/g, '');
        const numericValue = parseFloat(sanitized) || 0;

        handleChange(field, numericValue);
        setCurrencyDisplay(prev => ({
            ...prev,
            [field]: sanitized
        }));
    };

    const handleCurrencyBlur = (field: keyof FilterModel): void => {
        const numericValue = formData[field] as number;
        setCurrencyDisplay(prev => ({
            ...prev,
            [field]: formatCurrency(numericValue)
        }));
    };

    const handleCurrencyFocus = (field: keyof FilterModel): void => {
        const numericValue = formData[field] as number;
        setCurrencyDisplay(prev => ({
            ...prev,
            [field]: numericValue.toString()
        }));
    };

    const formatPercent = (value: number): string => {
        return `${value.toFixed(2)}%`;
    };

    const handlePercentChange = (field: keyof FilterModel, displayText: string): void => {
        // Only allow digits, decimal point, and minus sign
        const sanitized = displayText.replace(/[^\d.-]/g, '');
        const numericValue = parseFloat(sanitized) || 0;

        handleChange(field, numericValue);
        setPercentDisplay(prev => ({
            ...prev,
            [field]: sanitized
        }));
    };

    const handlePercentBlur = (field: keyof FilterModel): void => {
        const numericValue = formData[field] as number;
        setPercentDisplay(prev => ({
            ...prev,
            [field]: formatPercent(numericValue)
        }));
    };

    const handlePercentFocus = (field: keyof FilterModel): void => {
        const numericValue = formData[field] as number;
        setPercentDisplay(prev => ({
            ...prev,
            [field]: numericValue.toString()
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
            <div
                className={`absolute inset-0 backdrop-blur-xs`}
                onClick={onClose}
            />
            <div className={`relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] ${isMobile ? 'mx-4 max-h-[90vh]' : 'mx-4'} overflow-y-auto`}>
                {/* Header */}
                <div className="sticky top-0 bg-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-dark">{Strings.filter}</h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Country Section */}
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-normal text-gray-dark">
                            Country of incorporation
                        </label>
                        <select
                            value={formData.countryOfIncorpation}
                            onChange={(e) =>
                                handleChange("countryOfIncorpation", e.target.value)
                            }
                            className="w-40 px-4 py-2 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark text-sm font-normal appearance-none cursor-pointer"
                            style={{
                                backgroundImage: `url('/assets/down_blue.svg')`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 1rem center',
                                backgroundSize: '0.8em 0.8em',
                                paddingRight: '2rem'
                            }}
                        >
                            {countryOptions.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-normal text-gray-dark">
                            Industry (US)
                        </label>
                        <select
                            value={formData.industryUS}
                            onChange={(e) =>
                                handleChange("industryUS", e.target.value)
                            }
                            className="w-40 px-4 py-2 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark text-sm font-normal appearance-none cursor-pointer"
                            style={{
                                backgroundImage: `url('/assets/down_blue.svg')`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 1rem center',
                                backgroundSize: '0.8em 0.8em',
                                paddingRight: '2rem'
                            }}
                        >
                            {industries.map((industry) => (
                                <option key={industry} value={industry}>
                                    {industry}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-normal text-gray-dark">
                            Industry (Global)
                        </label>
                        <select
                            value={formData.industryGlobal}
                            onChange={(e) =>
                                handleChange("industryGlobal", e.target.value)
                            }
                            className="w-40 px-4 py-2 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark text-sm font-normal appearance-none cursor-pointer"
                            style={{
                                backgroundImage: `url('/assets/down_blue.svg')`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 1rem center',
                                backgroundSize: '0.8em 0.8em',
                                paddingRight: '2rem'
                            }}
                        >
                            {industries.map((industry) => (
                                <option key={industry} value={industry}>
                                    {industry}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-normal text-gray-dark">
                            Do you have R&D expenses to capitalize?
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    handleChange("rdExpanses", true)
                                }
                                className={`px-6 py-1 rounded-full font-normal transition-colors ${formData.rdExpanses
                                    ? "bg-primary text-white"
                                    : "bg-primary-blue-lightest text-primary"
                                    }`}
                            >
                                {Strings.yes}
                            </button>
                            <button
                                onClick={() =>
                                    handleChange("rdExpanses", false)
                                }
                                className={`px-6 py-1 rounded-full font-normal transition-colors ${!formData.rdExpanses
                                    ? "bg-primary text-white"
                                    : "bg-primary-blue-lightest text-primary"
                                    }`}
                            >
                                {Strings.no}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-normal text-gray-dark">
                            Do you have operating lease commitments?
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    handleChange("operatingLease", true)
                                }
                                className={`px-6 py-1 rounded-full font-normal transition-colors ${formData.operatingLease
                                    ? "bg-primary text-white"
                                    : "bg-primary-blue-lightest text-primary"
                                    }`}
                            >
                                {Strings.yes}
                            </button>
                            <button
                                onClick={() =>
                                    handleChange("operatingLease", false)
                                }
                                className={`px-6 py-1 rounded-full font-normal transition-colors ${!formData.operatingLease
                                    ? "bg-primary text-white"
                                    : "bg-primary-blue-lightest text-primary"
                                    }`}
                            >
                                {Strings.no}
                            </button>
                        </div>
                    </div>

                    {/* Non-Operating Assets */}
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-normal text-gray-dark">
                            Cross holdings and other non-operating assets
                        </label>
                        <input
                            type="text"
                            value={currencyDisplay.nonOperatingAssets || formatCurrency(formData.nonOperatingAssets)}
                            onChange={(e) => handleCurrencyChange("nonOperatingAssets", e.target.value)}
                            onBlur={() => handleCurrencyBlur("nonOperatingAssets")}
                            onFocus={() => handleCurrencyFocus("nonOperatingAssets")}
                            className="w-40 px-4 py-2 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark"
                            placeholder="$0.00"
                        />
                    </div>

                    {/* The Value Drivers Below */}
                    <div className="pt-4">
                        <h3 className="font-semibold text-gray-dark mb-4">The value drivers below:</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-normal text-gray-dark">
                                    Compounded annual revenue growth rate over next 5 years
                                </label>
                                <input
                                    type="text"
                                    value={percentDisplay.compoundRevenue || formatPercent(formData.compoundRevenue)}
                                    onChange={(e) => handlePercentChange("compoundRevenue", e.target.value)}
                                    onBlur={() => handlePercentBlur("compoundRevenue")}
                                    onFocus={() => handlePercentFocus("compoundRevenue")}
                                    className="w-40 px-4 py-2 border border-gray-300 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-normal text-gray-dark">
                                    Target pre-tax operating margin (EBIT as % of sales in year 10)
                                </label>
                                <input
                                    type="text"
                                    value={percentDisplay.taxValue || formatPercent(formData.taxValue)}
                                    onChange={(e) => handlePercentChange("taxValue", e.target.value)}
                                    onBlur={() => handlePercentBlur("taxValue")}
                                    onFocus={() => handlePercentFocus("taxValue")}
                                    className="w-40 px-4 py-2 border border-gray-300 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-normal text-gray-dark">
                                    Year of convergence
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.convergence}
                                    onChange={(e) =>
                                        handleChange("convergence", parseFloat(e.target.value) || 0)
                                    }
                                    className="w-40 px-4 py-2 border border-gray-300 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Other Inputs */}
                    <div className="pt-4">
                        <h3 className="font-bold text-gray-dark mb-4">Other inputs</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-normal text-gray-dark">
                                    Do you have employee options outstanding?
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleChange("employeeOutstanding", true)
                                        }
                                        className={`px-6 py-1 rounded-full font-normal transition-colors ${formData.employeeOutstanding
                                            ? "bg-primary text-white"
                                            : "bg-primary-blue-lightest text-primary"
                                            }`}
                                    >
                                        {Strings.yes}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleChange("employeeOutstanding", false)
                                        }
                                        className={`px-6 py-1 rounded-full font-normal transition-colors ${!formData.employeeOutstanding
                                            ? "bg-primary text-white"
                                            : "bg-primary-blue-lightest text-primary"
                                            }`}
                                    >
                                        {Strings.no}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-normal text-gray-dark">
                                    Number of options outstanding (in millions)
                                </label>
                                <input
                                    type="text"
                                    value={currencyDisplay.optionsOutstanding || formatCurrency(formData.optionsOutstanding)}
                                    onChange={(e) => handleCurrencyChange("optionsOutstanding", e.target.value)}
                                    onBlur={() => handleCurrencyBlur("optionsOutstanding")}
                                    onFocus={() => handleCurrencyFocus("optionsOutstanding")}
                                    className="w-40 px-4 py-2 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-normal text-gray-dark">
                                    Average strike price
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.strikePrice}
                                    onChange={(e) =>
                                        handleChange(
                                            "strikePrice",
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    className="w-40 px-4 py-2 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-normal text-gray-dark">
                                    Average maturity
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.maturityPrice}
                                    onChange={(e) =>
                                        handleChange(
                                            "maturityPrice",
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    className="w-40 px-4 py-2 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-normal text-gray-dark">
                                    Standard deviation on stock price
                                </label>
                                <input
                                    type="text"
                                    value={percentDisplay.standardDeviation || formatPercent(formData.standardDeviation)}
                                    onChange={(e) => handlePercentChange("standardDeviation", e.target.value)}
                                    onBlur={() => handlePercentBlur("standardDeviation")}
                                    onFocus={() => handlePercentFocus("standardDeviation")}
                                    className="w-40 px-4 py-2 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Default Assumptions */}
                    <div className="pt-4">
                        <h3 className="font-bold text-gray-dark mb-4">Default assumptions</h3>
                        <p className="text-sm font-semibold text-gray-dark mb-4">In stable growth, I will assume that your firm will have a cost of capital simialr to that of typical mature companies (riskfree rate + 4.5%)</p>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-normal text-gray-dark">
                                    Do you want to override cost of capital assumption?
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleChange("costOfCaptialAssumption", true)
                                        }
                                        className={`px-6 py-1 rounded-full font-normal transition-colors ${formData.costOfCaptialAssumption
                                            ? "bg-primary text-white"
                                            : "bg-primary-blue-lightest text-primary"
                                            }`}
                                    >
                                        {Strings.yes}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleChange("costOfCaptialAssumption", false)
                                        }
                                        className={`px-6 py-1 rounded-full font-normal transition-colors ${!formData.costOfCaptialAssumption
                                            ? "bg-primary text-white"
                                            : "bg-primary-blue-lightest text-primary"
                                            }`}
                                    >
                                        {Strings.no}
                                    </button>
                                </div>
                            </div>

                            {formData.costOfCaptialAssumption && (
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-normal text-gray-dark mb-2">
                                        If yes, Enter the Cost of capital after year 10
                                    </label>
                                    <input
                                        type="text"
                                        value={percentDisplay.costOfCaptialAfterTen || formatPercent(formData.costOfCaptialAfterTen)}
                                        onChange={(e) => handlePercentChange("costOfCaptialAfterTen", e.target.value)}
                                        onBlur={() => handlePercentBlur("costOfCaptialAfterTen")}
                                        onFocus={() => handlePercentFocus("costOfCaptialAfterTen")}
                                        className="w-40 px-4 py-2 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark"
                                        placeholder="0.00"
                                    />
                                </div>
                            )}

                            <p className="text-sm font-semibold text-gray-dark">I will assume that your firm will ear a return on capital equal to its cost of capital after year 10. I am assuming that whatever competitive advantages you have today will fade over time.</p>

                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-normal text-gray-dark">
                                    Do you want to override this assumption?
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleChange("failureAssumption", true)
                                        }
                                        className={`px-6 py-1 rounded-full font-normal transition-colors ${formData.failureAssumption
                                            ? "bg-primary text-white"
                                            : "bg-primary-blue-lightest text-primary"
                                            }`}
                                    >
                                        {Strings.yes}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleChange("failureAssumption", false)
                                        }
                                        className={`px-6 py-1 rounded-full font-normal transition-colors ${!formData.failureAssumption
                                            ? "bg-primary text-white"
                                            : "bg-primary-blue-lightest text-primary"
                                            }`}
                                    >
                                        {Strings.no}
                                    </button>
                                </div>
                            </div>

                            {formData.failureAssumption && (
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-normal text-gray-dark">
                                        If yes, Enter the probability of failure
                                    </label>
                                    <input
                                        type="text"
                                        value={percentDisplay.probabilityFailure || formatPercent(formData.probabilityFailure)}
                                        onChange={(e) => handlePercentChange("probabilityFailure", e.target.value)}
                                        onBlur={() => handlePercentBlur("probabilityFailure")}
                                        onFocus={() => handlePercentFocus("probabilityFailure")}
                                        className="w-40 px-4 py-2 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark"
                                        placeholder="0.00"
                                    />
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-normal text-gray-dark">
                                    What do you want to tie your proceeds in failure to?
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleChange("failureTie", true)
                                        }
                                        className={`px-6 py-1 rounded-full font-normal transition-colors ${formData.failureTie
                                            ? "bg-primary text-white"
                                            : "bg-primary-blue-lightest text-primary"
                                            }`}
                                    >
                                        V
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleChange("failureTie", false)
                                        }
                                        className={`px-6 py-1 rounded-full font-normal transition-colors ${!formData.failureTie
                                            ? "bg-primary text-white"
                                            : "bg-primary-blue-lightest text-primary"
                                            }`}
                                    >
                                        B
                                    </button>
                                </div>

                            </div>
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-gray-dark mb-2">
                                    Enter the Distress proceeds as percentage of book or fair value
                                </label>
                                <input
                                    type="text"
                                    value={percentDisplay.fairValue || formatPercent(formData.fairValue)}
                                    onChange={(e) => handlePercentChange("fairValue", e.target.value)}
                                    onBlur={() => handlePercentBlur("fairValue")}
                                    onFocus={() => handlePercentFocus("fairValue")}
                                    className="w-40 px-4 py-2 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark"
                                    placeholder="0.00"
                                />
                            </div>

                            <p className="text-sm font-semibold text-gray-dark">I will assume that your effective rate will adjust to your marginal tax rate by your terminal year. If you override this assumptio, I will leave the tax rate at your effective tax rate.</p>

                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-normal text-gray-dark">
                                    Do you want to override this assumption?
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleChange("taxRateAssumption", true)
                                        }
                                        className={`px-6 py-1 rounded-full font-normal transition-colors ${formData.taxRateAssumption
                                            ? "bg-primary text-white"
                                            : "bg-primary-blue-lightest text-primary"
                                            }`}
                                    >
                                        {Strings.yes}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleChange("taxRateAssumption", false)
                                        }
                                        className={`px-6 py-1 rounded-full font-normal transition-colors ${!formData.taxRateAssumption
                                            ? "bg-primary text-white"
                                            : "bg-primary-blue-lightest text-primary"
                                            }`}
                                    >
                                        {Strings.no}
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm font-semibold text-gray-dark">I will assume that you have no losses carried forward from prior years (NOL) coming into the valuation. If you have a money losing company, you may want to override this.</p>

                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-normal text-gray-dark mb-2">
                                    Do you want to override this assumption
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleChange("nolAssumption", true)
                                        }
                                        className={`px-6 py-1 rounded-full font-normal transition-colors ${formData.nolAssumption
                                            ? "bg-primary text-white"
                                            : "bg-primary-blue-lightest text-primary"
                                            }`}
                                    >
                                        {Strings.yes}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleChange("nolAssumption", false)
                                        }
                                        className={`px-6 py-1 rounded-full font-normal transition-colors ${!formData.nolAssumption
                                            ? "bg-primary text-white"
                                            : "bg-primary-blue-lightest text-primary"
                                            }`}
                                    >
                                        {Strings.no}
                                    </button>
                                </div>
                            </div>


                            {formData.nolAssumption && (
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-normal text-gray-dark">
                                        If yes, Enter the NOL that you are carrying over into year 1
                                    </label>
                                    <input
                                        type="text"
                                        value={currencyDisplay.nolCarringValue || formatCurrency(formData.nolCarringValue)}
                                        onChange={(e) => handleCurrencyChange("nolCarringValue", e.target.value)}
                                        onBlur={() => handleCurrencyBlur("nolCarringValue")}
                                        onFocus={() => handleCurrencyFocus("nolCarringValue")}
                                        className="w-40 px-4 py-2 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark"
                                        placeholder="0.00"
                                    />
                                </div>
                            )}

                            <p className="text-sm font-semibold text-gray-dark">I will assume that the growth rate in perpetuity will be equal to the risk free rate. This allows for both valuation consistency and prevents 'impoosible' growth rates.</p>

                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-normal text-gray-dark">
                                    Do you want to override this assumption?
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleChange("growthRateAssumption", true)
                                        }
                                        className={`px-6 py-1 rounded-full font-normal transition-colors ${formData.growthRateAssumption
                                            ? "bg-primary text-white"
                                            : "bg-primary-blue-lightest text-primary"
                                            }`}
                                    >
                                        {Strings.yes}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleChange("growthRateAssumption", false)
                                        }
                                        className={`px-6 py-1 rounded-full font-normal transition-colors ${!formData.growthRateAssumption
                                            ? "bg-primary text-white"
                                            : "bg-primary-blue-lightest text-primary"
                                            }`}
                                    >
                                        {Strings.no}
                                    </button>
                                </div>
                            </div>

                            {formData.growthRateAssumption && (
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-dark mb-2">
                                        If yes, Enter the Growth rate in perpetuity
                                    </label>
                                    <input
                                        type="text"
                                        value={percentDisplay.growthRatePerpetutity || formatPercent(formData.growthRatePerpetutity)}
                                        onChange={(e) => handlePercentChange("growthRatePerpetutity", e.target.value)}
                                        onBlur={() => handlePercentBlur("growthRatePerpetutity")}
                                        onFocus={() => handlePercentFocus("growthRatePerpetutity")}
                                        className="w-40 px-4 py-2 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark"
                                        placeholder="0.00"
                                    />
                                </div>
                            )}

                            <p className="text-sm font-semibold text-gray-dark">I have assumed that none of the cash is trapped (in foreign countries) and that there is no additinal tax liability coming due to and that cash is a neutral asset.</p>

                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-normal text-gray-dark">
                                    Do you want to override this assumption?
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleChange("trappedCashAssumption", true)
                                        }
                                        className={`px-6 py-1 rounded-full font-normal transition-colors ${formData.trappedCashAssumption
                                            ? "bg-primary text-white"
                                            : "bg-primary-blue-lightest text-primary"
                                            }`}
                                    >
                                        {Strings.yes}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleChange("trappedCashAssumption", false)
                                        }
                                        className={`px-6 py-1 rounded-full font-normal transition-colors ${!formData.trappedCashAssumption
                                            ? "bg-primary text-white"
                                            : "bg-primary-blue-lightest text-primary"
                                            }`}
                                    >
                                        {Strings.no}
                                    </button>
                                </div>
                            </div>

                            {formData.trappedCashAssumption && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-normal text-gray-dark">
                                            If yes, Enter the trapped cash (in taxes) or entire balance (if mistrust)
                                        </label>
                                        <input
                                            type="text"
                                            value={currencyDisplay.trappedCashValue || formatCurrency(formData.trappedCashValue)}
                                            onChange={(e) => handleCurrencyChange("trappedCashValue", e.target.value)}
                                            onBlur={() => handleCurrencyBlur("trappedCashValue")}
                                            onFocus={() => handleCurrencyFocus("trappedCashValue")}
                                            className="w-40 px-4 py-2 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-normal text-gray-dark">
                                            & Average tax rate of foreign markets where cash is trapped
                                        </label>
                                        <input
                                            type="text"
                                            value={percentDisplay.taxRateTrappedValue || formatPercent(formData.taxRateTrappedValue)}
                                            onChange={(e) => handlePercentChange("taxRateTrappedValue", e.target.value)}
                                            onBlur={() => handlePercentBlur("taxRateTrappedValue")}
                                            onFocus={() => handlePercentFocus("taxRateTrappedValue")}
                                            className="w-40 px-4 py-2 rounded-full focus:outline-none bg-primary-blue-lightest text-gray-dark"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-normal text-gray-dark">
                            Comments
                        </label>
                        <textarea
                            value={formData.comments}
                            onChange={(e) =>
                                handleChange("comments", e.target.value)
                            }
                            rows={isMobile ? 8 : 4}
                            className={`${isMobile ? 'w-50' : 'w-120'} px-4 py-2 rounded-lg focus:outline-none bg-primary-blue-lightest text-gray-dark placeholder:text-gray-light text-sm`}
                            placeholder="Add any additional comments..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white p-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-full font-medium text-gray-700 bg-primary-blue-lightest text-primary transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-primary text-white rounded-full font-medium transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
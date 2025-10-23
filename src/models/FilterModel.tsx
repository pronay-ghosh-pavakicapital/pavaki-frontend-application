import { useState } from "react";
import { getData } from "country-list";
import type { FilterModel } from "../data_models/FilterDataModel";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (filterData: FilterModel) => void;
    initialData: FilterModel | null;
    stockName: string;
}

const FilterModal: React.FC<FilterModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    stockName,
}) => {
    const countries = getData();
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
            rdExpanses: false,
            operatingLease: false,
            nonOperatingAssets: 0,
            taxValue: 0,
            compoundRevenue: 0,
            convergence: 0,
            employeeOutstanding: false,
            optionsOutstanding: 0,
            strikePrice: 0,
            maturityPrice: 0,
            standardDeviation: 0,
            costOfCaptialAssumption: false,
            costOfCaptialAfterTen: 0,
            failureAssumption: false,
            probabilityFailure: 0,
            failureTie: "V",
            fairValue: 0,
            taxRateAssumption: false,
            nolAssumption: false,
            nolCarringValue: 0,
            growthRateAssumption: false,
            growthRatePerpetutity: 0,
            trappedCashAssumption: false,
            trappedCashValue: 0,
            taxRateTrappedValue: 0,
            comments: "",
        }
    );

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Filter</h2>
                        <p className="text-sm text-gray-600 mt-1">{stockName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Country Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Country of incorporation
                        </label>
                        <select
                            value={formData.countryOfIncorpation}
                            onChange={(e) =>
                                handleChange("countryOfIncorpation", e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                        >
                            {countryOptions.map((country) => (
                                <option key={country.code} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Industry Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Industry (US)
                            </label>
                            <select
                                value={formData.industryUS}
                                onChange={(e) =>
                                    handleChange("industryUS", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                            >
                                <option value="">Select Industry</option>
                                {industries.map((industry) => (
                                    <option key={industry} value={industry}>
                                        {industry}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Industry (Global)
                            </label>
                            <select
                                value={formData.industryGlobal}
                                onChange={(e) =>
                                    handleChange("industryGlobal", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                            >
                                <option value="">Select Industry</option>
                                {industries.map((industry) => (
                                    <option key={industry} value={industry}>
                                        {industry}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* R&D and Operating Lease */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Do you have R&D expenses to capitalize?
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        handleChange("rdExpanses", true)
                                    }
                                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                        formData.rdExpanses
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() =>
                                        handleChange("rdExpanses", false)
                                    }
                                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                        !formData.rdExpanses
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Do you have operating lease commitments?
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        handleChange("operatingLease", true)
                                    }
                                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                        formData.operatingLease
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() =>
                                        handleChange("operatingLease", false)
                                    }
                                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                        !formData.operatingLease
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Non-Operating Assets */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Cross holdings and other non-operating assets
                        </label>
                        <input
                            type="number"
                            value={formData.nonOperatingAssets}
                            onChange={(e) =>
                                handleChange(
                                    "nonOperatingAssets",
                                    parseFloat(e.target.value) || 0
                                )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                            placeholder="0.00"
                        />
                    </div>

                    {/* The Value Drivers Below */}
                    <div className="pt-4 border-t border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4">The value drivers below:</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Compounded annual revenue growth rate over next 5 years
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.compoundRevenue}
                                    onChange={(e) =>
                                        handleChange(
                                            "compoundRevenue",
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Target pre-tax operating margin (EBIT as % of sales in year 10)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.taxValue}
                                    onChange={(e) =>
                                        handleChange(
                                            "taxValue",
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Year of convergence
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.convergence}
                                    onChange={(e) =>
                                        handleChange(
                                            "convergence",
                                            parseFloat(e.target.value) || 0
                                        )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Other Inputs */}
                    <div className="pt-4 border-t border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4">Other inputs</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Do you have employee options outstanding?
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleChange("employeeOutstanding", true)
                                        }
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                            formData.employeeOutstanding
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleChange("employeeOutstanding", false)
                                        }
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                            !formData.employeeOutstanding
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>

                            {formData.employeeOutstanding && (
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Number of options outstanding (in millions)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.optionsOutstanding}
                                            onChange={(e) =>
                                                handleChange(
                                                    "optionsOutstanding",
                                                    parseFloat(e.target.value) || 0
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Standard deviation on stock price
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.standardDeviation}
                                            onChange={(e) =>
                                                handleChange(
                                                    "standardDeviation",
                                                    parseFloat(e.target.value) || 0
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Default Assumptions */}
                    <div className="pt-4 border-t border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4">Default assumptions</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Do you want to override cost of capital assumption?
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleChange("costOfCaptialAssumption", true)
                                        }
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                            formData.costOfCaptialAssumption
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleChange("costOfCaptialAssumption", false)
                                        }
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                            !formData.costOfCaptialAssumption
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>

                            {formData.costOfCaptialAssumption && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Cost of capital after year 10
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.costOfCaptialAfterTen}
                                        onChange={(e) =>
                                            handleChange(
                                                "costOfCaptialAfterTen",
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                                        placeholder="0.00"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Do you want to override probability of failure assumption?
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleChange("failureAssumption", true)
                                        }
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                            formData.failureAssumption
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleChange("failureAssumption", false)
                                        }
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                            !formData.failureAssumption
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>

                            {formData.failureAssumption && (
                                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Probability of failure
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.probabilityFailure}
                                            onChange={(e) =>
                                                handleChange(
                                                    "probabilityFailure",
                                                    parseFloat(e.target.value) || 0
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Tie proceeds to V or B
                                        </label>
                                        <select
                                            value={formData.failureTie}
                                            onChange={(e) =>
                                                handleChange("failureTie", e.target.value)
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="V">Value (V)</option>
                                            <option value="B">Book (B)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Distress proceeds as percentage of book or fair value
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.fairValue}
                                            onChange={(e) =>
                                                handleChange(
                                                    "fairValue",
                                                    parseFloat(e.target.value) || 0
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Do you want to override effective tax rate assumption?
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleChange("taxRateAssumption", true)
                                        }
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                            formData.taxRateAssumption
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleChange("taxRateAssumption", false)
                                        }
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                            !formData.taxRateAssumption
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Do you want to override NOL assumption?
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleChange("nolAssumption", true)
                                        }
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                            formData.nolAssumption
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleChange("nolAssumption", false)
                                        }
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                            !formData.nolAssumption
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>

                            {formData.nolAssumption && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        NOL carrying over into year 1
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.nolCarringValue}
                                        onChange={(e) =>
                                            handleChange(
                                                "nolCarringValue",
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                                        placeholder="0.00"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Do you want to override growth rate assumption?
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleChange("growthRateAssumption", true)
                                        }
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                            formData.growthRateAssumption
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleChange("growthRateAssumption", false)
                                        }
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                            !formData.growthRateAssumption
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>

                            {formData.growthRateAssumption && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Growth rate in perpetuity
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.growthRatePerpetutity}
                                        onChange={(e) =>
                                            handleChange(
                                                "growthRatePerpetutity",
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                                        placeholder="0.00"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Do you want to override trapped cash assumption?
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleChange("trappedCashAssumption", true)
                                        }
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                            formData.trappedCashAssumption
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleChange("trappedCashAssumption", false)
                                        }
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                            !formData.trappedCashAssumption
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>

                            {formData.trappedCashAssumption && (
                                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Trapped cash value
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.trappedCashValue}
                                            onChange={(e) =>
                                                handleChange(
                                                    "trappedCashValue",
                                                    parseFloat(e.target.value) || 0
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Average tax rate of foreign markets
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.taxRateTrappedValue}
                                            onChange={(e) =>
                                                handleChange(
                                                    "taxRateTrappedValue",
                                                    parseFloat(e.target.value) || 0
                                                )
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comments */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Comments
                        </label>
                        <textarea
                            value={formData.comments}
                            onChange={(e) =>
                                handleChange("comments", e.target.value)
                            }
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                            placeholder="Add any additional comments..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Save Filter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
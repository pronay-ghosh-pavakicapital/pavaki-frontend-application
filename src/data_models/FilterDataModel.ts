export interface FilterModel {
    countryOfIncorpation: string; // Country of incorporation
    industryUS: string; // Industry (US)
    industryGlobal: string; // Industry (Global)
    rdExpanses: boolean; // Do you have R&D expenses to capitalize
    operatingLease: boolean; // Do you have operating lease commitments
    nonOperatingAssets: number; // Cross holdings and other non-operating assets
    taxValue: number; // Pre tax value
    compoundRevenue: number; // Compound revenue
    convergence:  number; // Year of convergence
    employeeOutstanding: boolean; // Do you have employee options outstanding: Yes or No
    optionsOutstanding: number; // Number of options outstanding (in millions)
    strikePrice: number; // Average strike price
    maturityPrice: number; // Average maturity
    standardDeviation: number; // Standard deviation on stock price
    costOfCaptialAssumption: boolean; // Do you want to override cost of capital assumption: Yes or no
    costOfCaptialAfterTen: number; // If yes, enter the cost of capital after year 10
    failureAssumption: boolean; // Do you want to override probability of failure assumption: Yes or no
    probabilityFailure: number; // If yes, enter the probability of failure
    failureTie: string; // What do you want to tie your proceeds in failure to:  V or B
    fairValue: number; //  Enter the distress proceeds as percentage of book or fair value
    taxRateAssumption: boolean; // Do you want to override effective tax rate assumption: Yes or no
    nolAssumption: boolean; // Do you want to override NOL assumption: Yes or no
    nolCarringValue: number; // If yes, enter the NOL that you are carrying over into year 1
    growthRateAssumption:  boolean; // Do you want to override growth rate assumption: Yes or No
    growthRatePerpetutity: number; // If yes, enter the growth rate in perpetuity
    trappedCashAssumption: boolean; // Do you want to override trapped cash assumption: Yes  or no
    trappedCashValue: number; // If yes, enter trapped cash (if taxes) or entire balance (if mistrust)
    taxRateTrappedValue: number; // & Average tax rate of the foreign markets where the cash is trapped
    comments: string; // Comments
}
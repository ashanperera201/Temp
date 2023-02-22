

export class CurrencyRateViewModel {
    id : string;
    currencyId : string;
    currencyName : string;
    currencyCode: string;
    rate : number;
    conversionFactor : number;
    isRFQ:boolean;
    isRFAQ:boolean;
    isRFI:boolean;
    validFrom:Date;
    isBaseCurrency:boolean;
    isChecked : boolean;
    rateDate: Date;
    isIMICurrency: boolean;
    isBind: boolean;
    isActive : boolean;
}

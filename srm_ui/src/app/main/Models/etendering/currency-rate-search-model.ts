// public Guid BaseCurrency { get; set; }
// public List<CurrencyRateModel> CurrencyRates { get; set; }

import { ListModel } from "./list-model";
import { CurrencyRateViewModel } from "./ViewModels/currency-rate-view-model";

export class CurrencyRateSearchModel  extends ListModel {
    baseCurrency : string;
    currencyName: string;
    currencyCode: string;
    currencyRates : CurrencyRateViewModel[];
    isChecked : boolean;
    validFrom:Date;
    rateDate:Date;
    rfxType: string;
    isIMICurrency : boolean;
    currencyModels:any;
    IsIMICurrency: boolean;
    constructor() {
        super();
        this.column = "currencyName";
    }
}

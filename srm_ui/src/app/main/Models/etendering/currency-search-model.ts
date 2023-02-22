// public Guid BaseCurrency { get; set; }
// public List<CurrencyRateModel> CurrencyRates { get; set; }

import { ListModel } from "./list-model";
import { CurrencyViewModel } from "./ViewModels/currency-view-model";

export class CurrencySearchModel  extends ListModel {
    
    currencyCode: string;
    currencyName : string;
    baseCurrency : string;
    currencyModels : CurrencyViewModel[];
    isIMICurrency:boolean;
    constructor() {
        super();
        this.column = "currencyName";
    }
}

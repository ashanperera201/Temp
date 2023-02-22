import { ListModel } from "./list-model";
import { NumberingSequenceViewModel } from "./ViewModels/numbering-sequence-view-model";

export class NumberingSequenceSearchModel  extends ListModel {
    id : string;
    rFxType : string;
  
    numberingSequenceModels : NumberingSequenceViewModel[];
    
    constructor() {
        super();
        this.column = "rFxType";
    }
}

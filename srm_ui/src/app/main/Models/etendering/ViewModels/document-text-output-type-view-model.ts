import { LogicalUnitViewModel } from "./logical-unit-view-model";
import { OutputTypeViewModel } from "./output-type-view-model";

export class DocumentTextOutputTypeViewModel {
    id : string;
    outputTypeId : string;
    xitriconViewId : string;
    
    outputType : OutputTypeViewModel;
    xitriconView: LogicalUnitViewModel;
}

import { LogicalUnitViewModel } from "./logical-unit-view-model";
import { OutputTypeViewModel } from "./output-type-view-model";

export class OutputTypeTransformationViewModel {
    id : string;
    sourceViewId : string;
    outputTypeId: string;
    destinationViewId: string;
    suppress: boolean;
    modifyAllow: boolean;

    sourceView: LogicalUnitViewModel;
    outputType: OutputTypeViewModel;
    destinationView: LogicalUnitViewModel;
}

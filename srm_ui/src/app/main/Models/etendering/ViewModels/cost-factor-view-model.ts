export class CostFactorTextViewModel {
    id: string;
    cfName: string;
    cfDescription: string;
    cfTypeName: string;
    cfType: string;
    cfTypeId: string;
    isChecked: boolean;
    costFactorGroupId: string;
    isDisabled: boolean;
    rfqId: string;
    rfqPartlineId: string;
    cfTypes: any[];
    costFactorGroupModels: any[];
    costFactorGroupMappings: any[];
    // Value to hold expected value in add new cost factor overlay when editing cost factor item details.
    expectedValue: string;
    ischeckdisabled:boolean;
}
import { ListModel } from "./list-model";
import { IFSEmployeeModel } from "./ViewModels/ifs-employee-model";

export class IFSEmployeeSearchModel  extends ListModel { 

    employeeName: string;
    employeesecName: string;
    employeepriName: string;
    employeeEmail : string;
    employeePosition : string;
    ifsEmployeeModel : IFSEmployeeModel[];
    data: any;
    collaborationTeamId : string;

    constructor() {
        super();
        this.column = "IFSEmployeeName";
    }
}
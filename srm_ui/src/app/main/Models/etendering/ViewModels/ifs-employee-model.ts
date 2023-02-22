export class IFSEmployeeModel{
    id: string;
    companyId : string;
    empNO : string;
    personId : string;
    operator : string;
    firstName : string;
    lastName : string;
    employeeName : string;
    employeeStatus : string;
    assignmentType : string;
    orgCode : string;
    abpUsers_Id : string;
    employeeEmail : string;
    employeePosition : string;

    employeeContactValues : any[];   
    isChecked:boolean;  
    isCheckedSub:boolean;
    isDisabled:boolean;

    primaryUserId: string;
    isSelectedPrimUser: boolean;

}
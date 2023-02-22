import { ListModel } from "../list-model";
import { RFQCollaborationTeamModel } from "./rfq-collaboration-team-model";

export class RFQCollaborationTeamAccessModel extends ListModel{
    id: string;
    role: string;
    pageName: string;
    isEdit: boolean;
    isView: boolean;
    isFull: boolean;
    rfqCollaborationTeamId: string;
    rfqCollaborationTeam: RFQCollaborationTeamModel;
    userName: string;
    substituteUserId: string;
    substituteUsername: string;
    userId: string;
    selectedrfxRoleList: any[];
    selectedpagesAccess: any[];
    selectedAccessLvl: any[];
    isSelectedPrimUser: boolean;
    substituteUserModel:any
}
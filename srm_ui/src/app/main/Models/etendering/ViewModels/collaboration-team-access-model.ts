import { CollaborationTeamTextViewModel } from "./collaboration-team-view-model";

export class CollaborationTeamAccessModel {
    collaborationTeamId : string;       
    role : string;
    pageName : string;
    isEdit :boolean;
    isView :boolean;
    isFull :boolean;
    id:string;

    userName: string;
    substituteUserId: string;
    userId: string;
    selectedrfxRoleList: any[];
    selectedpagesAccess: any[];
    selectedAccessLvl: any[];
    isSelectedPrimUser: boolean;

   
    //collaborationTeam:CollaborationTeamTextViewModel;
}

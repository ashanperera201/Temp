import { ListModel } from "./list-model";
import { CollaborationTeamTextViewModel } from "./ViewModels/collaboration-team-view-model";

export class CollaborationTeamSearchModel extends ListModel {
    teamName: string;
    teamDescription: string;
    isPrivate: boolean;
    token: { result: string };
    collaborationTeamTextViewModels: CollaborationTeamTextViewModel[];
    rfqId:string;
    constructor() {
        super();
        //this.column = "teamName";
        this.column = "CreationDate";
        this.direction = "Desc";
    }
}

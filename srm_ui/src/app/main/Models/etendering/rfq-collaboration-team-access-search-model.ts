import { ListModel } from "./list-model";
import { RFQCollaborationTeamAccessModel } from "./ViewModels/rfq-collaboration-team-access-model";

export class RFQCollaborationTeamAccessSearchModel extends ListModel{
    rfqid: string;  
    rfqCollaborationTeamAccessModel : RFQCollaborationTeamAccessModel[];
    constructor() {
        super();       
    }
}

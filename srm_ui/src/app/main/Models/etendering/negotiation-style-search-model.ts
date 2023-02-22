import { ListModel } from "./list-model";
import { NegotiationStyleViewModel } from "./ViewModels/negotiation-style-view-model";

export class NegotiationStyleSearchModel extends ListModel {
    title: string;
    name: string;
    isPrivate: boolean;
    negotiationStyleModels: NegotiationStyleViewModel[];

    constructor() {
        super();
        //this.column = "title";
        this.column = "creationDate";
        this.direction = "desc";
    }
}

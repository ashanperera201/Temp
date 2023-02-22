import { ListModel } from "./list-model";

export class AttributeItemSearchModel extends ListModel {
    Id: string;
    attributeName: string;
    name:string;//to be delete
    dataTypeName: string;
    category: string;
    description:string;
    constructor() {
        super();
        this.column = "attributeName";
    }
}

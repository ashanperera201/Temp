import { RFQ } from "./rfq";
import { Tenant } from "./tenant";
import { UserProfile } from "./userprofile";

export class RegisterModel{
    userProfile: UserProfile;
    rfq: RFQ;
    tenant: Tenant;
}
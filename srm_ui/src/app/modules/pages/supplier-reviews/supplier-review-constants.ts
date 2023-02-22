/* eslint-disable max-len */
export class SupplierReviewConstants {

    // grading methods
    public static gradingMethodA: string = 'Method A - Simple Average';
    public static descriptionMethodA: string = 'Every reviewer will contribute equally for the final average score';
    public static gradingMethodB: string = 'Method B - Weighted Average';
    public static descriptionMethodB: string = 'Different reviewers contribute differently to the final average score';
    public static gradingMethodC: string = 'Method C - Min Grade Threshold';
    public static descriptionMethodC: string = 'If any reviewer has given a score below the Min Grade Threshold, Supplier is not Recommended';
    public static gradingMethodD: string = 'Method D - Grade Range';
    public static descriptionMethodD: string = 'Supplier recommendation based on majority of scores falling within a considered Grade Range. If equal for 2 categories or more highest category will prevail';

    // users and user roles
    public static usersAssignMethod: string = 'users';
    public static userRolesAssignMethod: string = 'userroles';

    // time periods
    public static presetTypePeriod: string = 'preset';
    public static customTypePeriod: string = 'custom';

    // schedule frequencies
    public static monthlyScheduleFrequency: string = 'Monthly';
    public static quarterlyScheduleFrequency: string = 'Quarterly';
    public static semiAnnualScheduleFrequency: string = 'Semi Annually';
    public static annualScheduleFrequency: string = 'Annually';


    // statuses
    public static reviewPublishedState: string = 'published';
    public static reviewCreatedState: string = 'created';
    public static reviewResponseCreatedState: string = 'waiting for review';
    public static reviewResponseApprovalReadyState: string = 'ready for approval';
    public static reviewResponseApprovalWaitingState: string = 'waiting for approval';
    public static reviewOutcomeCreatedState: string = 'waiting for reviews';
    public static reviewOutcomeReviewsRecievedState: string = 'received all reviews';
    public static reviewResponseApprovedState: string = 'approved';
    public static reviewResponseRejectedState: string = 'rejected';
    public static reviewOutcomeCompletedState: string = 'completed';
    public static reviewApproverCreatedState: string = 'to be approved';
    public static reviewApproverWaitingState: string = 'waiting for approval';
    public static reviewApproverApprovedState: string = 'approved';
    public static reviewApproverRejectedState: string = 'rejected';
    public static reviewApproverReinitiatedState: string = 'reinitiated';
    public static reviewTodoCreatedState: string = 'pending';
    public static reviewTodoCompletedState: string = 'completed';

    // toDo action Types
    public static supplierReviewalActionType: string = 'supplier reviewal';
    public static reviewApprovalActionType: string = 'review approval';
    // outcomes
    public static notRecommendedOutcome: string = 'Not recommended';
    public static recommendedOutcome: string = 'Recommended';
    public static noOutcome: string = 'No Outcome';
    public static blockedSupplierStatus: string = 'blocked';

    // review initiation tab names
    public static evaluationNameTab: string = 'Evaluation Name';
    public static formTab: string = 'Form Selection';
    public static userTab: string = 'Users/ User Groups';
    public static supplierTab: string = 'Supplier Selection';
    public static timeTab: string = 'Time Period Selection';
    public static gradingMethodTab: string = 'Grading Method Selection';
    public static gradeCategoriesTab: string = 'Grade Categories';

    //form types
    public static materialTypeForm: string = 'Material';
    public static serviceTypeForm: string = 'Service';
    public static commonTypeForm: string = 'Material & Service';

    // role based visibility
    public static limitingRoles: string = 'reviewer,supervisor'


}

export interface ReviewResponse {
  id: number;
  reviewSessionId: number;
  createdDate: Date;
  review: string;
  conductedUser: string;
  modifiedDate: Date;
  status: string;
  evaluationName?: string;
  score: number;
  title?: string;
  subtitle?: string;
  supplierId: number;
  supplierName: string;
  supplierEmail: string;
  startDate: Date;
  endDate: Date;
  presetPeriod: string;
  periodType: string;
  reviewYear: string;
  createdUser: string;
  createdEmail: string;
  gradeCategories: string;
  reviewerWeights: string;
  minGradeThreshold: string;
  finalScore: number;
  outcome: string;
  approvalInitiationDate: Date;
  supervisorName: string;
  supervisorEmail: string;
}

export interface ReviewForm {
  formType: any;
  id: string;
  name: string;
  submittedDate: Date;
  form: string;
  isActive?: number;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  weight: number;
  department: string;
}

export interface UserRole {
  name: string;
  id: string;
}

export interface Supplier {
  supplierID: number;
  supplierName: string;
  email: string;
  status?: string;
  supplierType?: string;
  supplierCode?: string;
  ifsCode?: string;
  regDate?:Date
}
export interface ReviewerWeight {
  reviewer: string;
  weight: number;
}

export interface PresetPeriod {
  period: string;
  startDate: Date;
  endDate: Date;
}

export interface ReviewInitiationForm {
  formId: number;
  evaluationName: string;
  formName: string;
  reviewYear: string;
  review: string;
  status: string;
  assignedUsersList: string[];
  assignedUsers: string;
  assignType: string;
  assignedUserRolesList: string[];
  assignedUserRoles: string;
  createdUser: string;
  supplierList: string[];
  suppliers: string;
  gradingMethod: string;
  gradeCategoriesArray: [];
  gradeCategories: string;
  reviewerWeightsArray: [];
  reviewerWeights: string;
  minGradeThreshold: number;
  startDate: Date;
  endDate: Date;
  presetPeriod: string;
  periodType: string;
  supplierBlocker: 1;
  frequency?: string;
  scheduled: number;
  materials: number;
  services: number;
  scored: number;
}

export interface ReviewSession {
  id: number;
  formId: string;
  formName?: string;
  suppliers: string;
  evaluationName: string;
  createdDate: Date;
  reviewTimeline: string;
  reviewYear: string;
  createdUser: string;
  assignedUsers: string;
  assignedUserRoles?: string;
  modifiedDate: Date;
  status: string;
  gradeCategories: string;
  reviewerWeights: string;
  minGradeThreshold: string;
  outcome: string;
  startDate: Date;
  endDate: Date;
  periodType: string;
  presetPeriod: string;
  frequency?: string;
  scheduled?: number;
  services: string;
  scored: number;
  assignType: string;
}

  export interface ReviewOutcome {
    id: number,
    sessionId: number,
    supplierId: number,
    outcome: string,
    evaluationName?:string,
    timePeriod?:string,
    supplierName?:string,
    supplierEmail: string;
    startDate?: Date,
    endDate?: Date,
    periodType?: string,
    presetPeriod?: string,
    reviewYear?: string,
    createdUser?: string
    status?:string
    createdDate?:string
    scheduled?:string
    frequency?:string
    services?:string
    finalScore?:number
    approvalInitiationDate: Date
    supplierType?:string
    supplierStatus?:string
    supplierCode?:string
    assignedUsers?:string
    modifiedDate: Date
  }
  
  export interface ReviewApprover {
    id?: number,
    approverId: number,
    approverName: string,
    reviewResponseId: number,
    outcomeId?: number,
    status:string,
    comments?:string,
    stepNo:number,
    email:string,
    type?:string,
    role?:string,
    conductedUser?:string
  }

export interface ReviewTodo {
  id?: number,
  actionType: string,
  actionTakerUsername: string,
  status: string,
  createdDate?: string,
  modifiedDate?: string,
  reviewResponseId: number,
  evaluationName?:string,
  supplierName?:string,
  services?: string
}
export interface ReviewerSectionScore {
  reviewer: string;
  score: number;
  section: string;
}

export enum Tabs {
  Review_Sessions = 0,
  Review_Todos = 1,
  Review_Responses = 2,
  Review_Outcomes = 3
}
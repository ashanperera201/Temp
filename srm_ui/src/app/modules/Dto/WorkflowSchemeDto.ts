export class WorkflowSchemeDto{
    code: string | undefined;
}

export class GetWorkflowSchemesOutput {
    schemes: WorkflowSchemeDto[] | undefined;
    id: number | undefined;
}
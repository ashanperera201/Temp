interface Attributes {
    title: string;
    name: string;
    group: string;
}

interface AttributeItem {
    item: string;
    description: string;
    value: string;
}
interface SupplierResponces {
    name: string;
    value: string;
    cost: string;
    Comments: string;
}

interface CostFactors {
    list: string;
    description: string;
}

interface CostFactorItems {
    name: string;
    type: string;
    description: string;
    value: string;
}

interface CostFactorbySuppliers {
    name: string;
    type: string;
    description: string;
}

interface SupplierResponces1 {
    name: string;
    value: string;
    Comments: string;
}

interface SupplierResponces2 {
    name: string;
    value: string;
    Comments: string;
}

interface PaymentSchedule {
    no: number;
    description: string;
    work: string;
    milestone: number;
    payment: string;
    retention: string;
    release: string;
    value: string;
}

interface PaymentSchedulebySuppliers {
    no: number;
    description: string;
    work: string;
    milestone: number;
    payment: string;
    retention: string;
    release: string;
    value: string;
}

interface Responces1 {
    name: string;
    responces: string;
    Comments: string;
}

interface Responces2 {
    name: string;
    responces: string;
    Comments: string;
}

interface Attachments {
    no: number;
    titleName: string;
    fileName: string;
    Attachemnt: string;
    Type: string;
}

interface AttachmentResponces {
    name: string;
    responces: string;
    Comments: string;
}

interface Documents {
    no: string;
}

interface Notes {
    no: string;
}

interface DocumentResponces {
    name: string;
    responces: string;
    Comments: string;
}

interface NotesResponces {
    name: string;
    responces: string;
    Comments: string;
}

interface Deliverables {
    no: number;
    name: string;
    description: string;
    milestone: string;
    progress: string;
    stageProgress: string;
    date: string;
}

interface DeliverablesbySuppliers {
    no: number;
    name: string;
    description: string;
    milestone: string;
    progress: string;
    stageProgress: string;
    date: string;
}

interface DeliverableResponces1 {
    name: string;
    responces: string;
    Comments: string;
}

interface DeliverableResponces2 {
    name: string;
    responces: string;
    Comments: string;
}

interface supplierResponses_header {
    rfqno: string;
    revno: string;
    rfqname: string;
    description: string;
    id: string;
    projectname: string;
    supplier: string;
    date: string;
}
interface header {
    quoteNumber: string;
    refNumber: string;
    rfqCurrency: string;
    validUntil: string;
    weeks: string;
    deliveryTime: string;
    supplierSite: string;
}
interface Lines {
    no: number;
    prNo: number;
    partId: number;
    description: string;
    date: string;
    target: string;
    price: string;
    uom: string;
    qty: number;
}
interface Information {
    name: string;
    role: string;
    substitute: string;
    access: string;
    pages: string;
    teamName: string;
    description: string;
    ifsSupplierId: string;
}

const SampleAttribute = [
    {
        ATTRIBUTES: [
            { title: '01', name: '1121247', group: 'Ball Bearings - SKF 6206' },
        ],

        ATTRIBUTE_ITEMS: [
            {
                item: 'Minimum Order ',
                description: 'Min order quantity',
                value: '100',
            },
        ],

        SUPPLIERS: [
            {
                name: 'Supplier A',
                value: ' Number *',
                cost: '0.00 USD*',
                Comments: '',
            },
            {
                name: 'Supplier B',
                value: ' Number *',
                cost: '0.00 USD*',
                Comments: '',
            },
            {
                name: 'Supplier C',
                value: ' Number *',
                cost: '0.00 USD*',
                Comments: '',
            },
        ],
    },
    {
        ATTRIBUTES: [
            { title: '02', name: '1121258', group: 'Ball Bearings - SKF 6216' },
        ],

        ATTRIBUTE_ITEMS: [
            {
                item: 'Packaging ',
                description: 'Do you ship in boxes',
                value: 'Yes / No',
            },
        ],

        SUPPLIERS: [
            {
                name: 'Supplier A',
                value: ' Number *',
                cost: '0.00 USD*',
                Comments: '',
            },
            {
                name: 'Supplier B',
                value: ' Number *',
                cost: '0.00 USD*',
                Comments: '',
            },
            {
                name: 'Supplier C',
                value: ' Number *',
                cost: '0.00 USD*',
                Comments: '',
            },
        ],
    },
    {
        ATTRIBUTES: [
            { title: '03', name: '1121268', group: 'Ball Bearings - SKF 6226' },
        ],

        ATTRIBUTE_ITEMS: [
            {
                item: 'Shipment Date ',
                description: 'When can you ship?',
                value: '25/12/2021',
            },
        ],

        SUPPLIERS: [
            {
                name: 'Supplier A',
                value: ' Number *',
                cost: '0.00 USD*',
                Comments: '',
            },
            {
                name: 'Supplier B',
                value: ' Number *',
                cost: '0.00 USD*',
                Comments: '',
            },
            {
                name: 'Supplier C',
                value: ' Number *',
                cost: '0.00 USD*',
                Comments: '',
            },
        ],
    },
    {
        ATTRIBUTES: [
            { title: '04', name: '1121277', group: 'Ball Bearings - SKF 6236' },
        ],

        ATTRIBUTE_ITEMS: [
            {
                item: 'Maximum Order ',
                description: 'Max order quantity',
                value: '500',
            },
        ],

        SUPPLIERS: [
            {
                name: 'Supplier A',
                value: ' Number *',
                cost: '0.00 USD*',
                Comments: '',
            },
            {
                name: 'Supplier B',
                value: ' Number *',
                cost: '0.00 USD*',
                Comments: '',
            },
            {
                name: 'Supplier C',
                value: ' Number *',
                cost: '0.00 USD*',
                Comments: '',
            },
        ],
    },
    {
        ATTRIBUTES: [
            { title: '05', name: '1121297', group: 'Ball Bearings - SKF 6236' },
        ],

        ATTRIBUTE_ITEMS: [
            {
                item: 'Return Policy ',
                description: 'Return damage item',
                value: '25/01/2022',
            },
        ],

        SUPPLIERS: [
            {
                name: 'Supplier A',
                value: ' Number *',
                cost: '0.00 USD*',
                Comments: '',
            },
            {
                name: 'Supplier B',
                value: ' Number *',
                cost: '0.00 USD*',
                Comments: '',
            },
            {
                name: 'Supplier C',
                value: ' Number *',
                cost: '0.00 USD*',
                Comments: '',
            },
        ],
    },
];

const SampleCostFactors = [
    {
        CostFactors: [
            {
                list: 'Breakdown Costs',
                description: 'Cost Elements involved in RIG building',
            },
        ],

        CostFactorItems: [
            {
                name: 'Minimum Order ',
                type: 'Min order quantity',
                description: '100',
                value: '',
            },
        ],

        CostFactorbySuppliers: [{ name: '111', type: '222', description: '333' }],

        SupplierResponces1: [
            { name: 'Supplier A1', value: 'Number *', Comments: '' },
            { name: 'Supplier B1', value: 'Number *', Comments: '' },
            { name: 'Supplier C1', value: 'Number *', Comments: '' },
            { name: 'Supplier D1', value: 'Number *', Comments: '' },
        ],

        SupplierResponces2: [
            { name: 'Supplier A', value: 'Number *', Comments: '' },
            { name: 'Supplier B', value: 'Number *', Comments: '' },
            { name: 'Supplier C', value: 'Number *', Comments: '' },
            { name: 'Supplier D', value: 'Number *', Comments: '' },
        ],
    },
    {
        CostFactors: [
            {
                list: 'Breakdown Costs',
                description: 'Cost Elements involved in RIG building',
            },
        ],

        CostFactorItems: [
            {
                name: 'Packaging',
                type: 'Do you ship in boxes',
                description: 'Yes / No',
                value: '',
            },
        ],

        CostFactorbySuppliers: [{ name: '', type: '', description: '' }],

        SupplierResponces1: [
            { name: 'Supplier A', value: 'Number *', Comments: '' },
            { name: 'Supplier B', value: 'Number *', Comments: '' },
            { name: 'Supplier C', value: 'Number *', Comments: '' },
            { name: 'Supplier D', value: 'Number *', Comments: '' },
        ],

        SupplierResponces2: [
            { name: 'Supplier A', value: 'Number *', Comments: '' },
            { name: 'Supplier B', value: 'Number *', Comments: '' },
            { name: 'Supplier C', value: 'Number *', Comments: '' },
            { name: 'Supplier D', value: 'Number *', Comments: '' },
        ],
    },
];

const SamplePaymentSchedule = [
    {
        PaymentSchedule: [
            {
                no: 1,
                description: 'Shipment Loading',
                work: '60%',
                milestone: 1,
                payment: '50%',
                retention: '10%',
                release: '90%',
                value: 'USD 10,000',
            },
        ],

        PaymentSchedulebySuppliers: [
            {
                no: 1,
                description: 'Shipment Loading',
                work: '60%',
                milestone: 1,
                payment: '50%',
                retention: '10%',
                release: '90%',
                value: 'USD 10,000',
            },
        ],

        Responces1: [
            { name: 'Supplier A', responces: 'Agreed', Comments: 'Ok to proceed' },
            {
                name: 'Supplier B',
                responces: 'Not Agreed',
                Comments: 'Retention - 10%',
            },
            { name: 'Supplier C', responces: '', Comments: '' },
        ],

        Responces2: [
            { name: 'Supplier A', responces: 'Agreed', Comments: 'Ok to proceed' },
            {
                name: 'Supplier B',
                responces: 'Not Agreed',
                Comments: 'Retention - 10%',
            },
            { name: 'Supplier C', responces: '', Comments: '' },
        ],
    },
];

const SampleAttachments = [
    {
        Attachments: [
            {
                no: 10101,
                titleName: 'Attachment ABC',
                fileName: 'ABC.PDF',
                Attachemnt: 'Attachment 1',
                Type: 'Technical',
            },
        ],
        AttachmentResponces: [
            { name: 'Supplier A', responces: 'abc.xlx', Comments: '' },
            { name: 'Supplier B', responces: 'xyz.xlx', Comments: '' },
        ],
    },
];

const SampleDocument = [
    {
        Documents: [
            {
                no: 'Line items are fragile. EPlease ensure they are packed properlly with required materials and containers',
            },
        ],
        DocumentResponces: [
           
                    {
                        name: 'Supplier A',
                        responces: 'Yes will do',
                        Comments: 'Additional cost - 1000 USD',
                    },
                
                    {
                        name: 'Supplier B',
                        responces: 'Yes will do',
                        Comments: 'Additional cost - 1000 USD',
                    },
                ],
           
       
    },
];

const SampleNotes = [
    {
        Notes: [
            {
                no: 'Line items are fragile. EPlease ensure they are packed properlly with required materials and containers',
            },
        ],
        NotesResponces: [
            {
                name: 'Supplier A',
                responces: 'Yes will do',
                Comments: 'Additional cost - 1000 USD',
            },
        
            {
                name: 'Supplier B',
                responces: 'Yes will do',
                Comments: 'Additional cost - 1000 USD',
            },
        ],
    },
];

const SampleDeliverables = [
    {
        Deliverables: [
            {
                no: 1,
                name: 'Shipment Loading',
                description: 'Loading Goods',
                milestone: '50%',
                progress: '10%',
                stageProgress: '90%',
                date: '02/01/2021',
            }
        ],

        DeliverablesbySuppliers: [
            {
                no: 2,
                name: 'Shipment Delivery',
                description: 'GRN of shipment',
                milestone: '50%',
                progress: '20%',
                stageProgress: '80%',
                date: '02/02/2021',
            }
        ],

        DeliverableResponces1: [
            {
                name: 'Supplier A',
                responces: 'Not Agreed',
                Comments: 'Date not possible',
            },
            {
                name: 'Supplier B',
                responces: 'Not Agreed',
                Comments: 'Date not possible',
            }
        ],

        DeliverableResponces2: [
            {
                name: 'Supplier A',
                responces: 'Not Agreed',
                Comments: 'Date not possible',
            },
            {
                name: 'Supplier B',
                responces: 'Not Agreed',
                Comments: 'Date not possible',
            }
        ],
    },
];

const supplierResponses_headerData = [
    {
        rfqno: 'RFQ 2231',
        revno: 'REV NO',
        rfqname: 'RFQ Name',
        description: 'RFQ Description',
        id: 'ASDIT-SA-2332',
        projectname: 'RIG Building',
        supplier: 'Supplier A ',
        date: '05/12/2021',
    },
];

const headerData = [
    {
        quoteNumber: 'RFQ 2231',
        refNumber: 'REV NO',
        rfqCurrency: 'RFQ Name',
        validUntil: 'RFQ Description',
        weeks: 'ASDIT-SA-2332',
        deliveryTime: 'RIG Building',
        supplierSite: 'Supplier A ',
    },
];

const Lines_Data = [
    {
        no: 1,
        prNo: 10101,
        partId: 1121247,
        description: 'Ball Bearing - 62065',
        date: '05/12/2021',
        target: '55 USD',
        price: 'Yes',
        uom: 'Each',
        qty: 75,
        isShow:false
    },
    {
        no: 2,
        prNo: 10101,
        partId: 1121247,
        description: 'Ball Bearing - 62065',
        date: '05/12/2021',
        target: '55 USD',
        price: 'Yes',
        uom: 'Each',
        qty: 75,
    },
    {
        no: 3,
        prNo: 10101,
        partId: 1121247,
        description: 'Ball Bearing - 62065',
        date: '05/12/2021',
        target: '55 USD',
        price: 'Yes',
        uom: 'Each',
        qty: 75,
    },
    
];

const Supplier_Inormation_Data = [
    {
        supplierID: '101230',
        name: 'Sup A',
        invitedOn: '01-02-2021  02:00PM',
        supplierContact: 'ABC',
        emailID: 'abc123@gmail.com',
        currencies: 'Yet to Acknowledge',
        status: 'Quality Team 01',
    },
    {
        supplierID: '101230',
        name: 'Sup A',
        invitedOn: '01-02-2021  02:00PM',
        supplierContact: 'ABC',
        emailID: 'abc123@gmail.com',
        currencies: 'Yet to Acknowledge',
        status: 'Quality Team 01',
    },
    {
        supplierID: '101230',
        name: 'Sup A',
        invitedOn: '01-02-2021  02:00PM',
        supplierContact: 'ABC',
        emailID: 'abc123@gmail.com',
        currencies: 'Yet to Acknowledge',
        status: 'Quality Team 01',
    },
    {
        supplierID: '101230',
        name: 'Sup A',
        invitedOn: '01-02-2021  02:00PM',
        supplierContact: 'ABC',
        emailID: 'abc123@gmail.com',
        currencies: 'Yet to Acknowledge',
        status: 'Quality Team 01',
    },
];

const Team_Inormation_Data = [
    {
        name: 'Danny Boyle',
        role: 'Buyer',
        substitute: 'Chris Torris',
        access: 'Full',
        pages: 'Full RFQ',
        teamName: 'Q1',
        description: 'Quality Team 01',
    },
    {
        name: 'Richard Barn',
        role: 'Technical Bid Evaluator',
        substitute: 'M Nauman',
        access: 'Edit Tabs',
        pages: 'RFQ - Evaluations',
        teamName: 'Q1',
        description: 'Quality Team 01',
    },
    {
        name: 'M Azhar',
        role: 'Commercial Bid Evaluator',
        substitute: 'Rajesh Kumar',
        access: 'Edit Tabs',
        pages: 'RFQ - Evaluations',
        teamName: 'Q1',
        description: 'Quality Team 01',
    },
    {
        name: 'Ben David',
        role: 'Finance Head',
        substitute: 'Vinay Kumar',
        access: 'View Only',
        pages: 'RFQ',
        teamName: 'Q1',
        description: 'Quality Team 01',
    },
];

interface newTable {
    select: boolean;
    name: string;
    t: boolean;
    c: boolean;
}

const Rules_RFX_header = [
    {
        select: true,
        name: 'Attribute Items',
        t: true,
        c: false,
    },
    {
        select: true,
        name: 'Cost Factors',
        t: true,
        c: false,
    },
    {
        select: true,
        name: 'Payment Schedules',
        t: true,
        c: false,
    },
    {
        select: true,
        name: 'Attatchment',
        t: true,
        c: false,
    },
    {
        select: true,
        name: 'Document Text',
        t: true,
        c: false,
    },
    {
        select: true,
        name: 'Notes',
        t: true,
        c: false,
    },
    {
        select: true,
        name: 'Terms and Condtions',
        t: true,
        c: false,
    },
    {
        select: true,
        name: 'Deliverables',
        t: true,
        c: false,
    },
    {
        select: false,
        name: 'Survey Forms',
        t: false,
        c: false,
    },
];

const Rules_Lines_header = [
    {
        select: true,
        name: 'Attribute Items',
        t: true,
        c: false,
    },
    {
        select: true,
        name: 'Cost Factors',
        t: true,
        c: false,
    },
    {
        select: true,
        name: 'Payment Schedules',
        t: true,
        c: false,
    },
    {
        select: true,
        name: 'Attatchment',
        t: true,
        c: false,
    },
    {
        select: true,
        name: 'Document Text',
        t: true,
        c: false,
    },
    {
        select: true,
        name: 'Notes',
        t: true,
        c: false,
    },
    {
        select: true,
        name: 'Terms and Condtions',
        t: true,
        c: false,
    },
    {
        select: true,
        name: 'Deliverables',
        t: true,
        c: false,
    },
    {
        select: false,
        name: 'Survey Forms',
        t: false,
        c: false,
    },
];

interface GeneralRules {
    name: string;
    select: boolean;
}

const GeneralRules_Data = [
    {
        name: 'Allow suppliers to select lines on which to respond',
        select: true,
    },
    {
        name: 'Display best price to suppliers',
        select: true,
    },
    {
        name: 'Allow multiple response',
        select: true,
    },
    {
        name: 'Allow bid price scoring',
        select: true,
    },
    {
        name: 'Require full quantity',
        select: true,
    },
    {
        name: 'Allow manual close before the close date',
        select: true,
    },
    {
        name: 'Allow manual extend when the negotiation is open',
        select: true,
    },
];

interface scoringTables {
    name: string;
    points: number;
    weight: number;
}

const Scoring_Header_Attribute_Data = [
    {
        name: '',
        points: 30,
        weight: 30,
    },
    {
        name: 'Attribute Item 01',
        points: 10,
        weight: 10,
    },
    {
        name: 'Attribute Item 02',
        points: 10,
        weight: 10,
    },
    {
        name: 'Attribute Item 03',
        points: 10,
        weight: 10,
    },
];

const Scoring_Header_CostFactors_Data = [
    {
        name: '',
        points: 20,
        weight: 20,
    },
    {
        name: 'Breakdown Costs',
        points: 5,
        weight: 5,
    },
    {
        name: 'Material Costs',
        points: 5,
        weight: 5,
    },
    {
        name: 'Labor Costs',
        points: 5,
        weight: 5,
    },
    {
        name: 'Transport Costs',
        points: 5,
        weight: 5,
    },
];

const Scoring_Header_PaymentShcedule_Data = [
    {
        name: '',
        points: 10,
        weight: 10,
    },
    {
        name: 'Freight Cost',
        points: 5,
        weight: 5,
    },
    {
        name: 'Initiation of Project',
        points: 5,
        weight: 5,
    },
];

const Scoring_Header_Attachment_Data = [
    {
        name: '',
        points: 10,
        weight: 10,
    },
    {
        name: 'Supplier Details Attatchments',
        points: 5,
        weight: 5,
    },
    {
        name: 'Sourcing Attatchments',
        points: 5,
        weight: 5,
    },
];

const Scoring_Header_Document_Data = [
    {
        name: '',
        points: 10,
        weight: 10,
    },
    {
        name: 'Item batch 15435',
        points: 5,
        weight: 5,
    },
    {
        name: 'Item batch 22353',
        points: 5,
        weight: 5,
    },
];

const Scoring_Header_Notes_Data = [
    {
        name: '',
        points: 10,
        weight: 10,
    },
    {
        name: 'Hazard and Caution',
        points: 5,
        weight: 5,
    },
    {
        name: 'Technicalities',
        points: 5,
        weight: 5,
    },
];

const Scoring_Header_Deliverables_Data = [
    {
        name: '',
        points: 10,
        weight: 10,
    },
    {
        name: 'Item Batch 10023',
        points: 10,
        weight: 15,
    },
];

const Scoring_Lines_Attribute_Data = [
    {
        name: '',
        points: 30,
        weight: 30,
    },
    {
        name: 'Minnimum Order',
        points: 10,
        weight: 10,
    },
    {
        name: 'Packaging',
        points: 10,
        weight: 10,
    },
    {
        name: 'Shipment Date',
        points: 10,
        weight: 10,
    },
    {
        name: 'Maximum Order',
        points: 30,
        weight: 30,
    },
    {
        name: 'Return Policy',
        points: 30,
        weight: 30,
    },
    {
        name: 'Construction',
        points: 30,
        weight: 30,
    },
];

const Scoring_Lines_CostFactors_Data = [
    {
        name: '',
        points: 20,
        weight: 20,
    },
    {
        name: 'Line Price',
        points: 5,
        weight: 5,
    },
    {
        name: 'Cost of Start-Up & C/Ammissioning Spares',
        points: 5,
        weight: 5,
    },
    {
        name: 'Cost of Inspection Requirements',
        points: 5,
        weight: 5,
    },
    {
        name: 'First Fills and Lubricants Cost',
        points: 5,
        weight: 5,
    },
];

const Scoring_Lines_PaymentShcedule_Data = [
    {
        name: '',
        points: 10,
        weight: 10,
    },
    {
        name: 'Freight Cost',
        points: 5,
        weight: 5,
    },
    {
        name: 'Project Initiation - Phase 1',
        points: 5,
        weight: 5,
    },
];

const Scoring_Lines_Attachment_Data = [
    {
        name: '',
        points: 10,
        weight: 10,
    },
    {
        name: 'Attachment 1 - Technical',
        points: 5,
        weight: 5,
    },
    {
        name: 'Attachment 2 - Commercial',
        points: 5,
        weight: 5,
    },
];

const Scoring_Lines_Document_Data = [
    {
        name: '',
        points: 10,
        weight: 10,
    },
    {
        name: 'Fragile Goods - Packaging',
        points: 5,
        weight: 5,
    },
    {
        name: 'Urgent Order - Delivery Date',
        points: 5,
        weight: 5,
    },
];

const Scoring_Lines_Notes_Data = [
    {
        name: '',
        points: 10,
        weight: 10,
    },
    {
        name: 'Fragile Goods - Packaging',
        points: 5,
        weight: 5,
    },
    {
        name: 'Urgent Order - Delivery Date',
        points: 5,
        weight: 5,
    },
];

const Scoring_Lines_Deliverables_Data = [
    {
        name: '',
        points: 10,
        weight: 10,
    },
    {
        name: 'SDD Submission',
        points: 10,
        weight: 5,
    },
    {
        name: 'Design Approvals',
        points: 5,
        weight: 5,
    },
];
interface lineItems {
    line: string;
    id: string;
    description: string;
    points: number;
    weight: number;
}

const lineItems_Data = [
    {
        line: '01',
        id: '1121247',
        description: 'Ball Bearings - SKF 6206',
        points: 25,
        weight: 25,
    },
    {
        line: '02',
        id: '1121247',
        description: 'Ball Bearings - SKF 6206',
        points: 25,
        weight: 25,
    },
    {
        line: '03',
        id: '1121247',
        description: 'Ball Bearings - SKF 6206',
        points: 50,
        weight: 50,
    },
];

interface scoringCriteria {
    name: string;
    points: number;
    weight: number;
    score: number;
}

const scoringCriteria_Data = [
    {
        name: 'Attribute Items',
        points: 5,
        weight: 5,
        score: 5,
    },
    {
        name: 'Cost Factors',
        points: 5,
        weight: 5,
        score: 5,
    },
    {
        name: 'Payment Schedules',
        points: 5,
        weight: 5,
        score: 5,
    },
    {
        name: 'Attatchment',
        points: 5,
        weight: 5,
        score: 5,
    },
    {
        name: 'Document Text',
        points: 5,
        weight: 5,
        score: 5,
    },
    {
        name: 'Notes',
        points: 5,
        weight: 5,
        score: 5,
    },
    {
        name: 'Terms and Condtions',
        points: 5,
        weight: 5,
        score: 5,
    },
    {
        name: 'Deliverables',
        points: 5,
        weight: 5,
        score: 5,
    },
    {
        name: 'Survey Forms',
        points: 5,
        weight: 5,
        score: 5,
    },
];

const BidPrice_Data = [
    {
        name: 'Attribute Items',
        points: 5,
        weight: 5,
        score: 5,
    },
    {
        name: 'Cost Factors',
        points: 5,
        weight: 5,
        score: 5,
    },
    {
        name: 'Payment Schedules',
        points: 5,
        weight: 5,
        score: 5,
    },
];

interface evaluations {
    name: string;
    description: string;
    weight: number;
    supA: number;
    supB: number;
    supC: number;
    supD: number;
}
const Evaluation_Attribute_Data = [
    {
        Name: 'Minnimum Order',
        Description: 'Minnimum order Qty',
        Weight: 5,
        'Supplier A': 5,
        'Supplier B': 4,
        'Supplier C': 2,
        'Supplier D': 5,
    },
    {
        Name: 'Packaging',
        Description: 'Shipment Boxes ',
        Weight: 5,
        'Supplier A': 5,
        'Supplier B': 5,
        'Supplier C': 5,
        'Supplier D': 4,
    },
];

const Evaluation_CostFactors_Data = [
    {
        Name: 'Breakdown costs',
        Description: 'Cost Elements involved in RIG building',
        Weight: 5,
        'Supplier A': 5,
        'Supplier B': 4,
        'Supplier C': 2,
        'Supplier D': 5,
    },
    {
        Name: 'Internal Costs',
        Description: 'Costs of Internal holdings',
        Weight: 5,
        'Supplier A': 5,
        'Supplier B': 5,
        'Supplier C': 5,
        'Supplier D': 4,
    },
];

const Evaluation_PaymentSchedule_Data = [
    {
        Name: 'Freight Cost for single shipment 1',
        Description: 'Freight Cost for single shipment 1',
        Weight: 5,
        'Supplier A': 5,
        'Supplier B': 4,
        'Supplier C': 2,
        'Supplier D': 5,
    },
    {
        Name: 'Freight Cost for single shipment 2',
        Description: 'Freight Cost for single shipment 2',
        Weight: 5,
        'Supplier A': 5,
        'Supplier B': 5,
        'Supplier C': 5,
        'Supplier D': 4,
    },
];

const Evaluation_Attachments_Data = [
    {
        Name: 'Technical Attachment1',
        Description: 'Tech Drawing 1',
        Weight: 5,
        'Supplier A': 5,
        'Supplier B': 4,
        'Supplier C': 2,
        'Supplier D': 5,
    },
    {
        Name: 'Technical Attachment 2',
        Description: 'Tech Drawing 2',
        Weight: 5,
        'Supplier A': 5,
        'Supplier B': 5,
        'Supplier C': 5,
        'Supplier D': 4,
    },
];

const Evaluation_Document_Data = [
    {
        Name: 'Fragile Item',
        Description: 'Proper Packing',
        Weight: 5,
        'Supplier A': 5,
        'Supplier B': 4,
        'Supplier C': 2,
        'Supplier D': 5,
    },
    {
        Name: 'Urgent Item ',
        Description: 'Delivery date',
        Weight: 5,
        'Supplier A': 5,
        'Supplier B': 5,
        'Supplier C': 5,
        'Supplier D': 4,
    },
];

const Evaluation_Notes_Data = [
    {
        Name: 'Fragile Item',
        Description: 'Proper Packaging',
        Weight: 5,
        'Supplier A': 5,
        'Supplier B': 4,
        'Supplier C': 2,
        'Supplier D': 5,
    },
    {
        Name: 'Urgent Item ',
        Description: 'Delivery date',
        Weight: 5,
        'Supplier A': 5,
        'Supplier B': 5,
        'Supplier C': 5,
        'Supplier D': 4,
    },
];

const Evaluation_Deliverables_Data = [
    {
        Name: 'MSDD Submission',
        Description: 'Minnimum order Qty',
        Weight: 5,
        'Supplier A': 5,
        'Supplier B': 4,
        'Supplier C': 2,
        'Supplier D': 5,
    },
    {
        Name: 'Design Approval',
        description: 'Shipment Boxes ',
        Weight: 5,
        'Supplier A': 5,
        'Supplier B': 5,
        'Supplier C': 5,
        'Supplier D': 4,
    },
];

interface technicalEvaluation_Score {
    name: string;
    finalScore: string;
}

const technicalEvaluation_Score_Data = [
    {
        name: 'Supplier A',
        finalScore: '80%',
    },
    {
        name: 'Supplier B',
        finalScore: '65%',
    },
    {
        name: 'Supplier C',
        finalScore: '40%',
    },
];
interface bidDetails {
    name: string;
    items: string;
    total: string;
}

const totalBID_Data = [
    {
        name: 'Supplier A',
        items: '7',
        total: '10,000',
    },
    {
        name: 'Supplier B',
        items: '7',
        total: '12,300',
    },
    {
        name: 'Supplier C',
        items: '7',
        total: '10,200',
    },
    {
        name: 'Supplier D',
        items: '7',
        total: '10,800',
    },
];
interface summeryComparison {
    name: string;
    total: string;
    target: string;
    tbeRank: number;
    cbeRank: number;
    overallRank: number;
    status: string;
}

const summeryComparison_data = [
    {
        name: 'Supplier A',
        total: '8,500',
        target: '575',
        tbeRank: 1,
        cbeRank: 1,
        overallRank: 3,
        status: 'awarded',
    },
    {
        name: 'Supplier B',
        total: '4,500',
        target: '425',
        tbeRank: 2,
        cbeRank: 2,
        overallRank: 2,
        status: 'Awarded',
    },
    {
        name: 'Supplier C',
        total: '2,000',
        target: '175',
        tbeRank: 3,
        cbeRank: 4,
        overallRank: 4,
        status: 'Awarded',
    },
    {
        name: 'Supplier D',
        total: '2,500',
        target: '175',
        tbeRank: 4,
        cbeRank: 3,
        overallRank: 1,
        status: 'Awarded',
    },
];
interface lineItemAward {
    description: string;
    price: string;
    cost: string;
    award: string;
}

const lineItemAward_data = [
    {
        description: 'Ball Bearing 01',
        price: '350',
        cost: '3500',
        award: 'Supplier A',
    },
    {
        description: 'Ball Bearing 02',
        price: '400',
        cost: '4000',
        award: 'Supplier B',
    },
    {
        description: 'Ball Bearing 03',
        price: '200',
        cost: '2000',
        award: 'Supplier C',
    },
    {
        description: 'Ball Bearing 04',
        price: '180',
        cost: '1800',
        award: 'Supplier A',
    },
    {
        description: 'Ball Bearing 05',
        price: '100',
        cost: '500',
        award: 'Supplier B',
    },
    {
        description: 'Ball Bearing 06',
        price: '500',
        cost: '2500',
        award: 'Supplier D',
    },
    {
        description: 'Ball Bearing 07',
        price: '320',
        cost: '3200',
        award: 'Supplier A',
    },
];

interface lineItemBreakdown {
    no: number;
    partId: number;
    description: string;
    qty: number;
    uom: string;
    date: string;
    target: string;
}

const lineItemBreakdown_data = [
    {
        no: 1,
        partId: 1121247,
        description: 'Ball Bearing - 62065',
        qty: 75,
        uom: 'Each',
        date: '05/12/2021',
        target: '55 USD',
    },
];

interface totalAward {
    name: string;
    award: string;
}

const totalAward_data = [
    {
        name: 'Supplier A',
        award: '8,500',
    },
    {
        name: 'Supplier B',
        award: '4,500',
    },
    {
        name: 'Supplier C',
        award: '2000',
    },
    {
        name: 'Supplier D',
        award: '2,500',
    },
];

const supplierResponseDetails = [
    {
        ' ': 'Line#',
        'Supplier A Response': 'Quote # 1323',
        'Supplier B Response': 'Quote # 15245',
        'Supplier C Response': 'Quote # 15245',
        'Supplier D Response': 'Quote # 15467',
    },
    {
        ' ': 'Part ID',
        'Supplier A Response': '12467834',
        'Supplier B Response': ' ',
        'Supplier C Response': ' ',
        'Supplier D Response': ' ',
    },
    {
        ' ': 'Substitute Part ID',
        'Supplier A Response': ' ',
        'Supplier B Response': '12467834',
        'Supplier C Response': '12467834',
        'Supplier D Response': '12467834',
    },
    {
        ' ': 'Part Description',
        'Supplier A Response': 'Ball Bearings - SKF 6208',
        'Supplier B Response': 'Ball Bearings - NACHI 6208',
        'Supplier C Response': 'Ball Bearings - NACHI 6208',
        'Supplier D Response': 'Ball Bearings - NACHI 6208',
    },
    {
        ' ': 'Quantity',
        'Supplier A Response': '50',
        'Supplier B Response': '50',
        'Supplier C Response': '50',
        'Supplier D Response': '50',
    },
    {
        ' ': 'UOM',
        'Supplier A Response': 'Each',
        'Supplier B Response': 'Each',
        'Supplier C Response': 'Each',
        'Supplier D Response': 'Each',
    },
    {
        ' ': 'Need by Date',
        'Supplier A Response': '19/12/2021',
        'Supplier B Response': '19/12/2021',
        'Supplier C Response': '19/12/2021',
        'Supplier D Response': '19/12/2021',
    },
    {
        ' ': 'Unit Price',
        'Supplier A Response': '95 USD',
        'Supplier B Response': '88 USD',
        'Supplier C Response': '68 USD',
        'Supplier D Response': '78 USD',
    },
    {
        ' ': 'Discount Type',
        'Supplier A Response': 'Fixed ',
        'Supplier B Response': 'Fixed ',
        'Supplier C Response': 'Fixed ',
        'Supplier D Response': 'Fixed ',
    },
    {
        ' ': 'Discounted Value',
        'Supplier A Response': '10',
        'Supplier B Response': '10',
        'Supplier C Response': '10',
        'Supplier D Response': '10',
    },
    {
        ' ': 'Final Unit Price',
        'Supplier A Response': '85 USD',
        'Supplier B Response': '79.20 USD',
        'Supplier C Response': '79.20 USD',
        'Supplier D Response': '79.20 USD',
    },
    {
        ' ': 'Total Price',
        'Supplier A Response': '4250 USD',
        'Supplier B Response': '3960 USD ',
        'Supplier C Response': '3960 USD ',
        'Supplier D Response': '3960 USD ',
    },
    {
        ' ': 'Promised Date',
        'Supplier A Response': '12/12/2021',
        'Supplier B Response': '12/12/2021',
        'Supplier C Response': '12/12/2021',
        'Supplier D Response': '12/12/2021',
    },
    {
        ' ': 'Lead Time',
        'Supplier A Response': '24 Days',
        'Supplier B Response': '24 Days',
        'Supplier C Response': '25 Days',
        'Supplier D Response': '24 Days',
    },
    {
        ' ': 'Origin',
        'Supplier A Response': 'China',
        'Supplier B Response': 'Japan',
        'Supplier C Response': 'Japan',
        'Supplier D Response': 'Japan',
    },
    {
        ' ': 'Manufacturer',
        'Supplier  Response': 'Zhang Pvt Ltd',
        'Supplier B Response': 'NACHI-FUJIKOSHI CORP',
        'Supplier C Response': 'NACHI-FUJIKOSHI CORP',
        'Supplier D Response': 'NACHI-FUJIKOSHI CORP',
    },
    {
        ' ': 'Rank',
        'Supplier A Response': '1',
        'Supplier B Response': '3',
        'Supplier C Response': '2',
        'Supplier D Response': '4',
    },
    {
        ' ': 'Evaluation Details',
        'Supplier A Response': ' ',
        'Supplier B Response': ' ',
        'Supplier C Response': ' ',
        'Supplier D Response': ' ',
    },
    {
        ' ': 'Score',
        'Supplier A Response': '8',
        'Supplier B Response': '5',
        'Supplier C Response': '4',
        'Supplier D Response': '4',
    },
    {
        ' ': 'Bid Acceptance',
        'Supplier A Response': 'Accepted',
        'Supplier B Response': 'Accepted, with reservations',
        'Supplier C Response': 'Accepted, with reservations',
        'Supplier D Response': 'Accepted, with reservations',
    },
    {
        ' ': 'Evaluator’s Comments',
        'Supplier A Response': ' ',
        'Supplier B Response': ' ',
        'Supplier C Response': ' ',
        'Supplier D Response': ' ',
    },
];

const supplier_chartdata = [
    {
        supplier: 'Supplier A',
        data: [
            { name: 'Attribute', value: 56 },
            { name: 'Cost Factors', value: 78 },
            { name: 'Payment Schedules', value: 23 },
            { name: 'Attachment', value: 98 },
            { name: 'Document Text', value: 56 },
            { name: 'Notes', value: 67 },
            { name: 'Deliverables', value: 34 },
        ],
    },
    {
        supplier: 'Supplier B',
        data: [
            { name: 'Attribute', value: 67 },
            { name: 'Cost Factors', value: 67 },
            { name: 'Payment Schedules', value: 98 },
            { name: 'Attachment', value: 56 },
            { name: 'Document Text', value: 78 },
            { name: 'Notes', value: 45 },
            { name: 'Deliverables', value: 89 },
        ],
    },
    {
        supplier: 'Supplier C',
        data: [
            { name: 'Attribute', value: 89 },
            { name: 'Cost Factors', value: 56 },
            { name: 'Payment Schedules', value: 87 },
            { name: 'Attachment', value: 45 },
            { name: 'Document Text', value: 98 },
            { name: 'Notes', value: 34 },
            { name: 'Deliverables', value: 56 },
        ],
    },
];

const supplier_cost_chartdata = [
    {
        supplier: 'Supplier A',
        data: [
            { name: 'Line 1', value: 56 },
            { name: 'Line 2', value: 78 },
            { name: 'Line 3', value: 23 },
            { name: 'Line 4', value: 98 },
            { name: 'Line 5', value: 56 },
            { name: 'Line 6', value: 67 },
            { name: 'Line 7', value: 34 },
        ],
    },
    {
        supplier: 'Supplier B',
        data: [
            { name: 'Line 1', value: 56 },
            { name: 'Line 2', value: 78 },
            { name: 'Line 3', value: 23 },
            { name: 'Line 4', value: 98 },
            { name: 'Line 5', value: 56 },
            { name: 'Line 6', value: 67 },
            { name: 'Line 7', value: 34 },
        ],
    },
    {
        supplier: 'Supplier C',
        data: [
            { name: 'Line 1', value: 56 },
            { name: 'Line 2', value: 78 },
            { name: 'Line 3', value: 23 },
            { name: 'Line 4', value: 98 },
            { name: 'Line 5', value: 56 },
            { name: 'Line 6', value: 67 },
            { name: 'Line 7', value: 34 },
        ],
    },
];

const supplier_response_chartdata = [
    {
        supplier: 'Supplier',
        data: [
            { name: 'Supplier A', value: 8 },
            { name: 'Supplier B', value: 5 },
            { name: 'Supplier C', value: 3 },
            { name: 'Supplier D', value: 4 },
        ],
    },
];

const summary_comparison_chartdata = [
    {
        supplier: 'TBE Score',
        data: [
            { name: 'Supplier A', value: 84 },
            { name: 'Supplier B', value: 50 },
            { name: 'Supplier C', value: 39 },
            { name: 'Supplier D', value: 30 },
        ],
    },
    {
        supplier: 'CBE Score',
        data: [
            { name: 'Supplier A', value: 22 },
            { name: 'Supplier B', value: 50 },
            { name: 'Supplier C', value: 65 },
            { name: 'Supplier D', value: 40 },
        ],
    },
    {
        supplier: 'CBA - Rank',
        data: [
            { name: 'Supplier A', value: 10 },
            { name: 'Supplier B', value: 20 },
            { name: 'Supplier C', value: 30 },
            { name: 'Supplier D', value: 40 },
        ],
    },
];

const awardedSupplier_chartdata = [
    {
        supplier: 'Awarded Supplier',
        data: [
            { name: 'Line 1 - Supplier A', value: 8 },
            { name: 'Line 2 - Supplier B', value: 5 },
            { name: 'Line 3 - Supplier C', value: 3 },
            { name: 'Line 4 - Supplier D', value: 4 },
            { name: 'Line 5 - Supplier B', value: 8 },
            { name: 'Line 6 - Supplier D', value: 5 },
            { name: 'Line 3 - Supplier A', value: 3 },
        ],
    },
];

const totalAward_chartdata = [
    {
        supplier: 'Supplier',
        data: [
            { name: 'Supplier A', value: 8 },
            { name: 'Supplier B', value: 5 },
            { name: 'Supplier C', value: 3 },
            { name: 'Supplier D', value: 4 },
        ],
    },
];

export {
    Attributes,
    AttributeItem,
    SupplierResponces,
    CostFactors,
    CostFactorItems,
    CostFactorbySuppliers,
    SupplierResponces1,
    SupplierResponces2,
    PaymentSchedule,
    PaymentSchedulebySuppliers,
    Responces1,
    Responces2,
    Attachments,
    AttachmentResponces,
    Documents,
    DocumentResponces,
    Notes,
    NotesResponces,
    Deliverables,
    DeliverablesbySuppliers,
    DeliverableResponces1,
    DeliverableResponces2,
    supplierResponses_header,
    header,
    Lines,
    Information,
    newTable,
    GeneralRules,
    scoringTables,
    lineItems,
    scoringCriteria,
    evaluations,
    technicalEvaluation_Score,
    bidDetails,
    summeryComparison,
    lineItemAward,
    totalAward,
    lineItemBreakdown,
    Supplier_Inormation_Data,
    Team_Inormation_Data,
    Lines_Data,
    headerData,
    supplierResponses_headerData,
    SampleAttribute,
    SampleCostFactors,
    SamplePaymentSchedule,
    SampleDocument,
    SampleNotes,
    SampleAttachments,
    SampleDeliverables,
    Rules_RFX_header,
    Rules_Lines_header,
    GeneralRules_Data,
    Scoring_Header_Attribute_Data,
    Scoring_Header_CostFactors_Data,
    Scoring_Header_PaymentShcedule_Data,
    Scoring_Header_Attachment_Data,
    Scoring_Header_Document_Data,
    Scoring_Header_Notes_Data,
    Scoring_Header_Deliverables_Data,
    Scoring_Lines_Attribute_Data,
    Scoring_Lines_CostFactors_Data,
    Scoring_Lines_PaymentShcedule_Data,
    Scoring_Lines_Attachment_Data,
    Scoring_Lines_Document_Data,
    Scoring_Lines_Notes_Data,
    Scoring_Lines_Deliverables_Data,
    lineItems_Data,
    scoringCriteria_Data,
    BidPrice_Data,
    Evaluation_Attribute_Data,
    Evaluation_CostFactors_Data,
    Evaluation_PaymentSchedule_Data,
    Evaluation_Attachments_Data,
    Evaluation_Document_Data,
    Evaluation_Notes_Data,
    Evaluation_Deliverables_Data,
    technicalEvaluation_Score_Data,
    totalBID_Data,
    supplierResponseDetails,
    summeryComparison_data,
    lineItemAward_data,
    totalAward_data,
    supplier_chartdata,
    supplier_cost_chartdata,
    supplier_response_chartdata,
    summary_comparison_chartdata,
    awardedSupplier_chartdata,
    totalAward_chartdata,
    lineItemBreakdown_data,
};

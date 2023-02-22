import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SurveyErrorStateMatcher } from '../error-state.matcher';
import { conditional, FormItem, FormItemOptionItem, FormItemWidget, FormSection } from '../form-item';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';

export class FormItemConditonalQuestion extends FormItem {
    questions: FormItemOptionItem[];
    answers: FormItemOptionItem[];
    conditional: conditional;
    hasOptions: boolean = true;
    section: FormSection;
}

@Component({
    selector: 'conditional-question',
    templateUrl: './conditional-question.component.html',
    styleUrls: ['./conditional-question.component.scss']
})
export class FormItemConditonalQuestionComponent implements FormItemWidget, OnInit {

    @Input() item: FormItemConditonalQuestion;
    @Input() editable: boolean = true;
    @Input() view: boolean = true;

    @Output() changes = new EventEmitter<FormItemConditonalQuestion>();
    matcher = new SurveyErrorStateMatcher();

    displayedColumns: string[] = ['question', 'answers', 'action'];
    dataSource = new MatTableDataSource<any>();

    currentQuestion: any;
    currentAnwers: any;

    currentDataSet: any = [];

    constructor() {
    }

    ngOnInit() {
        let multiChoiceQuestions = this.item.section.items
            .filter(i => ['radio'].indexOf(i.type) >= 0)
            .map(function (section) {
                return <FormItemOptionItem>{
                    label: section.label,
                    optionValue: section.name
                };
            });
        this.item.questions = multiChoiceQuestions;
        this.setAnswerList();

        if (this.item?.conditional?.multipleQuestionsData) {
            this.currentDataSet = this.item.conditional.multipleQuestionsData;
            this.dataSource.data = this.item.conditional.multipleQuestionsData;
        }
    }

    addToSource = () => {
        if (this.currentQuestion && this.currentAnwers) {
            let selectedValues = {
                question: this.currentQuestion,
                answers: this.currentAnwers
            }

            this.currentDataSet.push({ ...selectedValues });
            this.currentQuestion = undefined;
            this.currentAnwers = undefined;

            this.item.conditional.conditionalQuestion = null;
            this.item.conditional.conditionalAnswer = null;

            const filteredArr: any = [...new Map(this.currentDataSet.map((m) => [m.question, m])).values()];
            this.dataSource.data = filteredArr;

            this.item.conditional.multipleQuestionsData = this.dataSource.data;
            this.item.conditional.selectedQuestions = filteredArr.map(x => x.question).join(",");
            this.changes.emit(this.item);
        }
    }

    removeItem = (element: any) => {
        this.currentDataSet = this.currentDataSet.filter(x => x.question !== element.question);
        this.dataSource.data = this.currentDataSet;
    }

    onQuestionSelectionChange(value) {
        this.currentQuestion = value;
        this.item.conditional.conditionalQuestion = value;
        this.item.conditional.conditionalAnswer = "";
        this.item.answers = [];
        this.item.value = this.item.conditional;
        this.setAnswerList();
        this.changes.emit(this.item);
    }

    onAnswerSelectionChange(value) {
        this.currentAnwers = value;
        this.item.conditional.conditionalAnswer = value;
        this.item.value = this.item.conditional;
        this.changes.emit(this.item);
    }

    onChange(event: MatCheckboxChange) {
        this.item.conditional.conditional = event.checked;
        this.item.value = this.item.conditional;
        this.changes.emit(this.item);
    }

    setAnswerList() {
        if (this.item.conditional.conditionalQuestion) {
            let answers = this.item.section.items
                .find(i => ['radio'].indexOf(i.type) >= 0 && i.name == this.item.conditional.conditionalQuestion).items
                .map(function (option) {
                    return <FormItemOptionItem>{
                        label: option.label,
                        optionValue: option.optionValue
                    };
                });
            this.item.answers = answers;
        }
    }
}
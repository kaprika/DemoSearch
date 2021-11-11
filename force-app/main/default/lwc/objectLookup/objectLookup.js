import { LightningElement, api, track } from 'lwc';
import findRecords from '@salesforce/apex/SearchController.findRecords';
const DELAY = 200;

export default class ObjectLookup extends LightningElement {
    @api objectName;
    @track objectList = [];
    @api labelName;
    @api placeholder = 'Search...';
    @api fields;
    @api whereConditions;
    @api orderByAsc;
    @api orderByDesc;
    @api limitCondition;
    resultMessage = false;
    @api searchKey = '';

    field;
    field1;
    field2;

    connectedCallback() {
        if (this.objectName.includes('__c')) {
            let object = this.objectName.substring(0, this.objectName.length - 3);
            this.labelName = object.replaceAll('_', ' ');
        } else {
            this.labelName = this.objectName;
        }
        this.labelName = this.formatString(this.labelName);

        let fieldList = this.fields;
        if (fieldList.length == 1) {
            this.field = fieldList[0].trim();
        }
        else if (fieldList.length > 1) {
            this.field = fieldList[0].trim();
            this.field1 = fieldList[1].trim();
        }
        if (fieldList.length > 2) {
            this.field2 = fieldList[2].trim();
        }
    }

    handleKeyChange(event) {
        this.resultMessage = false;
        this.searchKey = event.target.value;
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            if (this.searchKey.length >= 2) {
                findRecords({
                    objectApiName: this.objectName,
                    fields: this.fields,
                    searchKey: this.searchKey,
                    whereConditions: this.whereConditions,
                    orderByAsc: this.orderByAsc,
                    orderByDesc: this.orderByDesc,
                    limitCondition: this.limitCondition
                })
                    .then(result => {
                        if (result.length == 0) {
                            this.resultMessage = true;
                        }
                        let stringResult = JSON.stringify(result);
                        let allResult = JSON.parse(stringResult);
                        allResult.forEach(record => {
                            record.FIELD1 = record[this.field];
                            record.FIELD2 = record[this.field1];
                            if (this.field2) {
                                record.FIELD3 = record[this.field2];
                            } else {
                                record.FIELD3 = '';
                            }
                        });
                        this.objectList = allResult;
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    })
                    .finally(() => {
                    });
            }
            else {
                this.objectList = [];
            }
        }, DELAY);
    }

    formatString(string) {
        var sentence = string.toLowerCase().split(' ');
        for (var i = 0; i < sentence.length; i++) {
            sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
        }
        return sentence;
    }
}
import { LightningElement, track } from 'lwc';
import getSObjectTypeFields from '@salesforce/apex/SearchController.getSObjectTypeFields';

export default class Demo extends LightningElement {
    @track fields = ['Name'];
    sObjectSelected = false;
    sObjectApiName;
    labelName;
    whereConditions = '';
    orderByAsc = 'Name';
    orderByDesc = '';
    limitCondition = 3;
    placeholder = 'Search...';
    searchKey = '';
    //?
    @track fieldsNames = [];

    handleSelection(event) {
        this.sObjectSelected = true;
        this.sObjectApiName = event.detail;
        if (this.sObjectApiName.includes('__c')) {
            let object = this.sObjectApiName.substring(0, this.sObjectApiName.length - 3);
            this.labelName = object.replaceAll('_', ' ');
        } else {
            this.labelName = this.sObjectApiName;
        }
        this.labelName = this.formatString(this.labelName);
        this.fieldsNames = [];
        getSObjectTypeFields({
            sObjectName: this.sObjectApiName
        })
            .then(result => {
                for (const fieldName of result) {
                    this.fieldsNames = [... this.fieldsNames, fieldName];
                }
                console.log('fields : ', this.fieldsNames);
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
            });
    }

    formatString(string) {
        var sentence = string.toLowerCase().split(' ');
        for (var i = 0; i < sentence.length; i++) {
            sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
        }
        return sentence;
    }
}
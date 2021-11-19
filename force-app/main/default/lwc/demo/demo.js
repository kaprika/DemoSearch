import { LightningElement, track } from 'lwc';
import getSObjectTypeFields from '@salesforce/apex/SearchController.getSObjectTypeFields';

export default class Demo extends LightningElement {
    @track fields = [];
    sObjectSelected = false;
    sObjectApiName;
    labelName;
    whereConditions = '';
    orderByAsc = '';
    orderByDesc = '';
    limitCondition = 3;
    placeholder = 'Search...';

    handleSelection(event) {
        this.sObjectSelected = true;
        this.sObjectApiName = event.detail;
        if (this.sObjectApiName.includes('__c')) {
            let object = this.sObjectApiName.substring(0, this.sObjectApiName.length - 3);
            this.labelName = object.replaceAll('_', ' ');
        } else {
            this.labelName = this.sObjectApiName;
        }
        this.fields = [];
        getSObjectTypeFields({
            sObjectName: this.sObjectApiName
        })
            .then(result => {
                for (const fieldName of result) {
                    this.fields = [... this.fields, fieldName];
                }
                this.orderByAsc = this.fields[0];
                console.log('fields : ', this.fields);
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
            });
    }

    handleSelected(event){
        console.log(event.detail);
    }
}
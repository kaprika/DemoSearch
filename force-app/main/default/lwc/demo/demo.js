import { LightningElement, track } from 'lwc';
import getSObjectTypeFields from '@salesforce/apex/SearchController.getSObjectTypeFields';

export default class Demo extends LightningElement {
    fields = ['Name', 'Phone', 'AccountNumber'];
    sObjectSelected = false;
    sObjectApiName;
    whereConditions = '';
    orderByAsc = 'Name';
    orderByDesc = '';
    limitCondition = 3;
    //?
    @track fieldsNames = [];

    handleSelection(event) {
        this.sObjectSelected = true;
        this.sObjectApiName = event.detail;
        //?
        /*
        getSObjectTypeFields({
            sObjectName: this.sObjectApiName
        })
            .then(result => {
                this.fields = result;
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
            });
            */
    }
}
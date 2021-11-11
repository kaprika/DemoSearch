import { LightningElement, track } from 'lwc';
import getSObjectTypeFields from '@salesforce/apex/SearchController.getSObjectTypeFields';

export default class Demo extends LightningElement {
    @track fields = ['Name'];
    searchKey = '';
    sObjectSelected = false;
    sObjectApiName;
    whereConditions = '';
    orderByAsc = 'Name';
    orderByDesc = '';
    limitCondition = 3;
    placeholder = 'Search...';
    @track fieldsNames = [];

    handleSelection(event) {
        this.sObjectSelected = true;
        this.sObjectApiName = event.detail;
        this.fieldsNames = [];
        this.searchKey = '';
        getSObjectTypeFields({
            sObjectName: this.sObjectApiName
        })
            .then(result => {
                let i = 0;
                for (const fieldName of result) {
                    i++;
                    this.fieldsNames = [... this.fieldsNames, fieldName];
                    if (i === 6) break;
                }
                console.log('fields : ', this.fieldsNames);
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
            });
    }
}
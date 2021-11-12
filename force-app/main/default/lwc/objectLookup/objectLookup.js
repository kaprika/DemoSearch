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
    @api searchKey = '';

    get showResultMessage() {
        return (this.objectList.length == 0 && this.searchKey.length > 1)
    }

    handleKeyChange(event) {
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
                        this.objectList = result;
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
}
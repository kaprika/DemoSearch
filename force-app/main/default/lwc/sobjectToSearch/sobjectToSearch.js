import { LightningElement, wire, track } from 'lwc';
import getSObjectTypes from '@salesforce/apex/SearchController.getSObjectTypes';

export default class SobjectToSearch extends LightningElement {
    objectApiName = '';
    @track sObjectTypes = [];

    @wire(getSObjectTypes, {})
    retrieveSObjectTypes({ error, data }) {
        if (data) {
            for (const sObjectName in data) {
                const option = { label: data[sObjectName], value: sObjectName };
                this.sObjectTypes = [...this.sObjectTypes, option];
            }
        }
        else if (error) {
            console.error(error);
        }
    }

    handleChange(event) {
        this.objectApiName = event.detail.value;
        const selectedEvent = new CustomEvent('selected', { detail: this.objectApiName });
        this.dispatchEvent(selectedEvent);
    }
}

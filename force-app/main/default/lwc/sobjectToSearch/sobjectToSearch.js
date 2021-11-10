import { LightningElement, wire, track } from 'lwc';
import getSObjectTypes from '@salesforce/apex/SearchController.getSObjectTypes';

export default class SobjectToSearch extends LightningElement {
    value = '';
    @track sObjectTypes = [];

    @wire(getSObjectTypes, {})
    retrieveSObjectTypes({ error, data }) {
        if (data) {
            for (const sObjectName of data) {
                const option = { label: sObjectName, value: sObjectName };
                this.sObjectTypes = [...this.sObjectTypes, option];
            }
        }
        else if (error) {
            console.error(error);
        }
    }

    handleChange(event) {
        this.value = event.detail.value;
        const selectedEvent = new CustomEvent('selected', { detail: this.value });
        this.dispatchEvent(selectedEvent);
    }
}

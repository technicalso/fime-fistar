import { Injectable, OnInit } from '@angular/core';
import { AngularCsv } from 'angular7-csv';
@Injectable()
export class SoCSVService {

    constructor() { }

    downloadCampaign(array, name, option) {
        let content = [];
        array.forEach((r) => {
            let item = {
                'Id': r['cp_id'],
                'Company': r['partner']['pc_name'],
                'Cover': r['cp_image'],
                'Name': r['cp_name'],
                'State': r['cp_state'] === 1 ? 'Approval' : r['cp_state'] === 2 ? 'Disabled' : 'New',
                'Category': r['category']['cd_label'],
                'Brand': r['cp_brand'],
                'Try Period start': r['cp_period_start'],
                'Try Period end': r['cp_period_end'],
                'Type': r['cp_type'] === 1 ? 'Paid' : 'Free'
            };
            content.push(item);
        });
        this.dowloadCSV(content, name, option);
    }

    dowloadCSV(data, name, option) {
        // tslint:disable-next-line:no-unused-expression
        new AngularCsv(data, name, option);
    }
}






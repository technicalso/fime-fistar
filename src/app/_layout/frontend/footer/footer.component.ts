import { Component, OnInit, Input } from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {SettingService} from '../../../../services/setting.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    @Input() container: string;
    public setting: any;

    constructor(private api: Restangular,
                private settingService: SettingService) { }

    ngOnInit() {
        this.setting = {};
        this.getSetting();
    }

    getSetting() {
        const self = this;
        this.settingService.getSettings().subscribe((res) => {
            const data = res;
            for (let i = 0; i < data.length; i++) {
                const key = data[i].key;
                self.setting[key] = data[i].value;
            }
        });
    }

}

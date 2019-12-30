import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { setTheme } from 'ngx-bootstrap/utils';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(public translate: TranslateService) {
        translate.setDefaultLang('vn');
        translate.use('vn');
        setTheme('bs4'); // or 'bs3'
    }

    switchLanguage(language: string) {
        this.translate.use(language);
    }
}

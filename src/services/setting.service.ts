import {Restangular} from 'ngx-restangular';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {observable, Observable, Subject} from 'rxjs';

@Injectable()
export class SettingService {

    constructor(private api: Restangular,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    getSettings() {
        return new Observable<[any]>((observer) => {
            this.api.all('settings').customGET().subscribe(res => {
                if (res.result) {
                    observer.next(res.result);
                } else {
                    observer.next(null);
                }
            });
        });
    }
}



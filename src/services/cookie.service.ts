import { PlatformService } from './platform.service';
import { Inject, Injectable } from '@angular/core';
import { CookieAttributes, getJSON, remove, set } from 'js-cookie';
import { Subject } from 'rxjs';

@Injectable()
export class CookieService {
    private readonly cookieSource = new Subject<{ readonly [key: string]: any }>();
    public readonly cookies$ = this.cookieSource.asObservable();
    @Inject('req') private req: any;

    constructor(private platformService: PlatformService) { }

    public set(name: string, value: any, options?: CookieAttributes): void {
        if (this.platformService.isBrowser) {
            set(name, value, options);
            this.updateSource();
        }
    }

    public remove(name: string, options?: CookieAttributes): void {
        if (this.platformService.isBrowser) {
            remove(name, options);
            this.updateSource();
        }
    }

    public get(name: string): any {
        if (this.platformService.isBrowser) {
            return getJSON(name);
        } else {
            try {
                return JSON.parse(this.req.cookies[name]);
            } catch (err) {
                return this.req ? this.req.cookies[name] : undefined;
            }
        }
    }

    public getAll(): any {
        if (this.platformService.isBrowser) {
            return getJSON();
        } else {
            if (this.req) { return this.req.cookies; }
        }
    }

    private updateSource() {
        this.cookieSource.next(this.getAll());
    }
}

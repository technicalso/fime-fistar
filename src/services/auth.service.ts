import {CookieService} from './cookie.service';
import {Inject, Injectable} from '@angular/core';

@Injectable()
export class AuthService {
    constructor(private cookieService: CookieService) {
    }

    public checkAuthentication(): boolean {
        const token = this.cookieService.get('X-Token');
        if (token) {
            return true;
        }
        return false;
    }
}

import { RestangularModule } from 'ngx-restangular';
import { environment } from '../environments/environment';
import { CookieService } from './cookie.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { PlatformService } from './platform.service';
import { ToastrService } from 'ngx-toastr';

export function RestangularConfigFactory(RestangularProvider, cookieService, loadingService, platformService, toastService) {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    };
    RestangularProvider
        .setBaseUrl(environment.host)
        .setDefaultHeaders(headers)
        .setErrorInterceptor(function (response) {
            if (response.status === 500) {
                toastService.error(response.data.message);
            } else if (response.status === 401) {
                //toastService.error('Unauthorized');
                cookieService.remove('X-Token');
            } else if (response.status === 400 || response.status === 404) {
                toastService.error(response.data.message);
            }
            if (platformService.isBrowser) {
                loadingService.complete();
            }
        })
        .addFullRequestInterceptor(function (element, operation, what, url, headers) {
            const userCookie = cookieService.get('X-Token');
            headers.Authorization = 'Bearer ' + userCookie;
            if (platformService.isBrowser) {
                loadingService.start();
            }
        }).addResponseInterceptor((data, operation, what, url, response) => {
            if (platformService.isBrowser) {
                loadingService.complete();
            }
            return data;
        });
}

export const Restful = RestangularModule.forRoot([CookieService, LoadingBarService, PlatformService, ToastrService],
    RestangularConfigFactory);

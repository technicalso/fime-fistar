import {Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ShareFacebookService} from '../../../../services/share-facebook.service';
import {environment} from '../../../../environments/environment';
import {CookieService} from '../../../../services/cookie.service';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
    selector: 'app-points-dialog',
    templateUrl: './points-dialog.component.html',
    styleUrls: [
        './points-dialog.component.scss',
    ]
})
export class PointsDialogComponent implements OnInit {
    public env: any;
    public points: any;
    public displayedColumns: string[] = ['accml_dt', 'code', 'accml_pntt', 'code_nm'];

    constructor(private api: Restangular,
                private cookieService: CookieService,
                public activeRoute: ActivatedRoute,
                private router: Router,
                private toast: ToastrService,
                private shareFacebookService: ShareFacebookService,
                @Inject(PLATFORM_ID) private platformId: Object,
                public bsModalRef: BsModalRef) {
    }

    ngOnInit() {
        this.env = environment;
        console.log(this.points);
    }
    close() {
        this.bsModalRef.hide();
    }
}

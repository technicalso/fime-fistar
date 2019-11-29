
import { Component, OnInit, Inject, PLATFORM_ID, TemplateRef } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';;
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare var $: any;


@Component({
    selector: 'app-admin-fistar-recommend',
    templateUrl: './recommend.component.html',
    styleUrls: [
        './recommend.component.scss'
    ]
})
export class AdminFistarCampaignRecommendComponent implements OnInit {
    public fistars: any = [];
    public message: string;
    public url: string = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Midu_-_Summer_2012_%28Explored_1_-_May_24th%29_cropped.jpg/260px-Midu_-_Summer_2012_%28Explored_1_-_May_24th%29_cropped.jpg";
    public selected = [];
    public env: any;
    public showDelete = false;
    public showDeactivate = false;
    public showActive = false;
    modalRef: BsModalRef;
    constructor(
        private api: Restangular,
        private cookieService: CookieService,
        private router: Router,
        private toast: ToastrService,
        private modalService: BsModalService

    ) {

    }

    ngOnInit() {
        this.env = environment;
        this.getFistars();

    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
        $(".modal").addClass('disable');
    }
    getFistars() {
        this.fistars = [
            {
                id: 1,
                name: "banner1",
                gender: 'male',
                age: '20',
                location: 'area2',
                url: "/data/images/upload/20190612/MGa5y3oVtg_ORIGINAL.png",
                scrap: 20,
                followers: '355K',
                fime: '300k',
                facebook: 'Son kem lì BBIA LAST VELVET LIP TINT ',
                twitter: '500k',
                youtube: '600k',
                campaign: 'matching',
                status: 'ready',
                matching: 'Apply → Partner confirm → Confirm → Matched',
            },
            {
                id: 2,
                name: "banner1",
                gender: 'male',
                age: '20',
                location: 'area2',
                url: "/data/images/upload/20190612/MGa5y3oVtg_ORIGINAL.png",
                scrap: 20,
                followers: '355K',
                fime: '300k',
                facebook: '400k',
                twitter: '500k',
                youtube: '600k',
                campaign: 'matching',
                status: 'ready',
                matching: 'Apply → Partner confirm → Confirm → Matched',
            },

            {
                id: 3,
                name: "banner1",
                gender: 'male',
                age: '20',
                location: 'area2',
                url: "/data/images/upload/20190612/MGa5y3oVtg_ORIGINAL.png",
                scrap: 20,
                followers: '355K',
                fime: '300k',
                facebook: '400k',
                twitter: '500k',
                youtube: '600k',
                campaign: 'matching',
                status: 'ready',
                matching: 'Apply → Partner confirm → Confirm → Matched',
            },
            {
                id: 4,
                name: "banner1",
                gender: 'male',
                age: '20',
                location: 'area2',
                url: "/data/images/upload/20190612/MGa5y3oVtg_ORIGINAL.png",
                scrap: 20,
                followers: '355K',
                fime: '300k',
                facebook: '400k',
                twitter: '500k',
                youtube: '600k',
                campaign: 'matching',
                status: 'ready',
                matching: 'Apply → Partner confirm → Confirm → Matched',
            },


        ];

    }

}

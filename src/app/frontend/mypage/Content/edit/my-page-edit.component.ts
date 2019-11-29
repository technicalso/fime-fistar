import {Component, Inject, Input, OnChanges, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {CookieService} from '../../../../../services/cookie.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {ShareFacebookService} from '../../../../../services/share-facebook.service';

@Component({
    selector: 'app-my-page-edit',
    templateUrl: './my-page-edit.component.html',
    styleUrls: [
        './my-page-edit.component.scss',
    ]
})

export class MyPageEditComponent implements OnInit, OnChanges {
    public env: any;
    public defaultAvatar: string;

    @Input()
    public user: any;

    public model = {
        'self_intro': '',
        'email': '',
        'cellphone': '',
        'home_addr1': '',
        'pic': '',
        'sns_id': ''
    };

    public isSaving = false;
    public isChange = false;

    public form;
    public submitted;

    constructor(private cookieService: CookieService,
                private router: Router,
                private translate: TranslateService,
                private activeRoute: ActivatedRoute,
                private api: Restangular,
                private toast: ToastrService,
                private fbService: ShareFacebookService,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit(): void {
        this.env = environment;
        this.defaultAvatar = this.env.rootHost + '/images/user.png';
        this.form = new FormGroup({
            reg_name: new FormControl({value: this.user.reg_name, disabled: true}, []),
            slug: new FormControl({value: this.user.slug, disabled: true}, []),
            home_addr1: new FormControl(this.model.home_addr1, [Validators.required]),
            email: new FormControl(this.model.email, [Validators.email, Validators.required]),
            cellphone: new FormControl(this.model.cellphone, [Validators.required]),
            pic: new FormControl(this.model.pic, []),
            self_intro: new FormControl(this.model.self_intro, [])
        });
        this.submitted = false;
    }

    ngOnChanges(changes: any) {
        if (this.user && typeof this.user !== 'undefined') {
            this.model = {
                'self_intro': this.user.self_intro,
                'email': this.user.email,
                'cellphone': this.user.cellphone,
                'home_addr1': this.user.home_addr1,
                'pic': this.user.pic,
                'sns_id': this.user.sns_id
            };
        }
    }

    fileChangeEvent(event: any): void {
        this.isChange = true;
        const files = event.target.files;
        const file = files[0];

        if (files && file) {
            const reader = new FileReader();
            reader.onload = this.handleImageResult.bind(this);
            reader.readAsDataURL(file);
        }
    }

    handleImageResult(reader) {
        this.defaultAvatar = reader.target.result;
        this.model.pic = null;
    }

    onSave() {
        console.log(this.form.valid);
        this.submitted = true;
        if (this.isSaving) {
            return;
        }
        if (this.form.valid) {
            this.isSaving = true;
            if (this.model.pic === null && this.isChange) {
                this.model.pic = this.defaultAvatar;
            }
            this.api.all('/my-page/edit').customPOST({
                user: this.model
            }).subscribe(res => {
                this.user = res.result;
                this.model = {
                    'self_intro': this.user.self_intro,
                    'email': this.user.email,
                    'cellphone': this.user.cellphone,
                    'home_addr1': this.user.home_addr1,
                    'pic': this.user.pic,
                    'sns_id': this.user.sns_id
                };
                this.toast.success('Cập nhật thành công');

                const expiredTime = new Date();
                expiredTime.setTime(expiredTime.getTime() + (36000 * 1000));
                this.cookieService.set('user', JSON.stringify(this.user), {expires: expiredTime});
                this.isSaving = false;
            });
        }
    }

    linkToFacebook() {
        this.fbService.loginWithFacebook().subscribe(userID => {
            if (userID == null) {
                return;
            }
            this.api.one('/my-page/linkFacebook').customPOST({
                token: userID
            }).subscribe(res => {
                if (res.result.error) {
                    this.toast.error('Tài khoản Facebook này đã được liên kết với một tài khoản khác. Bạn vui lòng kiểm tra lại.');
                    return;
                }
                this.model.sns_id = res.result.sns_id;
            });
        });
    }

    unlink() {
        this.api.one('/my-page/linkFacebook').customPOST({
            token: ''
        }).subscribe(res => {
            this.model.sns_id = res.result.sns_id;
        });
    }
}

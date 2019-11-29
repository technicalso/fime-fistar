import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-auth-combine',
    templateUrl: './combine-auth.component.html',
    styleUrls: ['./combine-auth.component.scss']
})

export class CombineAuthComponent implements OnInit {
    public tabIndex: number;

    constructor(private router: Router,
                private route: ActivatedRoute,
                @Inject(PLATFORM_ID) private platformId: Object) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const action = params.get('action');
            if (action === 'login') {
                this.tabIndex = 1;
            } else if (action === 'register') {
                this.tabIndex = 2;
            } else {
                this.router.navigate(['/']);
            }
        });
    }

    changeTab(index) {
        if (index === 1) {
            this.router.navigate(['/login']);
        } else if (index === 2) {
            this.router.navigate(['/register']);
        } else {
            this.router.navigate(['/']);
        }
    }

}

import {Component, OnInit} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-faqs',
    templateUrl: './faqs.component.html',
    styleUrls: [
        './faqs.component.scss',
    ]
})

export class FaqsComponent implements OnInit {
    public faqs: any;
    public categories: any;
    public currentTabCode: string;
    public loadedData: any;

    constructor(private api: Restangular,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.faqs = [];
        this.categories = [];
        this.loadedData = [];
        this.getCategories();
    }

    getCategories() {
        this.api
            .all('faq-categories')
            .customGET('')
            .subscribe(res => {
                this.categories = res.result;
                this.currentTabCode = this.categories[0].code;
                for (let i = 0; i < this.categories.length; i++) {
                    this.loadedData.push({code: this.categories[i].code, isLoaded: false, data: []});
                }
                this.getFaqs(this.currentTabCode);
            });
    }

    getFaqs(faqSeCode) {
        for (let i = 0; i < this.loadedData.length; i++) {
            if (faqSeCode === this.loadedData[i].code && this.loadedData[i].isLoaded) {
                this.faqs = this.loadedData[i].data;
                return;
            }
        }
        this.callAPI(faqSeCode);
    }

    callAPI(faqSeCode) {
        this.api
            .one('faqs/getByCategory', faqSeCode)
            .get()
            .subscribe(res => {
                this.faqs = res.result;
                for (let i = 0; i < this.loadedData.length; i++) {
                    if (faqSeCode === this.loadedData[i].code) {
                        this.loadedData[i].data = this.faqs;
                        this.loadedData[i].isLoaded = true;
                    }
                }
            });
    }

    changeTab(categoryCode) {
        this.currentTabCode = categoryCode;
        this.getFaqs(categoryCode);
    }

}

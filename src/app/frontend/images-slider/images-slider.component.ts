import {AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {trigger, style, animate, transition, state} from '@angular/animations';
import {environment} from '../../../environments/environment';
import {ReviewService} from '../../../services/review.service';
import {TryService} from '../../../services/try.service';
import {any} from 'codelyzer/util/function';
import {DOCUMENT, isPlatformBrowser, isPlatformServer} from '@angular/common';


@Component({
    selector: 'app-images-slider',
    templateUrl: './images-slider.component.html',
    styleUrls: [
        './images-slider.component.scss',
    ],
    animations: [
        trigger('fade', [
            state('in', style({'opacity': '1'})),
            state('out', style({'opacity': '0'})),
            transition('* <=> *', [
                animate(1000)
            ])
        ])
    ]
})

export class ImagesSliderComponent implements OnInit, AfterViewInit {
    public images = [];
    @Input() objectType: any;
    public resourceType: number;
    public mainImage;
    public currentImageIndex;
    public state = 'in';
    public env: any;
    public currentResourceType: number;
    public showZoom: boolean;
    public SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight', UP: 'swipeup', DOWN: 'swipedown' };
    private swipeCoord?: [number, number];
    private swipeTime?: number;

    constructor(@Inject(PLATFORM_ID) private platformId: any,
                @Inject(DOCUMENT) private document: Document,
                private reviewService: ReviewService,
                private tryService: TryService) {
    }

    ngOnInit() {
        this.env = environment;
        this.showZoom = false;
        if (this.objectType === 'review') {
            this.reviewService.reviewObser.subscribe(review => {
                this.processData(review);
            });
        } else {
            this.tryService.tryObserve.subscribe(tryData => {
                this.processData(tryData);
            });
        }
    }

    ngAfterViewInit() {
        const mainImage = document.getElementById('mainImage');
    }

    processData(data) {
        this.images = [];
        this.currentResourceType = 1;
        // For image
        if (this.objectType === 'try') {
            for (let i = 0; i < data.files.length; i++) {
                if (i === 0) {
                    if (data.files[i].stre_file_nm) {
                        this.images.push({
                            url: data.files[i].file_cours + '/' + data.files[i].stre_file_nm,
                            thumbnail: data.files[i].file_cours + '/' + data.files[i].stre_file_nm,
                            image: true
                        });
                    } else {
                        this.images.push({
                            url: data.files[i].file_cours,
                            thumbnail: data.files[i].file_cours,
                            image: true
                        });
                    }
                } else {
                    this.images.push({
                        url: data.files[i].file_cours + '/' + data.files[i].stre_file_nm,
                        thumbnail: data.files[i].file_cours + '/' + data.files[i].stre_file_nm,
                        image: true
                    });
                }
            }
        }
        if (this.objectType === 'review') {
            for (let i = 0; i < data.files.length; i++) {
                this.images.push({
                    url: data.files[i].FILE_COURS + '/' + data.files[i].STRE_FILE_NM,
                    thumbnail: data.files[i].FILE_COURS + '/' + data.files[i].STRE_FILE_NM,
                    image: true
                });
            }
        }
        this.currentImageIndex = 0;
        this.mainImage = this.images[this.currentImageIndex];
    }

    changeImage(index) {
        // this.toggleState();
        this.currentImageIndex = index;
        if (index === 0) {
            this.resourceType = this.currentResourceType;
        } else {
            this.resourceType = 1;
        }
        this.mainImage = this.images[this.currentImageIndex];
    }

    imageZoom(imgID, resultID) {
        this.showZoom = true;
        let img, lens, result, cx, cy;
        img = this.document.getElementById(imgID);
        result = this.document.getElementById(resultID);
        /*create lens:*/
        lens = this.document.createElement('DIV');
        lens.setAttribute('class', 'img-zoom-lens');
        // lens.offsetWidth = 135;
        // lens.offsetHeight = 100;
        /*insert lens:*/
        img.parentElement.insertBefore(lens, img);
        /*calculate the ratio between result DIV and lens:*/
        cx = result.offsetWidth / lens.offsetWidth;
        cy = result.offsetHeight / lens.offsetHeight;
        /*set background properties for the result DIV:*/
        result.style.backgroundImage = 'url(\'' + img.src + '\')';
        // const background_size = (img.width * cx) + 'px ' + (img.height * cy) + 'px';
        // result.setAttribute('style', 'background-size: ' + background_size);
        result.style.backgroundSize = (img.width * cx) + 'px ' + (img.height * cy) + 'px';
        const moveLens = e => {
            let pos, x, y;
            /*prevent any other actions that may occur when moving over the image:*/
            /*get the cursor's x and y positions:*/
            pos = getCursorPos(e);
            /*calculate the position of the lens:*/
            x = pos.x - (lens.offsetWidth / 2);
            y = pos.y - (lens.offsetHeight / 2);
            /*prevent the lens from being positioned outside the image:*/
            if (x > img.width - lens.offsetWidth) {
                x = img.width - lens.offsetWidth;
            }
            if (x < 0) {
                x = 0;
            }
            if (y > img.height - lens.offsetHeight) {
                y = img.height - lens.offsetHeight;
            }
            if (y < 0) {
                y = 0;
            }
            /*set the position of the lens:*/
            lens.style.left = x + 'px';
            lens.style.top = y + 'px';
            /*display what the lens "sees":*/
            result.style.backgroundPosition = '-' + (x * cx) + 'px -' + (y * cy) + 'px';
        };
        /*execute a function when someone moves the cursor over the image, or the lens:*/
        lens.addEventListener('mousemove', moveLens);
        img.addEventListener('mousemove', moveLens);
        /*and also for touch screens:*/
        lens.addEventListener('touchmove', moveLens);
        img.addEventListener('touchmove', moveLens);

        const getCursorPos = e => {
            let a, x = 0, y = 0;
            e = e || window.event;
            /*get the x and y positions of the image:*/
            a = img.getBoundingClientRect();
            /*calculate the cursor's x and y coordinates, relative to the image:*/
            x = e.pageX - a.left;
            y = e.pageY - a.top;
            /*consider any page scrolling:*/
            x = x - window.pageXOffset;
            y = y - window.pageYOffset;
            return {x: x, y: y, ratio: img.naturalWidth / a.width};
        };
    }

    hideImageZoom() {
        this.showZoom = false;
        const lens = this.document.getElementsByClassName('img-zoom-lens');
        for (let i = 0; i < lens.length; i++) {
            const element = lens[i];
            element.parentNode.removeChild(element);
        }
    }

    swipe(e: TouchEvent, when: string): void {
        const coord: [number, number] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
        const time = new Date().getTime();

        if (when === 'start') {
            this.swipeCoord = coord;
            this.swipeTime = time;
        } else if (when === 'end') {
            const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
            const duration = time - this.swipeTime;

            if (duration < 1000 //
                && Math.abs(direction[0]) > 30
                && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
                const swipe = direction[0] < 0 ? 'next' : 'previous';
                const currentIndex = this.currentImageIndex;
                if (currentIndex > this.images.length || currentIndex < 0) {
                    return;
                }

                let nextIndex = 0;
                if (swipe === 'next') {
                    const isLast = currentIndex === this.images.length - 1;
                    nextIndex = isLast ? 0 : currentIndex + 1;
                }
                if (swipe === 'previous') {
                    const isFirst = currentIndex === 0;
                    nextIndex = isFirst ? this.images.length - 1 : currentIndex - 1;
                }
                this.currentImageIndex = nextIndex;
                // toggle main image visibility
                this.mainImage = this.images[nextIndex];
            }
        }
    }
}

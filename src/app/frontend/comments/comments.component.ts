import { AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../services/cookie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ReviewService } from '../../../services/review.service';
import * as moment from 'moment';
import { TryService } from '../../../services/try.service';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: [
        './comments.component.scss',
    ]
})

export class CommentsComponent implements OnInit, AfterViewInit {
    private objectId: number;
    @Input() objectType: string;
    @Output() changeCommentCount = new EventEmitter<number>();
    public commentForm: FormGroup;
    public comment: string;
    public listComments: [any];
    public page = 0;
    public user: any;
    public env: any;
    public numberComments = 0;
    public loadMore: boolean;
    public isSaving = false;
    public review;

    constructor(private api: Restangular,
        private cookieService: CookieService,
        private reviewService: ReviewService,
        private tryService: TryService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: Document) {
    }

    ngOnInit(): void {
        this.env = environment;
        this.commentForm = new FormGroup({
            comment: new FormControl(this.comment, Validators.required)
        });
        this.user = this.cookieService.get('user');
        if (!this.user) {
            this.user = {
                pic: null,
                name: ''
            };
        }
        if (this.objectType === 'review') {
            this.getListCommentsOfReview();
        } else {
            this.getListCommentsOfTry();
        }
    }

    get form() {
        return this.commentForm;
    }

    // Dev code
    times(n: number): any[] {
        return Array(n);
    }

    scrollToElement($element): void {
        $element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }

    showReply(id): void {
        const dom: HTMLElement = this.document.getElementById('replyForm' + id);
        this.renderer.setStyle(dom, 'display', 'block');
    }

    postComment() {
        if (this.isSaving) {
            return;
        }
        this.isSaving = true;
        const review_url = this.router.url;
        const user = this.cookieService.get('user');
        let data: any;
        if (this.objectType === 'review') {
            data = {
                object_id: this.objectId,
                object_type: this.objectType,
                content: this.comment,
                review_url: review_url,
                author_id: this.review.created_by,
                user_name: user.name,
                is_reply: false
            };
        } else {
            data = {
                object_id: this.objectId,
                object_type: this.objectType,
                content: this.comment
            };
        }
        this.api.all('comments/create').customPOST(data).subscribe(res => {
            if (res.result) {
                const newComment = this.formatCreatedTime([res.result])[0];
                newComment.author = this.user.id ? this.user.id : this.user.reg_name;
                newComment.author_avatar = this.user.pic;
                newComment.author_slug = this.user.slug;
                newComment.replies = [];
                this.listComments.splice(0, 0, newComment);
                this.comment = '';
                this.numberComments = this.numberComments + 1;
                this.isSaving = false;
                this.changeCommentCount.emit(this.numberComments);
            }
        });
    }

    getListCommentsOfReview() {
        this.reviewService.reviewObser.subscribe(review => {
            this.objectId = review.review_no;
            this.review = review;
            this.numberComments = review.comment_number;
            const data = { object_id: this.objectId, object_type: this.objectType, page: this.page };
            this.api.all('comments/list').customGET('', data).subscribe(res => {
                if (res.result) {
                    this.listComments = res.result.comments;
                    this.listComments = this.formatCreatedTime(this.listComments);
                    for (let i = 0; i < this.listComments.length; i++) {
                        this.listComments[i].replies = this.formatCreatedTime(this.listComments[i].replies);
                        this.listComments[i].page = 0;
                    }
                    this.loadMore = res.result.count > 0;
                }
            });
        });
    }

    getListCommentsOfTry() {
        this.tryService.tryObserve.subscribe(tryData => {
            this.objectId = tryData.cntnts_no;
            this.numberComments = tryData.comments;
            const data = { object_id: this.objectId, object_type: this.objectType, page: this.page };
            this.api.all('comments/list').customGET('', data).subscribe(res => {
                if (res.result) {
                    this.listComments = res.result.comments;
                    this.listComments = this.formatCreatedTime(this.listComments);
                    for (let i = 0; i < this.listComments.length; i++) {
                        this.listComments[i].replies = this.formatCreatedTime(this.listComments[i].replies);
                        this.listComments[i].page = 0;
                    }
                    this.loadMore = res.result.count > 0;
                }
            });
        });
    }

    loadMoreComment() {
        this.page = this.page + 1;
        const length = this.listComments.length;
        const data = { object_id: this.objectId, object_type: this.objectType, page: this.page, last_id: this.listComments[length - 1].id};
        this.api.all('comments/list').customGET('', data).subscribe(res => {
            if (res.result) {
                res.result.comments = this.formatCreatedTime(res.result.comments);
                for (let i = 0; i < res.result.comments.length; i++) {
                    res.result.comments[i].replies = this.formatCreatedTime(res.result.comments[i].replies);
                    this.listComments.push(res.result.comments[i]);
                }
                this.loadMore = res.result.count > 0;
            }
        });
    }

    loadMoreReply(comment_id, index) {
        this.listComments[index].page = this.listComments[index].page + 1;
        const length = this.listComments[index].replies.length;
        const data = { object_id: this.objectId, object_type: this.objectType, page: this.listComments[index].page,
            parent_id: comment_id , last_id: this.listComments[index].replies[length - 1].id};
        this.api.all('comments/list').customGET('', data).subscribe(res => {
            if (res.result) {
                res.result.comments = this.formatCreatedTime(res.result.comments);
                for (let i = 0; i < res.result.comments.length; i++) {
                    this.listComments[index].replies.push(res.result.comments[i]);
                }
                this.listComments[index].count = res.result.count;
            }
        });
    }

    processReply() {
        const listReply = [];
        for (let i = this.listComments.length - 1; i >= 0; i--) {
            if (this.listComments[i].parent_id) {
                listReply.push(this.listComments.splice(i, 1)[0]);
            }
        }
        if (listReply.length > 0) {
            for (let i = this.listComments.length - 1; i >= 0; i--) {
                this.listComments[i].replies = [];
                for (let j = 0; j < listReply.length; j++) {
                    if (listReply[j].parent_id === this.listComments[i].id) {
                        this.listComments[i].replies.push(listReply[j]);
                    }
                }
            }
        }
    }

    formatCreatedTime(comments) {
        for (let i = 0; i < comments.length; i++) {
            const now = moment();
            const created_time = moment(comments[i].created_at);
            const duration = moment.duration(now.diff(created_time));
            if (duration.years() > 0) {
                comments[i].time = duration.years();
                comments[i].timeUnit = 'year';
            } else if (duration.months() > 0) {
                comments[i].time = duration.months();
                comments[i].timeUnit = 'month';
            } else if (duration.days() > 0) {
                comments[i].time = duration.days();
                comments[i].timeUnit = 'day';
            } else if (duration.hours() > 0) {
                comments[i].time = duration.hours();
                comments[i].timeUnit = 'hour';
            } else if (duration.minutes() > 0) {
                comments[i].time = duration.minutes();
                comments[i].timeUnit = 'minute';
            } else {
                comments[i].time = duration.seconds();
                comments[i].timeUnit = 'second';
            }
        }
        return comments;
    }

    ngAfterViewInit(): void {
    }

    showReplyOfAnother(id, author_name, author_ds, author_slug, author_id) {
        author_name = author_ds ? author_ds : author_name;
        const form: HTMLElement = this.document.getElementById('replyForm' + id);
        this.renderer.setStyle(form, 'display', 'block');
        (<HTMLElement>form.children[2].children[0]).innerText = author_name;
        (<HTMLElement>form.children[2]).setAttribute('style', 'display: inline-block');
        const offset = (<HTMLElement>form.children[2]).offsetWidth + 18;
        (<HTMLElement>form.children[0]).setAttribute('style', 'padding-left:' + offset + 'px;');
        (<HTMLElement>form.children[3]).setAttribute('data-slug', author_slug);
        (<HTMLElement>form.children[3]).setAttribute('data-id', author_id);
    }

    postReply(id, parent_id) {
        if (this.isSaving) {
            return;
        }
        this.isSaving = true;
        const form: HTMLElement = this.document.getElementById('replyForm' + id);
        let replyContent = (<HTMLInputElement>form.children[0]).value;
        const is_reference = (<HTMLElement>form.children[2]).style.display === 'inline-block';
        let data: any;

        if (replyContent) {
            if (is_reference) {
                const author_slug = (<HTMLElement>form.children[3]).getAttribute('data-slug');
                const author = (<HTMLElement>form.children[2].children[0]).innerText;
                replyContent = '<a href="/usr/' + author_slug + '">' + author + '</a> ' + replyContent;
                data = {
                    object_id: this.objectId,
                    object_type: this.objectType,
                    content: replyContent,
                    parent_id: parent_id,
                    is_reply: true
                };
            } else {
                data = {
                    object_id: this.objectId,
                    object_type: this.objectType,
                    content: replyContent,
                    parent_id: parent_id,
                    is_reply: true
                };
            }
            this.api.all('comments/create').customPOST(data).subscribe(res => {
                if (res.result) {
                    const newReply = this.formatCreatedTime([res.result])[0];
                    newReply.author = this.user.id ? this.user.id : this.user.reg_name;
                    newReply.author_avatar = this.user.pic;
                    for (let i = this.listComments.length - 1; i >= 0; i--) {
                        if (newReply.parent_id === this.listComments[i].id) {
                            this.listComments[i].replies.splice(0, 0, newReply);
                            this.numberComments = this.numberComments + 1;
                            (<HTMLInputElement>form.children[0]).value = '';
                            (<HTMLElement>form.children[0]).setAttribute('style', 'padding-left: 15px;');
                            (<HTMLElement>form.children[2]).setAttribute('style', 'display: none');
                            this.isSaving = false;
                            this.changeCommentCount.emit(this.numberComments);
                        }
                    }
                }
            });
        }
    }

    remove(event, id) {
        (<HTMLElement>(<MouseEvent>event).target).offsetParent.setAttribute('style', 'display: none');
        const form: HTMLElement = this.document.getElementById('replyForm' + id);
        (<HTMLElement>form.children[0]).setAttribute('style', 'padding-left: 15px;');
    }

    deleteComment(id, objectType, index) {
        this.api.all('comments/delete').customPOST({id: id, type: objectType}).subscribe(res => {
            if (res.result) {
                this.listComments.splice(index, 1);
                this.numberComments = res.result.comment_number;
                this.changeCommentCount.emit(this.numberComments);
            }
        });
    }

    deleteReply(id, objectType, commentIndex, replyIndex) {
        this.api.all('comments/delete').customPOST({id: id, type: objectType}).subscribe(res => {
            if (res.result) {
                this.listComments[commentIndex].replies.splice(replyIndex, 1);
                this.numberComments = res.result.comment_number;
                this.changeCommentCount.emit(this.numberComments);
            }
        });
    }
}

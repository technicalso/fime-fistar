import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material';
import { GoogleChartsModule } from 'angular-google-charts';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { CookieService } from '../services/cookie.service';
import { Restful } from '../services/api.service';
import { Routing } from './app.admin.route';
import { PlatformService } from '../services/platform.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Third party */
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { ToastrModule } from 'ngx-toastr';
import {
    BsDropdownModule,
    CollapseModule,
    TypeaheadModule,
    BsDatepickerModule,
    RatingModule,
    CarouselModule,
    PaginationModule,
    PaginationConfig,
    ModalModule,
    TabsModule,
    ProgressbarModule,
    TooltipModule,
    AccordionModule
} from 'ngx-bootstrap';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { CKEditorModule } from 'ngx-ckeditor';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
import { NgxMasonryModule } from 'ngx-masonry';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FileUploadModule } from 'ng2-file-upload';

/* Component */
import { HeaderComponent } from './_layout/frontend/header/header.component';
import { AdminHeaderComponent } from './_layout/admin/admin-header/admin-header.component';
import { FooterComponent } from './_layout/frontend/footer/footer.component';
import { AdminLayoutComponent } from './_layout/admin/admin-layout/admin-layout.component';
import { SiteLayoutComponent } from './_layout/frontend/site-layout/site-layout.component';
import { AuthLayoutComponent } from './_layout/admin/auth-layout/auth-layout.component';
import { HomeComponent } from './frontend/home/home.component';
import { AdminTryComponent } from './admin/try/try.component';
import { AdminTryDetailsComponent } from './admin/try-details/try-details.component';
import { RegisterComponent } from './common/auth/register/register.component';
import { LoginComponent } from './common/auth/login/login.component';
import { ForgotPasswordComponent } from './common/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './common/auth/reset-password/reset-password.component';
import { AdminBannerComponent } from './admin/banner/banner.component';
import { AdminBannerDetailsComponent } from './admin/banner-details/banner-details.component';
import { AuthService } from '../services/auth.service';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { MaterialModule } from './material-module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AdminAdsComponent } from './admin/ad/ad.component';

import { AdminCategoryComponent } from './admin/category/category.component';
import { AdminCategoryDialogComponent } from './admin/category-dialog/category-dialog.component';
import { AdminAdDetailsComponent } from './admin/ad-details/ad-details.component';
import { AdminSidebarComponent } from './_layout/admin/admin-sidebar/sidebar.component';
import { AdminTopnavComponent } from './_layout/admin/admin-topnav/topnav.component';

import { AdminBlogComponent } from './admin/blog/blog.component';
import { AdminBlogDetailsComponent } from './admin/blog-details/blog-details.component';
import { AdminReviewComponent } from './admin/review/review.component';
import { AdminReviewDetailsComponent } from './admin/review-detail/review-details.component';
import { AdminBrandComponent } from './admin/brand/brand.component';
import { AdminBrandDialogComponent } from './admin/brand-dialog/brand-dialog.component';
import { AdminCommentComponent } from './admin/comment/comment.component';
import { AdminCommentDetailsComponent } from './admin/comment-detail/comment-details.component';
import { AdminResourceComponent } from './admin/resource/resource.component';
import { AdminFaqComponent } from './admin/faq/faq.component';
import { AdminFaqDetailsComponent } from './admin/faq-detail/faq-details.component';
import { AdminReviewFimerComponent } from './admin/review-fimer/review-fimer.component';
import { AdminUserDetailComponent } from './admin/user-management/user-detail.component';
import { SafePipe } from '../pipes/transform-url.pipe';
import { AdminResourceDialogImageCropComponent } from './admin/multiple-images/dialog-image-crop.component';
import { NumberToCurrencyPipe } from '../pipes/number-to-currency.pipe';
import { NumberLikePipe } from '../pipes/number-like.pipe';
import { AdminMultipleImagesComponent } from './admin/multiple-images/multiple-images.component';
import { ReviewsComponent } from './frontend/reviews/reviews.component';
import { FimersComponent } from './frontend/fimers/fimers.component';
import { TriesComponent } from './frontend/tries/tries.component';
import { TryDialogComponent } from './frontend/try-dialog/try-dialog.component';
import { ReviewDetailComponent } from './frontend/review-detail/review-detail.component';
import { ImagesSliderComponent } from './frontend/images-slider/images-slider.component';
import { TryDetailsComponent } from './frontend/try-detail/try-detail.component';
import { SafeHtmlPipe } from '../pipes/safe-html';
import { CommentsComponent } from './frontend/comments/comments.component';
import { ReviewService } from '../services/review.service';
import { MyPageComponent } from './frontend/mypage/my-page.component';
import { MyPageReviewsComponent } from './frontend/mypage/Content/reviews/my-page-reviews.component';
import { MyPageHeaderComponent } from './frontend/mypage/header/my-page-header.component';
import { AuthDirective } from './directives/auth.directive';
import { TryService } from '../services/try.service';
import { ReviewCreateComponent } from './frontend/review-create/review-create.component';
import { AdminMultipleImagesCustomComponent } from './admin/multiple-images/multiple-images-custom.component';
import { AdminTryWinnerComponent } from './admin/try-winner/try-winner.component';
import { MyPageFollowComponent } from './frontend/mypage/Content/follow/my-page-follow.component';
import { NotificationComponent } from './frontend/notification/notification.component';
import { MyPageTriesComponent } from './frontend/mypage/Content/tries/my-page-tries.component';
import { MyPageEditComponent } from './frontend/mypage/Content/edit/my-page-edit.component';
import { ShareFacebookService } from '../services/share-facebook.service';
import { AdminNotificationComponent } from './admin/notification/notification.component';
import { AdminNotificationDetailComponent } from './admin/notification-detail/notification-detail.component';
import { NotificationService } from '../services/notification.service';
import { TipsComponent } from './frontend/tips/tips.component';
import { TipDetailComponent } from './frontend/tip-detail/tip-detail.component';
import { CombineAuthComponent } from './common/auth/combine-auth/combine-auth.component';
import { AdminFaqCategoryComponent } from './admin/faq-category/faq-category.component';
import { AdminFAQCategoryDialogComponent } from './admin/faq-category-dialog/faq-category-dialog.component';
import { FaqsComponent } from './frontend/faqs/faqs.component';
import { AdminSettingComponent } from './admin/setting/setting.component';
import { SearchPageComponent } from './frontend/search/search-page.component';
import { SearchPageHeaderComponent } from './frontend/search/header/search-page-header.component';
import { SearchPageReviewsComponent } from './frontend/search/reviews/search-page-reviews.component';
import { SearchPageTriesComponent } from './frontend/search/tries/search-page-tries.component';
import { SearchPageFimerComponent } from './frontend/search/fimers/search-page-fimer.component';
import { SettingService } from '../services/setting.service';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { UsersLikeDialogComponent } from './frontend/users-like-dialog/users-like-dialog.component';
import { AdminDeliveryDialogComponent } from './admin/delivery-dialog/delivery-dialog.component';
import { AdminTryEventComponent } from './admin/try-event/try-event.component';
import { AdminTryEventDetailsComponent } from './admin/try-event-details/try-event-details.component';
import { AdminLoginComponent } from './admin/auth/admin-auth.component';
import { AdminForgotPasswordComponent } from './admin/auth/fogot/admin-auth-forgot.component';
import { AdminProfileComponent } from './admin/profile/profile.component';
import { AdminUpdatePasswordComponent } from './admin/profile/update-password.component';
import { BlogsComponent } from './frontend/blogs/blogs.component';
import { BlogDetailComponent } from './frontend/blog-detail/blog-detail.component';
import { DeliveryDialogComponent } from './frontend/delivery-dialog/delivery-dialog.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { PointsDialogComponent } from './admin/user-management/points-dialog/points-dialog.component';
import { GuideUploadDialogComponent } from './frontend/guide-upload-dialog/guide-upload-dialog.component';
import { PrivacyPolicyComponent } from './frontend/privacy-policy/privacy-policy.component';
import { ServiceTermComponent } from './frontend/service-term/service-term.component';

//softone dev
import { AdminBannerFistarComponent } from './admin/softone/banner-fistar/banner-slider.component';
import { AdminBannerFistarDetailsComponent } from './admin/softone/banner-fistar-details/banner-fistar-details.component';
import { AdminFistarComponent } from './admin/softone/fistar/fistar.component';
import { AdminFistarAddComponent} from "./admin/softone/fistar/fistar-add/fistar-add.component";
import { AdminFistarBasicComponent } from './admin/softone/fistar/basic-infomation/basic.component';
import { AdminFistarInformationComponent } from './admin/softone/fistar/fistar-infomation/fistar-info.component';
import { AdminFistarSNS } from './admin/softone/fistar/sns-channel/sns.component';
import { AdminFistarCampaignHistoryComponent } from './admin/softone/fistar/campaign-history/campaign-history.component';
import { AvatarModule } from 'ngx-avatar';
import { AdminFistarCampaignRecommendComponent } from './admin/softone/fistar/campaign-recommend/recommend.component';
import { AdminPartnerComponent } from './admin/softone/partner/partner.component';


import { AdminPartnerManagerComponent } from './admin/softone/partner/manager/manager.component';
import { AdminFartnerInformationComponent } from './admin/softone/partner/infomation/information.component';
import { AdminPartnerAddComponent} from './admin/softone/partner/add/partner-add.component';
import { AdminPartnerCampaignHistoryComponent } from './admin/softone/partner/history/history.component';
import { AdminCampaignComponent } from './admin/softone/campaign/home/campaign.component';
import { AdminCampaignEditComponent } from './admin/softone/campaign/campaign-edit/campaign-edit.component';
import { AdminCampaignMatchingStatusComponent } from './admin/softone/campaign/matching-fistar/matching-fistar.component';
import { AdminCampaignReviewComponent } from './admin/softone/campaign/review/review.component';
import { AdminCampaignReviewDetailComponent } from './admin/softone/campaign/review/details/review-detail.component';
import { AdminCampaignInformationComponent } from './admin/softone/campaign/review/information/information.component';
import { AdminCampaignReportComponent } from './admin/softone/campaign/report/report.component';
import { AdminCampaignPaymentComponent } from './admin/softone/campaign/payment/payment.component';
import { AdminCampaignPaymentManagerComponent } from './admin/softone/campaign/payment/manager/manager.component';
import { AdminCampaignPaymentFistarInformationComponent } from './admin/softone/campaign/payment/fistar-information/fistar-information.component';
import { AdminCustomerFQIComponent } from './admin/softone/customer/fqi.component';
import { AdminCustomerAddFQIComponent } from './admin/softone/customer/add-fiq/add-fiq.component';
import { AdminCustomerQAComponent } from './admin/softone/customer/q-and-a/q-and-a.component';
import { AdminCustomerAddQAComponent } from './admin/softone/customer/q-and-a/add-qa/add-qa.component';
import { AdminCustomerNotificationComponent } from './admin/softone/customer/notification/notification.component';
import { AdminCustomerAddNotificationComponent } from './admin/softone/customer/notification/add-notification/add-notification.component';

import { AdminSystemCodeComponent } from './admin/softone/system/code.component';
import { AdminSystemSNSComponent } from './admin/softone/system/sns/sns.component';
import { AdminSystemSNSDetailComponent } from './admin/softone/system/sns/sns-detail/sns-detail.component';
import { AdminSystemAccountComponent } from './admin/softone/system/account/account.component';
import { AdminSystemAccountAccessComponent } from './admin/softone/system/account/access/access.component';
import { AdminSystemLanguageComponent } from './admin/softone/system/language/language.component';
import { AppChartComponent } from './admin/softone/chart/chart.component';
import { BannerService } from './admin/softone/service/banner/banner.service';
import { RequestFistarService } from './admin/softone/service/request/fistar/fistar.service';
import { AdminRequestFistarComponent } from './admin/softone/request/fistar/fistar.component';
import { AdminRequestFistarBasicComponent } from './admin/softone/request/fistar/basic/basic.component';
import { AdminRequestFartnerComponent } from './admin/softone/request/partner/partner.component';
import { AdminRequestPartnerBasicComponent } from './admin/softone/request/partner/basic/basic.component';
import { RequestPartnerService } from './admin/softone/service/request/partner/partner.service';
import { FistarService } from './admin/softone/service/fistar/fistar.service';
import { AdminCampaignListPaymentComponent } from './admin/softone/campaign/list-payment/list-payment.component';
import { AdminCampaignTabComponent } from './admin/softone/campaign/tab.component';
import { PagerService } from './admin/shared/service/pager.service';
import { HttpClientAdminService } from './admin/shared/service/httpclient.service';
import { DataTableComponent } from './admin/shared/data-table/data-table.component';
import { CSVService } from './admin/shared/service/csv.service';
import { SoCSVService } from './admin/softone/service/csv/csv.service';
import { PartnerService } from './admin/softone/service/partner/partner.service';
import {SettingServiceSoftone} from './admin/softone/service/system/setting.service'
import {ImageAIService} from './admin/softone/service/image-ai/image-ai.service'
import { ReviewPaymentComponent } from './admin/softone/campaign/review/review-payment/review-payment.component';
import { PaymentInfoComponent } from './admin/softone/campaign/review/payment-info/payment-info.component';
import { AdminPartnerRecommendComponent } from './admin/softone/partner/Recommend/recommend.component';
import { AdminFistarRecommendComponent } from './admin/softone/fistar/Recommend/recommend.component';
import { CommonService } from './admin/softone/service/common.service';
import { CampaignService } from './admin/softone/service/campaign/campaign.service';
import { PartnerTabComponent } from './admin/softone/partner/tab/tab.component';
import { FistarTabComponent } from './admin/softone/fistar/tab/tab.component';
import { AddAccountComponent } from './admin/softone/system/account/add-account/add-account.component';
import { AccountService } from './admin/softone/service/system/account.service';
import {SoftoneResourceComponent} from "./admin/softone/resource/resource.component";
import { CampaignAddComponent } from './admin/softone/campaign/campaign-add/campaign-add.component';
import { LoadingPageComponent } from './loading-page/loading-page.component';
import { AdminCampaignInformationAddComponent } from './admin/softone/campaign/review/information-add/information-add.component';
import { AdminCampaignReviewDmncComponent } from './admin/softone/campaign/review/admin-detail/review-admin.component';
import { AdminImagesAIComponent } from './admin/softone/images-ai/images-ai.component';
import { AdminSystemSettingComponent } from './admin/softone/system/setting/setting.component';
import { AdminCampaignSearchFistarComponent } from './admin/softone/campaign/campaign-add/search-fistar/search-fistar.component';
import { CurrencyMaskModule } from "ng2-currency-mask";

import {AdminMultipleImagesSoftOneComponent} from "./admin/softone/multiple-images/multiple-images-softone.component.component";

import {AdminResourceDialogImageCropSoftOneComponent} from "./admin/softone/multiple-images/dialog-image-crop-softone.component";
//-----------------end softone dev------------------------------



export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SiteLayoutComponent,
        AuthLayoutComponent,
        AdminLayoutComponent,
        HeaderComponent,
        FooterComponent,
        AdminHeaderComponent,
        AdminTryComponent,
        AdminTryDetailsComponent,
        AdminAdDetailsComponent,
        RegisterComponent,
        AdminBannerComponent,
        AdminBannerDetailsComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        UserManagementComponent,
        AdminAdsComponent,
        AdminCategoryComponent,
        AdminCategoryDialogComponent,
        AdminBlogComponent,
        AdminBlogDetailsComponent,
        AdminSidebarComponent,
        AdminTopnavComponent,
        AdminReviewComponent,
        AdminReviewDetailsComponent,
        AdminTopnavComponent,
        AdminBrandComponent,
        AdminBrandDialogComponent,
        AdminDeliveryDialogComponent,
        DeliveryDialogComponent,
        AdminResourceComponent,
        AdminFaqComponent,
        AdminFaqDetailsComponent,
        AdminCommentComponent,
        AdminCommentDetailsComponent,
        AdminUserDetailComponent,
        SafePipe,
        AdminResourceDialogImageCropComponent,
        NumberToCurrencyPipe,
        NumberLikePipe,
        SafeHtmlPipe,
        AdminReviewFimerComponent,
        AdminMultipleImagesComponent,
        FimersComponent,
        ReviewsComponent,
        TriesComponent,
        TryDialogComponent,
        ReviewDetailComponent,
        ImagesSliderComponent,
        TryDetailsComponent,
        MyPageComponent,
        MyPageHeaderComponent,
        MyPageReviewsComponent,
        ImagesSliderComponent,
        CommentsComponent,
        AuthDirective,
        ClickOutsideDirective,
        ReviewCreateComponent,
        AdminMultipleImagesCustomComponent,
        AdminTryWinnerComponent,
        MyPageFollowComponent,
        MyPageTriesComponent,
        MyPageEditComponent,
        NotificationComponent,
        AdminNotificationComponent,
        AdminNotificationDetailComponent,
        TipsComponent,
        TipDetailComponent,
        CombineAuthComponent,
        AdminFaqCategoryComponent,
        AdminFAQCategoryDialogComponent,
        FaqsComponent,
        AdminSettingComponent,
        SearchPageComponent,
        SearchPageHeaderComponent,
        SearchPageReviewsComponent,
        SearchPageTriesComponent,
        SearchPageFimerComponent,
        UsersLikeDialogComponent,
        AdminTryEventComponent,
        AdminTryEventDetailsComponent,
        AdminLoginComponent,
        AdminForgotPasswordComponent,
        AdminProfileComponent,
        AdminUpdatePasswordComponent,
        BlogsComponent,
        BlogDetailComponent,
        PointsDialogComponent,
        GuideUploadDialogComponent,
        PrivacyPolicyComponent,
        ServiceTermComponent,


        //soft0ne dev
        AdminBannerFistarComponent,
        AdminBannerFistarDetailsComponent,
        AdminFistarComponent,
        AdminFistarAddComponent,
        AdminFistarBasicComponent,
        AdminFistarInformationComponent,
        AdminFistarSNS,
        AdminFistarCampaignHistoryComponent,
        AdminFistarCampaignRecommendComponent,
        AdminPartnerComponent,
        AdminPartnerManagerComponent,
        AdminFartnerInformationComponent,
        AdminPartnerCampaignHistoryComponent,
        AdminCampaignComponent,
        AdminCampaignEditComponent,
        AdminCampaignMatchingStatusComponent,
        AdminCampaignReviewComponent,
        AdminCampaignReviewDetailComponent,
        AdminCampaignInformationComponent,
        AdminCampaignReportComponent,
        AdminCampaignPaymentComponent,
        AdminCampaignPaymentManagerComponent,
        AdminCampaignPaymentFistarInformationComponent,
        AdminCustomerFQIComponent,
        AdminCustomerAddFQIComponent,
        AdminCustomerQAComponent,
        AdminCustomerAddQAComponent,
        AdminCustomerNotificationComponent,
        AdminCustomerAddNotificationComponent,
        AdminSystemCodeComponent,
        AdminSystemSNSComponent,
        AdminSystemSNSDetailComponent,
        AdminSystemAccountComponent,
        AdminSystemAccountAccessComponent,
        AdminSystemLanguageComponent,
        AppChartComponent,
        AdminRequestFistarComponent,
        AdminRequestFistarBasicComponent,
        AdminRequestFartnerComponent,
        AdminRequestPartnerBasicComponent,
        AdminCampaignListPaymentComponent,
        AdminCampaignTabComponent,
        DataTableComponent,
        ReviewPaymentComponent,
        PaymentInfoComponent,
        ReviewPaymentComponent,
        AdminPartnerRecommendComponent,
        AdminFistarRecommendComponent,
        PartnerTabComponent,
        FistarTabComponent,
        AddAccountComponent,
        SoftoneResourceComponent,
        CampaignAddComponent,
        LoadingPageComponent,
        AdminPartnerAddComponent,
        AdminCampaignInformationAddComponent,
        AdminImagesAIComponent,
        AdminSystemSettingComponent,
        AdminCampaignSearchFistarComponent,
        AdminCampaignReviewDmncComponent,
        AdminMultipleImagesSoftOneComponent,
        AdminResourceDialogImageCropSoftOneComponent
        //end softone dev



    ],
    imports: [
        GoogleChartsModule.forRoot(),
        BrowserModule.withServerTransition({ appId: 'my-app' }),
        BrowserTransferStateModule,
        AvatarModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        TransferHttpCacheModule,
        Restful,
        Routing,
        LoadingBarHttpModule,
        LoadingBarHttpClientModule,
        LoadingBarRouterModule,
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        CarouselModule.forRoot(),
        CollapseModule.forRoot(),
        TypeaheadModule.forRoot(),
        TooltipModule.forRoot(),
        RatingModule.forRoot(),
        ToastrModule.forRoot(),
        PaginationModule.forRoot(),
        AccordionModule.forRoot(),
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        ProgressbarModule.forRoot(),
        AngularFontAwesomeModule,
        ReactiveFormsModule,
        FormsModule,
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn-hero btn-danger',
            cancelButtonClass: 'btn-hero btn-cancel'
        }),
        UiSwitchModule,
        NgxDatatableModule,
        NgSelectModule,
        CKEditorModule,
        NgxDatatableModule,
        NgSelectModule,
        BrowserAnimationsModule,
        MatNativeDateModule,
        MaterialModule,
        ImageCropperModule,
        MatMomentDatetimeModule,
        MatDatetimepickerModule,
        FileUploadModule,
        NgxMasonryModule,
        InfiniteScrollModule,
        BrowserModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        //softone dev
        CurrencyMaskModule,
        //end

    ],
    exports: [
        AuthDirective,
        ClickOutsideDirective,
    ],
    providers: [
        // softone dev
        FistarService,
        RequestPartnerService,
        RequestFistarService,
        BannerService,
        SettingServiceSoftone,
        ImageAIService,
        CommonService,
        SoCSVService,
        CampaignService,
        PartnerService,
        //end softone dev
        CookieService,
        PlatformService,
        {
            provide: 'req',
            useValue: null
        },
        AuthService,
        ReviewService,
        TryService,
        ShareFacebookService,
        NotificationService,
        SettingService,
        PagerService,
        HttpClientAdminService,
        CSVService,
        AccountService,
    ],
    entryComponents: [
        AdminCategoryDialogComponent,
        AdminBrandDialogComponent,
        AdminDeliveryDialogComponent,
        DeliveryDialogComponent,
        AdminResourceDialogImageCropComponent,
        TryDialogComponent,
        AdminFAQCategoryDialogComponent,
        UsersLikeDialogComponent,
        PointsDialogComponent,
        GuideUploadDialogComponent,
        AdminResourceDialogImageCropSoftOneComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

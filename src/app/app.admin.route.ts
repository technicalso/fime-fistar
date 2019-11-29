import {Routes, RouterModule} from '@angular/router';

import {AdminLayoutComponent} from './_layout/admin/admin-layout/admin-layout.component';
import {AdminTryComponent} from './admin/try/try.component';
import {AdminTryDetailsComponent} from './admin/try-details/try-details.component';
import {AdminBannerComponent} from './admin/banner/banner.component';
import {AdminBlogComponent} from './admin/blog/blog.component';
import {AdminBlogDetailsComponent} from './admin/blog-details/blog-details.component';
import {AdminBannerDetailsComponent} from './admin/banner-details/banner-details.component';
import {UserManagementComponent} from './admin/user-management/user-management.component';
import {AdminCategoryComponent} from './admin/category/category.component';
import {AdminAdsComponent} from './admin/ad/ad.component';
import {AdminAdDetailsComponent} from './admin/ad-details/ad-details.component';
import {AdminReviewComponent} from './admin/review/review.component';
import {AdminReviewDetailsComponent} from './admin/review-detail/review-details.component';
import {AdminBrandComponent} from './admin/brand/brand.component';
import {AdminFaqComponent} from './admin/faq/faq.component';
import {AdminFaqDetailsComponent} from './admin/faq-detail/faq-details.component';
import {AdminCommentComponent} from './admin/comment/comment.component';
import {AdminCommentDetailsComponent} from './admin/comment-detail/comment-details.component';
import {AdminUserDetailComponent} from './admin/user-management/user-detail.component';
import {AdminReviewFimerComponent} from './admin/review-fimer/review-fimer.component';
import {AdminTryWinnerComponent} from './admin/try-winner/try-winner.component';
import {AdminNotificationComponent} from './admin/notification/notification.component';
import {AdminNotificationDetailComponent} from './admin/notification-detail/notification-detail.component';
import {AdminFaqCategoryComponent} from './admin/faq-category/faq-category.component';
import {AdminSettingComponent} from './admin/setting/setting.component';
import {AdminTryEventComponent} from './admin/try-event/try-event.component';
import {AdminTryEventDetailsComponent} from './admin/try-event-details/try-event-details.component';
import {AdminLoginComponent} from './admin/auth/admin-auth.component';
import {AdminForgotPasswordComponent} from './admin/auth/fogot/admin-auth-forgot.component';
import {AdminProfileComponent} from './admin/profile/profile.component';
import {AdminUpdatePasswordComponent} from './admin/profile/update-password.component';
import { AdminHashtagComponent } from './admin/hashtag/hashtag.component'
import { AdminTryEndComponent } from './admin/try-end/try-end.component';
import { AdminDeliveryComponent } from './admin/delivery/delivery.component';
import { AdminHotFimerComponent } from './admin/hot-fimer/hot-fimer.component';
import { AdminReviewEditComponent } from './admin/review-edit/review-edit.component';
//-----------------------------------softone dev-------------------------------------------------------
import { AdminBannerFistarComponent } from './admin/softone/banner-fistar/banner-fistar.component';
import { AdminBannerFistarDetailsComponent } from './admin/softone/banner-fistar-details/banner-fistar-details.component';
import { AdminRequestFistarComponent } from './admin/softone/request/fistar/fistar.component';
import { AdminRequestFistarBasicComponent } from './admin/softone/request/fistar/basic/basic.component';
import { AdminRequestFartnerComponent } from './admin/softone/request/partner/partner.component';
import { AdminRequestPartnerBasicComponent } from './admin/softone/request/partner/basic/basic.component';
import { AdminFistarComponent } from './admin/softone/fistar/fistar.component';
import { AdminFistarAddComponent} from "./admin/softone/fistar/fistar-add/fistar-add.component";
import { AdminFistarBasicComponent } from './admin/softone/fistar/basic-infomation/basic.component';
import { AdminFistarInformationComponent } from './admin/softone/fistar/fistar-infomation/fistar-info.component';
import { AdminFistarCampaignHistoryComponent } from './admin/softone/fistar/campaign-history/campaign-history.component';
import { AdminFistarCampaignRecommendComponent } from './admin/softone/fistar/campaign-recommend/recommend.component';
import { AdminFistarRecommendComponent } from './admin/softone/fistar/Recommend/recommend.component';
import { AdminFistarSNS } from './admin/softone/fistar/sns-channel/sns.component';
import { AdminImagesAIComponent } from './admin/softone/images-ai/images-ai.component';
import { AdminPartnerComponent } from './admin/softone/partner/partner.component';
import { AdminPartnerAddComponent} from './admin/softone/partner/add/partner-add.component';
import { AdminPartnerCampaignHistoryComponent } from './admin/softone/partner/history/history.component';
import { AdminFartnerInformationComponent } from './admin/softone/partner/infomation/information.component';
import { AdminPartnerManagerComponent } from './admin/softone/partner/manager/manager.component';
import { AdminPartnerRecommendComponent } from './admin/softone/partner/Recommend/recommend.component';
import { AdminCampaignTabComponent } from './admin/softone/campaign/tab.component';
import { AdminCampaignComponent } from './admin/softone/campaign/home/campaign.component';
import { CampaignAddComponent } from './admin/softone/campaign/campaign-add/campaign-add.component';
import { AdminCampaignEditComponent } from './admin/softone/campaign/campaign-edit/campaign-edit.component';
import { AdminCampaignListPaymentComponent } from './admin/softone/campaign/list-payment/list-payment.component';
import { AdminCampaignMatchingStatusComponent } from './admin/softone/campaign/matching-fistar/matching-fistar.component';
import { AdminCampaignPaymentComponent } from './admin/softone/campaign/payment/payment.component';
import { AdminCampaignPaymentFistarInformationComponent } from './admin/softone/campaign/payment/fistar-information/fistar-information.component';
import { AdminCampaignPaymentManagerComponent } from './admin/softone/campaign/payment/manager/manager.component';
import { AdminCampaignReportComponent } from './admin/softone/campaign/report/report.component';
import { AdminCampaignReviewComponent } from './admin/softone/campaign/review/review.component';
import { AdminCampaignReviewDmncComponent } from './admin/softone/campaign/review/admin-detail/review-admin.component';
import { AppChartComponent } from './admin/softone/chart/chart.component';
import { AdminCampaignReviewDetailComponent } from './admin/softone/campaign/review/details/review-detail.component';
import { AdminCampaignInformationComponent } from './admin/softone/campaign/review/information/information.component';
import { AdminCampaignInformationAddComponent } from './admin/softone/campaign/review/information-add/information-add.component';
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
import { AdminSystemSettingComponent } from './admin/softone/system/setting/setting.component';
import { AddAccountComponent } from './admin/softone/system/account/add-account/add-account.component';

const appRoutes: Routes = [
    // User route here
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {path: '', component: AdminTryComponent},
        ]
    },
    {
        path: 'admin/login',
        component: AdminLoginComponent
    },
    {
        path: 'admin/forgot-password',
        component: AdminForgotPasswordComponent
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            //---------------------softone dev-------------------------------------------------------------
            { path: 'banner-fistar', component: AdminBannerFistarComponent },
            { path: 'banner-fistar/add', component: AdminBannerFistarDetailsComponent },
            { path: 'banner-fistar/edit/:id', component: AdminBannerFistarDetailsComponent },
            { path: 'request/fistar', component: AdminRequestFistarComponent },
            { path: 'request/fistar/basic/:id', component: AdminRequestFistarBasicComponent },
            { path: 'request/partner', component: AdminRequestFartnerComponent },
            { path: 'request/partner/basic/:id', component: AdminRequestPartnerBasicComponent },
            { path: 'fistar', component: AdminFistarComponent },
            { path: 'fistar/add', component: AdminFistarAddComponent},
            { path: 'fistar/basic-infomation/:id', component: AdminFistarBasicComponent },
            { path: 'fistar/fistar-infomation/:id', component: AdminFistarInformationComponent },
            { path: 'fistar/campaign-history/:id', component: AdminFistarCampaignHistoryComponent },
            { path: 'fistar/campaign-recommend/:id', component: AdminFistarCampaignRecommendComponent },
            { path: 'fistar/recommend/:id', component: AdminFistarRecommendComponent },
            { path: 'fistar/sns/:id', component: AdminFistarSNS },
            { path: 'images-ai', component: AdminImagesAIComponent},
            { path: 'partner', component: AdminPartnerComponent },
            { path: 'partner/add', component: AdminPartnerAddComponent },
            { path: 'partner/history/:id', component: AdminPartnerCampaignHistoryComponent },
            { path: 'partner/information/:id', component: AdminFartnerInformationComponent },
            { path: 'partner/manager/:id', component: AdminPartnerManagerComponent },
            { path: 'partner/recommend/:id', component: AdminPartnerRecommendComponent },
            { path: 'campaign/tab', component: AdminCampaignTabComponent },
            { path: 'campaign', component: AdminCampaignComponent },
            { path: 'campaign/add', component: CampaignAddComponent},
            { path: 'campaign/edit/:id', component: AdminCampaignEditComponent },
            { path: 'campaign/campaign-list-payment', component: AdminCampaignListPaymentComponent },
            { path: 'campaign/matching-fistar/:id', component: AdminCampaignMatchingStatusComponent },
            { path: 'campaign/campaign-payment/:id', component: AdminCampaignPaymentComponent },
            { path: 'campaign/campaign-payment/fistar-information/:id', component: AdminCampaignPaymentFistarInformationComponent },
            { path: 'campaign/campaign-payment/manager/:id', component: AdminCampaignPaymentManagerComponent },
            { path: 'campaign/campaign-report/:id', component: AdminCampaignReportComponent },
            { path: 'campaign/campaign-review/:id', component: AdminCampaignReviewComponent },
            { path: 'campaign/campaign-review-admin/:action/:id/:rv', component: AdminCampaignReviewDmncComponent },
            { path: 'chart', component: AppChartComponent },
            { path: 'campaign/campaign-review-detail/:id', component: AdminCampaignReviewDetailComponent },
            { path: 'campaign/campaign-edit-detail/:id', component: AdminCampaignInformationComponent },
            { path: 'campaign/campaign-add-detail/:id', component: AdminCampaignInformationAddComponent },
            { path: 'customer/faq', component: AdminCustomerFQIComponent },
            { path: 'customer/faq/add', component: AdminCustomerAddFQIComponent },
            { path: 'customer/faq/add/:id', component: AdminCustomerAddFQIComponent },
            { path: 'customer/faq/:page', component: AdminCustomerFQIComponent },
            { path: 'customer/qa', component: AdminCustomerQAComponent },
            { path: 'customer/qa/:page', component: AdminCustomerQAComponent },
            { path: 'customer/qa/add', component: AdminCustomerAddQAComponent },
            { path: 'customer/qa/add/:id', component: AdminCustomerAddQAComponent },
            { path: 'customer/notification', component: AdminCustomerNotificationComponent },
            { path: 'customer/notification/add', component: AdminCustomerAddNotificationComponent },
            { path: 'customer/notification/add/:id', component: AdminCustomerAddNotificationComponent },
            { path: 'system/code', component: AdminSystemCodeComponent },
            { path: 'system/sns', component: AdminSystemSNSComponent },
            { path: 'system/sns/detail/:id/:name', component: AdminSystemSNSDetailComponent },
            { path: 'system/account', component: AdminSystemAccountComponent },
            { path: 'system/account/update', component: AddAccountComponent },
            { path: 'system/account/update/:id', component: AddAccountComponent },
            { path: 'system/account/access/:id', component: AdminSystemAccountAccessComponent },
            { path: 'system/account/:id', component: AdminSystemAccountComponent },
            { path: 'system/language', component: AdminSystemLanguageComponent },
            { path: 'system/setting', component: AdminSystemSettingComponent },
            {path: '', component: AdminLayoutComponent},
            {
                path: 'try',
                children: [
                    {
                        path: '',
                        component: AdminTryComponent
                    },
                    {
                        path: 'add',
                        component: AdminTryDetailsComponent
                    },
                    {
                        path: 'edit/:id',
                        component: AdminTryDetailsComponent
                    },
                    {
                        path: 'event',
                        children: [
                            {
                                path: '',
                                component: AdminTryEventComponent
                            },
                            {
                                path: 'add',
                                component: AdminTryEventDetailsComponent
                            },
                            {
                                path: 'edit/:id',
                                component: AdminTryEventDetailsComponent
                            }
                        ]
                    },
                    {
                        path: 'winner',
                        children: [
                            {
                                path: '',
                                component: AdminTryEndComponent
                                }
                        ]
                    },
                    {
                        path: 'delivery',
                        children: [
                            {
                                path: '',
                                component: AdminDeliveryComponent

                            }
                        ]
                    }
                ]
            },
            {path: 'winner/try/:id', component: AdminTryWinnerComponent},
            {path: 'banners', component: AdminBannerComponent},
            {path: 'banners/add', component: AdminBannerDetailsComponent},
            {path: 'banners/edit/:id', component: AdminBannerDetailsComponent},
            {path: 'blogs', component: AdminBlogComponent},
            {path: 'blogs/add', component: AdminBlogDetailsComponent},
            {path: 'blogs/edit/:id', component: AdminBlogDetailsComponent},
            {path: 'categories', component: AdminCategoryComponent},
            {path: 'user-management', component: UserManagementComponent},
            {path: 'user/edit/:id', component: AdminUserDetailComponent},
            {path: 'user/add', component: AdminUserDetailComponent},
            {path: 'ads', component: AdminAdsComponent},
            {path: 'ads/add', component: AdminAdDetailsComponent},
            {path: 'ads/edit/:id', component: AdminAdDetailsComponent},
            {path: 'brands', component: AdminBrandComponent},
            {path: 'faq-categories', component: AdminFaqCategoryComponent},
            {path: 'faqs', component: AdminFaqComponent},
            {path: 'faqs/add', component: AdminFaqDetailsComponent},
            {path: 'faqs/edit/:id', component: AdminFaqDetailsComponent},
            {path: 'comments/detail/:id', component: AdminCommentDetailsComponent},
            {path: 'comments/:object_type/:object_id', component: AdminCommentComponent},
            {path: 'notifications', component: AdminNotificationComponent},
            {path: 'notifications/add', component: AdminNotificationDetailComponent},
            {path: 'notifications/edit/:id', component: AdminNotificationDetailComponent},
            {path: 'settings', component: AdminSettingComponent},
            {path: 'reviews', component: AdminReviewComponent},
            {path: 'reviews/detail/:id', component: AdminReviewDetailsComponent},
            {path: 'reviews/edit/:id', component: AdminReviewEditComponent},
            {path: 'reviews/try/:tryId', component: AdminReviewComponent},
            {path: 'reviews/fimer', component: AdminReviewFimerComponent},
            {path: 'profile', component: AdminProfileComponent},
            {path: 'update-password', component: AdminUpdatePasswordComponent},
            {path: 'hashtags', component: AdminHashtagComponent},
            {path: 'hot-fimer', component: AdminHotFimerComponent}
        ]
    },
    // otherwise redirect to home
    {path: '**', redirectTo: '/admin/try'}
];

export const Routing = RouterModule.forRoot(appRoutes);

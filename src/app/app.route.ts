import {Routes, RouterModule} from '@angular/router';

import {AdminLayoutComponent} from './_layout/admin/admin-layout/admin-layout.component';
import {SiteLayoutComponent} from './_layout/frontend/site-layout/site-layout.component';

import {HomeComponent} from './frontend/home/home.component';
import {AuthLayoutComponent} from './_layout/admin/auth-layout/auth-layout.component';
import {RegisterComponent} from './common/auth/register/register.component';
import {AdminTryComponent} from './admin/try/try.component';
import {AdminTryDetailsComponent} from './admin/try-details/try-details.component';
import {ResetPasswordComponent} from './common/auth/reset-password/reset-password.component';
import {AdminBannerComponent} from './admin/banner/banner.component';
import {AdminBlogComponent} from './admin/blog/blog.component';
import {AdminBlogDetailsComponent} from './admin/blog-details/blog-details.component';
import {ForgotPasswordComponent} from './common/auth/forgot-password/forgot-password.component';
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
import {ReviewsComponent} from './frontend/reviews/reviews.component';
import {FimersComponent} from './frontend/fimers/fimers.component';
import {TriesComponent} from './frontend/tries/tries.component';
import {ReviewDetailComponent} from './frontend/review-detail/review-detail.component';
import {TryDetailsComponent} from './frontend/try-detail/try-detail.component';
import {MyPageComponent} from './frontend/mypage/my-page.component';
import {ReviewCreateComponent} from './frontend/review-create/review-create.component';
import {AdminTryWinnerComponent} from './admin/try-winner/try-winner.component';
import {NotificationComponent} from './frontend/notification/notification.component';
import {AdminNotificationComponent} from './admin/notification/notification.component';
import {AdminNotificationDetailComponent} from './admin/notification-detail/notification-detail.component';
import {TipsComponent} from './frontend/tips/tips.component';
import {TipDetailComponent} from './frontend/tip-detail/tip-detail.component';
import {CombineAuthComponent} from './common/auth/combine-auth/combine-auth.component';
import {AdminFaqCategoryComponent} from './admin/faq-category/faq-category.component';
import {FaqsComponent} from './frontend/faqs/faqs.component';
import {AdminSettingComponent} from './admin/setting/setting.component';
import {SearchPageComponent} from './frontend/search/search-page.component';
import {AdminTryEventComponent} from './admin/try-event/try-event.component';
import {AdminTryEventDetailsComponent} from './admin/try-event-details/try-event-details.component';
import {AdminLoginComponent} from './admin/auth/admin-auth.component';
import {AdminForgotPasswordComponent} from './admin/auth/fogot/admin-auth-forgot.component';
import {AdminProfileComponent} from './admin/profile/profile.component';
import {AdminUpdatePasswordComponent} from './admin/profile/update-password.component';
import {BlogsComponent} from './frontend/blogs/blogs.component';
import {BlogDetailComponent} from './frontend/blog-detail/blog-detail.component';

const appRoutes: Routes = [
    // User route here
    {
        path: '',
        component: SiteLayoutComponent,
        children: [
            {path: '', component: HomeComponent},
            {path: 'reviews', component: ReviewsComponent},
            {path: 'reviews/create', component: ReviewCreateComponent},
            {path: 'reviews/create/:try_id', component: ReviewCreateComponent},
            {path: 'reviews/edit/:slug', component: ReviewCreateComponent},
            {path: 'reviews/:slug', component: ReviewsComponent},
            {path: 'reviews/detail/:slug', component: ReviewDetailComponent},
            {path: 'reviews/tag/:tag', component: ReviewsComponent},
            {path: 'fimers', component: FimersComponent},
            {path: 'fimers/:type', component: FimersComponent},
            {path: 'tries', component: TriesComponent},
            {path: 'tries/:slug', component: TryDetailsComponent},
            {path: 'my-page', component: MyPageComponent},
            {path: 'my-page/:type', component: MyPageComponent},
            {path: 'usr/:slug', component: MyPageComponent},
            {path: 'usr/:slug/:type', component: MyPageComponent},
            {path: 'notifications', component: NotificationComponent},
            {path: 'tips', component: TipsComponent},
            {path: 'tips/:id', component: TipDetailComponent},
            {path: 'blogs', component: BlogsComponent},
            {path: 'blogs/:slug', component: BlogDetailComponent},
            {path: 'faqs', component: FaqsComponent},
            {path: 'search', component: SearchPageComponent},
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
                    }
                ]
            },
            {
                path: 'reviews',
                children: [
                    {
                        path: '',
                        component: AdminReviewComponent
                    },
                    {
                        path: 'detail/:id',
                        component: AdminReviewDetailsComponent
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
            {path: 'reviews/try/:tryId', component: AdminReviewComponent},
            {path: 'reviews/detail/:id', component: AdminReviewDetailsComponent},
            {path: 'reviews/fimer', component: AdminReviewFimerComponent},
            {path: 'profile', component: AdminProfileComponent},
            {path: 'update-password', component: AdminUpdatePasswordComponent}
        ]
    },
    // Auth route
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {path: 'register/:identity_id', component: RegisterComponent},
            {path: 'forgot-password', component: ForgotPasswordComponent},
            {path: 'reset-password/:token', component: ResetPasswordComponent},
            {path: ':action', component: CombineAuthComponent},
        ],
    },

    // no layout routes
    // { path: 'register', component: RegisterComponent },
    // otherwise redirect to home
    {path: '**', redirectTo: ''}
];

export const Routing = RouterModule.forRoot(appRoutes);

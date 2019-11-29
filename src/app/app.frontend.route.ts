import {Routes, RouterModule} from '@angular/router';

import {SiteLayoutComponent} from './_layout/frontend/site-layout/site-layout.component';
import {HomeComponent} from './frontend/home/home.component';
import {AuthLayoutComponent} from './_layout/admin/auth-layout/auth-layout.component';
import {RegisterComponent} from './common/auth/register/register.component';
import {ResetPasswordComponent} from './common/auth/reset-password/reset-password.component';
import {ForgotPasswordComponent} from './common/auth/forgot-password/forgot-password.component';
import {ReviewsComponent} from './frontend/reviews/reviews.component';
import {FimersComponent} from './frontend/fimers/fimers.component';
import {TriesComponent} from './frontend/tries/tries.component';
import {ReviewDetailComponent} from './frontend/review-detail/review-detail.component';
import {TryDetailsComponent} from './frontend/try-detail/try-detail.component';
import {MyPageComponent} from './frontend/mypage/my-page.component';
import {ReviewCreateComponent} from './frontend/review-create/review-create.component';
import {NotificationComponent} from './frontend/notification/notification.component';
import {TipsComponent} from './frontend/tips/tips.component';
import {TipDetailComponent} from './frontend/tip-detail/tip-detail.component';
import {CombineAuthComponent} from './common/auth/combine-auth/combine-auth.component';
import {FaqsComponent} from './frontend/faqs/faqs.component';
import {SearchPageComponent} from './frontend/search/search-page.component';
import {BlogsComponent} from './frontend/blogs/blogs.component';
import {BlogDetailComponent} from './frontend/blog-detail/blog-detail.component';
import {PrivacyPolicyComponent} from './frontend/privacy-policy/privacy-policy.component';
import {ServiceTermComponent} from './frontend/service-term/service-term.component';

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
            {path: 'privacy-policy', component: PrivacyPolicyComponent},
            {path: 'service-term', component: ServiceTermComponent},
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

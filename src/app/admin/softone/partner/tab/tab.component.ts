import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router } from '@angular/router';
import {  ActivatedRoute} from '@angular/router';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-admin-partner-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class PartnerTabComponent {
  title = 'angular-material-tab-router';  
  navLinks: any[];
  activeLinkIndex = -1; 
  public id: string;
  public env: any = environment;
  
  constructor(private router: Router,private activeRoute: ActivatedRoute,) {
    this.id = this.activeRoute.snapshot.paramMap.get('id');
    this.navLinks = [
        {
            label: 'Manager Information',
            link: '/admin/partner/manager/'+this.id,
            index: 0
        }, {
            label: 'Company Information',
            link: '/admin/partner/information/'+this.id,
            index: 1
        }, {
            label: 'Campaign History',
            link: '/admin/partner/history/'+this.id,
            index: 2
        }, 
        {
            label: 'fiStar Recommend',
            link: '/admin/partner/recommend/'+this.id,
            index: 3
        }, 
    ];
}
ngOnInit(): void {
  this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
  });
}
}

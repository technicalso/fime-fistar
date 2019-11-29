import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router } from '@angular/router';
import {  ActivatedRoute} from '@angular/router';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-admin-fistar-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class FistarTabComponent {
  title = 'angular-material-tab-router';  
  navLinks: any[];
  activeLinkIndex = -1; 
  public id: string;
  public env: any = environment;
  
  constructor(private router: Router,private activeRoute: ActivatedRoute,) {
    this.id = this.activeRoute.snapshot.paramMap.get('id');
    this.navLinks = [
        {
            label: 'Basic Information',
            link: '/admin/fistar/basic-infomation/'+this.id,
            index: 0
        }, {
            label: 'fiStar Information',
            link: '/admin/fistar/fistar-infomation/'+this.id,
            index: 1
        }, 
        {
          label: 'SNS Channel',
          link: '/admin/fistar/sns/'+this.id,
          index: 2
        }, 
        {
            label: 'Campaign History',
            link: '/admin/fistar/campaign-history/'+this.id,
            index: 3
        }, 
        {
          label: 'Campaign Recommend',
          link: '/admin/fistar/recommend/'+this.id,
          index: 4
        }, 
       
    ];
}
ngOnInit(): void {
  this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
  });
}
}
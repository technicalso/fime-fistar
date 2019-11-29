import { Component, OnInit, Inject, PLATFORM_ID, TemplateRef } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { CookieService } from '../../../../services/cookie.service';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { BannerService } from '../service/banner/banner.service';
import { CommonService } from '../../../admin/softone/service/common.service';
import { ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ImageAIService } from '../service/image-ai/image-ai.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SoCSVService } from '../service/csv/csv.service';

@Component({
  selector: 'admin-images-ai',
  templateUrl: './images-ai.component.html',
  styleUrls: [
    './images-ai.component.scss'
  ]
})
export class AdminImagesAIComponent implements OnInit {
  modalRef: BsModalRef;
  public data: any = {};
  public dataSearch: any = {};
  public foods: any;
  public dataProcess: any;
  search: string;
  public allValue: any = "all";
  max: number = 200;
  showWarning: boolean;
  dynamic: number;
  type: string;
  public form: any;
  public activeClick: boolean = false;
  public countImage: any;
  public fistar: any = [];
  public partner: any = [];
  public countData: any;
  public fistarCount: number = 0;
  public campaignCount: number = 0;
  public imageCount: number = 0;
  public keywordCount: number = 0;
  public totalData: number = 0;
  public dataKeyword: any = [];
  public requestSearch: boolean = false;
  public firstSearch: boolean = false;

  dataBlind = {
    period: {
      start: '',
      end: ''
    }
  };

  public page: any = {
    per_page: 10,
    current_page: 1
  };

  constructor(
    private api: Restangular,
    private cookieService: CookieService,
    private router: Router,
    private toast: ToastrService,
    private imageAIService: ImageAIService,
    private commonService: CommonService,
    private modalService: BsModalService,
    private csvService: SoCSVService,
    private ProgressbarModule: ProgressbarModule,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    this.getList();
    // this.random();
    this.getImageAIList();

    this.form = new FormGroup({
      job_image_ai_schedule: new FormControl(this.data.job_image_ai_schedule, [Validators.required]),
    });

    this.onReset();

  }



  handleChangeEndDate() {
    let startDate = '';
    let endDate = '';
    this.activeClick = true;
    if (this.dataBlind.period.start) {
      // tslint:disable-next-line:max-line-length
      let monthStart = this.dataBlind.period.start['_i']['month'] + 1;
      monthStart = monthStart >= 10 ? monthStart : '0' + monthStart;

      let dateStart = this.dataBlind.period.start['_i']['date'];
      dateStart = dateStart >= 10 ? dateStart : '0' + dateStart;

      startDate = `${this.dataBlind.period.start['_i']['year']}-${monthStart}-${dateStart}`;
      let monthEnd = this.dataBlind.period.end['_i']['month'] + 1;
      monthEnd = monthEnd >= 10 ? monthEnd : '0' + monthEnd;

      let dateEnd = this.dataBlind.period.end['_i']['date'];
      dateEnd = dateEnd >= 10 ? dateEnd : '0' + dateEnd;
      // tslint:disable-next-line:max-line-length
      endDate = `${this.dataBlind.period.end['_i']['year']}-${monthEnd}-${dateEnd}`;
      let stardate = moment(startDate);
      let enddate = moment(endDate);
      if (this.search) {
        this.activeClick = true;
      }

      if (stardate > enddate) {

        this.dataBlind.period.end = "false";

        this.toast.error('The start date may not be greater than end date.');
        this.activeClick = false;
      } else {
        // this.activeClick = true;
      }
    }
  }

  handleChangeKeyword(event) {
    console.log(event)
    console.log(this.dataBlind.period.end)
    console.log(this.dataBlind.period.start)
    if (event && this.dataBlind.period.start && (this.dataBlind.period.end !== "false")) {
      this.activeClick = true;
    }
  }

  onSubmit(){
    this.onSearch(1);
  }

  onSearch(page) {
    console.log(page);
    if(page == undefined) {
      page=1
    }
    console.log(page);
    console.log(this.dataBlind);
    console.log(this.search);
    console.log(this.allValue);
    this.requestSearch = true
    this.dataSearch.search = this.search;
    this.dataSearch.page = page;

    let startDate = '';
    let endDate = '';
    let searchActive = "";
    console.log(this.dataBlind.period.end);
    if (this.dataBlind.period.start && this.dataBlind.period.end == "") {
      this.toast.error('The end date feild is requered.');

      this.activeClick = false;
    } else if (this.dataBlind.period.start == "" && this.dataBlind.period.end == "") {
      this.toast.error('The date feild is requered.');

      this.activeClick = false;
    }
    if (this.dataBlind.period.start) {
      let monthStart = this.dataBlind.period.start['_i']['month'] + 1;
      monthStart = monthStart >= 10 ? monthStart : '0' + monthStart;
      let dateStart = this.dataBlind.period.start['_i']['date'];
      dateStart = dateStart >= 10 ? dateStart : '0' + dateStart;
      startDate = `${this.dataBlind.period.start['_i']['year']}-${monthStart}-${dateStart}`;
    }
    if (this.dataBlind.period.end) {
      let monthEnd = this.dataBlind.period.end['_i']['month'] + 1;
      monthEnd = monthEnd >= 10 ? monthEnd : '0' + monthEnd;
      let dateEnd = this.dataBlind.period.end['_i']['date'];
      dateEnd = dateEnd >= 10 ? dateEnd : '0' + dateEnd;   
      endDate = `${this.dataBlind.period.end['_i']['year']}-${monthEnd}-${dateEnd}`;
    }

    console.log(startDate)
    console.log(endDate)
    let stardate = moment(startDate);
    let enddate = moment(endDate);
    if (stardate > enddate) {
      this.dataBlind.period.end = "false";

      this.toast.error('The start date may not be greater than end date.');
    }
    console.log(startDate)
    console.log(endDate)
    if (startDate) {
      this.dataSearch.startDate = startDate;
    }
    if (endDate) {
      this.dataSearch.endDate = endDate;
    }

    console.log(this.allValue)

    if (this.allValue && this.allValue == "fistar") {
      this.dataSearch.allValue = this.allValue;
    } else if (this.allValue && this.allValue == "campaign") {
      this.dataSearch.allValue = this.allValue;
    } else {
      this.dataSearch.allValue = this.allValue;
    }
    console.log(this.dataSearch)
    console.log(page)

    let dataParam ={};
    if(this.dataSearch.allValue == "all") {
      dataParam = {
        search: this.dataSearch.search,
        start_date: this.dataSearch.startDate,
        end_date: this.dataSearch.endDate,
        type: '',
        page: page
      };
    }else{
      dataParam = {
        search: this.dataSearch.search,
        start_date: this.dataSearch.startDate,
        end_date: this.dataSearch.endDate,
        type: this.dataSearch.allValue == 'campaign' ? 2 : 1,
        page: page
      };
    }
    
    console.log(dataParam)


    this.page = {
      ...this.page,
      current_page: page,
      per_page:10
  }
    this.imageAIService.getImageAIList(dataParam).subscribe((res: any) => {
      console.log(res, "list search")
      this.data = res
      console.log(this.imageCount)
      this.firstSearch=true;
      this.page = {
        ...this.page,
        current_page: page,
        per_page:10
    }
    
      this.mapDataList(this.data);
    });


    this.imageAIService.getKeyword(dataParam).subscribe((res: any) => {
      console.log(res, "imageAIkeyword keyword")
      this.dataKeyword = res;

      this.fistarCount = this.dataKeyword.fistarCount.length > 0 ? this.dataKeyword.fistarCount[0].count : 0
      this.campaignCount = this.dataKeyword.campaignCount.length > 0 ? this.dataKeyword.campaignCount[0].count : 0
      this.imageCount = this.dataKeyword.imageCount.length > 0 ? this.dataKeyword.imageCount[0].count : 0
      this.keywordCount = this.dataKeyword.keywordCount.length > 0 ? this.dataKeyword.keywordCount[0].count : 0

    });




  }

  pagination(page?) {
    console.log(page)
    if (page === undefined) {
      page = 1;
    } else {
      page++;
    }
    // let dataSearch: any = {
    //   page
    // }
    console.log(page)
    if (this.requestSearch == true) {
      this.onSearch(page)
    } else {
      this.getImageAIList(page)
    }

    
  }

  goPage(page) {
    console.log(page)
    this.pagination(page.offset)
    
  }
  onReset() {
    console.log(this.dataBlind);
    this.dataBlind.period.end = ""
    this.dataBlind.period.start = ""
    // this.dataSearch=""
    this.search = ""
    this.allValue = "all"
    this.activeClick = false;

  }

  dowloadCSV() {
    let CSVData = [];
    let dataSearch: any = {
      download: true
    }

    if (this.requestSearch == true) {
      let dataParam = {
        search: this.dataSearch.search,
        start_date: this.dataSearch.startDate,
        end_date: this.dataSearch.endDate,
        type: this.dataSearch.allValue == 'campaign' ? 2 : 1,
        paginate: 9999999
      };
  
  
  
      this.imageAIService.getImageAIList(dataParam).subscribe((res: any) => {

        console.log(res)

        if (res.data && res.data.length > 0) {
              res.data.map((item) => {
      
      
                if (item.type == 1) {
                  item.typename = "Fistar"
                  item.nameData = item.fullname
                  // this.fistar.push(item);
                } else if (item.type == 2) {
                  item.typename = "Campaign"
                  item.nameData = item.cp_name
                  // this.partner.push(item);
                }
      
                CSVData.push({
                  'Date': item.created_at,
                  'Type': item.typename,
                  'Name': item.nameData,
                  'Image': item.image,
                  'Keywords': item.pass_keyword,
                })
              })
              let options = {
                fieldSeparator: ',',
                quoteStrings: '',
                decimalseparator: '.',
                useBom: true,
                headers: [
                  'Date',
                  'Type',
                  'Name',
                  'Image',
                  'Keywords',
                ]
              };
              this.csvService.dowloadCSV(CSVData, 'ImageAI', options);
            } else {
              this.toast.error("Nothing to export")
            }
      });
  
    } else {
    
      this.toast.error("Please search before export data!")
    }
    

  }



  getImageAIList(page = 1) {
    let dataParam = {
      page: page
    };
    let dataTest: string = "";
    this.imageAIService.getImageAIList(dataParam).subscribe((res: any) => {
      console.log(res, "imageAIService DETAIL")
      this.data = res;

      this.mapDataList(this.data);

    });


    this.imageAIService.getKeyword(dataTest).subscribe((res: any) => {
      console.log(res, "imageAIService DETAIL")
      this.dataKeyword = res;
      this.fistarCount = this.dataKeyword.fistarCount.length > 0 ? this.dataKeyword.fistarCount[0].count : 0
      this.campaignCount = this.dataKeyword.campaignCount.length > 0 ? this.dataKeyword.campaignCount[0].count : 0
      this.imageCount = this.dataKeyword.imageCount.length > 0 ? this.dataKeyword.imageCount[0].count : 0
      this.keywordCount = this.dataKeyword.keywordCount.length > 0 ? this.dataKeyword.keywordCount[0].count : 0

      // this.mapDataList(this.data);

    });

    this.imageAIService.getcountData().subscribe((res: any) => {
      console.log(res)
      this.countData = res;

    })

  }


  mapDataList(result) {
    console.log(result)

    result.data.map((item) => {


      this.totalData += parseInt(item.keywords_count)

      if (item.type == 1) {
        item.nameData = item.fullname
        item.typename = "Fistar"
        this.fistar.push(item);
      } else if (item.type == 2) {
        item.typename = "Campaign"
        item.nameData = item.cp_name
        this.partner.push(item);
      }

      if (item.json_keyword) {
        let test = item.json_keyword.responses[0].labelAnnotations.map((item) => {
          return item.description
        })
        test = test.join(',');
        item.json_keyword.stringkeyword = test;
      }

    })
    console.log(result);
    console.log(this.data);
    console.log(this.fistar);
    console.log(this.partner);

    // this.imageCount = result.data.length;
    // this.fistarCount = this.fistar.length;
    // this.campaignCount = this.partner.length;



  }

  getList() {

    this.foods = [
      { value: 'all', viewValue: 'All' },
      { value: 'fistar', viewValue: 'Fistar Name' },
      { value: 'campaign', viewValue: 'Campaign Name' }
    ];

    this.data = [

    ];

  }

  openModalKeyword(template: TemplateRef<any>, keyword: any) {

    let data = this.data.data.filter(data => data.name == keyword.name);
    console.log(keyword)
    this.dataProcess = [];
    this.dataProcess = keyword[0].labelAnnotations;
    console.log(this.dataProcess)
    this.dataProcess.map((data) => {
      let item = parseFloat(data.score);
      console.log(item, 'line 444')
      //data.score = Math.round(item * 1000) / 1000;
      //data.score = data.score * 100;
    })
    console.log(this.dataProcess)
    this.modalRef = this.modalService.show(template);

  }

  getImageFistarAnalysis(row) {
    return '/analysis/' + row.obj_id + '/' + row.image
  }
}

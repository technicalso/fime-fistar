import { Component, OnInit } from '@angular/core';
import * as CanvasJS from '../../../../assets/canvasjs.min';
//var CanvasJS = require('./canvasjs.min');
 
@Component({
	selector: 'app-admin-chart',
	templateUrl: './chart.component.html'
})
 
export class AppChartComponent implements OnInit {
    ngOnInit() {
        // let chart = new CanvasJS.Chart("chartContainer", {
        //     theme: "light2",
        //     animationEnabled: true,
        //     exportEnabled: true,
        //     title:{
        //         text: "fi : me Engagement"
        //     },
        //     data: [{
        //         type: "pie",
        //         showInLegend: true,
                
        //         toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
        //         indexLabel: "{name} - #percent%",
        //         dataPoints: [
        //             { y: 11, name: "Like" },
        //             { y: 25, name: "Reply" },
        //             { y: 64, name: "share" },
        //         ]
        //     }]
        // });

        let chart = new CanvasJS.Chart("chartContainer", {
            theme: "light2",
            animationEnabled: true,
            exportEnabled: true,
            title:{
                text: "fi : me Engagement"
            },
            data: [{
                type: "pie",
                showInLegend: true,
                
                toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
                indexLabel: "{name} - #percent%",
                dataPoints: [
                    { y: 11, name: "Like" },
                    { y: 25, name: "Reply" },
                    { y: 64, name: "share" },
                ]
            }]
        });
        chart.render();
    }
}

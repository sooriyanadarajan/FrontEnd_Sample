import { Component, OnInit } from '@angular/core';
import Highcharts from "highcharts/highmaps";
import worldMap from "@highcharts/map-collection/custom/world.geo.json";
import { DashboardService } from '../../../services/dashboard.service'
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label,SingleDataSet } from 'ng2-charts';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor = "mapChart";
  chartData = [{ code3: "ABW", z: 105 }, { code3: "AFG", z: 35530 }];
  mapData:any = [
    ["fo", 0],
    ["um", 0],
    ["us", 0],
    ["jp", 0],
    ["sc", 0],
    ["in", 0],
    ["fr", 0],
    ["fm", 0],
    ["cn", 0],
    ["pt", 0],
    ["sw", 0],
    ["sh", 0],
    ["br", 0],
    ["ki", 0],
    ["ph", 0],
    ["mx", 0],
    ["es", 0],
    ["bu", 0],
    ["mv", 0],
    ["sp", 0],
    ["gb", 0],
    ["gr", 0],
    ["as", 0],
    ["dk", 0],
    ["gl", 0],
    ["gu", 0],
    ["mp", 0],
    ["pr", 0],
    ["vi", 0],
    ["ca", 0],
    ["st", 0],
    ["cv", 0],
    ["dm", 0],
    ["nl", 0],
    ["jm", 0],
    ["ws", 0],
    ["om", 0],
    ["vc", 0],
    ["tr",0],
    ["bd", 0],
    ["lc",0],
    ["nr", 0],
    ["no", 0],
    ["kn", 0],
    ["bh", 0],
    ["to", 0],
    ["fi", 0],
    ["id",0],
    ["mu", 0],
    ["se", 0],
    ["tt", 0],
    ["my", 0],
    ["pa", 0],
    ["pw",0],
    ["tv", 0],
    ["mh", 0],
    ["cl", 0],
    ["th", 0],
    ["gd", 0],
    ["ee", 0],
    ["ag", 0],
    ["tw", 0],
    ["bb", 0],
    ["it", 0],
    ["mt", 0],
    ["vu", 0],
    ["sg", 0],
    ["cy", 0],
    ["lk", 0],
    ["km", 0],
    ["fj", 0],
    ["ru", 0],
    ["va", 0],
    ["sm", 0],
    ["kz", 0],
    ["az", 0],
    ["tj", 0],
    ["ls", 0],
    ["uz", 0],
    ["ma", 0],
    ["co", 0],
    ["tl", 0],
    ["tz", 0],
    ["ar", 0],
    ["sa", 0],
    ["pk", 0],
    ["ye", 0],
    ["ae", 0],
    ["ke", 0],
    ["pe", 0],
    ["do", 0],
    ["ht", 0],
    ["pg", 0],
    ["ao", 0],
    ["kh", 0],
    ["vn", 0],
    ["mz", 0],
    ["cr", 0],
    ["bj", 0],
    ["ng", 0],
    ["ir", 0],
    ["sv", 0],
    ["sl", 0],
    ["gw", 0],
    ["hr", 0],
    ["bz", 0],
    ["za", 0],
    ["cf", 0],
    ["sd", 0],
    ["cd", 0],
    ["kw", 0],
    ["de", 0],
    ["be", 0],
    ["ie", 0],
    ["kp", 0],
    ["kr", 0],
    ["gy", 0],
    ["hn", 0],
    ["mm", 0],
    ["ga", 0],
    ["gq", 0],
    ["ni", 0],
    ["lv", 0],
    ["ug", 0],
    ["mw", 0],
    ["am", 0],
    ["sx", 0],
    ["tm", 0],
    ["zm", 0],
    ["nc", 0],
    ["mr", 0],
    ["dz", 0],
    ["lt", 0],
    ["et", 0],
    ["er", 0],
    ["gh", 0],
    ["si", 0],
    ["gt", 0],
    ["ba", 0],
    ["jo", 0],
    ["sy", 0],
    ["mc", 0],
    ["al", 0],
    ["uy", 0],
    ["cnm", 0],
    ["mn", 0],
    ["rw", 0],
    ["so", 0],
    ["bo", 0],
    ["cm", 0],
    ["cg", 0],
    ["eh", 0],
    ["rs", 0],
    ["me", 0],
    ["tg", 0],
    ["la", 0],
    ["af", 0],
    ["ua", 0],
    ["sk", 0],
    ["jk", 0],
    ["bg", 0],
    ["qa", 0],
    ["li", 0],
    ["at", 0],
    ["sz", 0],
    ["hu", 0],
    ["ro", 0],
    ["ne", 0],
    ["lu", 0],
    ["ad", 0],
    ["ci", 0],
    ["lr", 0],
    ["bn", 0],
    ["iq", 0],
    ["ge", 0],
    ["gm", 0],
    ["ch", 0],
    ["td", 0],
    ["kv", 0],
    ["lb", 0],
    ["dj", 0],
    ["bi", 0],
    ["sr", 0],
    ["il", 0],
    ["ml", 0],
    ["sn", 0],
    ["gn", 0],
    ["zw", 0],
    ["pl", 0],
    ["mk", 0],
    ["py", 0],
    ["by", 0],
    ["cz", 0],
    ["bf", 0],
    ["na", 0],
    ["ly", 0],
    ["tn", 0],
    ["bt", 0],
    ["md", 0],
    ["ss", 0],
    ["bw", 0],
    ["bs", 0],
    ["nz", 0],
    ["cu", 0],
    ["ec", 0],
    ["au", 0],
    ["ve", 0],
    ["sb", 0],
    ["mg", 0],
    ["is", 0],
    ["eg", 0],
    ["kg", 0],
    ["np", 0]
  ]

  updateFlag=false;
  chartOptions: Highcharts.Options = {
    chart: {
      map: worldMap,
     },
    title: {
      text: ""
    },
    subtitle: {
      text:
        '<a href="http://code.highcharts.com/mapdata/custom/world.js"></a>'
    },
    mapNavigation: {
      enabled: true,
      enableMouseWheelZoom: false,
      buttonOptions: {
        alignTo: "spacingBox"
      }
    },
    legend: {
      enabled: false
    },
    colorAxis: {
      minColor: '#c6f7fa',
      maxColor: '#00bcc7'
  },  
    series: [
      {
        type: "map",
        name: "User Activity",
        states: {
          hover: {
            color: "#00bcc7"
          }
        },
        dataLabels: {
          enabled: false,
          format: "{point.name}"
        },
        allAreas: false,
        data:this.mapData
      }
    ]
  };

  //Bar chart
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            // fontFamily: '{GoogleSans}',
            // fontColor: 'black',
            // fontStyle: 'bold',
            // fontWeight: 600,
            padding:10,
            beginAtZero: true,
           },


          gridLines: {
            display: false,
            tickMarkLength: 1
          },
        }
      ],
      yAxes: [
        {
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false
          }
        }
      ]
    },
    legend: {
      display: false,
       },
    plugins: {
      datalabels: {
        display: false
      }
    }
  };

  public barChartData: ChartDataSets[] = [
    {
      data: [],
      barPercentage: 0.5,
      barThickness: 20,
      maxBarThickness: 25,
      backgroundColor: '#00bbc6',
      hoverBackgroundColor:'#00bbc6',
      categoryPercentage: 0.5
    },
  ];


  constructor(private dashboardService:DashboardService) { }

  ngOnInit(): void {
    this.getUser();
    this.getBotData();
    this.getDashboardPayment();
    this.getDashboardSmartTrade();
    this.getFxTrade();
  }

  userData:any;
  getUser(){
    this.dashboardService.getDashboardUser().subscribe((res)=>{
      if(res['success']){
        this.userData = res['data'];
      for(let map of this.userData.map){
          for (let index = 0; index < this.mapData.length; index++) {
            const element = this.mapData[index];
            if(element['hc-key'] == map.country_code){
              this.mapData[index]['value'] = map.count
            }
            
          }
        }
        this.updateFlag = true;
        this.chartOptions.series =  [
          {
            type: "map",
            name: "User Activity",
            states: {
              hover: {
                color: "#00bcc7"
              }
            },
            dataLabels: {
              enabled: false,
              format: "{point.name}"
            },
            allAreas: false,
            data:this.mapData
          }
        ]  
        this.userData.register.forEach(element => {
          this.barChartLabels.push(element['_id'].month + '/' + element['_id'].year);
          this.barChartData[0].data.push(element.count);
  
        });
       
      }
    })
  }

  botData:any=[];
  botType = 'SPOT'
  getBotData(){
    this.dashboardService.getDashboardBot().subscribe((res)=>{
      if(res['success']){
        this.botData = res['data']
      }
    })
  }

  dashboardPayment:any;
  totalPaymentAmount:any = 0
  getDashboardPayment(){
    this.dashboardService.getDashboardPayment().subscribe((res)=>{
      if(res['success']){
        this.dashboardPayment = res['data'];
        this.dashboardPayment['payment'].forEach(element => {
          this.totalPaymentAmount = this.totalPaymentAmount + element.price;
          });
        this.dashboardPayment['payment'].forEach(element => {
            this.pieChartData.push(((parseInt(element.price)/this.totalPaymentAmount)*100));
            this.pieChartLabels.push(element.payment_type + '-' + element.amount);
            // this.piechartColors[0].backgroundColor.push(this.getRandomColor())
        });
      }
    })
  }

  //Random Color Generator
getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


  smartTradeData:any;
  getDashboardSmartTrade(){
    this.dashboardService.getDashboardSmartTrade().subscribe((res)=>{
      if(res['success']){
        this.smartTradeData = res['data']
      }
    })
  }

  fxTradeData:any;
  getFxTrade(){
    this.dashboardService.getDashboardFx().subscribe((res)=>{
      if(res['success']){
        this.fxTradeData = res['data']
      }
    })
  }

//Pie Chart

public pieChartOptions: ChartOptions = {
  legend: {
    position: 'bottom',
    align: 'center',
    labels: {
      fontSize: 15,
      usePointStyle: true,
      boxWidth: 5,
    }
  },
  responsive: true,
  cutoutPercentage: 85,
  plugins: {
    datalabels: {
      anchor: 'center',
      align: 'end',
    }
  }

};

public piechartColors: any[] = [
  {
    backgroundColor: ["#00BCC7", "#37353D", "#F72A63"]
  }
];

public pieChartLabels: Label[] = [];
public pieChartData: SingleDataSet = [];
public pieChartType: ChartType = 'doughnut';
public pieChartLegend = true;
public pieChartPlugins = [];

//Doughnut chart


}
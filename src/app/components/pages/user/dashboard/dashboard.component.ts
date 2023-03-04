import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { ChartDataSets, ChartOptions, ChartType, RadialChartOptions  } from 'chart.js';
import { Label, Color, SingleDataSet } from 'ng2-charts';
import { NotifyService } from '../../../../services/notification.service';
import { CountryDropdown } from '../../../../helpers/countries.js';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private userService:UserService,
    private notify:NotifyService,
    private router:ActivatedRoute
  ) { 
  
   }

  confirmAccessForm:FormGroup;
  updateUserForm:FormGroup;
   userId:any;
   countryList = CountryDropdown;

   public radarChartOptions: RadialChartOptions = {
    responsive: true,
  };
  public radarChartLabels: Label[] = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];

  public radarChartData: ChartDataSets[] = [
    { data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B' }
  ];
  public radarChartType: ChartType = 'radar';

   public barChartLabels: Label[] = [];
   public barLabels = [];
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
       backgroundColor: '#F0F0F0',
       categoryPercentage: 0.5
     },
   ];

   
  // coin holding

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
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  ngOnInit(): void {
    this.router.params.subscribe((routeParams) => {
      this.userId = routeParams.id;
    });
 
      this.confirmAccessForm = this.fb.group({
       password:[null,[Validators.required]],
     });
     this.updateUserForm = this.fb.group({
      username: [null,[Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('^[a-zA-Z ]*$')]],
      emailaddress : [null,[Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      dob: [null,[Validators.required]],
      mobile: [null,[Validators.required, Validators.pattern('^(0|[+91]{3})?[0-9][0-9]{9,14}$')]],
      country: [null,[Validators.required]],
      zipcode:[null,[Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(6),Validators.maxLength(10)]],
    });
      this.viewUserDetail(this.userId);
     this.currentAssets(this.userId)
     this.changeDashboardType();
     this.coinHolding();
  }

    //View user
    userDetailData:any;

    viewUserDetail(id){
      this.userService.viewUser(id).subscribe((res)=>{
        if(res['success']){
          this.userDetailData = res['data']['user'];
          this.userVerify = this.userDetailData.isVerified;
          this.emailVerify = this.userDetailData.enableEmailVerification;
        }
      })
    }

    //user Edit
    userVerify = false;
    emailVerify = false;
    referral = 'vino';
    isEdit = false;
    editUser(){
      this.isEdit = true;
      let val = {
        name:this.updateUserForm.value.username,
        email:this.updateUserForm.value.emailaddress,
        country:this.updateUserForm.value.country,
        DOB:this.updateUserForm.value.dob,
        zipcode:this.updateUserForm.value.zipcode,
        mobileNum:this.updateUserForm.value.mobile
      }
       this.userService.updateUser(this.userId,val).subscribe((res)=>{
        if(res['success']){
          this.notify.success(res['message']);
          this.userDetailData.name = val.name;
          this.userDetailData.email = val.email;
          this.userDetailData.country = val.country;
          this.userDetailData.DOB = val.DOB;
          this.userDetailData.zipcode = val.zipcode;
          this.userDetailData.mobileNum = val.mobileNum;
          this.isEdit = false;
          this.handleCancel();
        }else{
          this.notify.error(res['message']);
          this.isEdit = false;
        }
      },(err)=>{
        this.notify.error(err.error.message);
        this.isEdit = false;
      })
    }
  
  

    //Trade Decision
    tradeDecisionData:any;

    getTradeDecision(id){
      this.userService.tradeDecision(id).subscribe((res)=>{
        if(res['success']){
          this.tradeDecisionData = res['data']
        }
      })
    }

    getFxTradeDecision(id){
      this.userService.tradeFXDecision(id).subscribe((res)=>{
        if(res['success']){
          this.tradeDecisionData = res['data']
        }
      })
    }
    //Daily Profit
    dailyProfitData:any;
    public GraphData = []
    getDailyProfit(id){
      this.barChartData[0].data = [];
      this.barChartLabels = [];
      
      this.userService.dailyProfit(id).subscribe((res)=>{
        if(res['success']){
          this.dailyProfitData = res['result']['returns'];
          this.GraphData = res['result']['graph'];
          if (this.GraphData) {
            this.GraphData['USDT'].forEach(element => {
              let date = new Date(element.day);
              let day = date.getDate();
              this.barChartLabels.push(day.toString());
              this.barChartData[0].data.push(element.profit);
            });
            this.FillProfit()
           }
        }
      })
    }

    getFXDailyProfit(id){
      this.barChartData[0].data = [];
      this.barChartLabels = [];  
      this.userService.dailyFXProfit(id).subscribe((res)=>{
        if(res['success']){
          this.dailyProfitData = res['result']['returns'];
          this.GraphData = res['result']['graph'];
          if (this.GraphData) {
            this.GraphData['USDT'].forEach(element => {
              let date = new Date(element.day);
              let day = date.getDate();
              this.barChartLabels.push(day.toString());
              this.barChartData[0].data.push(element.profit);
            });
            this.FillProfit();
           //  resolve();
        }
        }
      })
    }

    FillProfit() {
      let profitData = [];
      let data = []
      if(this.barChartData[0].data.length > 0){
        this.barChartData[0].data.forEach(element => {
        profitData.push(element)
        data.push(Math.abs(element))
        });  
      }
      let backgroundColor = profitData.map((item) =>
        item < 0 ? "#F72A63" : "#00BCC7"
      );
      let hoverBackgroundColor = profitData.map((item) =>
      item < 0 ? "#F72A63" : "#00BCC7"
    );
       this.barChartData = [{
        hoverBackgroundColor,
        data:data,
        backgroundColor,
        label:'USDT',
      }]
  
    }
  
    //Signal Accuracy
    singalData:any = 0;

    spotSignal(val){
      this.userService.spotSignalAccuracy(val).subscribe((res)=>{
        if(res['success']){
          this.singalData = res['data']['positivePercentage']
        }
      })
    }

    fxSignal(val){
      this.userService.fxSignalAccuracy(val).subscribe((res)=>{
        if(res['success']){
          this.singalData = res['data']['positivePercentage']
        }
      })
    }


    //Current Assets
    currentAssetList:any = [];
    currentAssets(id){
      this.userService.getCurrentAssets(id).subscribe((res)=>{
        if(res['success']){
          this.currentAssetList = res['data']
        }
      })
    }

    //Dashboard Type
    dashboardType = 'SPOT';
    changeDashboardType(){
      if(this.dashboardType == 'SPOT'){
        this.getTradeDecision(this.userId);
        this.getDailyProfit(this.userId);
        this.spotSignal(this.userId)
      }else{
        this.getFxTradeDecision(this.userId);
        this.getFXDailyProfit(this.userId);
        this.fxSignal(this.userId)
      }
    }

    //2nd level authentication
    isConfirmModal = false;
  
    handleCancel(){
      this.isConfirmModal = false;
      this.isVisible = false;
    }
  
    showConfirm(){
      this.isConfirmModal = true;
    }
  
    confirmAccess(){
      if(this.confirmAccessForm.value.password == 12345){
        this.isConfirmModal = false;
      }
      else{
        this.isConfirmModal = true;
      }
      // this.authenticationService.confirmAccess(val).subscribe((res)=>{
      //   if(res['success']){
  
      //   }else{
  
      //   }
      // })
    }


    isVisible = false;

    showModal(): void {
      this.isVisible = true;
    }
  
    handleOk(): void {
      this.isVisible = false;
    }
    
//Coin Holding
coinHoldings = [];
coinHolding() {
      this.userService.coinHolding(this.userId).subscribe((data: any) => {
        if (data['success']) {
          this.coinHoldings = data.data.sortPercentage;
          this.pieChartData.push(parseInt(data.data.sortothersPercentage));
          this.pieChartLabels.push('Others')
          this.coinHoldings.forEach(element => {
            this.pieChartData.push(parseInt(element.percentage));
            this.pieChartLabels.push(element.symbol);
            // this.piechartColors[0].backgroundColor.push(this.getRandomColor())
          });
          // this.coinValue = 'BTCUSDT'
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

//Date disable
disabledDate = (current: Date): boolean => {
  var date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return current > date;
};

}

import { Component } from '@angular/core';
import { NotifyService } from '../../../services/notification.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { SitesettingService } from '../../../services/sitesetting.service';
import {
  FormBuilder,
  FormGroup,
  Validators, FormControl
} from '@angular/forms';
import { Url } from '../../../shared/constant/url';

@Component({
  selector: 'app-admin-setting',
  templateUrl: './admin-setting.component.html',
  styleUrls: ['./admin-setting.component.scss']
})
export class AdminSettingComponent {

  ShowShowButton(i,type) {
    var disable = document.getElementById('disable'+i);
    disable.className = 'dis-type display-true';
    var show = document.getElementById('show'+i);
    show.className = 'disp-type display-false';
    if(type=='image'){
      var imageshow = document.getElementById('imageshow'+i);
      imageshow.className = 'dis-true attachment-item post-file';  
      var preview = document.getElementById('previewimageshow'+i);
      preview.className = 'dis-true img-file';
      var actualImage =  document.getElementById('imagenone' + i);
      actualImage.className = 'display-false img-file';
  }
    this.listForm.controls[this.listOfControl[i].controlInstance].enable();
  }
  ShowHideButton(i,type) {
    var show = document.getElementById('show'+i);
    show.className = 'disp-type display-true';
    var disable = document.getElementById('disable'+i);
    disable.className = 'disp-type display-false';
    if(type == 'image'){
      var imageshow = document.getElementById('imageshow'+i);
      imageshow.className = 'display-false img-file';
      var preview = document.getElementById('previewimageshow'+i);
      preview.className = 'display-false img-file';
      var actualImage =  document.getElementById('imagenone' + i);
      actualImage.className = 'display-true img-file';
    }
    this.listForm.controls[this.listOfControl[i].controlInstance].disable();
  }

  switchValue = true;
  imgUrl = Url.imageUrl;

  constructor(
    private notify: NotifyService,
    private fb: FormBuilder,
    private siteSettingService: SitesettingService
  ) { }

  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }


  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  fileList: NzUploadFile[] = [];
  
  ngOnInit(): void {
    this.siteSettingForm = this.fb.group({
      value: [null, [Validators.required]],
      key: [null, [Validators.required]],
      type: ['Text', [Validators.required]],
      secure: [false]
    });
    this.listForm = this.fb.group({});
    this.getSiteSettingList();
  }

  //create site setting
  siteSettingForm: FormGroup;
  type = 'text';
  formData: any = new FormData();
  isLoad = false;
  createSetting() {
    this.isLoad = true;
    let val = {
      key: this.siteSettingForm.value.key,
      title: this.siteSettingForm.value.value,
      type: this.type,
      secure: this.siteSettingForm.value.secure
    }
    this.siteSettingService.createSetting(val).subscribe((res) => {
      if (res['success']) {
        this.notify.success(res['message']);
        this.getSiteSettingList();
        this.isLoad = false;
        this.handleCancel();
        this.siteSettingForm.reset();
      } else {
        this.isLoad = false;
        this.notify.error(res['message'])
      }
    }, (err) => {
      this.isLoad = false;
      this.notify.error(err.error.message)
    })
  }

  siteSettingList = [];
  listForm: FormGroup;
  listOfControl: Array<{
    id: number; controlInstance: string; value: string; edit: boolean;
  }> = [];
  getSiteSettingList() {
    this.siteSettingService.siteSettingList().subscribe((res) => {
      if (res['success']) {
        this.siteSettingList = res['data'];
        this.listOfControl = [];

        this.siteSettingList.forEach(element => {
          const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;
              const control = {
              id,
              controlInstance: `create${id}`,
              value: '',
              edit: false
            };
             if (element.type == 'text' ||  element.type == 'date' || 
              element.type == 'url') {
                 const index = this.listOfControl.push(control);
                this.listForm.addControl(
                this.listOfControl[index - 1].controlInstance,
                new FormControl({ value: element.value, disabled: true }, Validators.required)
              );
            }
            if (element.type == 'email') {
              const index = this.listOfControl.push(control);
              this.listForm.addControl(
                this.listOfControl[index - 1].controlInstance,
                new FormControl({ value: element.value, disabled: true }, Validators.required)
              );
            }

            if (element.type == 'tel') {
              const index = this.listOfControl.push(control);
              this.listForm.addControl(
                this.listOfControl[index - 1].controlInstance,
                new FormControl({ value: element.value, disabled: true }, Validators.required)
              );
            }
           
            if ( element.type == 'toggle' || element.type == 'boolean') {
              let val = element.value === 'true'?true:false;
              const index = this.listOfControl.push(control);
              this.listForm.addControl(
                this.listOfControl[index - 1].controlInstance,
                new FormControl({ value: val, disabled: true }, Validators.required)
              );
            }
           if(element.type == 'image'){
              this.url.push(this.imgUrl + element.value);
              const index = this.listOfControl.push(control);
              this.listOfControl[index-1].value = this.imgUrl + element.value
            }
           
           
        });
      }
    })
  }
  url = [];
  onFileChange(e: any) {
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.url.push(event.target.result);
      }
      this.fileList.push(e.target.files[0]);
    }
  }


  updateSiteSetting(i, data,secure) {
     this.formData = new FormData();
    this.formData.delete('value');
  
    if(secure == null){
      if (data.type != 'image') {
        this.formData.append('key', data.key)
        this.formData.append('value', this.listForm.value[this.listOfControl[i].controlInstance])
      }
      if (data.type == 'image') {
        if (this.fileList.length > 0) {
          // for (let file of this.fileList) {
            this.formData.append('key', data.key)
          this.formData.append('value', this.fileList[0]);
          // }
        }
      }
    }else{
      this.formData.append('key', data.key)
       this.formData.append('secure', secure)
    }
   
    this.formData.append('id', data._id)
     this.siteSettingService.updateSitesetting(this.formData).subscribe((res) => {
      if (res['success']) {
        this.notify.success(res['message']);
        if(data.type != 'image'){
          data.value = this.listForm.value[this.listOfControl[i].controlInstance]
        }
        if(data.type == 'image'){
          this.listOfControl[i].value = this.url[this.url.length-1]
        }
         this.ShowHideButton(i,data.type);
      } else {
        this.notify.error(res['message'])
      }
    }, (err) => {
      this.notify.error(err.error.message)
    })
  }

  deleteSetting(id){
    this.siteSettingService.deleteSiteSetting(id).subscribe((res)=>{
      if(res['success']){
        this.notify.success(res['message']);
        this.getSiteSettingList();
      }else{
        this.notify.success(res['message'])
      }
    },(err)=>{
      this.notify.error(err.error.message)
    })
  }

  typeChange(val) {
  }

}

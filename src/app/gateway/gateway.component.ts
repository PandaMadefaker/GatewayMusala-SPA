import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, NgForm, FormControl, FormControlDirective } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-gateway',
  templateUrl: './gateway.component.html',
  styleUrls: ['./gateway.component.css']
})
export class GatewayComponent implements OnInit {
  gateways: any;
  closeResult: string;
  Adding = true;
  peripherals: any;
  gateway: any;
  gatewayForm: FormGroup;

  dropdownList = [];

  selectedItems = [];

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: false,
    limitSelection: 10
  };

  constructor(private http: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    this.getGateways();
    this.getPeripherals();
    this.gatewayForm = new FormGroup({
      name: new FormControl(),
      serialNumber: new FormControl(),
      iPv4Address: new FormControl(),
      peripherals: new FormControl()
    });
  }

  getGateways(){
    this.http.get('http://localhost:5000/gateways').subscribe(response => {
      this.gateways = response;
    }, error => {
        console.log(error);
    });
  }

  getPeripherals(){
    this.http.get('http://localhost:5000/peripherals').subscribe(response => {
      this.peripherals = response;
      if (response !== []){
      this.dropdownList = [];
      this.peripherals.forEach(element => {
        this.dropdownList.push({item_id: element.id, item_text: element.uId});
      });
    }
    }, error => {
        console.log(error);
    });
  }

  open(content) {
    this.Adding = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  onSubmit(){
    console.log(this.gatewayForm.value);
    let tempGateway = {};
    if (this.Adding){
      tempGateway = {
        name: this.gatewayForm.value.name,
        serialNumber: this.gatewayForm.value.serialNumber,
        iPv4Address: this.gatewayForm.value.iPv4Address
      };
      this.http.post('http://localhost:5000/gateways/createGateway', tempGateway).subscribe(response => {
          console.log(response);
      });
    }
    else{
      tempGateway = {
        id: this.gateway.id,
        name: this.gatewayForm.value.name,
        serialNumber: this.gatewayForm.value.serialNumber,
        iPv4Address: this.gatewayForm.value.iPv4Address
      };
      this.http.put('http://localhost:5000/gateways/' + this.gateway.id, tempGateway).subscribe(response => {
        console.log(response);
    });
    }
    this.selectedItems.forEach(element => {
      this.http.get('http://localhost:5000/peripherals/' + element.item_id).subscribe(response => {
        const peripheral = response as any;
        peripheral.idGateway = this.gateway.id;
        this.http.put('http://localhost:5000/peripherals/' + peripheral.id, peripheral).subscribe(res => {
          console.log(res);
        });
      }, error => {
          console.log(error);
      });
    });
    this.modalService.dismissAll();

  }

  onItemSelect(item: any) {
    if (!this.selectedItems.some(x => x.item_id === item.item_id)){
      this.selectedItems.push(item);
      console.log(item);
    }

  }
  onSelectAll(items: any) {
    this.selectedItems = [];
    this.selectedItems.push(items);
    console.log(items);
  }

  onEditGateway(item: number, content){
    this.selectedItems = [];
    this.http.get('http://localhost:5000/peripherals').subscribe(response => {
        const peripherals: any[] = response as [];
        peripherals.forEach(element => {
          if (element.idGateway === item){
              this.selectedItems.push({
                item_id: element.id,
                item_text: element.uId
              });
          }
        });
    });
    this.http.get('http://localhost:5000/gateways/' + item).subscribe(response => {
      this.gateway = response;
      this.open(content);
      this.Adding = false;
      this.gatewayForm.setValue({
        serialNumber: this.gateway.serialNumber,
        name: this.gateway.name,
        iPv4Address: this.gateway.iPv4Address,
        peripherals: this.selectedItems
      });
    }, error => {
        console.log(error);
    });
  }

  OnDelete(item: number){
    this.http.delete('http://localhost:5000/gateways/' + item).subscribe(response => {
      console.log(response);
    });
  }
}

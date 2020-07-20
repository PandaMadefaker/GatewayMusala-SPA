import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbModal, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-peripheral',
  templateUrl: './peripheral.component.html',
  styleUrls: ['./peripheral.component.css']
})
export class PeripheralComponent implements OnInit {
  peripherals: any;
  closeResult: string;
  Adding = true;
  peripheral: any;
  peripheralForm: FormGroup;
  constructor(private http: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    this.getPeripherals();
    this.peripheralForm = new FormGroup({
      uId: new FormControl(),
      vendor: new FormControl(),
      isOnline: new FormControl(),
      dateCreated: new FormControl()
    });
  }

  getPeripherals(){
    this.http.get('http://localhost:5000/peripherals').subscribe(response => {
      this.peripherals = response;
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
    console.log(this.peripheralForm.value);
    let tempPeripheral = {};
    if (this.Adding){
      tempPeripheral = {
        uId: this.peripheralForm.value.uId,
        vendor: this.peripheralForm.value.vendor,
        isOnline: this.peripheralForm.value.isOnline,
        dateCreated: this.peripheralForm.value.dateCreated
      };
      this.http.post('http://localhost:5000/peripherals/createPeripheral', tempPeripheral).subscribe(response => {
          console.log(response);
      });
    }
    else{
      tempPeripheral = {
        id: this.peripheral.id,
        uId: this.peripheralForm.value.uId,
        vendor: this.peripheralForm.value.vendor,
        isOnline: this.peripheralForm.value.isOnline,
        dateCreated: this.peripheralForm.value.dateCreated
      };
      this.http.put('http://localhost:5000/peripherals/' + this.peripheral.id, tempPeripheral).subscribe(response => {
        console.log(response);
      });
    }
    this.modalService.dismissAll();

  }

  onEditPeripheral(item: number, content){
    this.http.get('http://localhost:5000/peripherals/' + item).subscribe(response => {
      this.peripheral = response;
      this.open(content);
      this.Adding = false;
      this.peripheralForm.setValue({
        uId: this.peripheral.uId,
        vendor: this.peripheral.vendor,
        isOnline: this.peripheral.isOnline,
        dateCreated: this.peripheral.dateCreated,
      });
    }, error => {
        console.log(error);
    });
  }

  OnDelete(item: number){
    this.http.delete('http://localhost:5000/peripherals/' + item).subscribe(response => {
      console.log(response);
    });
  }
}

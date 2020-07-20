import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GatewayComponent } from './gateway/gateway.component';
import { PeripheralComponent } from './peripheral/peripheral.component';
import { HttpClientModule } from '@angular/common/http';
import { AlertifyService } from '../app/services/alertify.service';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
   declarations: [
      AppComponent,
      GatewayComponent,
      PeripheralComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      BsDropdownModule.forRoot(),
      NgbModule,
      FormsModule,
      NgMultiSelectDropDownModule.forRoot(),
      ReactiveFormsModule
   ],
   providers: [
      AlertifyService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }

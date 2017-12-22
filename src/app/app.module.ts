import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { MapService } from './services/map.service';
import { NextbusApiService } from './services/nextbus-api.service';
import { RoutesDropdownComponent } from './components/routes-dropdown/routes-dropdown.component';

@NgModule({
  declarations: [AppComponent, MapComponent, RoutesDropdownComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatSelectModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule
  ],
  providers: [MapService, NextbusApiService],
  bootstrap: [AppComponent]
})
export class AppModule {}

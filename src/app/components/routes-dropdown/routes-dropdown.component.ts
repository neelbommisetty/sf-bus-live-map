import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material';

@Component({
  selector: 'app-routes-dropdown',
  templateUrl: './routes-dropdown.component.html',
  styleUrls: ['./routes-dropdown.component.css']
})
export class RoutesDropdownComponent implements OnInit {

  @Input('routes') routes;
  @Output('routeSelected') routeSelected = new EventEmitter<any>();
  @ViewChild('dropdown') dropdown: MatSelect;

  ngOnInit() { }

  onSelectionChanged(e) {
    this.routeSelected.emit(e);
    this.dropdown.close();
  }
}

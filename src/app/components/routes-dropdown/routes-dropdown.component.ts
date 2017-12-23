import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-routes-dropdown',
  templateUrl: './routes-dropdown.component.html',
  styleUrls: ['./routes-dropdown.component.css']
})
export class RoutesDropdownComponent implements OnInit {

  @Input('routes') routes;
  @Output('routeSelected') routeSelected = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  onSelectionChanged(e) {
    this.routeSelected.emit(e);
  }
}

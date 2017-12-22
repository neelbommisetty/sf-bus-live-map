import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-routes-dropdown',
  templateUrl: './routes-dropdown.component.html',
  styleUrls: ['./routes-dropdown.component.css']
})
export class RoutesDropdownComponent implements OnInit {
  routeForm= new FormControl();

  @Input('routes') routes;

  constructor() { }

  ngOnInit() {
  }

}

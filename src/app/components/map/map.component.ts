import { Component, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { GeoProjection, GeoPath } from 'd3';
import { MatSnackBar } from '@angular/material';
import { Selection } from 'd3-selection';

import { NextbusApiService } from '../../services/nextbus-api.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnDestroy {
  rootSvg: Selection<any, any, any, any>;
  projection: GeoProjection;
  path: GeoPath<any, any>;
  routeData: any;
  interval;
  selectedRoutes: any[] = [];

  constructor(
    private element: ElementRef,
    private mapService: MapService,
    private nextBusApi: NextbusApiService,
    public snackBar: MatSnackBar
  ) {}

  ngAfterViewInit() {
    this.rootSvg = this.mapService.getRootSvgSelection('map-holder');
    this.projection = this.mapService.getProjection();
    this.path = this.mapService.getPathWithProjection(this.projection);
    this.renderMapWithData();
    this.nextBusApi.getRoutes()
      .then((res: any) => {
          this.routeData = res.route;
      })
      .catch((err) => {
        console.log(err);
        this.snackBar.open('Failed To Fetch Route Data. Try Again!');
      });
  }

  async renderMapWithData() {
    const streetsData = await this.mapService.getMapTypeData('streets');
    this.mapService.drawMap(this.rootSvg, streetsData, 'streets', this.path);

    const arteriesData = await this.mapService.getMapTypeData('arteries');
    this.mapService.drawMap(this.rootSvg, arteriesData, 'arteries', this.path);

    const freewaysData = await this.mapService.getMapTypeData('freeways');
    this.mapService.drawMap(this.rootSvg, freewaysData, 'freeways', this.path);

    const neighborhoodsData = await this.mapService.getMapTypeData('neighborhoods');
    this.mapService.drawMap(this.rootSvg, neighborhoodsData, 'neighborhoods', this.path);
  }

  onRoutesSelected(e) {
    this.selectedRoutes = e.value;
    const routeTags = this.selectedRoutes.map(route => route.tag);
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.drawBusesForSelectedRoutes(routeTags); // initial drawing
    this.interval = setInterval(() => {
      this.drawBusesForSelectedRoutes(routeTags); // repeat every 15 secs
    }, 15000);
  }

  drawBusesForSelectedRoutes(routeTags) {
    const busApiPromises = [];
    routeTags.forEach(tag => {
      busApiPromises.push(this.nextBusApi.getBuses(tag));
    });
    Promise.all(busApiPromises).then((busRes) => {
        this.mapService.drawBuses(this.rootSvg, busRes);
    })
    .catch(err => {
      console.log(err);
      this.snackBar.open('Failed To Fetch Live Bus Data For Selected Routes. Try Again!');
    });
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}

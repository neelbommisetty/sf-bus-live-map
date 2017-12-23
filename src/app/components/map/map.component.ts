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
  isLoading = true;

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
    this.nextBusApi.getRoutes()
      .then((res: any) => {
        this.routeData = res.route;
        this.isLoading = false;
      })
      .catch((err) => {
        console.log(err);
        this.isLoading = false;
        this.snackBar.open('Failed To Fetch Route Data. Try Again!');
      });
    this.renderMapWithData();
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
    this.isLoading = true;
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
      this.isLoading = false;
      const busData =  busRes
        .map(data => data.vehicle)
        .filter(data => data) // removing empty objects
        .reduce((prev, curr) => prev.concat(curr), []); // flatteing the array.

      if (busData.length <= 0) {
        this.snackBar.open('No Buses Live For Select Route');
        return;
      }
      this.mapService.drawBuses(this.rootSvg, busData);

    })
    .catch(err => {
      console.log(err);
      this.isLoading = false;
      this.snackBar.open('Failed To Fetch Live Bus Data For Selected Routes. Try Again!');
    });
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}

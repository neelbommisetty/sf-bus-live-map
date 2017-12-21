import { MapService } from '../../services/map.service';
import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { json, GeoProjection, GeoPath } from 'd3';
import { Selection } from 'd3-selection';
import { NextbusApiService } from '../../services/nextbus-api.service';
import { interval } from 'rxjs/observable/interval';
import { flatMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  className = 'map-holder';
  rootSvg: Selection<any, any, any, any>;
  projection: GeoProjection;
  path: GeoPath<any, any>;
  constructor(
    private element: ElementRef,
    private mapService: MapService,
    private nextBusApi: NextbusApiService
  ) {}

  ngAfterViewInit() {
    this.rootSvg = this.mapService.getRootSvgSelection('map-holder');
    this.projection = this.mapService.getProjection();
    this.path = this.mapService.getPathWithProjection(this.projection);
    this.renderMapWithData();
    this.nextBusApi.getRoutes().subscribe((res: any) => {
      res.route.forEach(route => {
        this.mapService.renderRoute(this.rootSvg, route);
      });
      this.nextBusApi.getBuses().subscribe((busRes: any) => {
        this.mapService.drawBuses(this.rootSvg, busRes.vehicle);
      });
      interval(15000)
        .pipe(flatMap(() => this.nextBusApi.getBuses()))
        .subscribe((busRes: any) => {
          this.mapService.drawBuses(this.rootSvg, busRes.vehicle);
        });
    });
  }

  async renderMapWithData() {
    const makePromise = fun => new Promise((res, rej) => fun(res, rej));
    const streetsData = await makePromise((res, rej) => {
      json('../../../assets/data/streets.json', (err, data: any) => {
        if (err) {
          rej(err);
        }
        res(data);
      });
    });
    this.mapService.drawMap(this.rootSvg, streetsData, 'streets', this.path);
    const freewaysData = await makePromise((res, rej) => {
      json('../../../assets/data/freeways.json', (err, data: any) => {
        if (err) {
          rej(err);
        }
        res(data);
      });
    });
    this.mapService.drawMap(this.rootSvg, freewaysData, 'freeways', this.path);
    const arteriesData = await makePromise((res, rej) => {
      json('../../../assets/data/arteries.json', (err, data: any) => {
        if (err) {
          rej(err);
        }
        res(data);
      });
    });
    this.mapService.drawMap(this.rootSvg, arteriesData, 'arteries', this.path);
    const neighborhoodsData = await makePromise((res, rej) => {
      json('../../../assets/data/neighborhoods.json', (err, data: any) => {
        if (err) {
          rej(err);
        }
        res(data);
      });
    });
    this.mapService.drawMap(
      this.rootSvg,
      neighborhoodsData,
      'neighborhoods',
      this.path
    );
  }
}

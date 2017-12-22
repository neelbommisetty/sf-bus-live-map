import { Component, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { flatMap, tap } from 'rxjs/operators';
import { interval } from 'rxjs/observable/interval';
import { json, GeoProjection, GeoPath } from 'd3';
import { MatSnackBar } from '@angular/material';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Selection } from 'd3-selection';
import { Subject } from 'rxjs/Subject';

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
  endSubject: Subject<boolean> = new Subject();
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
    this.nextBusApi.getRoutes().toPromise().then((res: any) => {
      // res.route.forEach(route => {
      //   this.mapService.renderRoute(this.rootSvg, route);
      // });
      this.routeData = res.route;
      this.nextBusApi.getBuses().subscribe((busRes: any) => {
        this.mapService.drawBuses(this.rootSvg, busRes.vehicle);
      });
      interval(15000)
        .pipe(
          flatMap(() => this.nextBusApi.getBuses()),
          takeUntil(this.endSubject)
        )
        .subscribe((busRes: any) => {
          this.mapService.drawBuses(this.rootSvg, busRes.vehicle);
        }, err => {
          console.log(err);
          this.snackBar.open('Failed To Fetch Live Bus Data For Selected Routes. Try Again!');
        });
    }, (err) => {
      console.log(err);
      this.snackBar.open('Failed To Fetch Route Data. Try Again!');
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
    const arteriesData = await makePromise((res, rej) => {
      json('../../../assets/data/arteries.json', (err, data: any) => {
        if (err) {
          rej(err);
        }
        res(data);
      });
    });
    this.mapService.drawMap(this.rootSvg, arteriesData, 'arteries', this.path);
    const freewaysData = await makePromise((res, rej) => {
      json('../../../assets/data/freeways.json', (err, data: any) => {
        if (err) {
          rej(err);
        }
        res(data);
      });
    });
    this.mapService.drawMap(this.rootSvg, freewaysData, 'freeways', this.path);
    const neighborhoodsData = await makePromise((res, rej) => {
      json('../../../assets/data/neighborhoods.json', (err, data: any) => {
        if (err) {
          rej(err);
        }
        res(data);
      });
    });
    this.mapService.drawMap(this.rootSvg, neighborhoodsData, 'neighborhoods', this.path);
  }

  ngOnDestroy() {
    this.endSubject.next();
  }
}

import { HttpClient } from '@angular/common/http';
import { selection } from 'd3-selection';
import { Injectable } from '@angular/core';
import { geoMercator, geoPath } from 'd3-geo';
import { select, line } from 'd3';

import IPoint from '../models/Point';
import IPathElement from '../models/Path';
import IVehicle from '../models/Vehicle';

@Injectable()
export class MapService {

  private projection = geoMercator()
    .scale(275000)
    .center([-122.465, 37.8]);

  private routeLineFunction = line<IPoint>()
    .x((d: IPoint) => this.projection([d.lon, d.lat])[0])
    .y((d: IPoint) => this.projection([d.lon, d.lat])[1]);

  constructor(private http: HttpClient) {}

  getProjection() {
    return this.projection;
  }

  getPathWithProjection(projection) {
    return geoPath().projection(projection);
  }

  getMapTypeData(type) {
    const url = `assets/data/${type}.json`;
    return this.http.get(url).toPromise();
  }

  drawMap(svg, json, className, path) {
    return svg
      .append('path')
      .datum(json)
      .attr('class', `map ${className}`)
      .style('fill', 'none')
      .attr('d', path);
  }

  getRootSvgSelection(className) {
    return select(`.${className}`)
      .append('svg')
      .attr('class', 'root-svg')
      .attr('width', '100%')
      .attr('height', '100%');
  }

  drawBuses(rootSvg, busData) {
    rootSvg.selectAll('.bus').remove(); // clearing existing buses

    const nonEmptyBuses = busData
      .map(data => data.vehicle)
      .filter(data => data) // removing empty objects
      .reduce((prev, curr) => prev.concat(curr), []); // flatteing the array.

    const buses = rootSvg.selectAll('.bus').data(nonEmptyBuses);

    buses
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#ff8c00')
      .attr('fill-opacity', '0.75')
      .attr('class', 'bus')
      .attr('cx', (d: IVehicle) => this.projection([d.lon, d.lat])[0])
      .attr('cy', (d: IVehicle) => this.projection([d.lon, d.lat])[1]);

    buses.exit().remove();
  }
}

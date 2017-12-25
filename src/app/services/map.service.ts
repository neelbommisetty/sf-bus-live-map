import { Injectable } from '@angular/core';
import { select, line, json } from 'd3';
import { geoMercator, geoPath } from 'd3-geo';
import { selection } from 'd3-selection';

import IPoint from '../models/Point';
import IVehicle from '../models/Vehicle';

@Injectable()
export class MapService {

  private projection = geoMercator()
    .scale(275000)
    .center([-122.465, 37.8]);

  private routeLineFunction = line<IPoint>()
    .x((d: IPoint) => this.projection([d.lon, d.lat])[0])
    .y((d: IPoint) => this.projection([d.lon, d.lat])[1]);

  getProjection() {
    return this.projection;
  }

  getPathWithProjection(projection) {
    return geoPath().projection(projection);
  }

  getMapTypeData(type) {
    const url = `../../assets/data/${type}.json`;
    return new Promise((resolve, reject) => {
      json(url, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  drawMap(svg, data, className, path) {
    return svg
      .append('path')
      .datum(data)
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

    const buses = rootSvg.selectAll('.bus').data(busData);

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

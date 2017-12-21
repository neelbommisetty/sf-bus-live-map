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
    .scale(200000)
    .center([-122.4194, 37.7749]);

  private routeLineFunction = line<IPoint>()
    .x((d: IPoint) => {
      return this.projection([d.lon, d.lat])[0];
    })
    .y((d: IPoint) => {
      return this.projection([d.lon, d.lat])[1];
    });

  constructor() {}

  getProjection() {
    return this.projection;
  }
  getPathWithProjection(projection) {
    return geoPath().projection(projection);
  }

  drawMap(svg, json, className, path) {
    // const path = this.getPathWithProjection(this.projection);
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

  renderRoute(svg, routeData) {
    const tag = routeData.tag;
    routeData.path.forEach((path: IPathElement) => {
      svg
        .append('path')
        .attr('d', this.routeLineFunction(path.point))
        .attr('class', 'route')
        .attr('data-tag', tag)
        .attr('stroke', `#${routeData.color}`)
        .attr('stroke-width', 2)
        .style('stroke-opacity', 0.5)
        .attr('fill', 'none')
        .append('svg:title')
        .text(function(d) {
          return routeData.title;
        });
    });
  }

  drawBuses(rootSvg, busData) {
    rootSvg.selectAll('.bus').remove();

    const nonEmptyBuses = busData.filter(data => data);
    const buses = rootSvg.selectAll('.bus').data(nonEmptyBuses);

    // find it impossible to redraw and locate the pin
    // use simple symbole circle instead
    buses
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#f0027f')
      .attr('fill-opacity', '0.75')
      .attr('class', 'bus')
      .attr('data-route-tag', (d: IVehicle) => d.routeTag)
      .attr('data-dir-tag', (d: IVehicle) => d.dirTag)
      .attr('data-heading', (d: IVehicle) => d.heading)
      .attr('data-id', (d: IVehicle) => d.id)
      .attr('cx', (d: IVehicle) => this.projection([d.lon, d.lat])[0])
      .attr('cy', (d: IVehicle) => this.projection([d.lon, d.lat])[1]);

    buses.exit().remove();
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NextbusApiService {
  private basePath = 'http://webservices.nextbus.com/service/publicJSONFeed';
  private agency = 'sf-muni';
  constructor(private http: HttpClient) {}

  getRoutes(routeTag?) {
    const url = `${this.basePath}?a=sf-muni&command=routeConfig${
      routeTag ? `&r=${routeTag}` : ''
    }`;
    return this.http.get(url).toPromise();
  }

  getBuses(routeTag?) {
    const url = `${
      this.basePath
    }?a=sf-muni&command=vehicleLocations&t=${new Date().valueOf()}${
      routeTag ? `&r=${routeTag}` : ''
    }`;
    return this.http.get(url).toPromise();
  }
}

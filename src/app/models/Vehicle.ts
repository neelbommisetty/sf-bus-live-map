export default interface IVehicle {
  dirTag: string;
  heading: string;
  id: number;
  lat: number;
  lon: number;
  predictable: boolean;
  routeTag: string;
  speedKmHr: number;
  secsSinceReport: number;
}

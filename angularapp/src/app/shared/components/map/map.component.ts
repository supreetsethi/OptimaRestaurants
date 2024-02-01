import { Component, Input } from '@angular/core';
import { LayerGroup, LeafletMouseEvent, Marker, layerGroup, map, tileLayer } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  @Input() hasSearchBar: boolean = true;
  map: any;
  markers: LayerGroup = layerGroup();
  addressSearchResults: any[] = [];
  selectedLocation: any;

  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    this.map = map('leafletMap').setView([42.605, 23.39], 10);

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.addLayer(this.markers);
    this.map.on('click', (e: LeafletMouseEvent) => this.onMapClick(e));
  }

  onMapClick(e: LeafletMouseEvent): void {
    this.markers.clearLayers();

    const marker = new Marker(e.latlng);
    this.markers.addLayer(marker);
    marker.bindPopup(`<b>Избрахте локация!</b><br>${marker.getLatLng().lat.toFixed(6)} ${marker.getLatLng().lng.toFixed(6)}.`).openPopup();
  }

  searchAddress(userInput: any) {
    const apiKey = 'c7e582b61584497ca5c4d41eca86078a';
    const searchString = userInput.target.value;
    const limitResults = 3;

    var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${searchString}&format=json&limit=${limitResults}&apiKey=${apiKey}`;

    if (searchString.length >= 3) {
      fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(result => this.addressSearchResults = result.results)
        .catch(error => console.log('error', error));
    }
    else {
      this.addressSearchResults = [];
    }
  }
}

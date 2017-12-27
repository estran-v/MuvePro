import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {NgMapApiLoader} from "ng2-map";
import {AgmCoreModule, AgmMap} from "@agm/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";

declare var google: any;

@Component({
  selector: 'app-muves',
  templateUrl: './muves.component.html',
  styleUrls: ['./muves.component.css']
})
export class MuvesComponent implements OnInit {

  public lat = 45.7381506;
  public lng = 4.83750729999997;
  public latConfirm = 45.7381506;
  public lngConfirm = 4.83750729999997;
  public zoom = 12;
  public whereTo;
  public pickPos = false;
  public place = {
    formatted_address: '',
    geometry: {
      location: {
        lat: (): number => {
          return 1;
        },
        lng: (): number => {
          return 1;
        }
      }
    }
  };
  public formSubmitted = false;
  public muve = {
    title: '',
    artist: '',
    position: {
      lat: null,
      lng: null
    },
    description: '',
    radius: 1,
  };
  public positionActive = true;
  public contenuActive = false;
  public confirmationActive = false;
  muveForm = new FormGroup({
    title: new FormControl('', Validators.required),
    artist: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });
  submitted = false;

  constructor() {
  }

  ngOnInit() {
    google.setOnLoadCallback((res) => {
      console.log(res);
    });
  }

  getPlace(address = null, latLng = null) {
    let geocoder = new google.maps.Geocoder();
    let option = {};
    if (address) {
      option = {'address': address, 'region': 'fr'};
    } else if (latLng) {
      option = {'location': latLng, 'region': 'fr'};
    }
    let that = this;
    geocoder.geocode(option, function (results, status) {
      if (status.toString() === 'OK') {
        that.place = results[0];
        that.pickPos = true;
      } else {
      }
    });
  }

  mapClicked($event) {
    this.getPlace(null, new google.maps.LatLng($event.coords.lat, $event.coords.lng));
  }

  selectPos() {
    this.getPlace(this.whereTo);
  }

  checkValidForm() {
    if (!this.muve.title || !this.muve.artist) {
      return false;
    } else {
      return true;
    }
  }

  addNewEmployeeAddress() {
    this.muveForm.reset();
    this.submitted = false;
  }

  handleBtn(btn) {
    this.pickPos = false;
    if (btn === false) {
      return;
    } else {
      this.contenuActive = true;
      this.positionActive = false;
      this.latConfirm = this.place.geometry.location.lat();
      this.lngConfirm = this.place.geometry.location.lng();
    }
  }

  sendContentForm() {

  }
}

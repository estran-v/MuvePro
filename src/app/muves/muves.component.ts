import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {NgMapApiLoader} from "ng2-map";
import {AgmCoreModule, AgmMap} from "@agm/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthHttp} from "angular2-jwt";
import {AuthService} from "../services/auth.service";
import * as _ from "lodash";

declare var google: any;

@Component({
  selector: 'app-muves',
  templateUrl: './muves.component.html',
  styleUrls: ['./muves.component.css']
})
export class MuvesComponent implements OnInit {

  public muvePageLoading = false;
  public muveSent = false;
  public lat = 45.7381506;
  public lng = 4.83750729999997;
  public latConfirm;
  public lngConfirm;
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
    duration: 1
  };
  public muves = [];
  public positionActive = true;
  public contenuActive = false;
  public confirmationActive = false;
  public listActive = false;
  public depotActive = true;
  public sponsoredActive = false;
  muveForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(this.muve.description, Validators.required),
  });
  muveSponsoForm = new FormGroup({
    title: new FormControl(this.muve.title, Validators.required),
    artist: new FormControl(this.muve.artist, Validators.required),
    description: new FormControl(this.muve.description, Validators.required),
    duration: new FormControl(this.muve.duration, Validators.required),
    radius: new FormControl(this.muve.radius, Validators.required)
  });
  public currentDuration = 1;
  public currentRadius = 0.5;
  estimatedPrice = this.muve.duration * this.muve.radius;
  submitted = false;
  loading = false;
  noResult = false;
  pickMusic = false;
  musics = [];
  selectedMusic;

  constructor(private authHttp: AuthHttp,
              private Auth: AuthService) {
    this.muveSponsoForm.valueChanges.subscribe(data => {
      if (data.duration !== this.currentDuration) {
        this.estimatedPrice = data.duration * this.muveForm.value.radius;
        this.currentDuration = data.duration;
      } else if (data.radius !== this.currentRadius) {
        this.estimatedPrice = this.muveForm.value.duration * data.radius;
        this.currentRadius = data.radius;
      }
    });
  }

  ngOnInit() {
    this.authHttp.get(this.Auth.API + '/me/muves').toPromise()
      .then((res) => {
        console.log(res.json());
      }).catch((err) => {
      console.error(err);
    });
    google.setOnLoadCallback((res) => {
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

  searchMusic() {
    if (this.muveForm.value.title) {
      this.loading = true;
      this.pickMusic = true;
      this.noResult = false;
      this.authHttp.get(this.Auth.API + '/musics/search?title=' + this.muveForm.value.title).toPromise()
        .then((res) => {
          if (res.json().results) {
            const local = _.find(res.json().results, r => r.provider === 'Local');
            const youtube = _.find(res.json().results, r => r.provider === 'Youtube');
            const spotify = _.find(res.json().results, r => r.provider === 'Spotify');
            this.musics['local'] = local.items;
            this.musics['youtube'] = youtube.items;
            this.musics['spotify'] = spotify.items;
            if (this.musics['local'].length === 0 && this.musics['youtube'].length === 0 && this.musics['spotify'].length === 0)
              this.noResult = true;
            else
              this.noResult = false;
            this.loading = false;
            console.log(this.musics);
          }
        }).catch((err) => {
        console.error(err);
      });
    }
  }

  selectMusic(music) {
    this.selectedMusic = music;
  }

  sendMuve() {
    this.muvePageLoading = true;
    this.authHttp.post(this.Auth.API + '/muves', {
      music: this.selectedMusic.id,
      content: this.muveForm.value.description,
      lat: this.place.geometry.location.lat(),
      lng: this.place.geometry.location.lng(),
    }).toPromise().then((res) => {
      this.muvePageLoading = false;
      this.muveSent = true;
      this.muves.push(res.json().muve);
    }).catch((err) => {
      console.error(err);
    });
  }
}

import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {AuthHttp} from "angular2-jwt";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  public newDateForm = new FormGroup({
    date: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    venue: new FormControl('', Validators.required),
    hidden: new FormControl(false)
  });
  public passedEvents = [];
  public toComeEvents = [];
  submitted = false;
  public newActive = true;
  public toComeActive = false;
  public passedActive = false;

  public eventEdit;
  public eventEditForm = new FormGroup({
    date: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    venue: new FormControl('', Validators.required),
    hidden: new FormControl(false)
  });

  public deleteModal = false;
  public editModal = false;


  public deleting = false;

  constructor(private authHttp: AuthHttp,
              private Auth: AuthService,
              private route: ActivatedRoute) {
    this.route
      .queryParams
      .subscribe(params => {
        if (params.tab) {
          switch (params.tab) {
            case 'tocome' :
              this.newActive = false;
              this.passedActive = false;
              this.toComeActive = true;
              break;
          }
        }
        console.log(params);
      });
  }

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.passedEvents = [];
    this.toComeEvents = [];
    return this.authHttp.get(this.Auth.API + '/me/events').toPromise()
      .then((res) => {
        res.json().results.forEach(event => {
          if (new Date() < new Date(event.date)) {
            this.toComeEvents.push(event);
          } else if (new Date() > new Date(event.date)) {
            this.passedEvents.push(event);
          }
        });
      }).catch((err) => {
        console.error(err);
      });
  }

  sendNewDateForm() {
    this.newDateForm.value.date = new Date(this.newDateForm.value.date);
    this.authHttp.post(this.Auth.API + '/events', this.newDateForm.value).toPromise()
      .then((res) => {
        this.newDateForm.reset();
        this.getEvents().then((data) => {
          this.newActive = false;
          this.toComeActive = true;
        });
      }).catch((err) => {
      console.error(err);
    });
  }

  sendEditForm() {
    if (this.eventEditForm.valid) {
      this.eventEditForm.value.date = new Date(this.eventEditForm.value.date);
      this.authHttp.put(this.Auth.API + '/events/' + this.eventEdit.id, this.eventEditForm.value).toPromise()
        .then((res) => {
          this.eventEditForm.reset();
          this.eventEdit = null;
          this.getEvents().then((data) => {
            this.editModal = false;
          });
        }).catch((err) => {
        console.error(err);
      });
    }
  }

  deleteEvent() {
    this.deleting = true;
    this.authHttp.delete(this.Auth.API + '/events/' + this.eventEdit.id).toPromise()
      .then((res) => {
        this.deleting = false;
        if (this.toComeEvents.indexOf(this.eventEdit) !== -1) {
          this.toComeEvents.splice(this.toComeEvents.indexOf(this.eventEdit), 1);
        } else if (this.passedEvents.indexOf(this.eventEdit) !== -1) {
          this.passedEvents.splice(this.passedEvents.indexOf(this.eventEdit), 1);
        }
        this.deleteModal = false;
      }).catch((err) => {
      console.error(err);
    });
  }

  createEditForm() {
    this.eventEditForm = new FormGroup({
      date: new FormControl(new Date(this.eventEdit.date), Validators.required),
      city: new FormControl(this.eventEdit.city, Validators.required),
      venue: new FormControl(this.eventEdit.venue, Validators.required),
      hidden: new FormControl(false),
    });
  }

}

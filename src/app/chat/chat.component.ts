import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SailsService} from 'angular2-sails';
import {AuthService} from '../services/auth.service';
import {Observable} from 'rxjs/Observable';
import {AuthHttp} from 'angular2-jwt';
import {find} from 'tslint/lib/utils';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';

import {Pipe, PipeTransform} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Pipe({
  name: 'sort'
})
export class ArraySortPipe implements PipeTransform {
  transform(array: any[], field: string): any[] {
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}

export class Room {
  static URL = 'https://devapi.muve-app.com/';
  friend;
  users;
  messages;
  id;
  updatedAt;
  socket;
  sub;
  newMsg;

  constructor(fetched, public authHttp: AuthHttp, public Auth: AuthService) {
    this.users = fetched.users;
    this.messages = fetched.messages;
    this.id = fetched.id;
    this.updatedAt = fetched.updatedAt;
  }

  getMessages() {
    return this.messages;
  }

  pushMessage(msg) {
    const messageExists = _.find(this.messages, m => m['id'] === msg.id);
    if (messageExists === undefined) {
      this.messages.push(msg);
    }
  }

  sendMessage(msg) {
    const user = this.Auth.getUser();
    if (user) {
      const m = this.messages.push({notSent: true, body: msg, sender: user.user.id});
      this.sendApi(this, {notSent: true, body: msg, sender: user.user.id}).subscribe(sent => {
        this.messages[m - 1].notSent = false;
        this.newMsg = '';
      }, err => {
        console.error(err);
        this.messages[m - 1].error = true;
      });
    }
  }

  sendApi(room, msg) {
    return this.authHttp.post(this.Auth.API + '/rooms/' + room.id + '/send', msg);
  }
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  rooms: Array<Room> = new Array<Room>();
  selectedRoom: Room;
  unreadMessages = [];
  socket;
  unreadMessagesUpdate = new BehaviorSubject(0);
  roomMessageUpdate = new BehaviorSubject({});
  messageSub;
  newDiscu = false;
  loadingPpl;
  searchRes = [];
  whoTo = '';

  constructor(private _sailsService: SailsService,
              private Auth: AuthService,
              private authHttp: AuthHttp,
              private route: ActivatedRoute) {
    this.route
      .queryParams
      .subscribe(params => {
        if (params.tab) {
          this.fetchRoomById(params.tab).then((res) => {
            this.setRoom(res);
          }).catch((err) => {
            console.error(err);
          });
        }
      });
  }

  ngOnInit() {
    this.connectToSails();
  }

  connectToSails() {
    const opts = {
      url: this.Auth.API,
      transports: ['websocket'],
      headers: {
        'Authorization': 'Bearer ' + this.Auth.getToken()
      },
      pingInterval: 1000,
      useCORSRouteToGetCookie: false,
      afterDisconnect: (s, o, c) => {
        console.log('SOCKET DISCONNECTED');
      }
    };

    const s = this._sailsService.connect(opts).subscribe(() => {
      const s2 = this.fetchRooms().subscribe(() => {
        s2.unsubscribe();
      });
      s.unsubscribe();
    });
  }

  // getRoomWithUser(user) {
  //   return new Promise((resolve, reject) => {
  //     this.api.getRoomWithUser(user).subscribe((room) => {
  //       resolve(room);
  //     }, err => reject(err));
  //   });
  // }

  fetchRooms() {
    return new Observable(observer => {
      const s = this.getRooms().subscribe((userWithRooms) => {
        s.unsubscribe();
        if (userWithRooms.rooms && userWithRooms.rooms.length) {
          userWithRooms.rooms.forEach((room) => {
            if (typeof _.find(this.rooms, r => r.id === room.id) !== 'undefined') {
              observer.next(this.rooms);
              return;
            }
            this._sailsService.get(this.Auth.API + '/rooms/' + room.id).subscribe((roomDetailed) => {
              const roomObj = new Room(roomDetailed.data, this.authHttp, this.Auth);
              const user = this.Auth.getUser();
              if (user) {
                roomObj.friend = _.find(roomDetailed.data.users, o => o.id !== user.user.id);
                this.rooms.push(roomObj);
                observer.next(this.rooms);
              }
            });
          });

          if (!this.messageSub) {
            this.messageSub = this._sailsService.on('message').subscribe(log => {
              const toUpdate = _.find(this.rooms, (r) => r.id === log.room);
              const user = this.Auth.getUser();
              if (user) {
                if (toUpdate && log.sender !== user.user.id) {
                  toUpdate.pushMessage(log);
                  this.unreadMessages.push(log);
                  this.unreadMessagesUpdate.next(this.unreadMessages.length);
                  this.roomMessageUpdate.next(this.getUnreadMessages());
                }
              }
            });
          }
        } else {
          observer.complete();
        }
      }, err => observer.error(err));
    });
  }

  setMessageRead(room: Room) {
    this.unreadMessages = _.pullAllWith(this.unreadMessages, [room], (m, r) => {
      return m.room === r.id;
    });
    this.unreadMessagesUpdate.next(this.unreadMessages.length);
    this.roomMessageUpdate.next(this.getUnreadMessages());
  }

  subscribeToRoomUpdate() {
    return this.roomMessageUpdate;
  }

  subscribeToUnreadMessages() {
    return this.unreadMessagesUpdate;
  }

  getUnreadMessages() {
    return _.groupBy(this.unreadMessages, 'room');
  }

  getNumberOfUnreadMessages() {
    return this.unreadMessages.length;
  }

  fetchRoomById(id) {
    return new Promise((resolve, reject) => {
      this.getRoomById(id).subscribe(roomDetailed => {
        const user = this.Auth.getUser();
        if (user) {
          roomDetailed.friend = _.find(roomDetailed.users, o => o.id !== user.user.id);
          if (typeof _.find(this.rooms, r => r.id === id) !== 'undefined') {
            return resolve(_.find(this.rooms, r => r.id === id));
          }
          console.log(roomDetailed);
          console.log(roomDetailed);
          this.rooms.push(roomDetailed);
          resolve(roomDetailed);
        }
      }, err => reject(err));
    });
  }

  getThisRooms() {
    return this.rooms;
  }

  findRoomWithUser(userId) {
    return _.find(this.rooms, r => r.friend.id === userId);
  }

  getRoomById(id) {
    return this.authHttp.get(this.Auth.API + '/rooms/' + id).map((res) => {
      try {
        return res.json();
      } catch (e) {
        return res.text();
      }
    });
  }

  getRooms() {
    return this.authHttp.get(this.Auth.API + '/rooms').map((res) => {
      try {
        return res.json();
      } catch (e) {
        return res.text();
      }
    });
  }

  setRoom(room) {
    this.selectedRoom = room;
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  sendMessage(room: Room, message) {
    room.sendMessage(message);
    setTimeout(() => {
      this.scrollToBottom();
    }, 1000);
  }

  searchPpl() {
    this.loadingPpl = true;
    this.searchRes = [];
    this.authHttp.get(this.Auth.API + '/users?q=' + this.whoTo).toPromise()
      .then((res) => {
        this.searchRes = res.json();
        this.rooms.forEach(room => {
          this.searchRes.forEach(user => {
            if (room.friend.id === user.id) {
              this.searchRes.splice(this.searchRes.indexOf(user), 1);
            }
          });
        });
        this.loadingPpl = false;
      }).catch((err) => {
      console.error(err);
    });
  }

  createRoom() {
    const user = _.find(this.searchRes, o => o.selected === true);
    if (user) {
      this.authHttp.get(this.Auth.API + '/rooms?user=' + user.id).toPromise()
        .then((res) => {
          const newRoom = res.json();
          this.fetchRooms().subscribe((room) => {
            this.newDiscu = false;
          });
        }).catch((err) => {
        console.error(err);
      });
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  selectUser(user) {
    const alreadySelected = _.find(this.searchRes, f => f.selected === true);
    if (alreadySelected) {
      alreadySelected.selected = false;
    }
    user.selected = true;
  }
}

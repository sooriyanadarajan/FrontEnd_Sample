import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket:any;
  // local_socket = 'http://localhost:3003'
  readonly url:string="wss://devnexfolio.nextazy.com";

  notify=[];
  constructor(){
  }
    connect(val){

        this.socket = io.io(this.url,{
            query: { userId: val },
            transports: ["websocket"],
            path: '/socket.io'
        });
    }

    disconnect(){
      this.socket.disconnect();
     }
 
  listen(eventName:string){
      return new Observable((subscriber)=>{
          this.socket.on(eventName,(data:any)=>{
              subscriber.next(data);
          })
      })
  }

  emit(eventName:string,data:any){
      this.socket.emit(eventName,data)
  }


}

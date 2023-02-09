import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddtaskService {

  constructor() { }

  addTask(task:string){
    alert(task)
  }
}

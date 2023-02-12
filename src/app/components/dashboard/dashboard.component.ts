import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Task } from '../../model/task';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  todoForm !: FormGroup;
  tasks: Task [] = [];
  inprogress: Task [] = [];
  reopen: Task [] = [];
  resolved: Task [] = [];

  updateIndex !: any;
  isEditEnabled : boolean = false;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    ) {}

    ngOnInit(): void {
      this.todoForm = this.fb.group({
        item : ['', Validators.required],
        itemID : ['', Validators.required],
        selectStatus : ['', Validators.required]

      });
      const taskData = localStorage.getItem('todoItems');
      if(taskData != null){
        this.tasks = JSON.parse(taskData);
      }
      const inprogressData = localStorage.getItem('inprogressItems');
      if(inprogressData != null){
        this.inprogress = JSON.parse(inprogressData);
      }
      const reopenData = localStorage.getItem('reopenItems');
      if(reopenData != null){
        this.reopen = JSON.parse(reopenData);
      }
      const resolvedData = localStorage.getItem('resolvedItems');
      if(resolvedData != null){
        this.resolved = JSON.parse(resolvedData);
      }
    }

    drop(event: CdkDragDrop<Task[]>) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
    }

    addTask(){
      if(this.todoForm.value.selectStatus == 'Todo'){
      this.tasks.push({
        description: this.todoForm.value.item,
        id: this.todoForm.value.itemID,
        status: this.todoForm.value.selectStatus,
        done: false,   
      });
      localStorage.setItem('todoItems', JSON.stringify(this.tasks))
      this.todoForm.reset();
    }
    else if(this.todoForm.value.selectStatus == 'Inprogress'){
      this.inprogress.push({
        description: this.todoForm.value.item,
        id: this.todoForm.value.itemID,
        status: this.todoForm.value.selectStatus,
        done: false,   
      });
      localStorage.setItem('inprogressItems', JSON.stringify(this.inprogress))
      this.todoForm.reset();
    }
    else if(this.todoForm.value.selectStatus == 'Reopen'){
      this.reopen.push({
        description: this.todoForm.value.item,
        id: this.todoForm.value.itemID,
        status: this.todoForm.value.selectStatus,
        done: false,   
      });
      localStorage.setItem('reopenItems', JSON.stringify(this.reopen))
      this.todoForm.reset();
    }
    else if(this.todoForm.value.selectStatus == 'Resolved'){
      this.resolved.push({
        description: this.todoForm.value.item,
        id: this.todoForm.value.itemID,
        status: this.todoForm.value.selectStatus,
        done: true,   
      });
      localStorage.setItem('resolvedItems', JSON.stringify(this.resolved))
      this.todoForm.reset();
    }
   
    }

    onEdit(item : Task, i : number){
      this.todoForm.controls['item'].setValue(item.description);
      this.updateIndex = i;
      this.isEditEnabled = true;
    }

    updateTask(){
      this.tasks[this.updateIndex].description = this.todoForm.value.item;
      this.tasks[this.updateIndex].id = this.todoForm.value.itemID;
      this.tasks[this.updateIndex].status = this.todoForm.value.selectStatus;
      this.tasks[this.updateIndex].done = false;
      this.todoForm.reset();
      this.updateIndex = undefined;
      this.isEditEnabled = false;
      localStorage.setItem('todoItems', JSON.stringify(this.tasks))
    }

    deleteTask(i: number){
     let fIndex = this.tasks.indexOf(this.tasks[i]);
     if (fIndex > -1){
      this.tasks.splice(i,1);
     }
      localStorage.setItem('todoItems',JSON.stringify(this.tasks));
    }

    deleteInProgressTask(i: number){
     let fIndex = this.inprogress.indexOf(this.inprogress[i]);
     if (fIndex > -1){
      this.inprogress.splice(i,1);
     }
      localStorage.setItem('inprogressItems',JSON.stringify(this.inprogress));
    }

    deleteReopenTask(i: number){
     let fIndex = this.reopen.indexOf(this.reopen[i]);
     if (fIndex > -1){
      this.reopen.splice(i,1);
     }
      localStorage.setItem('reopenItems',JSON.stringify(this.reopen));
    }

    deleteResolvedTask(i: number){
      let fIndex = this.resolved.indexOf(this.resolved[i]);
      if (fIndex > -1){
       this.resolved.splice(i,1);
      }
       localStorage.setItem('resolvedItems',JSON.stringify(this.resolved));
    }

    signOut(){
      this.auth.SignOut()
    }
}
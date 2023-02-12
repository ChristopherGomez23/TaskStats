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
  done: Task [] = [];

  updateIndex !: any;
  isEditEnabled : boolean = false;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    ) {}

    ngOnInit(): void {
      this.todoForm = this.fb.group({
        item : ['', Validators.required]
      });
      const taskData = localStorage.getItem('todoItems');
      if(taskData != null){
        this.tasks = JSON.parse(taskData);
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
      this.tasks.push({
        description: this.todoForm.value.item,
        done: false
      });
      localStorage.setItem('todoItems', JSON.stringify(this.tasks))
      this.todoForm.reset();
    }

    onEdit(item : Task, i : number){
      this.todoForm.controls['item'].setValue(item.description);
      this.updateIndex = i;
      this.isEditEnabled = true;
    }

    updateTask(){
      this.tasks[this.updateIndex].description = this.todoForm.value.item;
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
      this.inprogress.splice(i,1);
    }

    deleteDoneTask(i: number){
      this.done.splice(i,1);
    }

    signOut(){
      this.auth.SignOut()
    }




}
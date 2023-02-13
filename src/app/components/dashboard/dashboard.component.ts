import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Task } from '../../model/task';
import { DataService } from 'src/app/shared/services/data.service';
import { Router } from '@angular/router';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { FirebaseTSFirestore, OrderBy } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  firestore = new FirebaseTSFirestore();
  todoForm !: FormGroup;
  tasks: TicketData [] = [];
  inprogress: TicketData [] = [];
  reopen: TicketData [] = [];
  resolved: TicketData [] = [];
  updateIndex !: any;
  isEditEnabled : boolean = false;


  onCreateClick(taskId: HTMLInputElement, taskName: HTMLInputElement, taskStatus: HTMLSelectElement){
    let id = taskId.value;
    let name = taskName.value;
    let status = taskStatus.value;
    this.router.navigateByUrl('/dashboard');
    this.firestore = new FirebaseTSFirestore();
    this.firestore.create(
      {
        path: ['TicketCollection'],
        data: {
          taskId: id,
          taskName: name,
          taskStatus: status,
          timestamp: FirebaseTSApp.getFirestoreTimestamp(),
        },
        onComplete: () => {
          // this.dialog.close();
          this.router.navigate(['/dashboard']);
          window.location.reload();
        },
        onFail: (err) => {
          alert(err.message);
        },
      }
    );
  }
  onCloseClick(){
    // this.dialog.close();
  }



  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    public db : DataService,
    // private firestores: FirebaseTSFirestore,
    private router: Router
    ) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => {
        return false; 
      };
    }

    ngOnInit(): void {
      this.todoForm = this.fb.group({
        ticketId : ['', Validators.required],
        taskName : ['', Validators.required],
        selectStatus : ['', Validators.required]

      });
      this.getTickets();
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

    getTickets(){
      this.firestore.getCollection(
        {
          path: ['TicketCollection'],
          where: [
            new OrderBy('timestamp','desc'),
          ],
          onComplete:(result) => {
            result.docs.forEach(
              doc => {
                let ticket = <TicketData>doc.data();
                ticket.id = doc.id;
                switch (ticket.taskStatus) {
                  case 'To Do':
                      this.tasks.push(ticket);
                      break;
                  case 'In Progress':
                      this.inprogress.push(ticket);
                      break;
                  case 'Reopen':
                      this.reopen.push(ticket);
                      break;
                  case 'Resolve':
                      this.resolved.push(ticket);
                      break;
                  default:
                      break;
                  }
              }
            );
          },
          onFail: err => {
          }
        }
      );
    }


    // drop(event: CdkDragDrop<Task[]>) {
    //   if (event.previousContainer === event.container) {
    //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    //   } else {
    //     transferArrayItem(
    //       event.previousContainer.data,
    //       event.container.data,
    //       event.previousIndex,
    //       event.currentIndex,
    //     );
    //   }
    // }

    drop(event: CdkDragDrop<TicketData[]>) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        console.log(event.currentIndex)
  
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
        this.firestore.update(
          {
            path: ['TicketCollection',event.container.data[event.currentIndex]['id']],
            data: {
              taskStatus: event.container.id
            },
            onComplete: (docref) => {
              console.log("Successful Update")
            },
            onFail: (err) => {
              console.log("Failed Update")
            },
          }
        )
      }
    }
  

    // addTask(){
    //   if(this.todoForm.value.selectStatus == 'Todo'){
    //   this.tasks.push({
    //     description: this.todoForm.value.item,
    //     id: this.todoForm.value.itemID,
    //     status: this.todoForm.value.selectStatus,
    //     done: false,   
    //   });
    //   localStorage.setItem('todoItems', JSON.stringify(this.tasks))
    //   this.todoForm.reset();
    // }
    // else if(this.todoForm.value.selectStatus == 'Inprogress'){
    //   this.inprogress.push({
    //     description: this.todoForm.value.item,
    //     id: this.todoForm.value.itemID,
    //     status: this.todoForm.value.selectStatus,
    //     done: false,   
    //   });
    //   localStorage.setItem('inprogressItems', JSON.stringify(this.inprogress))
    //   this.todoForm.reset();
    // }
    // else if(this.todoForm.value.selectStatus == 'Reopen'){
    //   this.reopen.push({
    //     description: this.todoForm.value.item,
    //     id: this.todoForm.value.itemID,
    //     status: this.todoForm.value.selectStatus,
    //     done: false,   
    //   });
    //   localStorage.setItem('reopenItems', JSON.stringify(this.reopen))
    //   this.todoForm.reset();
    // }
    // else if(this.todoForm.value.selectStatus == 'Resolved'){
    //   this.resolved.push({
    //     description: this.todoForm.value.item,
    //     id: this.todoForm.value.itemID,
    //     status: this.todoForm.value.selectStatus,
    //     done: true,   
    //   });
    //   localStorage.setItem('resolvedItems', JSON.stringify(this.resolved))
    //   this.todoForm.reset();
    // }
   
    // }

    // onEdit(item : Task, i : number){
    //   this.todoForm.controls['item'].setValue(item.description);
    //   this.updateIndex = i;
    //   this.isEditEnabled = true;
    // }

    // updateTask(){
    //   if(this.todoForm.value.selectStatus == 'Todo'){
    //   this.tasks[this.updateIndex].description = this.todoForm.value.item;
    //   this.tasks[this.updateIndex].id = this.todoForm.value.itemID;
    //   this.tasks[this.updateIndex].status = this.todoForm.value.selectStatus;
    //   this.tasks[this.updateIndex].done = false;
    //   this.todoForm.reset();
    //   this.updateIndex = undefined;
    //   this.isEditEnabled = false;
    //   localStorage.setItem('todoItems', JSON.stringify(this.inprogress));
    //   }
    //   else if(this.todoForm.value.selectStatus == 'Inprogress'){
    //     this.inprogress[this.updateIndex].description = this.todoForm.value.item;
    //     this.inprogress[this.updateIndex].id = this.todoForm.value.itemID;
    //     this.inprogress[this.updateIndex].status = this.todoForm.value.selectStatus;
    //     this.inprogress[this.updateIndex].done = false;
    //     this.todoForm.reset();
    //     this.updateIndex = undefined;
    //     this.isEditEnabled = false;
    //     localStorage.setItem('inprogressItems', JSON.stringify(this.inprogress));
    //     }
    //   else if(this.todoForm.value.selectStatus == 'Reopen'){
    //     this.reopen[this.updateIndex].description = this.todoForm.value.item;
    //     this.reopen[this.updateIndex].id = this.todoForm.value.itemID;
    //     this.reopen[this.updateIndex].status = this.todoForm.value.selectStatus;
    //     this.reopen[this.updateIndex].done = false;
    //     this.todoForm.reset();
    //     this.updateIndex = undefined;
    //     this.isEditEnabled = false;
    //     localStorage.setItem('reopenItems', JSON.stringify(this.reopen));
    //     }
    //     else if(this.todoForm.value.selectStatus == 'Resolved'){
    //       this.resolved[this.updateIndex].description = this.todoForm.value.item;
    //       this.resolved[this.updateIndex].id = this.todoForm.value.itemID;
    //       this.resolved[this.updateIndex].status = this.todoForm.value.selectStatus;
    //       this.resolved[this.updateIndex].done = false;
    //       this.todoForm.reset();
    //       this.updateIndex = undefined;
    //       this.isEditEnabled = false;
    //       localStorage.setItem('resolvedItems', JSON.stringify(this.resolved));
    //       }  
    // }

    // deleteTask(i: number){
    //  let fIndex = this.tasks.indexOf(this.tasks[i]);
    //  if (fIndex > -1){
    //   this.tasks.splice(i,1);
    //  }
    //   localStorage.setItem('todoItems',JSON.stringify(this.tasks));
    // }

    // deleteInProgressTask(i: number){
    //  let fIndex = this.inprogress.indexOf(this.inprogress[i]);
    //  if (fIndex > -1){
    //   this.inprogress.splice(i,1);
    //  }
    //   localStorage.setItem('inprogressItems',JSON.stringify(this.inprogress));
    // }

    // deleteReopenTask(i: number){
    //  let fIndex = this.reopen.indexOf(this.reopen[i]);
    //  if (fIndex > -1){
    //   this.reopen.splice(i,1);
    //  }
    //   localStorage.setItem('reopenItems',JSON.stringify(this.reopen));
    // }

    // deleteResolvedTask(i: number){
    //   let fIndex = this.resolved.indexOf(this.resolved[i]);
    //   if (fIndex > -1){
    //    this.resolved.splice(i,1);
    //   }
    //    localStorage.setItem('resolvedItems',JSON.stringify(this.resolved));
    // }

    signOut(){
      this.auth.SignOut()
    }
}

export interface TicketData {
  id: string;
  taskId: string;
  taskName: string;
  taskStatus: string;
  timestamp: string;
}
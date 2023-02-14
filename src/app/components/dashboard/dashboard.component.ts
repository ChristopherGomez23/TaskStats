import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
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
  tasks: TicketData [] = [];
  inprogress: TicketData [] = [];
  reopen: TicketData [] = [];
  resolved: TicketData [] = [];
  isEditEnabled : boolean = false;
  updateIndex !: any;

  @ViewChild('taskName') taskName!: ElementRef;
  @ViewChild('taskId') taskId!: ElementRef;


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
          this.router.navigate(['/dashboard']);
          window.location.reload();
        },
        onFail: (err) => {
          alert(err.message);
        },
      }
    );
  }



  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router
    ) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => {
        return false; 
      };
    }

    ngOnInit(): void {
      this.getTickets();
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
                console.log(ticket)
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

    clearContainer(){
      this.tasks = [];
      this.inprogress = [];
      this.reopen = [];
      this.resolved = [];
    }

    deleteEntry(id: string){
      this.firestore.delete({
        path: ['TicketCollection', id],
        onComplete: () => {
          this.clearContainer();
          this.getTickets();
       },
       onFail: err => {
          alert(err.message);
       }
    
      })
    }
    

    onEditTask(id:string,index:number){
      this.isEditEnabled = true;
      console.log(this.tasks[index].taskName);
      console.log(this.tasks[index].taskId);
      
      this.firestore.delete({
        path: ['TicketCollection', id],
        onComplete: () => {
          
          this.taskName.nativeElement.value = this.tasks[index].taskName;
          this.taskId.nativeElement.value = this.tasks[index].taskId;
          this.getTickets();
       },
       onFail: err => {
          alert(err.message);
       }
    
      })
    }

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
            onComplete: () => {
              console.log("Successful Update")
            },
            onFail: () => {
              console.log("Failed Update")
            },
          }
        )
      }
    }
 
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
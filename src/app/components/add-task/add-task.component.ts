import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../shared/services/task';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  addTask = new FormGroup({
    taskName: new FormControl('',[Validators.required]),
    taskDescription: new FormControl('', [Validators.required])
  })


  constructor(
    private dialogRef: MatDialogRef<AddTaskComponent>,
    
  ) { }

  ngOnInit(): void {
  }
  
  onNoClick(): void{
    this.dialogRef.close();
  }

  submit(){
    const { taskName, taskDescription } = this.addTask.value;

    const taskObj: Task = {
      id: '',
      title: taskName,
      description: taskDescription,
    }
    
    this.dialogRef.close();
  }

}

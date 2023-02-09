import { Component, OnInit } from '@angular/core';
import { AddtaskService } from 'src/app/shared/services/addtask.service';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  constructor(private AddTaskServ: AddtaskService) { }

  ngOnInit(): void {
  }
  taskName = 'Wow';
  addTask(){
    this.AddTaskServ.addTask(this.taskName)
  }

}

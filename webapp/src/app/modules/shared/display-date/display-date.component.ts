import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from './../shared.service';

@Component({
  selector: 'app-display-date',
  templateUrl: './display-date.component.html',
  styleUrls: ['./display-date.component.css']
})
export class DisplayDateComponent implements OnInit {

  @Input() date: Date;

  dateString: string;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    if (this.date) {
      this.dateString = this.sharedService.dateString(this.date);
    }
  }

}

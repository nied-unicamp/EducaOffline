import { Component, Input, OnInit } from '@angular/core';
import { ActivitiesService } from '../../activities/activities.service';

@Component({
  selector: 'app-activity-share',
  templateUrl: './activity-share.component.html',
  styleUrls: ['./activity-share.component.css']
})
export class ActivityShareComponent implements OnInit {


  constructor(private activitiesService: ActivitiesService) {

  }
  // permission: boolean = true;
  // userChoose: String = "No Shared";

  @Input() hasPermission: boolean;
  @Input() choseSharedUser: string;

  translationText: any = {};



  onChange(deviceValue) {
    console.log(deviceValue);
  }

  ngOnInit() {

    // this.choseSharedUser = "Não Compartilhado";
    console.log(this.translationText);
  }


}

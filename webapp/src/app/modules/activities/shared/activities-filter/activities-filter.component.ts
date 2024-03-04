import { Component, OnInit } from '@angular/core';
import { ActivityFilter } from 'src/app/models/activity.model';
import { ActivitiesService } from '../../activities.service';

@Component({
  selector: 'app-activities-filter',
  templateUrl: './activities-filter.component.html',
  styleUrls: ['./activities-filter.component.css']
})
export class ActivitiesFilterComponent {

  filteredBy: ActivityFilter;
  filterOptions: ActivityFilter[];

  translationText = ActivitiesService.translationText.ActivitiesFilterComponent;

  constructor(private activitiesService: ActivitiesService) {
    this.filterOptions = this.activitiesService.getFilters();
    console.log(this.filterOptions);
  }



  changeFilter(filter: ActivityFilter): void {
    this.activitiesService.updateFilter(filter);
  }

  getName(filter: ActivityFilter): string {
    return ActivityFilter[filter];
  }
}

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Activity } from 'src/app/models/activity.model';
import { ActivitiesService } from '../../activities.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';


@Component({
  selector: 'app-activities-sort',
  templateUrl: './activities-sort.component.html',
  styleUrls: ['./activities-sort.component.css']
})
export class ActivitiesSortComponent implements OnChanges, OnInit, OnDestroy {

  @Input() in: Activity[];
  @Output() out: EventEmitter<Activity[]> = new EventEmitter<Activity[]>();


  /**
   * Size used for responsive view implementations
   *
   */
  @Input() size: 'big' | 'normal' | 'small';


  translationText: typeof LANGUAGE.activities.ActivitiesSortComponent;
  private translationSubscription: Subscription | undefined;

  sortedBy: string;

  sortOptions: string[] = ['Newer', 'LastModified', 'Older'];


  constructor(private activitiesService: ActivitiesService, config: NgbDropdownConfig, private translationService: TranslationService) {

    config.placement = 'bottom-right';

    // Define the default sort option
    this.defineSort('Newer');
  }

  ngOnInit(): void {

    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.activities.ActivitiesSortComponent
      }
    );
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }


  /**
   * On any changes, update the sort option
   *
   */
  ngOnChanges() {
    this.defineSort(this.sortedBy);
  }

  /**
   * Define the sort order and outputs the sorted array
   *
   * @param sort - String
   */
  defineSort(sort: string) {
    this.sortedBy = sort;

    const output = [] as Activity[];

    // Emits the sorted array to a parent component
    this.out.emit(output);
  }



}

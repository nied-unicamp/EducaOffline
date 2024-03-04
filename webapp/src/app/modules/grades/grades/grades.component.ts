import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ParticipationAdvancedSelectors } from 'src/app/state/participation/participation.advanced.selector';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {
  canGetAllEvaluations$: Observable<boolean>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.canGetAllEvaluations$ = this.store.select(ParticipationAdvancedSelectors.hasPermission('get_all_evaluations'))
  }
}

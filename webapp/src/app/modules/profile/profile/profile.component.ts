import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { ProfileService } from '../profile.service';
import { Store } from '@ngrx/store';
import { UserSelectors } from 'src/app/state/user/user.selector';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  private me$: Observable<User>;
  profile$: Observable<User>;
  canEdit$: Observable<boolean>;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private store: Store
  ) { }

  ngOnInit() {
    console.log('profile')
    this.profile$ = this.store.select(UserSelectors.current)
    
    this.me$ = this.route.data.pipe(map((data: { user: User }) => data.user))

    this.canEdit$ = combineLatest([this.me$, this.profile$]).pipe(map(([me, p]) => me?.isAdmin || me?.id === p?.id));
  }
}

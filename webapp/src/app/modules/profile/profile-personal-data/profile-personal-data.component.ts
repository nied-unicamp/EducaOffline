import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User, UserSM } from 'src/app/models/user.model';
import { ProfileService } from '../profile.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { Store } from '@ngrx/store';
import { UserActions } from 'src/app/state/user/user.actions';

@Component({
  selector: 'app-profile-personal-data',
  templateUrl: './profile-personal-data.component.html',
  styleUrls: ['./profile-personal-data.component.css']
})
export class ProfilePersonalDataComponent implements OnInit, OnDestroy {

  @Input() profile: User;
  @Input() canEdit: boolean;
  editing = false;
  urlPhoto: string;

  translationText: typeof LANGUAGE.profile.ProfilePersonalDataComponent;
  private translationSubscription: Subscription | undefined;

  constructor(
    private profileService: ProfileService,
    private translationService: TranslationService,
    private store: Store
  ) {
  }

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.profile.ProfilePersonalDataComponent
      }
 	  );
    this.urlPhoto = this.profileService.getProfilePhoto(this.profile?.id);
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  editProfile(user: UserSM): void {
    console.log('user despachado', user)
    this.store.dispatch(UserActions.editProfile.request({
      input: {
        id: user.id,
        form: user
      }
    }))
  }
}

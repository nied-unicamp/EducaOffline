import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LANGUAGE } from 'src/app/dev/languages';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { LoginSelectors } from 'src/app/state/login/login.selector';
import { UserActions } from 'src/app/state/user/user.actions';
import { UserSelectors } from 'src/app/state/user/user.selector';
import { ProfileService } from '../../profile/profile.service';
import { CODE_LANGUAGES } from 'src/app/dev/code-languages';
import { UserSM } from 'src/app/models/user.model';

@Component({
  selector: 'app-botao-translate',
  templateUrl: './botao-translate.component.html',
  styleUrls: ['./botao-translate.component.css']
})
export class BotaoTranslateComponent implements OnInit, OnDestroy {

  @Input() userEditingLang: boolean; 
  @Output() editUser: EventEmitter<UserSM> = new EventEmitter<UserSM>();

  constructor(
    private translationService: TranslationService,
    private store: Store,
    private profileService: ProfileService
  ) { }

  translationText: typeof LANGUAGE.shared.translateButton
  private translationSubscription: Subscription | undefined;

  currentLanguage: string;
  languageNames: string[];

  ngOnInit(): void {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.shared.translateButton
        this.setCurrentLanguage();
        this.languageNames = this.translationService.getLanguageProperties().map(code => this.getLanguageName(code))
      }
 	  );
    
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  getLanguageName(code: string): string {
    return code == 'en' ? this.translationText.english : 
            code == 'pt' ? this.translationText.portuguese : null;
  }

  getLanguageCode(name: string): string {
    return name == this.translationText.english ? 'en': 
            name == this.translationText.portuguese ? 'pt' : null;
  }

  setCurrentLanguage(): void {
    this.currentLanguage = this.getLanguageName(this.translationService.getLanguageProperty())
  }

  switchLanguage(lang: string) {
    if (this.userEditingLang) {
      let currentUser: UserSM;
      this.store.select(UserSelectors.current).pipe(
        map(user => currentUser = user)
      ).subscribe()
      console.log('currentUser', currentUser)
      const newLang = CODE_LANGUAGES[this.getLanguageCode(lang)]
      console.log('newLang', newLang)
      const newUser = {
        ...currentUser,
        language: newLang
      }
      console.log('newUser', newUser)
      this.editUser.emit(newUser);
    }

    console.log('lang: ' + lang);
    let code: string = this.getLanguageCode(lang) 
    console.log("code: ", code)
    this.translationService.setTranslationByProperty(code);
  }
}

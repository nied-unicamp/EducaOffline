import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { CODE_LANGUAGES } from 'src/app/dev/code-languages';
import { LANGUAGE_EN } from 'src/app/dev/en';
import { LANGUAGE_PT } from 'src/app/dev/pt';

type LanguageType<T> = {
  [K in keyof T]: LanguageType<T[K]> | string;
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private currentLang: string = 'en'; 
  private translations: Record<string, typeof LANGUAGE_EN> = {
    pt: LANGUAGE_PT,
    en: LANGUAGE_EN,
  };

  private translationChange$ = new BehaviorSubject<typeof LANGUAGE_EN>(this.getTranslation());
  
  public getTranslationChangeObservable(): Observable<typeof LANGUAGE_EN> {
    return this.translationChange$.asObservable();
  }
  
  public getTranslation(): typeof LANGUAGE_EN {
    return this.translations[this.currentLang];
  }

  public setTranslationByProperty(prop: string) {
    if (prop in this.translations) {
      this.currentLang = prop;
      this.translationChange$.next(this.getTranslation());
    } else {
      console.warn(`Language '${prop}' is not supported.`);
    }
  }

  public setTranslationByCode(code: string) {
    if (Object.values(CODE_LANGUAGES).includes(code)) {
      for (const prop in CODE_LANGUAGES) {
        if (CODE_LANGUAGES[prop] == code) {
          this.setTranslationByProperty(prop);
        }
      }
    } else {
      console.warn(`Code '${code}' not found.`);
    }
  }

  public changeToBrowserLanguage() {
    const lang: string = navigator.language;
    switch(lang) {
      case 'pt-BR':
        this.setTranslationByProperty('pt')
        break;
      default:
        this.setTranslationByProperty('en');
    }
  }

  public getLanguageProperty() {
    return this.currentLang;
  }

  public getLanguageProperties(): string[] {
    return Object.keys(this.translations);
  }

  public getLanguageCode() {
    return CODE_LANGUAGES[this.currentLang];
  }
}

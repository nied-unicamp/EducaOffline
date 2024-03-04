import { TranslationWidth } from '@angular/common';
import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES: {
  [key: string]: {
    weekdays: string[];
    monthsShort: string[];
    months: string[];
  }
} = {
  'pt-BR': {
    weekdays: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'],
    monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  }
  // other languages you would support
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  language = 'pt-BR';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  constructor(private _i18n: I18n) {
    super();
  }


  getWeekdayLabel(weekday: number, width?: TranslationWidth): string {
    let characterCount = 1;

    if (width === TranslationWidth.Abbreviated) {
      characterCount = 3;
    } else if (width === TranslationWidth.Short) {
      characterCount = 2;
    } else if (width === TranslationWidth.Wide) {
      characterCount = undefined;
    }

    return I18N_VALUES[this._i18n.language]?.weekdays[weekday - 1].slice(0, characterCount);
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language]?.monthsShort[month - 1];
  }
  getMonthFullName(month: number): string {
    return I18N_VALUES[this._i18n.language]?.months[month - 1];
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}/${date.month}/${date.year}`;
  }
}

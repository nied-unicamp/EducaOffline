import { Injectable } from '@angular/core';
import { LANGUAGE } from 'src/app/dev/languages';

@Injectable()
export class GradesService {

  static translationText = LANGUAGE.grades;

  constructor() { }
}

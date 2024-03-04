import { Injectable } from '@angular/core';
import { LANGUAGE } from 'src/app/dev/languages';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class WallService {

  static translationText = LANGUAGE.wall;

  constructor(
    private sharedService: SharedService,
  ) { }

  getProfilePhoto(userId: number) {
    return this.sharedService.downloadLink(`users/${userId}/picture`)
  }
}

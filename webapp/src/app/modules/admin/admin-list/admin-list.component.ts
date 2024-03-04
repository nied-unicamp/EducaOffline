import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AdminService } from './../admin.service';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { Subscription } from 'rxjs';
import { LANGUAGE } from 'src/app/dev/languages';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css']
})
export class AdminListComponent implements OnInit, OnDestroy {

  @Input() activityId: number;

  admins: User[];
  private translationSubscription: Subscription | undefined;

  constructor(
    private adminService: AdminService,
    private translationService: TranslationService
  ) { }

  screenSize: 'small' | 'normal' | 'big' = 'big';


  translationText: typeof LANGUAGE.admin.AdminListComponent;

  ngOnInit() {
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.admin.AdminListComponent
      }
    );
    this.getAdmins();
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }

  getAdmins() {
    this.adminService.getAdmins().subscribe((res) => {
      this.admins = res;
    });
  }

  @HostListener('window:resize', ['$event'])
  updateScreenSize(event) {
    const size = window.screen.availWidth;

    if (size > 500) {
      this.screenSize = 'big';
    } else {
      this.screenSize = 'small';
    }
  }
}

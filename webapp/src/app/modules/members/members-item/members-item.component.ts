import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Role } from 'src/app/models/role.model';
import { User } from 'src/app/models/user.model';
import { SharedService } from '../../shared/shared.service';
import { MembersService } from '../members.service';
import { UserResolverService } from 'src/app/services/resolvers/user-resolver.service';
import { LANGUAGE } from 'src/app/dev/languages';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-members-item',
  templateUrl: './members-item.component.html',
  styleUrls: ['./members-item.component.css']
})
export class MembersItemComponent implements OnInit {
  @Input() user: User;
  @Input() role: Role;
  @Input() isMe: boolean;

  roleName: string;
  canGetEvaluation: boolean;
  photoUrl: string;
  showCap: boolean;
  roleBadge: string;

  translationText: typeof LANGUAGE.members.MembersItemComponent;
  private translationSubscription: Subscription | undefined;

  constructor(
    private sharedService: SharedService,
    private membersService: MembersService,
    private translationService: TranslationService
  ) {
/*
    private userResolverService: UserResolverService) {

    // this.returnData = this.router.navigate(["https://proteo.nied.unicamp.br/stag/api/v1/me"]);

    console.log("\n https://proteo.nied.unicamp.br/stag/api/v1/me \n");

 */
  }

  ngOnInit() {

   /*  // console.log("\nLoginService\n");
    // console.log(this.me);

    console.log("\n userResolverService \n");
    // console.log(this.userResolverService.getUser());

    const url = `users/${userId}`;

    return this.http.get<UserJson>(url).pipe(
      take(1),
      map(json => fromJsonToUser(json))
    );



       console.log("\n\nAntes");

    console.log(this.user);
    console.log(this.role);

 */
    this.translationSubscription = this.translationService.getTranslationChangeObservable().subscribe(
      (translation) => {
        this.translationText = translation.members.MembersItemComponent
      }
 	  );
    this.photoUrl = this.membersService.getProfilePhoto(this.user?.id);
    this.canGetEvaluation = this.sharedService.hasPermission('get_all_evaluations');
    this.showCap = this.role.permissions.some(p => p.name === 'edit_course');
    this.roleBadge = this.role.name === 'TEACHER'
      ? 'teacher'
      : this.isMe === true
        ? 'isme'
        : '';
    this.roleName = this.role.name === 'TEACHER'
      ? this.translationText.teacher
      : this.role.name === 'STUDENT'
        ? this.translationText.student
        : this.role.name === 'ADMIN'
          ? this.translationText.admin
          : this.role.name
  }

  ngOnDestroy(): void {
    this.translationSubscription.unsubscribe();
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IconName } from '@fortawesome/fontawesome-common-types';
import { Course } from 'src/app/models/course.model';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {

  courseId: number;
  courseName: string;

  courseNotifications = [];
  allNotifications = [];

  constructor(private newsService: NewsService, private route: ActivatedRoute) {
    this.route.data.subscribe((data: { course: Course }) => {
      this.courseId = data?.course?.id;
      this.courseName = data?.course?.name;

      if (this.courseId) {
        this.newsService.getNotificationsFromCourse(this.courseId).subscribe((data) => {
          this.courseNotifications = data?.sort(this.sortNotifications);
        });
      }

      this.newsService.getNotifications().subscribe((data) => {
        this.allNotifications = data?.sort(this.sortNotifications);
      });
    });
  }



  chooseIcon(type: string): IconName {
    if (type === 'NEW_STUDENT') {
      return 'user-friends';
    } else if (type[0] === 'A') {
      return 'tasks';
    } else if (type === 'NEW_MATERIAL') {
      return 'box-open';
    } else {
      return 'newspaper';
    }
  }

  chooseText(news): string {
    if (news.type === 'NEW_STUDENT') {
      if (news.itemId2 === 1) {
        return '1 student entered your course - ';
      } else {
        return news.itemId2 + ' students entered your course - ';
      }

    } else if (news.type === 'ACTIVITY_GRADE_RELEASED') {
      return 'Note released from activity ';

    } else if (news.type === 'ACTIVITY_PUBLISHED') {
      return 'An activity was published - ';

    } else if (news.type === 'NEW_MATERIAL') {
      return 'New support material published - ';

    } else if (news.type === 'NEW_WALL_POST_BY_TEACHER') {
      return 'The teacher made a new post on the Wall - ';

    } else if (news.type === 'NEW_POST_LIKES') {
      if (news.itemId2 === 1) {
        return '1 person likes your post - ';
      } else {
        return news.itemId2 + ' people like your post - '
      }

    } else if (news.type === 'NEW_POST_COMMENTS') {
      return news.itemId2 + ' new comment(s) on your post - '

    } else if (news.type === 'NEW_WALL_POST') {
      return news.itemId2 + ' new post(s) to the Wall - ';

    } else if (news.type === 'NEW_POST_COMMENT_BY_TEACHER') {
      return 'The teacher commented on your post - '
    }

    // ACTIVITY_SCHEDULED, ACTIVITY_DELETED, ACTIVITY_UPDATED, ACTIVITY_SUBMISSION_STARTED, ACTIVITY_SUBMISSION_ENDED
    // FINAL_GRADE_RELEASED, GRADE_CONFIG_UPDATED
  }

  chooseLink(news): string {
    const url = '/courses/' + [this.courseId ? this.courseId : news.course.id];
    if (news.type === 'ACTIVITY_GRADE_RELEASED' || news.type[0] === 'F' || news.type[0] === 'G') {
      return url + '/grades';

    } else if (news.type[0] === 'A') {
      return url + '/activities/' + news.itemId1;

    } else if (news.type === 'NEW_MATERIAL') {
      return url + '/material';

    } else {
      return url + '/wall';
    }
  }

  chooseTime(newsDate): string {
    const today = new Date(Date.now());
    const date = Date.parse(newsDate);
    const timeDiff = Math.abs(today.getTime() - date);
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (diffDays <= 1) {
      return '<' + diffDays + ' dia';
    } else {
      return diffDays + ' dias'
    }
  }

  isGradesIcon(news): boolean {
    if (news.type === 'ACTIVITY_GRADE_RELEASED' || news.type[0] === 'F' || news.type[0] === 'G') {
      return true
    }

    return false
  }

  private sortNotifications(a: any, b: any) {
    const dateA = a?.lastModifiedDate;
    const dateB = b?.lastModifiedDate;

    return dateA > dateB ? -1 : (dateA < dateB ? 1 : 0);
  }
}

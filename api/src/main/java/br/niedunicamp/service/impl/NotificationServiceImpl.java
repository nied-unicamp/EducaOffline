package br.niedunicamp.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.niedunicamp.model.Activity;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.Material;
import br.niedunicamp.model.Notification;
import br.niedunicamp.model.Participation;
import br.niedunicamp.model.Post;
import br.niedunicamp.model.Role;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.NotificationType;
import br.niedunicamp.repository.CourseRepository;
import br.niedunicamp.repository.NotificationRepository;
import br.niedunicamp.repository.ParticipationRepository;
import br.niedunicamp.repository.RoleRepository;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.NotificationService;
//#endregion

@Service
public class NotificationServiceImpl implements NotificationService {

    // #region Repositories and Services
    @Autowired
    NotificationRepository notificationRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    ParticipationRepository participationRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    CoreService coreService;
    // #endregion

    private Boolean shouldUpdate(Notification notification) {
        return this.shouldUpdate(notification, 24);
    }

    private Boolean shouldUpdate(Notification notification, int hours) {
        Date last24hours = this.coreService.now();
        last24hours.setTime(last24hours.getTime() - (hours * 60 * 60 * 1000));

        return notification.getLastModifiedDate().after(last24hours);
    }

    @Override
    public ResponseEntity<List<Notification>> listForUserAndCourse(User user, Course course) {
        Participation userParticipation = participationRepository.findByUserAndCourse(user, course);

        if (userParticipation == null) {
            return null;
        }

        // Get notifications for the course
        List<Notification> list = new ArrayList<Notification>();
        list.addAll(notificationRepository.findByCourseAndRole(course, userParticipation.getRole()));
        list.addAll(notificationRepository.findByCourseAndRoleNullAndUserNull(course));
        list.addAll(notificationRepository.findByCourseAndUser(course, user));

        list.removeIf(item -> (item.getType() == NotificationType.ACTIVITY_PUBLISHED
                && item.getLastModifiedDate().after(coreService.now())));

        return ResponseEntity.ok(list.stream().map(i -> { // remove course from json
            i.setCourse(null);
            i.setUser(null);
            i.setRole(null);
            return i;
        }).collect(Collectors.toList()));
    }

    @Override
    public ResponseEntity<List<Notification>> listForUser(User user) {
        List<Notification> list = new ArrayList<Notification>();

        list.addAll(notificationRepository.findByUser(user));
        list.addAll(this.participationRepository.findByUser(user).stream().map(p -> {
            List<Notification> l = new ArrayList<Notification>();
            l.addAll(this.notificationRepository.findByCourseAndRole(p.getCourse(), p.getRole()));
            l.addAll(notificationRepository.findByCourseAndRoleNullAndUserNull(p.getCourse()));
            return l;
        }).reduce(List.of(), (a, b) -> { // combine all notifications
            List<Notification> c = new ArrayList<Notification>();
            c.addAll(a);
            c.addAll(b);
            return c;
        }));

        list.removeIf(item -> (item.getType() == NotificationType.ACTIVITY_PUBLISHED
                && item.getLastModifiedDate().after(coreService.now())));

        return ResponseEntity.ok(list.stream().map(i -> { // remove course from json
            i.setUser(null);
            i.setRole(null);
            return i;
        }).collect(Collectors.toList()));
    }

    @Override
    public Notification upsertNewStudent(Course course, User user) {
        NotificationType notificationType = NotificationType.NEW_STUDENT;

        Optional<Notification> optional = this.notificationRepository.findByCourseAndType(course, notificationType)
                .stream().filter(n -> this.shouldUpdate(n)).findFirst();

        if (optional.isPresent()) {
            Notification notification = optional.get();

            notification.setItemId1(user.getId());
            notification.setItemText1(user.getName());
            notification.setItemId2(notification.getItemId2() + 1);

            notification.setLastModifiedDate(coreService.now());

            return notificationRepository.save(notification);
        } else {
            Notification notification = new Notification();
            notification.setCourse(course);

            Role role = this.roleRepository.findByName("TEACHER");
            notification.setRole(role);

            notification.setType(notificationType);

            notification.setItemId1(user.getId());
            notification.setItemText1(user.getName());
            notification.setItemId2(Long.valueOf(1));

            notification.setCreatedDate(coreService.now());
            notification.setLastModifiedDate(coreService.now());

            return notificationRepository.save(notification);
        }
    }

    @Override
    public Notification upsertNewMaterial(Material material) {
        NotificationType notificationType = NotificationType.NEW_MATERIAL;

        Optional<Notification> optional = this.notificationRepository
                .findByCourseAndType(material.getCourse(), notificationType).stream().filter(n -> this.shouldUpdate(n))
                .findFirst();

        if (optional.isPresent()) {
            Notification notification = optional.get();

            notification.setItemId1(material.getId());
            notification.setItemText1(material.getTitle());
            notification.setItemId2(notification.getItemId2() + 1);

            notification.setLastModifiedDate(coreService.now());

            return notificationRepository.save(notification);
        } else {
            Notification notification = new Notification();
            notification.setCourse(material.getCourse());

            notification.setType(notificationType);

            notification.setItemId1(material.getId());
            notification.setItemText1(material.getTitle());
            notification.setItemId2(Long.valueOf(1));

            notification.setCreatedDate(coreService.now());
            notification.setLastModifiedDate(coreService.now());

            return notificationRepository.save(notification);
        }
    }

    @Override
    public Notification addActivityGradeReleased(Activity activity) {
        NotificationType notificationType = NotificationType.ACTIVITY_GRADE_RELEASED;

        Notification notification = new Notification();
        notification.setCourse(activity.getCourse());

        Role role = this.roleRepository.findByName("STUDENT");
        notification.setRole(role);

        notification.setType(notificationType);

        notification.setItemId1(activity.getId());
        notification.setItemText1(activity.getTitle());

        notification.setCreatedDate(coreService.now());
        notification.setLastModifiedDate(coreService.now());

        return notificationRepository.save(notification);
    }

    @Override
    public Notification addActivityPublished(Activity activity) {
        NotificationType notificationType = NotificationType.ACTIVITY_PUBLISHED;

        Notification notification = new Notification();
        notification.setCourse(activity.getCourse());

        notification.setType(notificationType);

        notification.setItemId1(activity.getId());
        notification.setItemText1(activity.getTitle());

        notification.setCreatedDate(coreService.now());
        notification.setLastModifiedDate(activity.getPublishDate());

        return notificationRepository.save(notification);
    }

    @Override
    public Notification updateActivityPublished(Activity activity) {
        NotificationType notificationType = NotificationType.ACTIVITY_PUBLISHED;

        Optional<Notification> optional = this.notificationRepository
                .findByCourseAndType(activity.getCourse(), notificationType).stream()
                .filter(n -> n.getItemId1() == activity.getId()).findFirst();

        if (!optional.isPresent()) {
            return null;
        }

        Notification notification = optional.get();
        notification.setLastModifiedDate(activity.getPublishDate());

        return notificationRepository.save(notification);
    }

    @Override
    public Notification addWallPostByTeacher(Post post) {
        NotificationType notificationType = NotificationType.NEW_WALL_POST_BY_TEACHER;

        Notification notification = new Notification();
        notification.setCourse(post.getCourse());

        notification.setType(notificationType);

        notification.setItemId1(post.getId());

        notification.setCreatedDate(coreService.now());
        notification.setLastModifiedDate(coreService.now());

        return notificationRepository.save(notification);
    }

    @Override
    public Notification addPostCommentByTeacher(Post post) {
        NotificationType notificationType = NotificationType.NEW_POST_COMMENT_BY_TEACHER;

        Notification notification = new Notification();
        notification.setCourse(post.getCourse());

        notification.setType(notificationType);

        notification.setItemId1(post.getId());

        notification.setCreatedDate(coreService.now());
        notification.setLastModifiedDate(coreService.now());

        return notificationRepository.save(notification);
    }

    @Override
    public Notification upsertNewWallPost(Post post) {
        NotificationType notificationType = NotificationType.NEW_WALL_POST;

        Optional<Notification> optional = this.notificationRepository
                .findByCourseAndType(post.getCourse(), notificationType).stream().filter(n -> this.shouldUpdate(n))
                .findFirst();

        if (optional.isPresent()) {
            Notification notification = optional.get();

            notification.setItemId1(post.getId());
            notification.setItemText1(post.getText());
            notification.setItemId2(notification.getItemId2() + 1);
            notification.setItemText2(post.getCreatedBy().getName());

            notification.setLastModifiedDate(coreService.now());

            return notificationRepository.save(notification);
        } else {
            Notification notification = new Notification();
            notification.setCourse(post.getCourse());

            notification.setType(notificationType);

            notification.setItemId1(post.getId());
            notification.setItemText1(post.getText());
            notification.setItemText2(post.getCreatedBy().getName());
            notification.setItemId2(Long.valueOf(1));

            notification.setCreatedDate(coreService.now());
            notification.setLastModifiedDate(coreService.now());

            return notificationRepository.save(notification);
        }
    }

    @Override
    public Notification upsertNewPostComments(Post post) {
        NotificationType notificationType = NotificationType.NEW_POST_COMMENTS;

        Optional<Notification> optional = this.notificationRepository
                .findByCourseAndUser(post.getCourse(), post.getCreatedBy()).stream()
                .filter(n -> n.getType() == notificationType && post.getId() == n.getItemId1() && shouldUpdate(n))
                .findFirst();

        if (optional.isPresent()) {
            Notification notification = optional.get();

            notification.setItemId2(notification.getItemId2() + 1);

            notification.setLastModifiedDate(coreService.now());

            return notificationRepository.save(notification);
        } else {
            Notification notification = new Notification();
            notification.setCourse(post.getCourse());

            notification.setType(notificationType);
            notification.setUser(post.getCreatedBy());

            notification.setItemId1(post.getId());
            notification.setItemId2(Long.valueOf(1));

            notification.setCreatedDate(coreService.now());
            notification.setLastModifiedDate(coreService.now());

            return notificationRepository.save(notification);
        }
    }

    @Override
    public Notification upsertNewPostLikes(Post post) {
        NotificationType notificationType = NotificationType.NEW_POST_LIKES;

        Optional<Notification> optional = this.notificationRepository
                .findByCourseAndUser(post.getCourse(), post.getCreatedBy()).stream()
                .filter(n -> n.getType() == notificationType && post.getId() == n.getItemId1() && shouldUpdate(n))
                .findFirst();

        if (optional.isPresent()) {
            Notification notification = optional.get();

            notification.setItemId2(notification.getItemId2() + 1);

            notification.setLastModifiedDate(coreService.now());

            return notificationRepository.save(notification);
        } else {
            Notification notification = new Notification();
            notification.setCourse(post.getCourse());

            notification.setType(notificationType);
            notification.setUser(post.getCreatedBy());

            notification.setItemId1(post.getId());
            notification.setItemId2(Long.valueOf(1));

            notification.setCreatedDate(coreService.now());
            notification.setLastModifiedDate(coreService.now());

            return notificationRepository.save(notification);
        }
    }

    @Override
    public Notification removeLikeOnNewPostLikes(Post post) {
        NotificationType notificationType = NotificationType.NEW_POST_LIKES;

        Optional<Notification> optional = this.notificationRepository
                .findByCourseAndUser(post.getCourse(), post.getCreatedBy()).stream()
                .filter(n -> n.getType() == notificationType && post.getId() == n.getItemId1() && shouldUpdate(n))
                .findFirst();

        if (!optional.isPresent()) {
            return null;
        }

        Notification notification = optional.get();

        notification.setItemId2(notification.getItemId2() - 1);

        return notificationRepository.save(notification);
    }

}

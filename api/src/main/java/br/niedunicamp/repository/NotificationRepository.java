package br.niedunicamp.repository;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import br.niedunicamp.model.Course;
import br.niedunicamp.model.Notification;
import br.niedunicamp.model.Role;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.NotificationType;

@Repository
public interface NotificationRepository extends PagingAndSortingRepository<Notification, Long> {

    List<Notification> findByCourseAndRole(Course course, Role role);

    List<Notification> findByCourseAndRoleNullAndUserNull(Course course);

    List<Notification> findByCourseAndUser(Course course, User user);

    List<Notification> findByUser(User user);

    List<Notification> findByCourseAndType(Course course, NotificationType type);
}

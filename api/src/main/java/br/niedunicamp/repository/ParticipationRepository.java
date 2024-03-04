package br.niedunicamp.repository;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.Participation;
import br.niedunicamp.model.Role;
import br.niedunicamp.model.User;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipationRepository  extends JpaRepository<Participation, Long>{

    Set<Participation> findByUser(User user);

    Set<Participation> findByCourse(Course course);

    Set<Participation> findByCourseAndRole(Course course, Role role);

    Set<Participation> findByUserAndRole(User user, Role role);

    Participation findByUserAndCourse(User user, Course course);
}

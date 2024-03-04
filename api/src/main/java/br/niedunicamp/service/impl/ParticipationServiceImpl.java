package br.niedunicamp.service.impl;

//#region Imports
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import br.niedunicamp.exception.CourseException;
import br.niedunicamp.exception.ResourceNotFoundException;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.Participation;
import br.niedunicamp.model.Role;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.RoleAndCourseIds;
import br.niedunicamp.pojo.RolesAndCourses;
import br.niedunicamp.repository.CourseRepository;
import br.niedunicamp.repository.ParticipationRepository;
import br.niedunicamp.repository.RoleRepository;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.CourseService;
import br.niedunicamp.service.NotificationService;
import br.niedunicamp.service.ParticipationService;
//#endregion

@Service
public class ParticipationServiceImpl implements ParticipationService {

    // #region Repositories
    @Autowired
    ParticipationRepository participationRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    NotificationService notificationService;
    // #endregion
    @Autowired
    CourseService courseService;

    @Override
    public ResponseEntity<List<Participation>> listParticipations() {
        return ResponseEntity.ok(participationRepository.findAll());
    }

    @Override
    public ResponseEntity<List<Participation>> findByUser(User user) {

        return ResponseEntity.ok(participationRepository.findByUser(user).stream().map(n -> {
            n.setUser(null);
            return n;
        }).collect(Collectors.toList()));
    }

    @Override
    public ResponseEntity<RolesAndCourses> listUserCoursesAndRoles(User user) {
        Set<Course> courses = new HashSet<Course>();
        Set<Role> roles = new HashSet<Role>();
        Set<RoleAndCourseIds> associations = new HashSet<RoleAndCourseIds>();

        participationRepository.findByUser(user).forEach(p -> {
            courses.add(p.getCourse());
            roles.add(p.getRole());
            associations.add(new RoleAndCourseIds(p.getCourse().getId(), p.getRole().getId()));
        });

        RolesAndCourses result = new RolesAndCourses();

        result.setCourses(courses);
        result.setRoles(roles);
        result.setAssociations(associations);

        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<List<Course>> findCoursesByUser(User user) {

        return ResponseEntity.ok(
                participationRepository.findByUser(user).stream().map(n -> n.getCourse()).collect(Collectors.toList()));
    }

    @Override
    public ResponseEntity<List<Course>> findActiveCoursesByUser(User user) {

        Date now = new Date();

        return ResponseEntity.ok(participationRepository.findByUser(user).stream().map(n -> n.getCourse())
                .filter(c -> (c.getStartDate().getTime() < now.getTime() && c.getEndDate().getTime() > now.getTime()))
                .collect(Collectors.toList()));
    }

    @Override
    public ResponseEntity<List<Course>> findInactiveCoursesByUser(User user) {

        Date now = new Date();

        return ResponseEntity.ok(participationRepository.findByUser(user).stream().map(n -> n.getCourse())
                .filter(c -> (c.getEndDate().getTime() < now.getTime())).collect(Collectors.toList()));
    }

    @Override
    public ResponseEntity<List<Participation>> findByCourse(Course course) {

        return ResponseEntity.ok(participationRepository.findByCourse(course).stream().map(n -> {
            n.setCourse(null);
            return n;
        }).collect(Collectors.toList()));
    }

    @Override
    public ResponseEntity<Role> findByUserAndCourse(User user, Course course) {

        return ResponseEntity.ok(participationRepository.findByUserAndCourse(user, course).getRole());
    }

    @Override
    public ResponseEntity<List<User>> findByCourseAndRole(Course course, Role role) {

        return ResponseEntity.ok(participationRepository.findByCourseAndRole(course, role).stream()
                .map(u -> u.getUser()).collect(Collectors.toList()));
    }

    @Override
    public ResponseEntity<Participation> create(User user, Course course, Role role) {

        Participation participation = new Participation();
        participation.setCourse(course);
        participation.setRole(role);
        participation.setUser(user);

        return ResponseEntity.ok(participationRepository.save(participation));
    }

    @Override
    public ResponseEntity<Participation> enrollByKey(String courseKey, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername());

        Optional<Course> course = courseRepository.findByKey(courseKey);

        if (!course.isPresent())
            throw new ResourceNotFoundException("Invalid key.");

        ResponseEntity<List<Course>> openCourses = courseService.listOpenSubscriptions();

        if(openCourses.getBody() == null) {
            throw new ResourceNotFoundException("There is no course open for subscribing");
        }

        List<Course> courseList = openCourses.getBody();

        if(!courseList.contains(course.get())) {
            throw new CourseException("This course is finished");
        }

        Role role = roleRepository.findByName("STUDENT");

        Participation participation = new Participation();
        participation.setCourse(course.get());
        participation.setRole(role);
        participation.setUser(user);

        participation = participationRepository.save(participation);

        notificationService.upsertNewStudent(course.get(), user);

        return ResponseEntity.ok(participation);
    }

    @Override
    public ResponseEntity<?> delete(User user, Course course) {

        Participation participation = participationRepository.findByUserAndCourse(user, course);
        if (participation == null)
            throw new ResourceNotFoundException("Participation not found");

        try {
            participationRepository.delete(participation);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Error on deleting");
        }
    }

    @Override
    public ResponseEntity<List<Course>> findByUserAndRole(User user, Role role) {

        return ResponseEntity.ok(participationRepository.findByUserAndRole(user, role).stream().map(c -> c.getCourse())
                .collect(Collectors.toList()));
    }

}
package br.niedunicamp.service.impl;

//#region Imports
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import br.niedunicamp.exception.CourseException;
import br.niedunicamp.exception.InvalidFieldException;
import br.niedunicamp.exception.ResourceNotFoundException;
import br.niedunicamp.exception.UserNotAuthorized;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.GradeConfig;
import br.niedunicamp.pojo.CourseDTO;
import br.niedunicamp.pojo.CourseKey;
import br.niedunicamp.repository.CourseRepository;
import br.niedunicamp.repository.GradeConfigRepository;
import br.niedunicamp.service.ActivityService;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.CourseService;
import br.niedunicamp.service.FileStorageService;
import br.niedunicamp.util.DateUtil;
import net.bytebuddy.utility.RandomString;
//#endregion

@Service
public class CourseServiceImpl implements CourseService {

    // #region Repositories and Services
    @Autowired
    CourseRepository courseRepository;

    @Autowired
    GradeConfigRepository gradeConfigRepository;

    @Autowired
    FileStorageService fileStorageService;

    @Autowired
    CoreService coreService;

    @Autowired
    ActivityService activityService;
    // #endregion

    @Override
    public ResponseEntity<Course> create(CourseDTO courseDTO, UserDetails userDetails) {
        validateCourseFields(courseDTO);

        String newKey = "sampleKey";

        do {
            newKey = RandomString.make(6);
        } while (courseRepository.findByKey(newKey).isPresent());

        // Set course values
        Course course = new Course();
        course.setName(courseDTO.getName());
        course.setKey(newKey);
        course.setInfo(courseDTO.getInfo());
        course.setNoMaxStudents(courseDTO.getNoMaxStudents());

        course.setSubscriptionBegin(DateUtil.fromJSONDate(courseDTO.getSubscriptionBegin()));
        course.setSubscriptionEnd(DateUtil.fromJSONDate(courseDTO.getSubscriptionEnd()));

        course.setStartDate(DateUtil.fromJSONDate(courseDTO.getStartDate()));
        course.setEndDate(DateUtil.fromJSONDate(courseDTO.getEndDate()));

        // Save course
        course = courseRepository.save(course);

        // Create default grade config
        GradeConfig gradeConfig = new GradeConfig();
        gradeConfig.setCourse(course);
        gradeConfig.setDefaultWeight(1f);
        gradeConfig.setFinalGradesReleased(null);
        gradeConfig.setUseArithmeticMean(true);
        coreService.updateLastModified(gradeConfig, userDetails);
        // Save it
        gradeConfig = gradeConfigRepository.save(gradeConfig);

        return ResponseEntity.ok(course);
    }

    private void validateCourseFields(CourseDTO courseDTO) {
        validateNonNullFields(courseDTO);
        validateFieldLength(courseDTO);
        validateDateOrder(courseDTO);
    }

    private void validateNonNullFields(CourseDTO courseDTO) {
        if (courseDTO.getName() == null || 
            courseDTO.getSubscriptionBegin() == null || 
            courseDTO.getSubscriptionEnd() == null || 
            courseDTO.getStartDate() == null || 
            courseDTO.getEndDate() == null || 
            courseDTO.getInfo() == null || 
            courseDTO.getNoMaxStudents() == null) {
            throw new IllegalArgumentException("All fields must be provided");
        }
    }

    private void validateFieldLength(CourseDTO courseDTO) {
        int MAX_NAME_LENGTH = 100;
        int MAX_INFO_LENGTH = 1000;

        if (courseDTO.getName().length() > MAX_NAME_LENGTH) {
            throw new IllegalArgumentException("Name length exceeds the maximum limit");
        }

        if (courseDTO.getInfo().length() > MAX_INFO_LENGTH) {
            throw new IllegalArgumentException("Info length exceeds the maximum limit");
        }
    }

    private void validateDateOrder(CourseDTO courseDTO) {
        Date subscriptionBeginDate = DateUtil.fromJSONDate(courseDTO.getSubscriptionBegin());
        Date subscriptionEndDate = DateUtil.fromJSONDate(courseDTO.getSubscriptionEnd());
        Date startDate = DateUtil.fromJSONDate(courseDTO.getStartDate());
        Date endDate = DateUtil.fromJSONDate(courseDTO.getEndDate());

        if (subscriptionBeginDate.after(subscriptionEndDate)) {
            throw new IllegalArgumentException("Subscription begin date must be before the end date");
        }

        if (startDate.after(endDate)) {
            throw new IllegalArgumentException("Course start date must be before the end date");
        }
    }

    @Override
    public ResponseEntity<?> delete(Course course) {

        coreService.deleteCascade(course);

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity<Course> update(Course course, CourseDTO courseDTO) {
        validateCourseFields(courseDTO);
        
        course.setName(courseDTO.getName());
        course.setInfo(courseDTO.getInfo());
        course.setNoMaxStudents(courseDTO.getNoMaxStudents());

        course.setSubscriptionBegin(DateUtil.fromJSONDate(courseDTO.getSubscriptionBegin()));
        course.setSubscriptionEnd(DateUtil.fromJSONDate(courseDTO.getSubscriptionEnd()));
        course.setStartDate(DateUtil.fromJSONDate(courseDTO.getStartDate()));
        course.setEndDate(DateUtil.fromJSONDate(courseDTO.getEndDate()));

        return ResponseEntity.ok(courseRepository.save(course));
    }

    @Override
    public ResponseEntity<List<Course>> listCourses() {

        return ResponseEntity.ok((List<Course>) courseRepository.findAll());
    }

    @Override
    public ResponseEntity<List<Course>> listActiveCourses() {
        Date now = new Date();

        List<Course> courses = courseRepository.findByStartDateGreaterThanAndEndDateGreaterThan(now, now);

        return ResponseEntity.ok(courses);
    }

    @Override
    public ResponseEntity<List<Course>> listEndedCourses() {
        Date now = new Date();

        List<Course> courses = courseRepository.findByEndDateLessThan(now);

        return ResponseEntity.ok(courses);
    }

    @Override
    public ResponseEntity<List<Course>> listOpenSubscriptions() {
        Date now = new Date();

        List<Course> courses = courseRepository.findBySubscriptionBeginLessThanAndSubscriptionEndGreaterThan(now, now);

        return ResponseEntity.ok(courses);
    }

    @Override
    public ResponseEntity<List<Course>> findByCourseName(String name) {
        List<Course> courses = courseRepository.findByNameContaining(name);

        return ResponseEntity.ok(courses);
    }

    @Override
    public ResponseEntity<Course> get(Course course) {
        return ResponseEntity.ok(course);
    }

    @Override
    public ResponseEntity<Course> findByKey(String key) {
        Optional<Course> course = courseRepository.findByKey(key);

        if (!course.isPresent()) {
            throw new ResourceNotFoundException("Course not found with the key: '" + key + "'");
        }

        return ResponseEntity.ok(course.get());
    }

    @Override
    public ResponseEntity<Course> findOpenCourseByKey(String key) {
        ResponseEntity<Course> course = this.findByKey(key);

        ResponseEntity<List<Course>> openCourses = this.listOpenSubscriptions();

        if (openCourses.getBody() == null) {
            throw new ResourceNotFoundException("There is no course open for subscribing");
        }

        List<Course> courseList = openCourses.getBody();

        if (!courseList.contains(course.getBody())) {
            throw new CourseException("This course is finished");
        }

        return ResponseEntity.ok(course.getBody());
    }

    @Override
    public ResponseEntity<CourseKey> setKey(Course course, String key) {

        if (courseRepository.findByKey(key).isPresent()) {
            throw new UserNotAuthorized("Invalid key. Please try another one");
        }

        if(key.length() < 6 || key.length() > 8)
            throw new InvalidFieldException("Key size must be between 6 and 8 characters");
        else {
            course.setKey(key);
            courseRepository.save(course);
        }

        CourseKey courseKey = new CourseKey();
        courseKey.setKey(key);
        courseKey.setValidUntil(null);

        return ResponseEntity.ok(courseKey);
    }

    @Override
    public ResponseEntity<CourseKey> refreshKey(Course course) {
        String newKey;

        do {
            newKey = RandomString.make(6);
        } while (courseRepository.findByKey(newKey).isPresent());

        course.setKey(newKey);

        courseRepository.save(course);

        CourseKey courseKey = new CourseKey();
        courseKey.setKey(newKey);

        return ResponseEntity.ok(courseKey);
    }

    @Override
    public ResponseEntity<CourseKey> getKey(Course course) {
        CourseKey courseKey = new CourseKey();
        courseKey.setKey(course.getKey());

        return ResponseEntity.ok(courseKey);
    }

}
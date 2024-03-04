package br.niedunicamp.service.impl;

import java.util.ArrayList;
//#region Imports
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import br.niedunicamp.model.Activity;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.GradeConfig;
import br.niedunicamp.pojo.ActivityDTO;
import br.niedunicamp.pojo.ActivityListByGrade;
import br.niedunicamp.pojo.FileUploaded;
import br.niedunicamp.repository.ActivityRepository;
import br.niedunicamp.repository.CourseRepository;
import br.niedunicamp.repository.GradeConfigRepository;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.ActivityService;
import br.niedunicamp.service.ActivitySubmissionService;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.FileStorageService;
import br.niedunicamp.service.NotificationService;
import br.niedunicamp.service.PostService;
//#endregion

@Service
public class ActivityServiceImpl implements ActivityService {

	// #region Repositories
	@Autowired
	ActivityRepository activityRepository;

	@Autowired
	CourseRepository courseRepository;

	@Autowired
	CoreService coreService;

	@Autowired
	NotificationService notificationService;

	@Autowired
	PostService postService;

	@Autowired
	ActivitySubmissionService submissionService;

	@Autowired
	UserRepository userRepository;

	@Autowired
	GradeConfigRepository gradeConfigRepository;

	@Autowired
	ActivityRepository gradeActivityRepository;

	@Autowired
	FileStorageService fileStorageService;
	// #endregion

	@Override
	public ResponseEntity<List<Activity>> list(Course course) {
		return ResponseEntity.ok(activityRepository.findByCourse(course));
	}

	@Override
	public ResponseEntity<List<Activity>> listWithFiles(Course course) {
		List<Activity> activities = activityRepository.findByCourse(course);

		return ResponseEntity.ok(activities.stream().map(activity -> {
			List<FileUploaded> files = fileStorageService.listFiles(activity.getFilesFolder()).getBody();
			activity.setFiles(files);

			return activity;
		}).collect(Collectors.toList()));
	}

	@Override
	public ResponseEntity<Activity> getWithFiles(Activity activity) {
		List<FileUploaded> files = fileStorageService.listFiles(activity.getFilesFolder()).getBody();

		activity.setFiles(files);

		return ResponseEntity.ok(activity);
	}

	@Override
	public ResponseEntity<List<Activity>> listPublished(Course course) {
		Date now = coreService.now();

		List<Activity> activities = activityRepository.findByCourseAndPublishDateLessThan(course, now);

		return ResponseEntity.ok(activities.stream().map(activity -> {
			List<FileUploaded> files = fileStorageService.listFiles(activity.getFilesFolder()).getBody();
			activity.setFiles(files);

			return activity;
		}).collect(Collectors.toList()));
	}

	@Override
	public ResponseEntity<List<Activity>> listPublishedWithFiles(Course course) {
		Date date = coreService.now();
		return ResponseEntity.ok(activityRepository.findByCourseAndPublishDateLessThan(course, date));
	}

	@Override
	public ResponseEntity<ActivityListByGrade> listByGrade(Course course, UserDetails userDetails) {
		List<Activity> activities = activityRepository.findByCourse(course);

		if (!coreService.hasPermission("list_all_activities", course.getId(), userDetails)) {
			activities.removeIf(item -> item.getPublishDate().after(coreService.now()));
		}

		ActivityListByGrade list = new ActivityListByGrade();

		if (activities == null || activities.size() == 0) {
			list.setWithGrades(new ArrayList<Activity>());
			list.setWithoutGrades(new ArrayList<Activity>());
			return ResponseEntity.ok(list);
		}

		List<Activity> gradedActivities = activities.stream()
				.filter(activity -> activity != null && activity.getGradeWeight() != null).collect(Collectors.toList());

		if (gradedActivities != null && gradedActivities.size() > 0) {
			activities.removeAll(gradedActivities);
		}

		list.setWithGrades(gradedActivities);
		list.setWithoutGrades(activities);

		return ResponseEntity.ok(list);
	}

	@Override
	public ResponseEntity<Activity> create(ActivityDTO activityDTO, Course course, UserDetails userDetails) {

		Activity activity = toActivity(activityDTO);
		activity.setCourse(course);
		coreService.addCreated(activity, userDetails);
		coreService.updateLastModified(activity, userDetails);

		// Save activity
		activity = activityRepository.save(activity);
		// Create Post with activity
		//postService.createWithActivity(activity);

		if (activityDTO.getHasGrade()) {
			// Add default grade config
			GradeConfig gradeConfig = gradeConfigRepository.findByCourse(course);
			activity.setCriteria(activityDTO.getCriteria());
			activity.setGradeWeight(gradeConfig.getDefaultWeight());

			coreService.updateLastModified(activity, userDetails);

			activity = gradeActivityRepository.save(activity);
		}

		notificationService.addActivityPublished(activity);

		return ResponseEntity.ok(activity);
	}

	@Override
	public ResponseEntity<?> delete(Activity activity) {
		coreService.deleteCascade(activity);

		return ResponseEntity.ok(null);
	}

	@Override
	public ResponseEntity<Activity> update(ActivityDTO activityDTO, Activity activity, UserDetails userDetails) {

		activity.setDescription(activityDTO.getDescription());
		activity.setPublishDate(activityDTO.getPublishDate());
		activity.setSubmissionBegin(activityDTO.getSubmissionBegin());
		activity.setSubmissionEnd(activityDTO.getSubmissionEnd());
		activity.setTitle(activityDTO.getTitle());
		activity.setCriteria(activityDTO.getCriteria());

		Boolean oldHasGrade = activity.getGradeWeight() > 0f;

		if (activityDTO.getHasGrade() != oldHasGrade) {

			if (activityDTO.getHasGrade()) {
				// Add default grade config
				GradeConfig gradeConfig = gradeConfigRepository.findByCourse(activity.getCourse());

				activity.setGradeWeight(gradeConfig.getDefaultWeight());
			} else {
				activity.setGradeWeight(0f);
			}
			activity = gradeActivityRepository.save(activity);
		}

		coreService.updateLastModified(activity, userDetails);
		notificationService.updateActivityPublished(activity);

		return ResponseEntity.ok(activityRepository.save(activity));
	}

	@Override
	public Activity toActivity(ActivityDTO activityDTO) {
		Activity activity = new Activity();

		activity.setTitle(activityDTO.getTitle());
		activity.setDescription(activityDTO.getDescription());
		activity.setSubmissionBegin(activityDTO.getSubmissionBegin());
		activity.setSubmissionEnd(activityDTO.getSubmissionEnd());
		activity.setPublishDate(activityDTO.getPublishDate());
		activity.setCriteria(activityDTO.getCriteria());

		return activity;
	}
}
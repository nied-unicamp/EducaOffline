package br.niedunicamp.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import br.niedunicamp.model.Activity;
import br.niedunicamp.model.Course;
import br.niedunicamp.pojo.ActivityDTO;
import br.niedunicamp.pojo.ActivityListByGrade;

@Service
public interface ActivityService {
	ResponseEntity<Activity> getWithFiles(Activity activity);

	ResponseEntity<List<Activity>> list(Course course);

	ResponseEntity<List<Activity>> listWithFiles(Course course);

	ResponseEntity<List<Activity>> listPublished(Course course);

	ResponseEntity<List<Activity>> listPublishedWithFiles(Course course);

	ResponseEntity<ActivityListByGrade> listByGrade(Course course, UserDetails userDetails);

	ResponseEntity<Activity> create(ActivityDTO activity, Course course, UserDetails userDetails);

	ResponseEntity<Activity> update(ActivityDTO activityDTO, Activity activity, UserDetails userDetails);

	ResponseEntity<?> delete(Activity activity);

	Activity toActivity(ActivityDTO activity);
}
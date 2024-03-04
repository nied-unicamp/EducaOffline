package br.niedunicamp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import br.niedunicamp.exception.ResourceNotFoundException;
import br.niedunicamp.model.Activity;
import br.niedunicamp.model.ActivityItem;
import br.niedunicamp.model.ActivitySubmission;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.ActivitySubmissionDTO;
import br.niedunicamp.repository.ActivityEvaluationRepository;
import br.niedunicamp.repository.ActivityItemRepository;
import br.niedunicamp.repository.ActivityRepository;
import br.niedunicamp.repository.ActivitySubmissionRepository;
import br.niedunicamp.repository.CourseRepository;
import br.niedunicamp.repository.GroupRepository;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.ActivityEvaluationService;
import br.niedunicamp.service.ActivitySubmissionService;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.FileStorageService;
//#endregion
import br.niedunicamp.service.GradesService;

@Service
public class ActivitySubmissionServiceImpl implements ActivitySubmissionService {

	// #region Repositories and Services
	@Autowired
	CoreService coreService;

	@Autowired
	ActivityRepository activityRepository;

	@Autowired
	CourseRepository courseRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	GroupRepository groupRepository;

	@Autowired
	ActivitySubmissionRepository submissionRepository;

	@Autowired
	ActivityEvaluationRepository evaluationRepository;

	@Autowired
	ActivityItemRepository activityItemRepository;

	@Autowired
	FileStorageService fileStorageService;

	@Autowired
	ActivityEvaluationService evaluationService;

	@Autowired
	GradesService gradesService;
	// #endregion


	@Override
	public ResponseEntity<ActivitySubmission> create(ActivitySubmissionDTO submissionDTO, Activity activity,
			UserDetails userDetails) {

		User user = this.userRepository.findByEmail(userDetails.getUsername());
		ActivityItem activityItem = activityItemRepository.findByActivityAndUser(activity, user);

		// Check if the submission already exists
		if (activityItem instanceof ActivityItem && activityItem.getSubmission() instanceof ActivitySubmission) {
			throw new ResourceAccessException("Submission already created.");
		}

		// Create a new ActivityItem if needed
		if (!(activityItem instanceof ActivityItem)) {
			activityItem = new ActivityItem();
			activityItem.setActivity(activity);
			activityItem.setUser(user);
		}

		// Create the new submission
		ActivitySubmission submission = new ActivitySubmission();
		submission.setAnswer(submissionDTO.getAnswer());
		coreService.updateLastModified(submission, userDetails);

		// Save the submission
		submission = submissionRepository.save(submission);

		// Save ActivityItem
		activityItem.setSubmission(submission);
		activityItemRepository.save(activityItem);

		return ResponseEntity.ok(submission);
	}

	@Override
	public ResponseEntity<ActivitySubmission> update(ActivitySubmissionDTO submissionDTO, ActivitySubmission submission,
			UserDetails userDetails) {

		if (submissionDTO.getAnswer() != null)
			submission.setAnswer(submissionDTO.getAnswer());

		coreService.updateLastModified(submission, userDetails);

		return ResponseEntity.ok(submissionRepository.save(submission));
	}

	@Override
	public ResponseEntity<ActivitySubmission> update(ActivitySubmissionDTO submissionDTO, Activity activity,
			UserDetails userDetails) {
		User user = coreService.validateUser(userDetails);
		ActivityItem activityItem = gradesService.get(activity, user, userDetails).getBody();

		if (!(activityItem instanceof ActivityItem) || !(activityItem.getSubmission() instanceof ActivitySubmission)) {
			throw new ResourceNotFoundException("Submission not found!");
		}

		ActivitySubmission submission = activityItem.getSubmission();

		if (submissionDTO.getAnswer() != null)
			submission.setAnswer(submissionDTO.getAnswer());

		coreService.updateLastModified(submission, userDetails);

		return ResponseEntity.ok(submissionRepository.save(submission));
	}

	@Override
	public ResponseEntity<?> delete(Activity activity, UserDetails userDetails) {
		User user = coreService.validateUser(userDetails);

		ActivityItem activityItem = activityItemRepository.findByActivityAndUser(activity, user);

		if (!(activityItem instanceof ActivityItem) || !(activityItem.getSubmission() instanceof ActivitySubmission)) {
			throw new ResourceNotFoundException("Submission not found!");
		}

		ActivitySubmission submission = activityItem.getSubmission();

		// Update and save ActivityItem
		activityItem.setSubmission(null);
		activityItemRepository.save(activityItem);

		// Delete the submission
		submissionRepository.delete(submission);

		// Update and save ActivityItem
		//activityItem.setSubmission(null);
		//activityItemRepository.save(activityItem);

		return ResponseEntity.ok(null);
	}
}
package br.niedunicamp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import br.niedunicamp.exception.ResourceNotFoundException;
import br.niedunicamp.exception.UserNotAuthorized;
import br.niedunicamp.model.Activity;
import br.niedunicamp.model.ActivityEvaluation;
import br.niedunicamp.model.ActivityItem;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.ActivityEvaluationDTO;
import br.niedunicamp.repository.ActivityEvaluationRepository;
import br.niedunicamp.repository.ActivityItemRepository;
import br.niedunicamp.repository.ActivityRepository;
import br.niedunicamp.repository.ActivitySubmissionRepository;
import br.niedunicamp.repository.CourseRepository;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.ActivityEvaluationService;
import br.niedunicamp.service.ActivitySubmissionService;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.FileStorageService;
//#endregion
import br.niedunicamp.service.GradesService;

@Service
public class ActivityEvaluationServiceImpl implements ActivityEvaluationService {

	// #region Repos and services
	@Autowired
	ActivityRepository activityRepository;

	@Autowired
	CoreService coreService;

	@Autowired
	CourseRepository courseRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	ActivitySubmissionService submissionService;

	@Autowired
	GradesService gradesService;

	@Autowired
	ActivitySubmissionRepository submissionRepository;

	@Autowired
	ActivityEvaluationRepository evaluationRepository;

	@Autowired
	ActivityItemRepository activityItemRepository;

	@Autowired
	FileStorageService fileStorageService;
	// #endregion

	@Override
	public ResponseEntity<ActivityEvaluation> create(ActivityEvaluationDTO evaluationDTO, Activity activity,
			User student, UserDetails userDetails) {

		// Get current activityItem
		ActivityItem activityItem = gradesService.get(activity, student, userDetails).getBody();

		// Check if the evaluation was created already
		if (activityItem instanceof ActivityItem && activityItem.getEvaluation() instanceof ActivityEvaluation)
			throw new UserNotAuthorized("Evaluation already created.");

		// Create the new ActivityItem if needed
		if (!(activityItem instanceof ActivityItem)) {
			activityItem = new ActivityItem();
			activityItem.setActivity(activity);
			activityItem.setSubmission(null);
			activityItem.setUser(student);
		}

		// Create the new evaluation
		ActivityEvaluation evaluation = new ActivityEvaluation();
		evaluation.setComment(evaluationDTO.getComment());
		evaluation.setScore(evaluationDTO.getScore());
		coreService.updateLastModified(evaluation, userDetails);

		// Save the evaluation
		evaluation = evaluationRepository.save(evaluation);

		// Update and save the ActivityItem
		activityItem.setEvaluation(evaluation);
		activityItemRepository.save(activityItem);

		// Return the evaluation
		return ResponseEntity.ok(evaluation);
	}

	@Override
	public ResponseEntity<ActivityEvaluation> update(ActivityEvaluationDTO evaluationDTO, Activity activity,
			User student, UserDetails userDetails) {

		// Get current activityItem
		ActivityItem activityItem = gradesService.get(activity, student, userDetails).getBody();
		ActivityEvaluation evaluation = activityItem.getEvaluation();

		if (!(activityItem instanceof ActivityItem) || !(evaluation instanceof ActivityEvaluation))
			throw new ResourceNotFoundException("Evaluation not found");

		if (evaluationDTO.getComment() != null)
			evaluation.setComment(evaluationDTO.getComment());

		if (evaluation.getScore() != null)
			evaluation.setScore(evaluationDTO.getScore());

		coreService.updateLastModified(evaluation, userDetails);

		return ResponseEntity.ok(evaluationRepository.save(evaluation));
	}

	@Override
	public ResponseEntity<?> delete(Activity activity, User student, UserDetails userDetails) {
		// Get current activityItem
		ActivityItem activityItem = gradesService.get(activity, student, userDetails).getBody();
		ActivityEvaluation evaluation = activityItem.getEvaluation();

		if (!(activityItem instanceof ActivityItem) || !(evaluation instanceof ActivityEvaluation))
			throw new ResourceNotFoundException("Evaluation not found");

		// Update and save ActivityItem
		activityItem.setEvaluation(null);
		activityItemRepository.save(activityItem);

		// Delete evaluation
		evaluationRepository.delete(evaluation);

		return ResponseEntity.ok(null);
	}
}
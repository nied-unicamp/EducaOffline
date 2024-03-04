package br.niedunicamp.service;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import br.niedunicamp.model.Activity;
import br.niedunicamp.model.ActivitySubmission;
import br.niedunicamp.pojo.ActivitySubmissionDTO;

public interface ActivitySubmissionService {
	ResponseEntity<ActivitySubmission> create(ActivitySubmissionDTO submissionDTO, Activity activity,
			UserDetails userDetails);

	ResponseEntity<ActivitySubmission> update(ActivitySubmissionDTO submissionDTO, ActivitySubmission submission,
			UserDetails userDetails);

	ResponseEntity<ActivitySubmission> update(ActivitySubmissionDTO submissionDTO, Activity activity, UserDetails userDetails);

	ResponseEntity<?> delete(Activity activity, UserDetails userDetails);
}
package br.niedunicamp.service;

//#region Imports
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import br.niedunicamp.model.Activity;
import br.niedunicamp.model.ActivityEvaluation;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.ActivityEvaluationDTO;
//#endregion

@Service
public interface ActivityEvaluationService {
	ResponseEntity<ActivityEvaluation> create(ActivityEvaluationDTO evaluation, Activity activity, User student, UserDetails userDetails);

	ResponseEntity<ActivityEvaluation> update(ActivityEvaluationDTO evaluationDTO, Activity activity, User student, UserDetails userDetails);

	ResponseEntity<?> delete(Activity activity, User student, UserDetails userDetails);
}
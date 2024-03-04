package br.niedunicamp.service;

//#region Imports
import java.util.List;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import br.niedunicamp.model.Activity;
import br.niedunicamp.model.ActivityItem;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.GradeConfig;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.ActivityAverageGrade;
import br.niedunicamp.pojo.ActivityGradesSummary;
import br.niedunicamp.pojo.FinalGrade;
import br.niedunicamp.pojo.GradeConfigDTO;
import br.niedunicamp.pojo.GradesOverview;
//#endregion
import br.niedunicamp.pojo.GradesUserOverview;

@Service
public interface GradesService {

        ResponseEntity<GradesOverview> overview(Course course); 
        ResponseEntity<GradesUserOverview> userOverview(Course course, User user); 

        // ------------------------ ActivityItem ---------------------------- //
        ResponseEntity<List<ActivityItem>> list(Activity activity, UserDetails userDetails);

        ResponseEntity<List<ActivityItem>> list(Course course, User user, UserDetails userDetails);

        ResponseEntity<ActivityItem> get(Activity activity, User user, UserDetails userDetails);

        // ------------------------ Average/Summary ----------------------------------- //

        
        ResponseEntity<Set<ActivityAverageGrade>> listAverageGrades(Course course);
        ResponseEntity<ActivityAverageGrade> getAverageGrade(Activity activity);
        
        ResponseEntity<List<ActivityGradesSummary>> listActivities(Course course);

        // ------------------------ GradeConfig --------------------------- //

        ResponseEntity<GradeConfig> release(Course course, UserDetails userDetails);

        ResponseEntity<Activity> release(Activity activity, UserDetails userDetails);

        ResponseEntity<GradeConfig> getConfig(Course course);

        ResponseEntity<GradeConfig> useArithmeticMean(Course course, UserDetails userDetails);

        ResponseEntity<GradeConfig> updateWeights(Course course, GradeConfigDTO
        gradeConfigDTO, UserDetails userDetails);

        // ------------------------ Final grade ------------------------ //

        ResponseEntity<FinalGrade> getFinalGrade(Course course, User user);

        ResponseEntity<List<FinalGrade>> listFinalGrades(Course course);
}
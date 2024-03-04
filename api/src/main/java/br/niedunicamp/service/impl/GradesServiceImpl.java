package br.niedunicamp.service.impl;

//#region Imports
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import br.niedunicamp.model.Activity;
import br.niedunicamp.model.ActivityEvaluation;
import br.niedunicamp.model.ActivityItem;
import br.niedunicamp.model.ActivitySubmission;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.GradeConfig;
import br.niedunicamp.model.Role;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.ActivityAverageGrade;
import br.niedunicamp.pojo.ActivityGradesSummary;
import br.niedunicamp.pojo.ActivityItemLite;
import br.niedunicamp.pojo.FileUploaded;
import br.niedunicamp.pojo.FinalGrade;
import br.niedunicamp.pojo.GradeConfigDTO;
import br.niedunicamp.pojo.GradesOverview;
import br.niedunicamp.pojo.GradesUserOverview;
import br.niedunicamp.repository.ActivityEvaluationRepository;
import br.niedunicamp.repository.ActivityItemRepository;
import br.niedunicamp.repository.ActivityRepository;
import br.niedunicamp.repository.ActivitySubmissionRepository;
import br.niedunicamp.repository.CourseRepository;
import br.niedunicamp.repository.GradeConfigRepository;
import br.niedunicamp.repository.ParticipationRepository;
import br.niedunicamp.repository.RoleRepository;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.FileStorageService;
import br.niedunicamp.service.GradesService;
//#endregion
import br.niedunicamp.service.NotificationService;

@Service
public class GradesServiceImpl implements GradesService {

    // #region Repositories
    @Autowired
    ActivityRepository activityRepository;

    @Autowired
    ActivitySubmissionRepository submissionRepository;

    @Autowired
    ActivityEvaluationRepository evaluationRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    ParticipationRepository participationRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    GradeConfigRepository gradeConfigRepository;

    @Autowired
    CoreService coreService;

    @Autowired
    FileStorageService fileService;

    @Autowired
    NotificationService notificationService;

    @Autowired
    ActivityItemRepository activityItemRepository;
    // #endregion

    @Override
    public ResponseEntity<GradesOverview> overview(final Course course) {

        final Set<Activity> activities = activityRepository.findByCourse(course).stream().collect(Collectors.toSet());

        final Set<ActivityItemLite> activityItems = activities.stream()
                .flatMap(activity -> activityItemRepository.findByActivity(activity).stream())
                .map(item -> new ActivityItemLite(item)).collect(Collectors.toSet());

        final Set<User> students = fetchStudents(course).stream().collect(Collectors.toSet());

        final GradeConfig gradeConfig = gradeConfigRepository.findByCourse(course);

        final Set<FinalGrade> finalGrades = students.stream()
                .map(user -> this.fetchFinalGrade(gradeConfig,fetchGradedActivities(course),user))
                .collect(Collectors.toSet());

        final Set<ActivityAverageGrade> averageGrades = listAverageGrades(course).getBody();

        final GradesOverview gradesOverview = new GradesOverview();
        gradesOverview.setActivities(activities);
        gradesOverview.setGrades(activityItems);
        gradesOverview.setFinalGrades(finalGrades);
        gradesOverview.setAverageGrades(averageGrades);

        return ResponseEntity.ok(gradesOverview);
    }

    @Override
    public ResponseEntity<GradesUserOverview> userOverview(final Course course, final User user) {

        final Set<Activity> activities = activityRepository.findByCourse(course).stream().collect(Collectors.toSet());

        final Set<ActivityItemLite> activityItems = activities.stream()
                .map(activity -> activityItemRepository.findByActivityAndUser(activity, user))
                .filter(item -> item instanceof ActivityItem).map(item -> new ActivityItemLite(item))
                .collect(Collectors.toSet());

        final GradeConfig gradeConfig = gradeConfigRepository.findByCourse(course);

        final FinalGrade finalGrade = this.fetchFinalGrade(gradeConfig, fetchGradedActivities(course), user);

        final Set<ActivityAverageGrade> averageGrades = listAverageGrades(course).getBody();

        final GradesUserOverview gradesOverview = new GradesUserOverview();
        gradesOverview.setActivities(activities);
        gradesOverview.setFinalGrade(finalGrade);
        gradesOverview.setGrades(activityItems);
        gradesOverview.setAverageGrades(averageGrades);

        return ResponseEntity.ok(gradesOverview);
    }

    // ------------------------- Listing
    // --------------------------------------------------------------------- //

    @Override
    public ResponseEntity<ActivityItem> get(final Activity activity, final User user, final UserDetails userDetails) {
        final ActivityItem activityItem = activityItemRepository.findByActivityAndUser(activity, user);

        // Remove the Evaluation if needed
        if (activityItem instanceof ActivityItem) {
            if (!coreService.hasPermission("get_all_evaluations", activity.getCourse().getId(), userDetails)) {
                final Date gradesReleaseDate = activityItem.getActivity().getGradesReleaseDate();

                // Remove Evaluation if the grades were not published
                if (!(gradesReleaseDate instanceof Date) || gradesReleaseDate.after(coreService.now())) {
                    activityItem.setEvaluation(null);
                }
            }
        }

        return ResponseEntity.ok(activityItem);
    }

    @Override
    public ResponseEntity<List<ActivityItem>> list(final Activity activity, final UserDetails userDetails) {
        final List<ActivityItem> activityItems = activityItemRepository.findByActivity(activity);

        return ResponseEntity.ok(activityItems.stream().map(item -> {
            if (item.getSubmission() instanceof ActivitySubmission && item.getSubmission().getId() > 0) {
                ActivitySubmission submission = item.getSubmission();
                String subPath = item.getActivity().getFilesFolder() + submission.getFilesFolder();
                List<FileUploaded> myFiles = this.fileService.listFiles(subPath).getBody();

                submission.setFiles(myFiles);
            }

            return item;
        }).collect(Collectors.toList()));
    }

    @Override
    public ResponseEntity<List<ActivityItem>> list(final Course course, final User user,
            final UserDetails userDetails) {
        final Boolean removeEvaluation = !coreService.hasPermission("get_all_evaluations", course.getId(), userDetails);

        final List<ActivityItem> gradedActivities = activityRepository.findByCourse(course).stream()
                .filter(activity -> activity.getGradeWeight() != 0).map(activity -> {
                    return this.fetchActivityItem(activity, user, removeEvaluation);
                }).collect(Collectors.toList());

        return ResponseEntity.ok(gradedActivities);
    }

    // ------------------------ Summary -------------------------------------------
    // //

    @Override
    public ResponseEntity<List<ActivityGradesSummary>> listActivities(final Course course) {

        final List<ActivityGradesSummary> list = activityRepository.findByCourse(course).stream().map(activity -> {

            final List<ActivityItem> activityItems = activityItemRepository.findByActivity(activity);

            final ActivityGradesSummary activityGradesSummary = new ActivityGradesSummary();
            activityGradesSummary.setActivity(activity);
            activityGradesSummary.setSubmissions(0);
            activityGradesSummary.setEvaluations(0);
            activityGradesSummary.setAverage(0f);

            final Float gradesSum = activityItems.stream().map(activityItem -> {
                Float score = 0f;

                if (!(activityItem.getSubmission() instanceof ActivitySubmission)) {
                    activityGradesSummary.setSubmissions(1 + activityGradesSummary.getSubmissions());
                }

                if (!(activityItem.getEvaluation() instanceof ActivityEvaluation)) {
                    activityGradesSummary.setEvaluations(1 + activityGradesSummary.getEvaluations());
                    score = activityItem.getEvaluation().getScore();
                }

                return score;
            }).reduce(0f, (a, b) -> a + b);

            if (activityGradesSummary.getEvaluations() > 0) {
                final Float average = gradesSum / activityGradesSummary.getEvaluations();
                activityGradesSummary.setAverage(average);
            }

            return activityGradesSummary;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(list);
    }

    @Override
    public ResponseEntity<Set<ActivityAverageGrade>> listAverageGrades(final Course course) {

        final Set<ActivityAverageGrade> averageGrades = activityRepository.findByCourse(course).stream()
                .filter(activity -> activity != null && activity.getGradeWeight() != null)
                .map((final Activity activity) -> {

                    final List<ActivityItem> activityItems = activityItemRepository.findByActivity(activity);

                    final ActivityAverageGrade activityAverageGrade = new ActivityAverageGrade();
                    activityAverageGrade.setActivityId(activity.getId());

                    final Float gradesSum = activityItems.stream().map(activityItem -> {
                        Float score = 0f;

                        if (activityItem.getEvaluation() instanceof ActivityEvaluation) {
                            score = activityItem.getEvaluation().getScore();
                        }

                        return score;
                    }).reduce(0f, (a, b) -> a + b);

                    Float average;

                    if (gradesSum > 0) {
                        average = gradesSum / activityItems.size();
                    } else {
                        average = 0f;
                    }
                    activityAverageGrade.setAverage(average);

                    return activityAverageGrade;
                }).collect(Collectors.toSet());

        return ResponseEntity.ok(averageGrades);
    }

    @Override
    public ResponseEntity<ActivityAverageGrade> getAverageGrade(final Activity activity) {

        final List<ActivityItem> activityItems = activityItemRepository.findByActivity(activity);

        final ActivityAverageGrade activityAverageGrade = new ActivityAverageGrade();
        activityAverageGrade.setActivityId(activity.getId());

        final Float gradesSum = activityItems.stream().map(activityItem -> {
            Float score = 0f;

            if (activityItem.getEvaluation() instanceof ActivityEvaluation) {
                score = activityItem.getEvaluation().getScore();
            }

            return score;
        }).reduce(0f, (a, b) -> a + b);

        Float average;

        if (gradesSum > 0) {
            average = gradesSum / activityItems.size();
        } else {
            average = 0f;
        }
        activityAverageGrade.setAverage(average);

        return ResponseEntity.ok(activityAverageGrade);
    }

    // ------------------------ GradeConfig ------------------------------------ //

    @Override
    public ResponseEntity<Activity> release(Activity activity, final UserDetails userDetails) {
        activity.setGradesReleaseDate(coreService.now());
        activity = activityRepository.save(activity);

        notificationService.addActivityGradeReleased(activity);

        return ResponseEntity.ok(activity);
    }

    @Override
    public ResponseEntity<GradeConfig> release(final Course course, final UserDetails userDetails) {

        // Release all grades for graded activities previously unreleased
        final List<Activity> gradedActivities = activityRepository.findByCourse(course).stream()
                // Filter only valid graded activities
                .filter(activity -> activity.getGradeWeight() != 0)
                // Filter graded activities without released grades
                .filter(activity -> (!(activity.getGradesReleaseDate() instanceof Date)
                        || activity.getGradesReleaseDate().after(coreService.now())))
                // Release Grades
                .map(graded -> {
                    graded.setGradesReleaseDate(coreService.now());
                    coreService.updateLastModified(graded, userDetails);
                    return graded;
                }).collect(Collectors.toList());
        activityRepository.saveAll(gradedActivities);

        // Update Grade config and save it
        GradeConfig gradeConfig = gradeConfigRepository.findByCourse(course);
        gradeConfig.setFinalGradesReleased(coreService.now());
        coreService.updateLastModified(gradeConfig, userDetails);

        gradeConfig = gradeConfigRepository.save(gradeConfig);

        return ResponseEntity.ok(gradeConfig);
    }

    public ResponseEntity<GradeConfig> useArithmeticMean(final Course course, final UserDetails userDetails) {

        GradeConfig gradeConfig = gradeConfigRepository.findByCourse(course);
        gradeConfig.setUseArithmeticMean(true);
        coreService.updateLastModified(gradeConfig, userDetails);

        gradeConfig = gradeConfigRepository.save(gradeConfig);

        return ResponseEntity.ok(gradeConfig);
    }

    public ResponseEntity<GradeConfig> getConfig(final Course course) {
        final GradeConfig gradeConfig = gradeConfigRepository.findByCourse(course);

        gradeConfig.setGradedActivities(this.fetchGradedActivities(course));

        gradeConfig.setNotGradedActivities(fetchNotGradedActivities(course));

        return ResponseEntity.ok(gradeConfig);
    }

    public ResponseEntity<GradeConfig> updateWeights(final Course course, final GradeConfigDTO gradeConfigDTO,
            final UserDetails userDetails) {
        GradeConfig gradeConfig = gradeConfigRepository.findByCourse(course);

        gradeConfig.setUseArithmeticMean(false);
        gradeConfig.setDefaultWeight(gradeConfigDTO.getDefaultWeight());
        coreService.updateLastModified(gradeConfig, userDetails);
        gradeConfig = gradeConfigRepository.save(gradeConfig);

        if (gradeConfigDTO.getWeights() instanceof List) {
            gradeConfigDTO.getWeights().forEach(weight -> {
                final Optional<Activity> optional = activityRepository.findByCourse(course).stream()
                        .filter(activity -> activity.getId() == weight.getActivityId()).findAny();

                if (!optional.isPresent()) {
                    return;
                }

                final Activity activity = optional.get();
                activity.setGradeWeight(weight.getWeight());
                coreService.updateLastModified(activity, userDetails);

                activityRepository.save(activity);
            });
        }

        gradeConfig.setGradedActivities(fetchGradedActivities(course));

        gradeConfig.setNotGradedActivities(fetchNotGradedActivities(course));

        return ResponseEntity.ok(gradeConfig);
    }

    // ------------------------ Final grade --------------------------------- //

    @Override
    public ResponseEntity<List<FinalGrade>> listFinalGrades(final Course course) {
        final List<User> students = this.fetchStudents(course);
        final GradeConfig gradeConfig = gradeConfigRepository.findByCourse(course);
        final List<Activity> gradedActivities = fetchGradedActivities(course);

        final List<FinalGrade> grades = students.stream()
                .map(user -> this.fetchFinalGrade(gradeConfig, gradedActivities, user)).collect(Collectors.toList());

        return ResponseEntity.ok(grades);
    }

    @Override
    public ResponseEntity<FinalGrade> getFinalGrade(final Course course, final User user) {
        final GradeConfig gradeConfig = gradeConfigRepository.findByCourse(course);
        final List<Activity> gradedActivities = fetchGradedActivities(course);

        return ResponseEntity.ok(fetchFinalGrade(gradeConfig, gradedActivities, user));
    }

    // ----------------------------------------- Private Functions
    // ----------------------------------------- //

    private ActivityItem emptyActivityItem(final Activity activity, final User user) {
        final ActivityItem activityItem = new ActivityItem();
        activityItem.setActivity(activity);
        activityItem.setUser(user);

        return activityItem;
    }

    private List<User> fetchStudents(final Course course) {
        final Role role = roleRepository.findByName("STUDENT");

        return participationRepository.findByCourseAndRole(course, role).stream().map(item -> item.getUser())
                .collect(Collectors.toList());
    }

    private List<Activity> fetchGradedActivities(final Course course) {
        return activityRepository.findByCourseAndGradeWeightGreaterThan(course, 0f);
    }

    private List<Activity> fetchNotGradedActivities(final Course course) {
        return activityRepository.findByCourseAndGradeWeight(course, 0f);
    }

    private ActivityItem fetchActivityItem(final Activity activity, final User user, final Boolean removeEvaluation) {
        ActivityItem activityItem = activityItemRepository.findByActivityAndUser(activity, user);

        if (!(activityItem instanceof ActivityItem)) {
            activityItem = emptyActivityItem(activity, user);
        } else if (removeEvaluation) {
            activityItem.setEvaluation(null);
        }

        return activityItem;
    }

    private FinalGrade fetchFinalGrade(final GradeConfig gradeConfig, final List<Activity> gradedActivities,
            final User user) {
        final Float weightSum = gradeConfig.getUseArithmeticMean() ? gradedActivities.size()
                                : gradedActivities.stream().map(a -> a.getGradeWeight()).reduce(0f, (a, b) -> a + b);

        final Float valuesSum = gradedActivities.stream().map(activity -> fetchActivityItem(activity, user, false))
                .map(activityItem -> {
                    final Float weight = activityItem.getActivity().getGradeWeight();

                    if (!(activityItem.getEvaluation() instanceof ActivityEvaluation))
                        return 0f;

                    final Float score = activityItem.getEvaluation().getScore();

                    return gradeConfig.getUseArithmeticMean() ? score : score * weight;
                }).reduce(0f, (a, b) -> a + b);

        final Float finalScore = weightSum > 0f ? valuesSum / weightSum : 0f;

        final FinalGrade finalGrade = new FinalGrade();
        finalGrade.setUser(user);
        finalGrade.setScore(finalScore.toString());

        return finalGrade;
    }
}
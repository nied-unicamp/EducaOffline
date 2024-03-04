package br.niedunicamp.service.impl;

//#region Imports
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.niedunicamp.exception.ResourceNotFoundException;
import br.niedunicamp.exception.UserNotAuthorized;
import br.niedunicamp.model.Activity;
import br.niedunicamp.model.ActivityEvaluation;
import br.niedunicamp.model.ActivityItem;
import br.niedunicamp.model.ActivitySubmission;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.GradeConfig;
import br.niedunicamp.model.Group;
import br.niedunicamp.model.Material;
import br.niedunicamp.model.MaterialFolder;
import br.niedunicamp.model.Participation;
import br.niedunicamp.model.Permission;
import br.niedunicamp.model.Post;
import br.niedunicamp.model.PostComment;
import br.niedunicamp.model.Registration;
import br.niedunicamp.model.Role;
import br.niedunicamp.model.Share;
import br.niedunicamp.model.User;
import br.niedunicamp.model.interfaces.Created;
import br.niedunicamp.model.interfaces.LastModified;
import br.niedunicamp.pojo.UserRegistration;
import br.niedunicamp.repository.ActivityEvaluationRepository;
import br.niedunicamp.repository.ActivityItemRepository;
import br.niedunicamp.repository.ActivityRepository;
import br.niedunicamp.repository.ActivitySubmissionRepository;
import br.niedunicamp.repository.CourseRepository;
import br.niedunicamp.repository.GradeConfigRepository;
import br.niedunicamp.repository.GroupRepository;
import br.niedunicamp.repository.MaterialFolderRepository;
import br.niedunicamp.repository.MaterialRepository;
import br.niedunicamp.repository.ParticipationRepository;
import br.niedunicamp.repository.PermissionRepository;
import br.niedunicamp.repository.PostCommentRepository;
import br.niedunicamp.repository.PostRepository;
import br.niedunicamp.repository.RegistrationRepository;
import br.niedunicamp.repository.RoleRepository;
import br.niedunicamp.repository.ShareRepository;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.ActivityEvaluationService;
import br.niedunicamp.service.ActivitySubmissionService;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.FileStorageService;
//#endregion

@Service
public class CoreServiceImpl implements CoreService {

    // #region Repositories
    @Autowired
    UserRepository userRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    ActivityRepository activityRepository;

    @Autowired
    ActivitySubmissionRepository submissionRepository;

    @Autowired
    ActivityEvaluationRepository evaluationRepository;


    @Autowired
    ActivityItemRepository activityItemRepository;

    @Autowired
    MaterialRepository materialRepository;

    @Autowired
    MaterialFolderRepository materialFolderRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    ParticipationRepository participationRepository;

    @Autowired
    PermissionRepository permissionRepository;

    @Autowired
    PostRepository postRepository;

    @Autowired
    PostCommentRepository commentRepository;

    @Autowired
    GradeConfigRepository gradeConfigRepository;

    @Autowired
    ShareRepository shareRepository;

    @Autowired
    RegistrationRepository registrationRepository;

    @Autowired
    ActivityEvaluationService evaluationService;

    @Autowired
    ActivitySubmissionService submissionService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    FileStorageService fileStorageService;
    // #endregion

    @Value("${server.port}")
    public String serverPort;

    // #region Validation
    public void validateAdmin(UserDetails userDetails) {
        if (!userRepository.findByEmail(userDetails.getUsername()).getIsAdmin()) {
            throw new UserNotAuthorized("Error, only admins can do that.");
        }
    }

    public User validateUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);

        if (!user.isPresent()) {
            throw new ResourceNotFoundException("User not found");
        }

        return user.get();
    }

    public User validateUser(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername());

        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }

        return user;
    }

    @Override
    public Course validateCourse(Long courseId) {
        Optional<Course> course = courseRepository.findById(courseId);

        if (!course.isPresent()) {
            throw new ResourceNotFoundException("Course not found.");
        }
        return course.get();
    }

    @Override
    public Group validateGroup(Long courseId, Long groupId) {
        Optional<Group> group = groupRepository.findById(groupId);

        if (!group.isPresent() || !group.get().getCourse().getId().equals(courseId)) {
            throw new ResourceNotFoundException("This group id=" + groupId + " is not present in this course.");
        }
        return group.get();
    }

    @Override
    public Activity validateActivity(Long courseId, Long activityId) {
        Optional<Activity> activity = activityRepository.findById(activityId);

        if (!activity.isPresent() || !activity.get().getCourse().getId().equals(courseId)) {
            throw new ResourceNotFoundException("Activity not found!");
        }
        return activity.get();
    }

    @Override
    public ActivitySubmission validateSubmission(Long submissionId) {
        Optional<ActivitySubmission> submission = submissionRepository.findById(submissionId);

        if (!submission.isPresent()) {
            throw new ResourceNotFoundException("Submission (" + submissionId + ") not found.");
        }

        return submission.get();
    }


    @Override
    public ActivityEvaluation validateEvaluation(Long evaluationId) {

        Optional<ActivityEvaluation> evaluation = evaluationRepository.findById(evaluationId);

        if (!evaluation.isPresent()) {
            throw new ResourceNotFoundException("Evaluation (" + evaluationId + ") not found.");
        }

        return evaluation.get();
    }


    @Override
    public Material validateMaterial(Long courseId, Long materialId) {
        Optional<Material> material = materialRepository.findById(materialId);

        if (!material.isPresent() || !material.get().getCourse().getId().equals(courseId)) {
            throw new ResourceNotFoundException("Material not found");
        }

        return material.get();
    }

    @Override
    public MaterialFolder validateMaterialFolder(Long courseId, Long folderId) {
        Optional<MaterialFolder> folder = materialFolderRepository.findById(folderId);

        if (!folder.isPresent() || !folder.get().getCourse().getId().equals(courseId)) {
            throw new ResourceNotFoundException("Material folder not found");
        }

        return folder.get();
    }

    @Override
    public Post validatePost(Long courseId, Long postId) {
        Optional<Post> post = postRepository.findById(postId);

        if (!post.isPresent() || !post.get().getCourse().getId().equals(courseId))
            throw new ResourceNotFoundException("Post not found in this course.");

        return post.get();
    }

    @Override
    public PostComment validateComment(Long courseId, Long postId, Long commentId) {
        Optional<PostComment> comment = commentRepository.findById(commentId);

        if (!comment.isPresent())
            throw new ResourceNotFoundException("Comment not found.");
        else if (!comment.get().getPost().getId().equals(postId))
            throw new ResourceNotFoundException("Comment not found in this post.");
        else if (!comment.get().getPost().getCourse().getId().equals(courseId))
            throw new ResourceNotFoundException("Comment not found in this course.");

        return comment.get();
    }
    // #endregion

    @Override
    public ResponseEntity<Permission> createPermission(Permission permission) {
        return ResponseEntity.ok(permissionRepository.save(permission));
    }

    @Override
    public ResponseEntity<Role> createRole(Role role) {
        return ResponseEntity.ok(roleRepository.save(role));
    }

    @Override
    public ResponseEntity<User> register(UserRegistration userRegistration) {

        if (!userRegistration.getPassword().equals(userRegistration.getPasswordConfirmation())) {
            throw new UserNotAuthorized("Error, passwords and password confirmation fields do not match.");
        } else if (userRepository.findByEmail(userRegistration.getEmail()) != null) {
            throw new UserNotAuthorized("Error, this email is already used, please choose another one.");
        }

        User user = new User();
        user.setName(userRegistration.getName());
        user.setEmail(userRegistration.getEmail());
        user.setPassword(passwordEncoder.encode(userRegistration.getPassword()));
        user.setIsAdmin(false);
        user.setAboutMe(userRegistration.getAboutMe());

        return ResponseEntity.ok(userRepository.save(user));
    }


    @Override
    public boolean hasPermission(String permissionName, Long courseId, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername());

        if (user.getIsAdmin())
            return true;

        Course course = courseRepository.findById(courseId).orElseGet(null);
        if (course == null) {
            return false;
        }

        Participation participation = participationRepository.findByUserAndCourse(user, course);
        if (participation == null){
            return false;
        }

        boolean permit = participation.getRole().getPermissions()
                .contains(permissionRepository.findByName(permissionName));

        return permit;
    }


    
    @Override
    public boolean hasPermission(String permissionName, Course course, User user) {
        if (course == null || user == null) {
            return false;
        }

        if (user.getIsAdmin()) {
            return true;
        }

        Participation participation = participationRepository.findByUserAndCourse(user, course);
        
        if (participation == null) {
            return false;
        }

        boolean permit = participation.getRole().getPermissions()
                .contains(permissionRepository.findByName(permissionName));

        return permit;

    }

    // @Override
    // public boolean hasPermission(String permissionName, Owner resource, UserDetails userDetails) {
    //     User user = userRepository.findByEmail(userDetails.getUsername());

    //     if (user.getIsAdmin())
    //         return true;

    //     Participation participation = participationRepository.findByUserAndCourse(user, resource.getCourse());

    //     if (participation == null) {
    //         return false;
    //     }

    //     if (user.getId() == resource.getCreatedBy().getId()) {
    //         return true;
    //     } else if (resource.getOwnerGroup() != null) {
    //         return resource.getOwnerGroup().getUsers().contains(user);
    //     }

    //     return false;
    // }

    /** Return true if user identified by `userId` participates in given course */
    @Override
    public boolean isMember(Long userId, Long courseId) {
        User user = userRepository.findById(userId).orElseGet(null);

        Course course = courseRepository.findById(courseId).orElseGet(null);

        if (user == null || course == null)
            return false;

        if (user.getIsAdmin()) {
            return true;
        }

        return participationRepository.findByUserAndCourse(user, course) != null;
    }

    @Override
    public boolean isMember(UserDetails userDetails, Long courseId) {
        User user = userRepository.findByEmail(userDetails.getUsername());
        Optional<Course> course = courseRepository.findById(courseId);

        if (!course.isPresent()) {
            return false;
        }

        if (user.getIsAdmin()) {
            return true;
        }

        return participationRepository.findByUserAndCourse(user, course.get()) != null;
    }

    // @Override
    // public boolean isOwner(Long userId, Owner item) {
    //     User user = userRepository.findById(userId).orElseGet(null);

    //     return isOwner(user, item);
    // }

    // @Override
    // public boolean isOwner(User user, Owner item) {
    //     return item.getCreatedBy() == user
    //             || (item.getOwnerGroup() != null && item.getOwnerGroup().getUsers().contains(user));
    // }

    // @Override
    // public boolean isOwner(UserDetails userDetails, Owner item) {
    //     User user = userRepository.findByEmail(userDetails.getUsername());

    //     return isOwner(user, item);
    // }

    // @Override
    // public boolean isOwner(UserDetails userDetails, Created item) {
    //     User user = userRepository.findByEmail(userDetails.getUsername());

    //     return item.getCreatedBy() == user;
    // }

    @Override
    public void addCreated(Created item, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername());

        item.setCreatedBy(user);
        item.setCreatedDate(now());
    }

    @Override
    public void updateLastModified(LastModified item, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername());

        item.setLastModifiedBy(user);
        item.setLastModifiedDate(now());
    }

    // @Override
    // public void addCreatedWithGroup(Owner item, UserDetails userDetails) {
    //     addCreated(item, userDetails);

    //     Optional<Group> group = groupRepository.findByCourse(item.getCourse()).stream()
    //             .filter(gp -> gp.getUsers().contains(item.getCreatedBy())).findFirst();

    //     if (group.isPresent())
    //         item.setOwnerGroup(group.get());
    // }

    @Override
    public Date now() {
        return Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant());
    }

    @Override
    public Role validateRole(Long roleId) {
        Optional<Role> role = roleRepository.findById(roleId);

        if (!role.isPresent()) {
            throw new ResourceNotFoundException("Role not found.");
        }

        return role.get();
    }

    @Override
    public Share validateShare(Long courseId, Long shareId) {
        Optional<Share> share = shareRepository.findById(shareId);

        if (!share.isPresent() || !share.get().getCourse().getId().equals(courseId)) {
            throw new ResourceNotFoundException("Share not found!");
        }

        return share.get();
    }

    @Override
    public void deleteCascade(Course course) {

        // First, remove all posts bc they can reference an activity
        postRepository.findByCourse(course).forEach(post -> deleteCascade(post));

        // Remove activities
        activityRepository.findByCourse(course).forEach(activity -> deleteCascade(activity));

        // Remove the grade configuration
        deleteCascade(gradeConfigRepository.findByCourse(course));

        // Remove all material
        materialRepository.findByCourse(course).forEach(material -> deleteCascade(material));
        materialFolderRepository.findByCourse(course).forEach(folder -> deleteCascade(folder));

        // Lastly, Remove the users from the course
        participationRepository.deleteAll(participationRepository.findByCourse(course));

        try {
            fileStorageService.deleteFolder(course.getId().toString(), false);
        } catch (ResourceNotFoundException ignore) {}   // ignore no files found exception

        courseRepository.delete(course);
    }

    @Override
    public void deleteCascade(GradeConfig gradeConfig) {
        gradeConfigRepository.delete(gradeConfig);
    }

    @Override
    public void deleteCascade(Activity activity) {

        // First, remove all posts bc they can reference an activity
        Post post = postRepository.findByActivity(activity);

        if (post instanceof Post) {
            deleteCascade(post);
        }

        // Remove items
        List<ActivityItem> activityItems = activityItemRepository.findByActivity(activity);

        activityItems.forEach(activityItem -> deleteCascade(activityItem));

        // Remove uploaded files
        try {
            fileStorageService.deleteFolder(activity);
        } catch (ResourceNotFoundException ignore) {}   // ignore no files found exception

        activityRepository.delete(activity);
    }

    @Override
    public void deleteCascade(ActivityItem activityItem) {
        activityItemRepository.delete(activityItem);

        if (activityItem.getSubmission() instanceof ActivitySubmission) {
            deleteCascade(activityItem.getSubmission());
        }
        if (activityItem.getEvaluation() instanceof ActivityEvaluation) {
            deleteCascade(activityItem.getEvaluation());
        }
    }

    @Override
    public void deleteCascade(ActivitySubmission submission) {

        fileStorageService.deleteFolder(submission);

        submissionRepository.delete(submission);
    }

    @Override
    public void deleteCascade(ActivityEvaluation evaluation) {
        fileStorageService.deleteFolder(evaluation);

        evaluationRepository.delete(evaluation);
    }

    @Override
    public void deleteCascade(Post post) {
        commentRepository.findByPostAndParentCommentIsNull(post).forEach(item -> deleteCascade(item));

        postRepository.delete(post);
    }

    @Override
    public void deleteCascade(PostComment comment) {
        commentRepository.deleteAll(commentRepository.findByParentComment(comment));

        commentRepository.delete(comment);
    }

    @Override
    public void deleteCascade(Material material) {
        fileStorageService.deleteFolder(material);

        materialRepository.delete(material);
    }

    @Override
    public void deleteCascade(MaterialFolder folder) {
        materialRepository.findByFolder(folder).forEach(item -> deleteCascade(item));

        materialFolderRepository.delete(folder);
    }

    @Override
    public Registration validateRegistration(String email) {
        Optional<Registration> registration = registrationRepository.findByEmail(email);

        if (!registration.isPresent()) {
            throw new ResourceNotFoundException("Registration not found for selected email");
        }

        return registration.get();
    }
}

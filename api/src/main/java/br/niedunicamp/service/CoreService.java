package br.niedunicamp.service;

//#region Imports
import java.util.Date;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import br.niedunicamp.model.Activity;
import br.niedunicamp.model.ActivityEvaluation;
import br.niedunicamp.model.ActivityItem;
import br.niedunicamp.model.ActivitySubmission;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.GradeConfig;
import br.niedunicamp.model.Group;
import br.niedunicamp.model.Material;
import br.niedunicamp.model.MaterialFolder;
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
//#endregion

public interface CoreService {

    ResponseEntity<User> register(UserRegistration userRegistration);

    ResponseEntity<Permission> createPermission(Permission permission);

    ResponseEntity<Role> createRole(Role role);

    boolean hasPermission(String permissionName, Long courseId, UserDetails userDetails);

    boolean hasPermission(String permissionName, Course course, User user);

    // boolean hasPermission(String permissionName, Owner resource, UserDetails userDetails);

    boolean isMember(Long userId, Long courseId);

    boolean isMember(UserDetails userDetails, Long courseId);

    // boolean isOwner(Long userId, Owner item);

    // boolean isOwner(UserDetails userDetails, Owner item);

    // boolean isOwner(User user, Owner item);

    // boolean isOwner(UserDetails userDetails, Created item);

    void addCreated(Created item, UserDetails userDetails);

    void updateLastModified(LastModified item, UserDetails userDetails);

    // void addCreatedWithGroup(Owner item, UserDetails userDetails);

    Date now();

    User validateUser(Long userId);

    User validateUser(UserDetails userDetails);

    Role validateRole(Long roleId);

    Share validateShare(Long courseId, Long shareId);

    Course validateCourse(Long courseId);

    Group validateGroup(Long courseId, Long groupId);

    Activity validateActivity(Long courseId, Long activityId);

    Material validateMaterial(Long courseId, Long materialId);

    MaterialFolder validateMaterialFolder(Long courseId, Long folderId);

    ActivityEvaluation validateEvaluation(Long evaluationId);

    ActivitySubmission validateSubmission(Long submissionId);

    Post validatePost(Long courseId, Long postId);

    PostComment validateComment(Long courseId, Long postId, Long commentId);

    Registration validateRegistration(String email);

    void validateAdmin(UserDetails userDetails);

    void deleteCascade(Course course);

    void deleteCascade(GradeConfig gradeConfig);

    void deleteCascade(ActivitySubmission submission);

    void deleteCascade(ActivityEvaluation evaluation);

    void deleteCascade(Post post);

    void deleteCascade(ActivityItem activityItem);

    void deleteCascade(Activity activity);

    void deleteCascade(PostComment comment);

    void deleteCascade(Material material);

    void deleteCascade(MaterialFolder folder);
}

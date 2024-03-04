package br.niedunicamp.service.impl;

//#region Imports
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import br.niedunicamp.exception.ResourceNotFoundException;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.Group;
import br.niedunicamp.model.Role;
import br.niedunicamp.model.Share;
import br.niedunicamp.model.User;
import br.niedunicamp.model.interfaces.Shareable;
import br.niedunicamp.pojo.ShareDTO;
import br.niedunicamp.repository.ActivityEvaluationRepository;
import br.niedunicamp.repository.ActivityRepository;
import br.niedunicamp.repository.ActivitySubmissionRepository;
import br.niedunicamp.repository.CourseRepository;
import br.niedunicamp.repository.GroupRepository;
import br.niedunicamp.repository.MaterialRepository;
import br.niedunicamp.repository.ParticipationRepository;
import br.niedunicamp.repository.RoleRepository;
import br.niedunicamp.repository.ShareRepository;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.ShareService;
//#endregion

@Service
public class ShareServiceImpl implements ShareService {

    //#region Repositories
    @Autowired
    ShareRepository shareRepository;

    @Autowired
    ActivitySubmissionRepository submissionRepository;

    @Autowired
    ActivityEvaluationRepository evaluationRepository;

    @Autowired
    ActivityRepository activityRepository;

    @Autowired
    GroupRepository groupRepository;

    @Autowired
    MaterialRepository materialRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    ParticipationRepository participationRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    CoreService coreService;
    //#endregion

    @Override
    public ResponseEntity<Share> create(Course course, ShareDTO shareDTO, Shareable item, UserDetails userDetails) {
        if (item.getSharingInfo() != null) {
            return update(item.getSharingInfo(), shareDTO, userDetails);
        }
        Share share = shareFromDTO(shareDTO);

        share.setCourse(course);

        coreService.addCreated(share, userDetails);
        coreService.updateLastModified(share, userDetails);

        Share savedShare = shareRepository.save(share);

        // TODO: Not working, need to be saved in the resource repository
        item.setSharingInfo(savedShare);

        return ResponseEntity.ok(savedShare);
    }

    @Override
    public ResponseEntity<List<Share>> listAll(Course course) {

        List<Share> list = shareRepository.findByCourse(course);

        return ResponseEntity.ok(list);
    }

    @Override
    public ResponseEntity<Share> update(Share share, ShareDTO shareDTO, UserDetails userDetails) {

        Share newShare = shareFromDTO(shareDTO);

        share.setUsers(newShare.getUsers());
        share.setGroups(newShare.getGroups());
        share.setRoles(newShare.getRoles());
        share.setCanDelete(newShare.getCanDelete());
        share.setCanEdit(newShare.getCanEdit());

        coreService.addCreated(share, userDetails);
        coreService.updateLastModified(share, userDetails);

        return ResponseEntity.ok(shareRepository.save(share));
    }

    @Override
    public ResponseEntity<?> delete(Share share){
        shareRepository.delete(share);

        return ResponseEntity.ok(null);
    }

    Share shareFromDTO(ShareDTO shareDTO) throws ResourceNotFoundException {
        Set<User> userList = shareDTO.getUserId().stream().map(id -> {
            User user = coreService.validateUser(id);
            return user;
        }).collect(Collectors.toSet());

        Set<Group> groupList = shareDTO.getGroupId().stream().map(id -> {
            Group group = groupRepository.findById(id).orElseGet(null);
            if (group == null) {
                throw new ResourceNotFoundException("The group with id=" + id + " was not found.");
            }
            return group;
        }).collect(Collectors.toSet());

        Set<Role> roleList = shareDTO.getRoleId().stream().map(id ->
            coreService.validateRole(id)
        ).collect(Collectors.toSet());

        Share share = new Share();

        share.setCanDelete(shareDTO.getCanDelete());
        share.setCanEdit(shareDTO.getCanEdit());
        share.setGroups(groupList);
        share.setUsers(userList);
        share.setRoles(roleList);

        return share;
    }

    // @Override
    // public List<Share> listSharedWithMe(Course course, UserDetails userDetails) {
    //     User user = coreService.validateUser(userDetails);

    //     Participation participation = participationRepository.findByUserAndCourse(user, course);

    //     if (participation == null) {
    //         throw new ResourceNotFoundException("User not in the course.");
    //     }

    //     return shareRepository.findByCourse(course).stream()
    //             .filter(item -> item.getUsers().contains(user)
    //                     || item.getGroups().stream().anyMatch(any -> any.getUsers().contains(user))
    //                     || item.getRoles().contains(participation.getRole()))
    //             .collect(Collectors.toList());
    // }

    // @Override
    // public ResponseEntity<List<Activity>> listSharedActivities(Course course, UserDetails userDetails) {

    //     List<Share> shares = listSharedWithMe(course, userDetails);

    //     return ResponseEntity.ok(activityRepository.findByCourse(course).stream().filter(item -> {
    //         return shares.contains(item.getSharingInfo());
    //     }).collect(Collectors.toList()));
    // }

    // @Override
    // public ResponseEntity<List<Material>> listSharedMaterial(Course course, UserDetails userDetails) {

    //     List<Share> shares = listSharedWithMe(course, userDetails);

    //     return ResponseEntity.ok(materialRepository.findByCourse(course).stream().filter(item -> {
    //         return shares.contains(item.getSharingInfo());
    //     }).collect(Collectors.toList()));
    // }

    // @Override
    // public ResponseEntity<List<ActivitySubmission>> listSharedActivitySubmissions(Course course,
    //         UserDetails userDetails) {
    //     List<Share> shares = listSharedWithMe(course, userDetails);

    //     return ResponseEntity.ok(submissionRepository.findBySharingInfoNotNull().stream()
    //             .filter(item -> shares.contains(item.getSharingInfo())).collect(Collectors.toList()));
    // }

    // @Override
    // public ResponseEntity<List<ActivityEvaluation>> listSharedActivityEvaluations(Course course,
    //         UserDetails userDetails) {
    //     List<Share> shares = listSharedWithMe(course, userDetails);

    //     return ResponseEntity.ok(evaluationRepository.findBySharingInfoNotNull().stream()
    //             .filter(item -> shares.contains(item.getSharingInfo())).collect(Collectors.toList()));
    // }
}
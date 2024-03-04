package br.niedunicamp.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import br.niedunicamp.model.Course;
import br.niedunicamp.model.Share;
import br.niedunicamp.model.interfaces.Shareable;
import br.niedunicamp.pojo.ShareDTO;

@Service
public interface ShareService {
    ResponseEntity<Share> create(Course course, ShareDTO shareDTO, Shareable item, UserDetails userDetails);

    /**
     * Edit the sharing data using the
     *
     */
    ResponseEntity<Share> update(Share share, ShareDTO shareDTO, UserDetails userDetails);

    /**
     * Delete the share data if no references are found
     */
    ResponseEntity<?> delete(Share share);

    /**
     * Delete the Share data Additionally, deletes the sharing data from the
     * shareable item
     */
    // ResponseEntity<?> delete(Shareable item);

    // ResponseEntity<Share> shareToUser(Shareable item, User user);

    // ResponseEntity<Share> shareToRole(Shareable item, Role role);

    // ResponseEntity<Share> shareToGroup(Shareable item, Group group);

    // ResponseEntity<Share> removeSharingFromGroup(Shareable item, Group group);

    // ResponseEntity<Share> removeSharingFromRole(Shareable item, Role role);

    // ResponseEntity<Share> removeSharingFromUser(Shareable item, User user);

    /**
     * List all shared info from the course
     */
    ResponseEntity<List<Share>> listAll(Course course);

    /**
     * List the Share items that are shared with the user;
     */
    // List<Share> listSharedWithMe(Course course, UserDetails userDetails);

    // /**
    //  * List all activities that are shared with me
    //  */
    // ResponseEntity<List<Activity>> listSharedActivities(Course course, UserDetails userDetails);

    // /**
    //  * List all activities that are shared with me
    //  */
    // ResponseEntity<List<Material>> listSharedMaterial(Course course, UserDetails userDetails);

    // /**
    //  * List all activity submissions that are shared with me
    //  */
    // ResponseEntity<List<ActivitySubmission>> listSharedActivitySubmissions(Course course, UserDetails userDetails);

    // /**
    //  * List all activity evaluations that are shared with me
    //  */
    // ResponseEntity<List<ActivityEvaluation>> listSharedActivityEvaluations(Course course, UserDetails userDetails);
}
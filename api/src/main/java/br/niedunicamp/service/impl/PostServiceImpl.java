package br.niedunicamp.service.impl;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import br.niedunicamp.exception.ResourceNotFoundException;
import br.niedunicamp.model.Activity;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.Post;
import br.niedunicamp.model.User;
import br.niedunicamp.pojo.PostDTO;
import br.niedunicamp.repository.ActivityRepository;
import br.niedunicamp.repository.CourseRepository;
import br.niedunicamp.repository.ParticipationRepository;
import br.niedunicamp.repository.PostRepository;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.NotificationService;
import br.niedunicamp.service.PostService;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    CoreService coreService;

    @Autowired
    NotificationService notificationService;

    @Autowired
    PostRepository postRepository;

    @Autowired
    ParticipationRepository participationRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    ActivityRepository activityRepository;

    @Override
    public ResponseEntity<Post> create(PostDTO postDTO, Course course, UserDetails userDetails) {

        Post post = new Post(postDTO.getText(), postDTO.getIsFixed(), course);

        if (post.getIsFixed()) {
            removePinned(course);
        }

        coreService.addCreated(post, userDetails);
        coreService.updateLastModified(post, userDetails);

        post = this.addLikesFavoritesAndIsTeacherFor(postRepository.save(post), userDetails);

        User user = userRepository.findByEmail(userDetails.getUsername());
        Boolean isTeacher = user.getIsAdmin()
                || participationRepository.findByUserAndCourse(user, course).getRole().getName() == "TEACHER";

        if (isTeacher) {
            notificationService.addWallPostByTeacher(post);
        } else {
            notificationService.upsertNewWallPost(post);
        }

        return ResponseEntity.ok(post);
    }

    @Override
    public ResponseEntity<Post> createWithActivityId(PostDTO postDTO, Course course, Long activityId, UserDetails userDetails) {

        Post post = new Post(postDTO.getText(), course, activityId);

        if (post.getIsFixed()) {
            removePinned(course);
        }

        coreService.addCreated(post, userDetails);
        coreService.updateLastModified(post, userDetails);

        post = this.addLikesFavoritesAndIsTeacherFor(postRepository.save(post), userDetails);

        User user = userRepository.findByEmail(userDetails.getUsername());
        Boolean isTeacher = user.getIsAdmin()
                || participationRepository.findByUserAndCourse(user, course).getRole().getName() == "TEACHER";

        if (isTeacher) {
            notificationService.addWallPostByTeacher(post);
        } else {
            notificationService.upsertNewWallPost(post);
        }

        return ResponseEntity.ok(post);
    }

    @Override
    public ResponseEntity<?> delete(Post post) {
        coreService.deleteCascade(post);

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity<Post> update(PostDTO postDTO, Post post, UserDetails userDetails) {

        post.setIsFixed(postDTO.getIsFixed());
        post.setText(postDTO.getText());

        coreService.updateLastModified(post, userDetails);

        post = this.addLikesFavoritesAndIsTeacherFor(postRepository.save(post), userDetails);

        return ResponseEntity.ok(addActivityIdIfNeeded(post));
    }

    @Override
    public ResponseEntity<List<Post>> list(Course course, UserDetails userDetails, boolean activities,
            boolean onlyPublishedActivities) {

        List<Post> posts = postRepository.findByCourse(course);

        if (!activities) {
            posts = posts.stream().filter(item -> !(item.getActivity() instanceof Activity))
                    .collect(Collectors.toList());
        } else {
            posts = posts.stream().filter(item -> {
                if (item.getActivity() instanceof Activity && onlyPublishedActivities) {
                    Date now = coreService.now();

                    return item.getActivity().getPublishDate().before(now);
                }
                return true;
            }).map(item -> addActivityIdIfNeeded(item)).collect(Collectors.toList());
        }

        posts.sort(Comparator.comparing((Post post) -> post.getCreatedDate()));

        posts = addLikesFavoritesAndIsTeacherFor(posts, userDetails);

        return ResponseEntity.ok(posts);
    }

    private Post addActivityIdIfNeeded(Post post) {

        if (post.getActivity() instanceof Activity) {
            post.setCreatedDate(post.getActivity().getPublishDate());
            post.setCreatedBy(post.getActivity().getCreatedBy());
            post.setLastModifiedBy(post.getActivity().getLastModifiedBy());
            post.setLastModifiedDate(post.getActivity().getLastModifiedDate());

            post.setActivityId(post.getActivity().getId());
        }

        return post;
    }

    @Override
    public ResponseEntity<Post> get(Post post, UserDetails userDetails) {
        post = this.addLikesFavoritesAndIsTeacherFor(post, userDetails);

        return ResponseEntity.ok(addActivityIdIfNeeded(post));
    }

    @Override
    public ResponseEntity<?> like(Post post, UserDetails userDetails) {
        User user = coreService.validateUser(userDetails);

        Set<User> likes = post.getLikedBy();

        if (!likes.contains(user)) {
            likes.add(user);
            post.setLikedBy(likes);

            postRepository.save(post);

            notificationService.upsertNewPostLikes(post);
        }

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity<?> dislike(Post post, UserDetails userDetails) {
        User user = coreService.validateUser(userDetails);

        Set<User> likes = post.getLikedBy();

        if (likes.contains(user)) {
            likes.remove(user);
            post.setLikedBy(likes);

            postRepository.save(post);
        }

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity<?> favorite(Post post, UserDetails userDetails) {
        User user = coreService.validateUser(userDetails);

        Set<User> favorites = post.getFavoriteBy();

        if (!favorites.contains(user)) {
            favorites.add(user);
            post.setFavoriteBy(favorites);

            postRepository.save(post);
        }

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity<?> unfavorite(Post post, UserDetails userDetails) {
        User user = coreService.validateUser(userDetails);

        Set<User> favorites = post.getFavoriteBy();

        if (favorites.contains(user)) {
            favorites.remove(user);
            post.setFavoriteBy(favorites);

            postRepository.save(post);
        }

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity<List<Post>> listFavorite(Course course, UserDetails userDetails) {
        User user = coreService.validateUser(userDetails);

        List<Post> posts = postRepository.findByCourse(course).stream()
                .filter(item -> item.getFavoriteBy().contains(user)).map(item -> addActivityIdIfNeeded(item))
                .collect(Collectors.toList());

        return ResponseEntity.ok(this.addLikesFavoritesAndIsTeacherFor(posts, userDetails));
    }

    @Override
    public ResponseEntity<List<User>> listLikes(Post post) {
        return ResponseEntity.ok(post.getLikedBy().stream().collect(Collectors.toList()));
    }

    private List<Post> addLikesFavoritesAndIsTeacherFor(List<Post> posts, UserDetails userDetails) {
        User user = coreService.validateUser(userDetails);

        return posts.stream().map(post -> {
            post.setLiked(post.getLikedBy().contains(user));
            post.setFavorite(post.getFavoriteBy().contains(user));

            post.setFavoriteCounter(post.getFavoriteBy().size());
            post.setLikeCounter(post.getLikedBy().size());

            boolean canDeletePosts = coreService.hasPermission("delete_post", post.getCourse(), post.getCreatedBy());

            post.setTeacher(canDeletePosts);

            return post;
        }).collect(Collectors.toList());
    }

    @Override
    public ResponseEntity<?> listActivityPosts(Course course) {

        Date now = coreService.now();

		List<Activity> activities = activityRepository.findByCourseAndPublishDateLessThan(course, now);

		activities.forEach(activity -> {
			Post publishedPost = postRepository.findByActivity(activity);
			if (publishedPost == null) {
				createWithActivity(activity);
			}
		});

        return ResponseEntity.ok(null);
    }

    private Post addLikesFavoritesAndIsTeacherFor(Post post, UserDetails userDetails) {
        User user = coreService.validateUser(userDetails);

        post.setLiked(post.getLikedBy().contains(user));
        post.setFavorite(post.getFavoriteBy().contains(user));

        post.setLikeCounter(post.getLikedBy().size());
        post.setFavoriteCounter(post.getFavoriteBy().size());

        boolean canDeletePosts = coreService.hasPermission("delete_post", post.getCourse(), post.getCreatedBy());

        post.setTeacher(canDeletePosts);

        return post;
    }

    @Override
    public ResponseEntity<?> pin(Post post, UserDetails userDetails) {

        if (!post.getIsFixed()) {
            removePinned(post.getCourse());

            post.setIsFixed(true);
            coreService.updateLastModified(post, userDetails);

            postRepository.save(post);
        }

        return ResponseEntity.ok(null);
    }

    private void removePinned(Course course) {
        List<Post> posts = postRepository.findByCourseAndIsFixedTrue(course).stream().map(item -> {
            item.setIsFixed(false);
            return item;
        }).collect(Collectors.toList());

        postRepository.saveAll(posts);
    }

    @Override
    public ResponseEntity<?> unpin(Post post, UserDetails userDetails) {

        if (post.getIsFixed()) {
            post.setIsFixed(false);
            coreService.updateLastModified(post, userDetails);

            postRepository.save(post);
        }

        return ResponseEntity.ok(null);
    }


    @Override
    public Post createWithActivity(Activity activity) {
        Post post = new Post(activity.getTitle(), activity);

        post.setCreatedBy(activity.getCreatedBy());
        post.setCreatedDate(activity.getPublishDate());

        post.setLastModifiedBy(activity.getCreatedBy());
        post.setLastModifiedDate(activity.getPublishDate());

        postRepository.save(post);
        return post;
    }


    @Override
    public ResponseEntity<Post> createWithCreatedById(Long userId, PostDTO postDTO, Course course, UserDetails userDetails) {


        Post post = new Post(postDTO.getText(), false, course);

        Optional<User> creatorUser = userRepository.findById(userId);

        if (!creatorUser.isPresent()) {
            throw new ResourceNotFoundException("Creator user not found");
        }

        User user = creatorUser.get();
        Date date = coreService.now();

        post.setCreatedBy(user);
        post.setLastModifiedBy(user);
        post.setCreatedDate(date);
        post.setLastModifiedDate(date);

        postRepository.save(post);

        return ResponseEntity.ok(post);

    }
}
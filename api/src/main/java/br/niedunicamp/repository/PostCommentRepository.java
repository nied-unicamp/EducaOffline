package br.niedunicamp.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.niedunicamp.model.Post;
import br.niedunicamp.model.PostComment;
import br.niedunicamp.model.User;

public interface PostCommentRepository  extends JpaRepository<PostComment, Long>{

    List<PostComment> findByCreatedBy(User findByCreatedBy);

    // PostComment findById(Long postCommentId);

    List<PostComment> findByPost(Post post);

    List<PostComment> findByPostAndParentCommentIsNull(Post post);

    List<PostComment> findByParentComment(PostComment comment);

}

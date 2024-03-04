package br.niedunicamp.repository;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import br.niedunicamp.model.Course;
import br.niedunicamp.model.Material;
import br.niedunicamp.model.MaterialFolder;
import br.niedunicamp.model.User;

@Repository
public interface MaterialRepository extends PagingAndSortingRepository<Material, Long> {

    // Material findById(Long id);

    List<Material> findByCourse(Course course);

    List<Material> findByCourseAndFolderIsNull(Course course);

    List<Material> findByFolder(MaterialFolder folder);

    List<Material> findByCreatedBy(User user);

    // List<Group> findByOwnerGroup(Group group);
}

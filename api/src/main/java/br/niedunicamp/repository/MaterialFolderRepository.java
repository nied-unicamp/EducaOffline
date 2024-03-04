package br.niedunicamp.repository;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import br.niedunicamp.model.Course;
import br.niedunicamp.model.MaterialFolder;

@Repository
public interface MaterialFolderRepository extends PagingAndSortingRepository<MaterialFolder, Long> {

    // MaterialFolder findById(Long id);

    List<MaterialFolder> findByCourse(Course course);
}

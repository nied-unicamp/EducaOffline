package br.niedunicamp.repository;

import br.niedunicamp.model.Permission;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepository extends PagingAndSortingRepository<Permission, Long> {

    Permission findByName(String name);

    // Permission findById(Long id);
}

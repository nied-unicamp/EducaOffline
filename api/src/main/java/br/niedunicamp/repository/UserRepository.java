package br.niedunicamp.repository;

import br.niedunicamp.model.User;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends PagingAndSortingRepository<User, Long> {
    User findByName(String name);

    User findByEmail(String login);

    // User findById(Long id);

    List<User> findByIsAdmin(Boolean isAdmin);
}

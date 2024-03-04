package br.niedunicamp.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.niedunicamp.model.Registration;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, String> {

    Optional<Registration> findByEmail(String email);

    List<Registration> findByForgotPasswordTrue();

    List<Registration> findByForgotPasswordFalse();

    List<Registration> findByDateLessThan(Date date);
}

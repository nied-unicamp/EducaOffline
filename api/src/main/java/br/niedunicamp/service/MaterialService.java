package br.niedunicamp.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import br.niedunicamp.model.Course;
import br.niedunicamp.model.Material;
import br.niedunicamp.model.MaterialFolder;
import br.niedunicamp.pojo.MaterialDTO;

/**
 * MaterialService
 */
@Service
public interface MaterialService {
    ResponseEntity<Material> create(Course course, MaterialDTO materialDTO, UserDetails userDetails);

    ResponseEntity<Material> get(Material material);

    ResponseEntity<List<Material>> list(Course course);

    ResponseEntity<Material> update(MaterialDTO materialDTO, Material material, UserDetails userDetails);

    ResponseEntity<?> delete(Material material);

    ResponseEntity<?> changeFolder(Material material, MaterialFolder folder, UserDetails userDetails);

    ResponseEntity<?> removeFromFolder(Material material, UserDetails userDetails);
}
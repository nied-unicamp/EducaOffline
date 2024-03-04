package br.niedunicamp.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import br.niedunicamp.model.Course;
import br.niedunicamp.model.Material;
import br.niedunicamp.model.MaterialFolder;
import br.niedunicamp.pojo.MaterialDTO;
import br.niedunicamp.repository.CourseRepository;
import br.niedunicamp.repository.MaterialRepository;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.FileStorageService;
import br.niedunicamp.service.MaterialService;
//#endregion
import br.niedunicamp.service.NotificationService;

@Service
public class MaterialServiceImpl implements MaterialService {

    // #region Repositories and Services
    @Autowired
    MaterialRepository materialRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    FileStorageService fileStorageService;

    @Autowired
    NotificationService notificationService;

    @Autowired
    CoreService coreService;
    // #endregion

    @Override
    public ResponseEntity<Material> create(Course course, MaterialDTO materialDTO, UserDetails userDetails) {
        Material material = new Material();
        material.setCourse(course);
        material.setTitle(materialDTO.getTitle());
        material.setDescription(materialDTO.getDescription());

        if (materialDTO.getLink() != null) {
            material.setLink(materialDTO.getLink());
        }

        coreService.addCreated(material, userDetails);
        coreService.updateLastModified(material, userDetails);

        material = materialRepository.save(material);

        notificationService.upsertNewMaterial(material);

        return ResponseEntity.ok(material);
    }

    @Override
    public ResponseEntity<List<Material>> list(Course course) {
        List<Material> list = materialRepository.findByCourseAndFolderIsNull(course);

        return ResponseEntity.ok(list.stream().map(item -> {
            item.setFiles(fileStorageService.listFiles(item.getFilesFolder()).getBody());
            return item;
        }).collect(Collectors.toList()));
    }

    @Override
    public ResponseEntity<Material> get(Material material) {
        material.setFiles(fileStorageService.listFiles(material.getFilesFolder()).getBody());

        return ResponseEntity.ok(material);
    }

    @Override
    public ResponseEntity<Material> update(MaterialDTO materialDTO, Material material, UserDetails userDetails) {
        material.setDescription(materialDTO.getDescription());
        material.setTitle(materialDTO.getTitle());

        coreService.addCreated(material, userDetails);
        coreService.updateLastModified(material, userDetails);

        return ResponseEntity.ok(materialRepository.save(material));
    }

    @Override
    public ResponseEntity<?> delete(Material material) {
        fileStorageService.deleteFolder(material, false);
        materialRepository.delete(material);

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity<?> changeFolder(Material material, MaterialFolder folder, UserDetails userDetails) {
        material.setFolder(folder);
        coreService.updateLastModified(material, userDetails);
        materialRepository.save(material);

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity<?> removeFromFolder(Material material, UserDetails userDetails) {
        material.setFolder(null);
        coreService.updateLastModified(material, userDetails);
        materialRepository.save(material);

        return ResponseEntity.ok(null);
    }

}
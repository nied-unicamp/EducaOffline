package br.niedunicamp.service;

import java.io.IOException;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import br.niedunicamp.model.Course;
import br.niedunicamp.model.Material;
import br.niedunicamp.model.MaterialFolder;
import br.niedunicamp.pojo.MaterialFolderDTO;

/**
 * MaterialService
 */
@Service
public interface MaterialFolderService {
    ResponseEntity<MaterialFolder> create(Course course, MaterialFolderDTO folderDTO, UserDetails userDetails);

    ResponseEntity<List<MaterialFolder>> list(Course course);

    ResponseEntity<StreamingResponseBody> download(MaterialFolder folder) throws IOException;

    ResponseEntity<List<Material>> list(MaterialFolder folder);

    ResponseEntity<MaterialFolder> update(MaterialFolderDTO folderDTO, MaterialFolder folder, UserDetails userDetails);

    ResponseEntity<?> delete(MaterialFolder folder);

}
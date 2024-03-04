package br.niedunicamp.service.impl;

//#region Imports
import java.util.zip.ZipOutputStream;
import java.util.zip.ZipEntry;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import br.niedunicamp.model.Course;
import br.niedunicamp.model.Material;
import br.niedunicamp.model.MaterialFolder;
import br.niedunicamp.pojo.MaterialFolderDTO;
import br.niedunicamp.repository.CourseRepository;
import br.niedunicamp.repository.MaterialFolderRepository;
import br.niedunicamp.repository.MaterialRepository;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.FileStorageService;
import br.niedunicamp.service.MaterialFolderService;
//#endregion

@Service
public class MaterialFolderServiceImpl implements MaterialFolderService {

    // #region Repos and Services
    @Autowired
    MaterialFolderRepository materialFolderRepository;

    @Autowired
    MaterialRepository materialRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    FileStorageService fileStorageService;

    @Autowired
    CoreService coreService;
    // #endregion

    @Override
    public ResponseEntity<MaterialFolder> create(Course course, MaterialFolderDTO folderDTO, UserDetails userDetails) {
        MaterialFolder folder = new MaterialFolder();
        folder.setCourse(course);
        folder.setTitle(folderDTO.getTitle());
        folder.setDescription(folderDTO.getDescription());

        return ResponseEntity.ok(materialFolderRepository.save(folder));
    }

    @Override
    public ResponseEntity<List<MaterialFolder>> list(Course course) {

        List<MaterialFolder> list = materialFolderRepository.findByCourse(course);

        return ResponseEntity.ok(list);
    }

    @Override
    public ResponseEntity<StreamingResponseBody> download(MaterialFolder folder) throws IOException {

        // Create zip file

        String zipFileName = folder.getTitle() + ".zip";
        FileOutputStream fout = new FileOutputStream(zipFileName);
        ZipOutputStream zout = new ZipOutputStream(fout);

        // Add folder files to zip

        List<Material> folderMaterials = materialRepository.findByFolder(folder);

        for (Material material : folderMaterials)
        {
            if(!(material.getLink() == null)) // check if the material is a link.
                continue;

            String materialDirectory = material.getFilesFolder(); // each material, that is not a link, is a folder in the filesystem containing the file(s).
            Path directoryPath = fileStorageService.getFileStorageLocation().resolve(materialDirectory);

            DirectoryStream<Path> directoryStream = Files.newDirectoryStream(directoryPath);
            for (Path filePath : directoryStream)
            {
                ZipEntry ze = new ZipEntry(filePath.getFileName().toString());
                zout.putNextEntry(ze);

                // Get file data
                byte[] data = Files.readAllBytes(filePath);
                zout.write(data, 0, data.length);

                zout.closeEntry();
            }
        }
        zout.close();

        // Return the zip file to the user

        Path zipFilePath = Paths.get(zipFileName);

        return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType("application/zip"))
        .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + zipFileName + "\"")
        .body(os -> {
            Files.copy(zipFilePath, os);
            Files.delete(zipFilePath);
        });
    }

    @Override
    public ResponseEntity<MaterialFolder> update(MaterialFolderDTO materialDTO, MaterialFolder folder,
            UserDetails userDetails) {

        folder.setDescription(materialDTO.getDescription());
        folder.setTitle(materialDTO.getTitle());

        return ResponseEntity.ok(materialFolderRepository.save(folder));
    }

    @Override
    public ResponseEntity<?> delete(MaterialFolder folder) {

        materialFolderRepository.delete(folder);

        return ResponseEntity.ok(null);
    }

    @Override
    public ResponseEntity<List<Material>> list(MaterialFolder folder) {

    List<Material> list = materialRepository.findByFolder(folder);

    return ResponseEntity.ok(list.stream().map(item -> {
    item.setFiles(fileStorageService.listFiles(item.getFilesFolder()).getBody());
    return item;
    }).collect(Collectors.toList()));
    }

}
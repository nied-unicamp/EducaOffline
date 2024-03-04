package br.niedunicamp.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.niedunicamp.exception.UserNotAuthorized;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.Material;
import br.niedunicamp.model.MaterialFolder;
import br.niedunicamp.pojo.FileUploaded;
import br.niedunicamp.pojo.MaterialDTO;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.FileStorageService;
import br.niedunicamp.service.MaterialService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;
//#endregion

@CrossOrigin
@Api(value = "MaterialController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@RequestMapping("/v1/courses/{courseId}/materials")
public class MaterialController {

    // #region Repositories
    @Autowired
    private MaterialService materialService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private CoreService coreService;
    // #endregion

    @GetMapping
    @ApiOperation("List materials")
    public ResponseEntity<List<Material>> list(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("list_materials", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized");
        }

        return materialService.list(course);
    }

    @PostMapping
    @ApiOperation("Create material")
    public ResponseEntity<Material> createDTO(@RequestBody MaterialDTO materialDTO, @PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("create_material", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return materialService.create(course, materialDTO, userDetails);
    }

    @GetMapping("{materialId}")
    @ApiOperation("Get Material")
    public ResponseEntity<Material> get(@PathVariable Long courseId, @PathVariable Long materialId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Material material = coreService.validateMaterial(courseId, materialId);

        if (!coreService.hasPermission("list_materials", courseId, userDetails)) {
            throw new UserNotAuthorized("User can't list materials");
        }

        return materialService.get(material);
    }

    @PostMapping("files")
    @ApiOperation("Create material")
    public ResponseEntity<List<Material>> createFiles(@PathVariable Long courseId,
            @RequestParam @Valid MultipartFile[] files, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("create_material", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        List<Material> output = Arrays.asList(files).stream().map(file -> {
            MaterialDTO materialDTO = new MaterialDTO();
            materialDTO.setTitle(file.getOriginalFilename());

            Material material = materialService.create(course, materialDTO, userDetails).getBody();

            //FileUploaded fileUploaded = fileStorageService.upload(file, material.getFilesFolder()).getBody();

            List<FileUploaded> filesUploaded = fileStorageService.upload(file, material.getFilesFolder()).getBody();

            material.setFiles(filesUploaded);

            return material;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(output);
    }

    @DeleteMapping("{materialId}")
    @ApiOperation("Delete material")
    public ResponseEntity<?> delete(@PathVariable Long materialId, @PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Material material = coreService.validateMaterial(courseId, materialId);

        if (!coreService.hasPermission("delete_material", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return materialService.delete(material);
    }

    @PutMapping("{materialId}")
    @ApiOperation("Update material")
    public ResponseEntity<Material> update(@PathVariable Long materialId, @PathVariable Long courseId,
            @RequestBody MaterialDTO materialDTO, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Material material = coreService.validateMaterial(courseId, materialId);

        if (!coreService.hasPermission("update_material", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return materialService.update(materialDTO, material, userDetails);
    }

    @PostMapping("{materialId}/files")
    public ResponseEntity<List<FileUploaded>> uploadFiles(@RequestParam MultipartFile[] files,
            @PathVariable Long courseId, @PathVariable Long materialId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Material material = coreService.validateMaterial(courseId, materialId);

        if (!coreService.hasPermission("update_material", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return fileStorageService.upload(files, material.getFilesFolder());
    }

    @GetMapping("{materialId}/files/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, @PathVariable Long courseId,
            @PathVariable Long materialId, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Material material = coreService.validateMaterial(courseId, materialId);

        if (!coreService.hasPermission("list_materials", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return fileStorageService.download(fileName, material.getFilesFolder());
    }

    @GetMapping("{materialId}/files")
    public ResponseEntity<List<FileUploaded>> loadAllFilesFromFolder(@PathVariable Long courseId,
            @PathVariable Long materialId, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Material material = coreService.validateMaterial(courseId, materialId);

        if (!coreService.hasPermission("list_materials", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return fileStorageService.listFiles(material.getFilesFolder());
    }

    @DeleteMapping("{materialId}/files")
    public ResponseEntity<?> deleteFiles(@PathVariable Long courseId, @PathVariable Long materialId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Material material = coreService.validateMaterial(courseId, materialId);

        if (!coreService.hasPermission("delete_material", courseId, userDetails)) {
            throw new UserNotAuthorized("You do not have permission to delete materials.");
        }

        return fileStorageService.deleteFolder(material, true);
    }

    @DeleteMapping("{materialId}/files/{fileName:.+}")
    public ResponseEntity<?> deleteFile(@PathVariable Long courseId, @PathVariable Long materialId,
            @PathVariable String fileName, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Material material = coreService.validateMaterial(courseId, materialId);

        if (!coreService.hasPermission("delete_material", courseId, userDetails)) {
            throw new UserNotAuthorized("You do not have permission to delete materials.");
        }

        return fileStorageService.deleteFile(fileName, material);
    }

    @PostMapping("{materialId}/folder/{folderId}")
    public ResponseEntity<?> changeFolder(@PathVariable Long courseId, @PathVariable Long materialId,
            @PathVariable Long folderId, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Material material = coreService.validateMaterial(courseId, materialId);
        MaterialFolder folder = coreService.validateMaterialFolder(courseId, folderId);

        if (!coreService.hasPermission("update_material", courseId, userDetails)) {
            throw new UserNotAuthorized("You do not have permission to edit materials.");
        }

        return materialService.changeFolder(material, folder, userDetails);
    }

    @DeleteMapping("{materialId}/folder")
    public ResponseEntity<?> removeFromFolder(@PathVariable Long courseId, @PathVariable Long materialId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Material material = coreService.validateMaterial(courseId, materialId);

        if (!coreService.hasPermission("update_material", courseId, userDetails)) {
            throw new UserNotAuthorized("You do not have permission to edit materials.");
        }

        return materialService.removeFromFolder(material, userDetails);
    }
}
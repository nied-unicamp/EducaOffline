package br.niedunicamp.controller;

import java.io.IOException;
//#region Imports
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import br.niedunicamp.exception.FileStorageException;
import br.niedunicamp.exception.UserNotAuthorized;
import br.niedunicamp.model.Course;
import br.niedunicamp.model.Material;
import br.niedunicamp.model.MaterialFolder;
import br.niedunicamp.pojo.MaterialFolderDTO;
import br.niedunicamp.service.CoreService;
import br.niedunicamp.service.MaterialFolderService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;
//#endregion

@CrossOrigin
@Api(value = "MaterialController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@RequestMapping("/v1/courses/{courseId}/materials/folders")
public class MaterialFolderController {

    // #region Repositories

    @Autowired
    private MaterialFolderService materialFolderService;

    @Autowired
    private CoreService coreService;
    // #endregion

    @GetMapping
    @ApiOperation("List folders")
    public ResponseEntity<List<MaterialFolder>> list(@PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("list_material_folder", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized");
        }

        return materialFolderService.list(course);
    }

    @GetMapping("{folderId}")
    @ApiOperation("Download folder")
    public ResponseEntity<StreamingResponseBody> download(@PathVariable Long folderId, @PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        MaterialFolder folder = coreService.validateMaterialFolder(courseId, folderId);

        if (!coreService.hasPermission("download_material_folder", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized");
        }

        try {
            return materialFolderService.download(folder);
        } catch (IOException e) {
            e.printStackTrace();
            throw new FileStorageException("Failed to compress folder.");
        }
    }

    @PostMapping
    @ApiOperation("Create folder")
    public ResponseEntity<MaterialFolder> create(@RequestBody MaterialFolderDTO folderDTO, @PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        Course course = coreService.validateCourse(courseId);

        if (!coreService.hasPermission("create_material_folder", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return materialFolderService.create(course, folderDTO, userDetails);
    }

    @DeleteMapping("{folderId}")
    @ApiOperation("Delete material folder")
    public ResponseEntity<?> delete(@PathVariable Long folderId, @PathVariable Long courseId,
            @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {
        MaterialFolder folder = coreService.validateMaterialFolder(courseId, folderId);

        if (!coreService.hasPermission("delete_material_folder", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return materialFolderService.delete(folder);
    }

    @PutMapping("{folderId}")
    @ApiOperation("Update material folder")
    public ResponseEntity<MaterialFolder> update(@PathVariable Long folderId, @PathVariable Long courseId,
            @RequestBody MaterialFolderDTO folderDTO, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        MaterialFolder folder = coreService.validateMaterialFolder(courseId, folderId);

        if (!coreService.hasPermission("update_material_folder", courseId, userDetails))
            throw new UserNotAuthorized("User not authorized");

        return materialFolderService.update(folderDTO, folder, userDetails);
    }

    @GetMapping("{folderId}/materials")
    @ApiOperation("List materials")
    public ResponseEntity<List<Material>> list(@PathVariable Long courseId,
            @PathVariable Long folderId, @ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        MaterialFolder folder = coreService.validateMaterialFolder(courseId,
        folderId);

        if (!coreService.hasPermission("list_materials", courseId, userDetails)) {
            throw new UserNotAuthorized("User not authorized");
        }

        return materialFolderService.list(folder);
    }
}
package br.niedunicamp.controller;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.niedunicamp.exception.ResourceNotFoundException;
import br.niedunicamp.repository.UserRepository;
import br.niedunicamp.service.CoreService;
import io.swagger.annotations.Api;
import springfox.documentation.annotations.ApiIgnore;
// #endregion

@CrossOrigin
@Api(value = "ConnectionSpeedController", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
@RequestMapping("/v1/test")
public class ConnectionSpeedController {

    // #region Services and Repositories
    @Autowired
    UserRepository userRepository;

    @Autowired
    private CoreService coreService;
    // #endregion

    @PostMapping("upload")
    public void uploadTest(@RequestParam MultipartFile file) {
        /* 
         * This endpoint receives the test file upload and does not need to do anything specific with it
         * It serves the purpose of testing the upload speed
         */

    }

    @GetMapping("download")
    public ResponseEntity<InputStreamResource> downloadTest(@ApiIgnore @AuthenticationPrincipal UserDetails userDetails) {

        /*
         * This endpoint generates a small file to test download speed
         */

        if(coreService.validateUser(userDetails) == null)
        {
            throw new ResourceNotFoundException("User not found");
        }

        byte[] fileContent = generateTestFileContent(); // You need to implement this method
        InputStream inputStream = new ByteArrayInputStream(fileContent);
        InputStreamResource resource = new InputStreamResource(inputStream);

        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(fileContent.length)
                .header("Content-Disposition", "attachment; filename=test-file")
                .body(resource);
    }

    private byte[] generateTestFileContent() {
        byte[] content = new byte[1024]; // 1 KB
        return content;
    }
    
}

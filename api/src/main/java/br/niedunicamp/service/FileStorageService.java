package br.niedunicamp.service;

import java.nio.file.Path;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.niedunicamp.model.interfaces.HaveFiles;
import br.niedunicamp.pojo.FileUploaded;

@Service
public interface FileStorageService {

    Path getFileStorageLocation();

    ResponseEntity<List<FileUploaded>> listFiles(String subPath);

    ResponseEntity<List<FileUploaded>> listFiles(String subPath, HttpServletRequest request);

    ResponseEntity<Resource> download(String fileName, String subPath);

    ResponseEntity<List<FileUploaded>> upload(MultipartFile[] files, String subPath, HttpServletRequest request);

    ResponseEntity<List<FileUploaded>> upload(MultipartFile[] files, String subPath);

    ResponseEntity<List<FileUploaded>> upload(MultipartFile file, String subPath);

    ResponseEntity<FileUploaded> upload(MultipartFile file, String subPath, HttpServletRequest request);

    ResponseEntity<?> deleteFolder(HaveFiles item, Boolean keepFolder);

    ResponseEntity<?> deleteFolder(HaveFiles item);

    ResponseEntity<?> deleteFolder(String path, Boolean keepFolder);

    ResponseEntity<?> deleteFile(String fileName, HaveFiles item);

    ResponseEntity<?> deleteFile(String fileName, String path);
}
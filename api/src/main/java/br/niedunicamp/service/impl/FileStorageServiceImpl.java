package br.niedunicamp.service.impl;

import br.niedunicamp.config.FileStorageConfig;
import br.niedunicamp.exception.FileStorageException;
import br.niedunicamp.exception.ResourceNotFoundException;
import br.niedunicamp.model.interfaces.HaveFiles;
import br.niedunicamp.pojo.FileUploaded;
import br.niedunicamp.service.FileStorageService;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.awt.Graphics2D;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageServiceImpl implements FileStorageService {

  private final Path fileStorageLocation;

  @Autowired
  public FileStorageServiceImpl(FileStorageConfig fileStorageProperties) {
    this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir())
        .toAbsolutePath()
        .normalize();

    try {
      Files.createDirectories(this.fileStorageLocation);
    } catch (Exception ex) {
      throw new FileStorageException(
          "Could not create the directory where the uploaded files will be stored.",
          ex);
    }
  }

  public Path getFileStorageLocation()
  {
    return this.fileStorageLocation;
  }

  public ResponseEntity<Resource> download(String fileName, String subPath) {
    // Load file as Resource
    Resource resource = loadFileAsResource(fileName, subPath);

    // Try to determine file's content type
    String contentType = null;
    try {
      Tika tika = new Tika();
      contentType = tika.detect(resource.getFile());
    } catch (IOException ex) {
      System.out.println("Could not determine file type.");
    }

    // Fallback to the default content type if type could not be determined
    if (contentType == null) {
      contentType = "application/octet-stream";
    }

    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(contentType))
        .header(HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=\"" + resource.getFilename() + "\"")
        .body(resource);
  }

  public ResponseEntity<List<FileUploaded>> listFiles(String subPath) {
    try {
      Path local = this.fileStorageLocation.resolve(subPath);

      /**
       * TODO: remove either this "if" or the surrounding "try-catch" block
       */
      if (!Files.exists(local)) {
        return ResponseEntity.ok(new ArrayList<>());
      }

      List<FileUploaded> files = Files.walk(local, 1)
          .filter(path -> path.toFile().isFile())
          .map(path -> pathToFileResponse(path))
          .collect(Collectors.toList());

      return ResponseEntity.ok(files);
    } catch (IOException e) {
      throw new ResourceNotFoundException(
          "Failed to read stored files. Folder not found");
    }
  }

  public ResponseEntity<List<FileUploaded>> listFiles(String subPath, HttpServletRequest request) {
    return fixDownload(listFiles(subPath), request);
  }

  public ResponseEntity<List<FileUploaded>> upload(MultipartFile[] files, String subPath, HttpServletRequest request) {
    return fixDownload(upload(files, subPath), request);
  }

  public ResponseEntity<FileUploaded> upload(MultipartFile file, String subPath,
      HttpServletRequest request) {
    FileUploaded fileUploaded = upload(file, subPath).getBody().get(0);

    fileUploaded.setDownloadUri(request.getRequestURL() + "/" +
        fileUploaded.getFileName());

    return ResponseEntity.ok(fileUploaded);
  }

  public ResponseEntity<List<FileUploaded>> upload(MultipartFile[] files, String subPath) {
    List<FileUploaded> fileResponses = Arrays.stream(files)
            .flatMap(file -> {
                List<Path> filePaths = storeFile(file, subPath);
                return filePaths.stream().map(this::pathToFileResponse);
            })
            .collect(Collectors.toList());

    return ResponseEntity.ok(fileResponses);
}

  public ResponseEntity<List<FileUploaded>> upload(MultipartFile file,
      String subPath) {

    List<Path> filePaths = storeFile(file, subPath);

    return ResponseEntity.ok(filePaths.stream().map(filePath -> pathToFileResponse(filePath)).collect(Collectors.toList()));
  }

  private List<Path> storeFile(MultipartFile file, String subPath) {
    // Normalize file name
    String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
    String fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1);

    Path location = fileStorageLocation.resolve(subPath);

    if (!Files.exists(location)) {
      try {
        Files.createDirectories(location);
      } catch (Exception ex) {
        throw new FileStorageException(
            "Could not create the directory where the uploaded files will be stored.",
            ex);
      }
    }

    try {
      // Check if the file's name contains invalid characters
      if (originalFileName.contains("..")) {
        throw new FileStorageException(
            "Sorry! Filename contains invalid path sequence " + originalFileName);
      }

      List<Path> paths = new ArrayList<Path>(); // caminho dos arquivos salvos

      // Verifique se o arquivo é uma imagem
      String mimeType = getMimeType(file.getInputStream());
      if (isImageMimeType(mimeType)) {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        // Define os tamanhos desejados
        int[] targetHeights = { 480, 720, 1080 };
        String[] sizeSubPaths = { "480p", "720p", "1080p" };

        for (int i = 0; i < targetHeights.length; i++) {
          int targetHeight = targetHeights[i];
          String size = sizeSubPaths[i];

          if (targetHeight <= originalImage.getHeight()) {
            BufferedImage resizedImage = resizeImage(originalImage, targetHeight);
            String uniqueFileName = generateUniqueFileName(originalFileName, size, fileExtension, i + 1);
            Path targetLocation = location.resolve(uniqueFileName);
            ImageIO.write(resizedImage, fileExtension, targetLocation.toFile());
            paths.add(targetLocation);
          }
        }
      } 
      
      if (paths.isEmpty()){
        // O arquivo não é uma imagem, então simplesmente armazene-o com seu nome
        // original
        Path targetLocation = location.resolve(originalFileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        paths.add(targetLocation);
      }
      
      // returna lista de caminhos completos
      return paths.stream().map(path -> location.resolve(path)).collect(Collectors.toList());

    } catch (

    IOException ex) {
      throw new FileStorageException(
          "Could not store file " + originalFileName + ". Please try again!", ex);
    }
  }

  private BufferedImage resizeImage(BufferedImage originalImage, int targetHeight) {
    int targetWidth = (int) (originalImage.getWidth() * ((double) targetHeight / originalImage.getHeight()));
    BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
    Graphics2D g = resizedImage.createGraphics();
    g.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
    g.dispose();
    return resizedImage;
  }

  private String generateUniqueFileName(String originalFileName, String size, String fileExtension, int number) {
    // Gere um nome de arquivo único com base no tamanho e no nome original
    String fileNameWithoutExtension = originalFileName.substring(0, originalFileName.lastIndexOf("."));
    return fileNameWithoutExtension + "_" + size + "_" + number + "." + fileExtension;
  }

  private String getMimeType(InputStream inputStream) throws IOException {
    Tika tika = new Tika();
    return tika.detect(inputStream);
  }

  private boolean isImageMimeType(String mimeType) {
    // Verifique se o tipo MIME corresponde a um tipo de imagem comum
    return mimeType.startsWith("image/");
  }

  private Resource loadFileAsResource(String fileName, String subPath) {

    try {
      Path location = fileStorageLocation.resolve(subPath);
      Path filePath = location.resolve(fileName).normalize();

      Resource resource = new UrlResource(filePath.toUri());
      if (resource.exists()) {
        return resource;
      } else {
        throw new ResourceNotFoundException("File not found " + fileName);
      }
    } catch (MalformedURLException ex) {
      throw new ResourceNotFoundException("File not found " + fileName);
    }
  }

  private FileUploaded pathToFileResponse(Path path) {
    File realFile = path.toFile();
    FileUploaded file = new FileUploaded();

    file.setFileName(realFile.getName());
    file.setByteSize(realFile.length());

    // TODO: "Refactor" the FileUploaded so this is not needed as frequently
    try {
      String sha3Hex = new DigestUtils("SHA3-256").digestAsHex(realFile);
      file.setSha3Hex(sha3Hex);

      Tika tika = new Tika();
      file.setMimeType(tika.detect(path));
    } catch (IOException e) {
      // e.printStackTrace();
    }

    return file;
  }

  private ResponseEntity<List<FileUploaded>> fixDownload(ResponseEntity<List<FileUploaded>> response,
      HttpServletRequest request) {
    return ResponseEntity.ok(response.getBody()
        .stream()
        .map(item -> {
          item.setDownloadUri(request.getRequestURL() +
              "/" +
              item.getFileName());
          return item;
        })
        .collect(Collectors.toList()));
  }

  // TODO: Delete this!
  public ResponseEntity<?> deleteFile(String fileName, HaveFiles item) {
    String subPath = item.getFilesFolder();

    try {
      Path location = fileStorageLocation.resolve(subPath);
      Path filePath = location.resolve(fileName).normalize();

      FileSystemUtils.deleteRecursively(filePath.toFile());

      return ResponseEntity.ok(null);
    } catch (Exception e) {
      throw new ResourceNotFoundException(
          "The file was not found, so it could not be deleted");
    }
  }

  public ResponseEntity<?> deleteFile(String fileName, String path) {

    try {
      Path location = fileStorageLocation.resolve(path);
      Path filePath = location.resolve(fileName).normalize();

      FileSystemUtils.deleteRecursively(filePath.toFile());

      return ResponseEntity.ok(null);
    } catch (Exception e) {
      throw new ResourceNotFoundException(
          "The file was not found, so it could not be deleted");
    }
  }

  // TODO: Delete this
  @Override
  public ResponseEntity<?> deleteFolder(HaveFiles item) {
    return deleteFolder(item, false);
  }

  // TODO: Delete this
  @Override
  public ResponseEntity<?> deleteFolder(HaveFiles item, Boolean keepFolder) {
    String subPath = item.getFilesFolder();

    return deleteFolder(subPath, keepFolder);
  }

  @Override
  public ResponseEntity<?> deleteFolder(String path, Boolean keepFolder) {

    try {
      Path location = fileStorageLocation.resolve(path);

      FileSystemUtils.deleteRecursively(location.toFile());

      if (keepFolder) {
        Files.createDirectories(location);
      }

      return ResponseEntity.ok(null);
    } catch (Exception e) {
      throw new ResourceNotFoundException("The folder was not found");
    }
  }
}

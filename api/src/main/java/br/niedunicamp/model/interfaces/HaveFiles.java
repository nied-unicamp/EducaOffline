package br.niedunicamp.model.interfaces;

import java.util.List;

import br.niedunicamp.pojo.FileUploaded;

/**
 * HaveFiles
 */
public interface HaveFiles {

    List<FileUploaded> getFiles();

    String getFilesFolder();
}
package br.niedunicamp.pojo;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FileUploaded {
  private String fileName;
  private String sha3Hex;
  private String downloadUri;
  private String mimeType;
  private long byteSize;
}

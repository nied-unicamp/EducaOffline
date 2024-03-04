package br.niedunicamp.pojo;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ShareDTO {

    List<Long> userId;
    List<Long> roleId;
    List<Long> groupId;

    Boolean canEdit;
    Boolean canDelete;
}

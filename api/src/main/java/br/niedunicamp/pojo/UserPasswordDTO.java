package br.niedunicamp.pojo;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserPasswordDTO {

    private String oldPassword;
    private String newPassword;
}

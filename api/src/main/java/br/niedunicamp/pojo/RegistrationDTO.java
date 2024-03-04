package br.niedunicamp.pojo;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegistrationDTO {

    private String email;
    private String name;
    private String password;
    private String hash;
	private String language;
}
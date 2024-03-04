package br.niedunicamp.model;

import javax.persistence.Column;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Login {

    @Size(max = 255)
    @Column(columnDefinition = "TEXT", length = 255)
    private String userEmail;

    @Size(max = 255)
    @Column(columnDefinition = "TEXT", length = 255)
    private String password;
	private String language;
}

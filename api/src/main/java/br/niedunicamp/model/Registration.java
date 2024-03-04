package br.niedunicamp.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import br.niedunicamp.model.enums.Language;
import lombok.Data;

@Data
@Entity
public class Registration {

    @Id
    @Email(message = "*Please provide a valid Email")
    @NotNull(message = "*Please provide an email")
    private String email;

    @NotEmpty
    @Size(max = 255)
    @Column(columnDefinition = "TEXT", length = 255)
    private String name;

    @NotNull(message = "The course start date must not be blank.")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private Date date;

    @NotEmpty
    @JsonIgnore
    @Size(max = 255)
    @Column(columnDefinition = "TEXT", length = 255)
    private String hash;

    @Enumerated(EnumType.STRING)
    private Language language;
    
    private Boolean forgotPassword;

    @JsonIgnore
    @Size(max = 255)
    @Column(columnDefinition = "TEXT", length = 255)
    private String password;

    public Registration() {
        this.forgotPassword = false;
    }
}

package br.niedunicamp.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Transient;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.niedunicamp.model.enums.Language;
import br.niedunicamp.model.interfaces.HaveFiles;
import br.niedunicamp.pojo.FileUploaded;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.Table;
//#endregion

@Data
@NoArgsConstructor
@Entity
@Table(name = "tb_user")
public class User implements HaveFiles {

    // @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty
    @Size(max = 255)
    @Column(columnDefinition = "TEXT", length = 255)
    private String name;

    // Note: columnDefinition = "TEXT" is mysql specific
    // For details, see
    // https://chartio.com/resources/tutorials/understanding-strorage-sizes-for-mysql-text-data-types/
    // Using @Lob is a solution but it will use LONGTEXT in mysql
    @Size(max = 1000)
    @Column(columnDefinition = "TEXT", length = 1000)
    private String aboutMe;

    @NotNull
    private Boolean isAdmin;

    @NotNull
    @Email(message = "*Please provide a valid ")
    private String email;

    @JsonIgnore
    @NotNull
    @Size(min = 8, message = "*Your password must have at least 8 characters.")
    private String password;

    @Size(max = 255)
    @Column(columnDefinition = "TEXT", length = 255)
    private String picture;
    
    @Column(columnDefinition = "ENUM('EN_US','PT_BR') default 'EN_US'")
    @Enumerated(EnumType.STRING)
    private Language language;
    
    @Transient
    private List<FileUploaded> files;

    @JsonIgnore
    public String getPictureFolder() {
        return "profile-pictures/" + this.getId();
    }

    @Override
    @JsonIgnore
    public String getFilesFolder() {
        return getPictureFolder();
    }
}

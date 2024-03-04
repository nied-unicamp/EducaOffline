package br.niedunicamp.model;

//#region Imports
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import br.niedunicamp.annotations.JsonDate;
import br.niedunicamp.model.interfaces.Created;
import br.niedunicamp.model.interfaces.HaveFiles;
import br.niedunicamp.model.interfaces.LastModified;
import br.niedunicamp.pojo.FileUploaded;
import lombok.Data;
import lombok.NoArgsConstructor;
//#endregion

@Data
@NoArgsConstructor
@Entity
public class Material implements Created, LastModified, HaveFiles {

    // @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName = "id")
    private Course course;

    @Size(max = 255)
    @Column(columnDefinition = "TEXT", length = 255)
    private String title;

    @Size(max = 255)
    @Column(columnDefinition = "TEXT", length = 255)
    private String description;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName = "id")
    MaterialFolder folder;

    @Size(max = 1000)
    @Column(columnDefinition = "TEXT", length = 1000)
    String link;

    // ---------------- Date Metadata ----------
    @CreatedBy
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName = "id")
    private User createdBy;

    @CreatedDate
    @JsonDate
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @LastModifiedBy
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName = "id")
    private User lastModifiedBy;

    @LastModifiedDate
    @JsonDate
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastModifiedDate;
    // ----------------------------------------


    @Transient
    private List<FileUploaded> files;

    @Override
    @JsonIgnore
    public String getFilesFolder() {
    return this.course.getId() + "/material/" + this.getId();
    }
}
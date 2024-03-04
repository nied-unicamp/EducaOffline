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
import javax.validation.constraints.NotEmpty;
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
public class Activity implements Created, LastModified, HaveFiles {

    // @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @JsonIgnore
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName = "id")
    private Course course;

    @NotEmpty
    @Size(max = 255)
    @Column(columnDefinition = "TEXT", length = 255)
    private String title;

    @Size(max = 5000)
    @Column(columnDefinition = "TEXT", length = 5000)
    private String description;

    @NotNull
    @JsonDate
    @Temporal(TemporalType.TIMESTAMP)
    private Date submissionBegin;

    @NotNull
    @JsonDate
    @Temporal(TemporalType.TIMESTAMP)
    private Date submissionEnd;

    @NotNull
    @JsonDate
    @Temporal(TemporalType.TIMESTAMP)
    private Date publishDate;

    // ------------------- Grade --------------------

    @Size(max = 1000)
    @Column(columnDefinition = "TEXT", length = 1000)
    private String criteria;

    Float gradeWeight;

    @JsonDate
    @Temporal(TemporalType.TIMESTAMP)
    Date gradesReleaseDate;

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
    List<FileUploaded> files;

    @Override
    @JsonIgnore
    public String getFilesFolder() {
        return this.course.getId() + "/activities/" + this.getId();
    }

    public Float getGradeWeight() {
        return (this.gradeWeight != null) ? this.gradeWeight : 0f;
    }
}

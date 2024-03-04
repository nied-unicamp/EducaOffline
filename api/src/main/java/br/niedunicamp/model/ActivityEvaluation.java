package br.niedunicamp.model;

//#region IMPORTS
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
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import br.niedunicamp.annotations.JsonDate;
import br.niedunicamp.model.interfaces.HaveFiles;
import br.niedunicamp.model.interfaces.LastModified;
import br.niedunicamp.pojo.FileUploaded;
import lombok.Data;
import lombok.NoArgsConstructor;
//#endregion

@Data
@NoArgsConstructor
@Entity
public class ActivityEvaluation implements LastModified, HaveFiles {

    // @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 1000)
    @Column(columnDefinition = "TEXT", length = 1000)
    private String comment;

    private Float score;

    // ---------------- Date Metadata ----------
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
    return "/evaluations/" + this.getId();
    }
}

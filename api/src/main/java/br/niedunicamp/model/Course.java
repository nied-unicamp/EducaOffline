package br.niedunicamp.model;

import java.util.ArrayList;
//#region Imports
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.niedunicamp.annotations.JsonDate;
import br.niedunicamp.model.interfaces.HaveFiles;
import br.niedunicamp.pojo.FileUploaded;
import lombok.Data;
import lombok.NoArgsConstructor;
//#endregion

@Data
@NoArgsConstructor
@Entity
public class Course implements HaveFiles {

    // @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty
    @Size(max=100)
    @Column(length = 100)
    private String name;

    @NotEmpty
    @Size(max = 1000)
    @Column(length = 1000)
    private String info;

    @JsonIgnore
    @NotEmpty
    @Size(min = 6, max = 8)
    @Column(name = "course_key", length = 8)
    private String key;

    // --------- Start/End Dates --------
    @NotNull
    @JsonDate
    @Temporal(TemporalType.TIMESTAMP)
    private Date startDate;

    @NotNull
    @JsonDate
    @Temporal(TemporalType.TIMESTAMP)
    private Date endDate;
    // -------- Subscription Dates ------
    @NotNull
    @JsonDate
    @Temporal(TemporalType.TIMESTAMP)
    private Date subscriptionBegin;

    @NotNull
    @JsonDate
    @Temporal(TemporalType.TIMESTAMP)
    private Date subscriptionEnd;
    // ----------------------------------

    @NotNull
    private Integer noMaxStudents;


    @Transient
    private List<FileUploaded> files;

    @JsonIgnore
    @NotNull
    @OneToMany(mappedBy = "course", cascade = CascadeType.REMOVE)
    private List<Notification> notifications = new ArrayList<>();

    @Override
    @JsonIgnore
    public String getFilesFolder() {
        return this.id + "";
    }
}

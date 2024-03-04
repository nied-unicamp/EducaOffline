package br.niedunicamp.model;

//#region Imports
import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import br.niedunicamp.annotations.JsonDate;
import br.niedunicamp.model.interfaces.LastModified;
import lombok.Data;
import lombok.NoArgsConstructor;
//#endregion

@Data
@NoArgsConstructor
@Entity
public class GradeConfig implements LastModified {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    private Course course;

    Float defaultWeight;

    Boolean useArithmeticMean;

    @JsonDate
    @Temporal(TemporalType.TIMESTAMP)
    Date finalGradesReleased;

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
    List<Activity> gradedActivities;

    @Transient
    List<Activity> notGradedActivities;
}

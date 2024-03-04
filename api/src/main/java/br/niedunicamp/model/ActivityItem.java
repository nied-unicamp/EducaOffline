package br.niedunicamp.model;

//#region Imports
import java.io.Serializable;

import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Data;
import lombok.NoArgsConstructor;
//#endregion

@Data
@NoArgsConstructor
@Embeddable
class ActivityItemPK implements Serializable {

    private static final long serialVersionUID = 5877119163756684253L;

    private Long user;
    private Long activity;
}

@Data
@NoArgsConstructor
@Entity
@IdClass(ActivityItemPK.class)
public class ActivityItem {

    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;

    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "activity",referencedColumnName = "id", insertable = false, updatable = false)
    private Activity activity;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName = "id")
    private ActivitySubmission submission;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName = "id")
    private ActivityEvaluation evaluation;
}

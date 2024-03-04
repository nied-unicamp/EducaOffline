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
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
//#endregion

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
class ParticipationPK implements Serializable {

    private static final long serialVersionUID = 7633783359227964830L;

    private Long user;
    private Long course;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "participation")
@IdClass(ParticipationPK.class)
public class Participation {

    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName = "id")
    private User user;

    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName = "id")
    private Course course;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName = "id")
    private Role role;
}

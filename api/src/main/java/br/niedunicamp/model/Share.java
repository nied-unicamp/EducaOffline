package br.niedunicamp.model;

//#region Imports
import java.util.Date;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import br.niedunicamp.annotations.JsonDate;
import br.niedunicamp.model.interfaces.Created;
import br.niedunicamp.model.interfaces.LastModified;
import lombok.Data;
import lombok.NoArgsConstructor;
//#endregion

@Data
@NoArgsConstructor
@Entity
public class Share implements Created, LastModified {

    // @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName = "id", nullable = false)
    Course course;

    @ManyToMany
    @Fetch(FetchMode.SUBSELECT)
    Set<User> users;

    @ManyToMany
    @Fetch(FetchMode.SUBSELECT)
    Set<Group> groups;

    @ManyToMany
    @Fetch(FetchMode.SUBSELECT)
    Set<Role> roles;

    @ColumnDefault(value = "0")
    Boolean canEdit;

    @ColumnDefault(value = "0")
    Boolean canDelete;

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
}
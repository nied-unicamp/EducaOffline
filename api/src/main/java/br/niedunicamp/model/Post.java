package br.niedunicamp.model;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
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
import javax.persistence.Transient;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import br.niedunicamp.annotations.JsonDate;
import br.niedunicamp.model.interfaces.Created;
import br.niedunicamp.model.interfaces.LastModified;
import lombok.Data;
//#endregion

@Data
@Entity
public class Post implements Created, LastModified {

    // @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty
    @Size(max = 1000)
    @Column(length = 1000)
    private String text;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(referencedColumnName = "id")
    private Course course;

    private Boolean isFixed;

    @JsonIgnore
    @ManyToMany
    private Set<User> likedBy;

    @JsonIgnore
    @ManyToMany
    private Set<User> favoriteBy;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    private Activity activity;


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

    //#region Transient
    @Transient
    private boolean liked;

    @Transient
    private int likeCounter;

    @Transient
    private boolean favorite;

    @Transient
    private int favoriteCounter;

    @Transient
    private boolean isTeacher;


    @Transient
    private Long activityId;
    //#endregion

    public Post() {
        this.emptySets();
    }

    public Post(String text, Activity activity) {
        this.text = text;
        this.isFixed = false;
        this.course = activity.getCourse();
        this.activity = activity;
        this.emptySets();
    }

    public Post(String text, Boolean isFixed, Course course) {
        this.text = text;
        this.isFixed = isFixed != null ? isFixed : false;
        this.course = course;

        this.emptySets();
    }

    public Post(String text, Course course, Long activityId) {
        this.text = text;
        this.isFixed = false;
        this.course = course;
        this.activityId = activityId;
        this.emptySets();
    }

    private void emptySets() {
        this.favoriteBy = new HashSet<User>();
        this.likedBy = new HashSet<User>();
    }
}

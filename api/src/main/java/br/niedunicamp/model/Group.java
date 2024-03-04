package br.niedunicamp.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.NoArgsConstructor;
//#endregion

@Data
@NoArgsConstructor
@Entity
@Table(name = "tb_groups") // NOTE: The table was renamed to 'groups', since 'group' is a reserved word in
                        // SQL
public class Group {

    // @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    private Course course;

    @Size(max = 100)
    @Column(columnDefinition = "TEXT", length = 100)
    private String name;

    @ManyToMany
    private List<User> users;
}
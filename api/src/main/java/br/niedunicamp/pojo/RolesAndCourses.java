package br.niedunicamp.pojo;

import java.util.Set;

import br.niedunicamp.model.Course;
import br.niedunicamp.model.Role;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RolesAndCourses {
    private Set<Role> roles;
    private Set<Course> courses;

    private Set<RoleAndCourseIds> associations;
}
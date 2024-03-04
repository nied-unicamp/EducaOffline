package br.niedunicamp.pojo;

import lombok.Data;

@Data
public class RoleAndCourseIds {
    private Long courseId;
    private Long roleId;
    
	public RoleAndCourseIds(Long courseId, Long roleId) {
		super();
		this.courseId = courseId;
		this.roleId = roleId;
	}

    
}

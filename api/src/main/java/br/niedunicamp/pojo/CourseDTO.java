package br.niedunicamp.pojo;

import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseDTO {

    @Size(max = 100)
    private String name;

    private String subscriptionBegin;
    private String subscriptionEnd;

    private String startDate;
    private String endDate;

    @Size(max = 1000)
    private String info;
    private Integer noMaxStudents;
}
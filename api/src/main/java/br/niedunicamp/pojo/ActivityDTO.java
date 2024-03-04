package br.niedunicamp.pojo;

import java.util.Date;

import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityDTO {

    private String title;

    @Size(max = 5000)
    private String description;

    private Date submissionBegin;
    private Date submissionEnd;

    private Date publishDate;

    private Boolean hasGrade;

    @Size(max = 1000)
    private String criteria;
}

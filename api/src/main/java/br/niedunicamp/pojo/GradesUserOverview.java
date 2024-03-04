package br.niedunicamp.pojo;

import java.util.Set;

import br.niedunicamp.model.Activity;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GradesUserOverview {
    private Set<Activity> activities;
    private Set<ActivityItemLite> grades;
    private FinalGrade finalGrade;
    private Set<ActivityAverageGrade> averageGrades;  
}
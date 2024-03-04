package br.niedunicamp.pojo;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ActivityAverageGrade {
    private Long activityId;
    private Float average; 
}
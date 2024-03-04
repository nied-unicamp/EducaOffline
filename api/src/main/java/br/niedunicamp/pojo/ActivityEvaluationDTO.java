package br.niedunicamp.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityEvaluationDTO {
    private Long submissionId;

    private String comment;

    private Float score;
}
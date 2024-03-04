package br.niedunicamp.pojo;

import br.niedunicamp.model.Activity;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ActivityGradesSummary {
    private int submissions;
    private int evaluations;
    private Float average;

    private Activity activity;
}
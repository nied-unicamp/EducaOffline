package br.niedunicamp.pojo;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class GradeConfigDTO {
    Float defaultWeight;
    List<ActivityWeight> weights;
}

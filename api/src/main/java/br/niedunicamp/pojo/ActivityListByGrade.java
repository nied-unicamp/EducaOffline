package br.niedunicamp.pojo;

import java.util.List;

import br.niedunicamp.model.Activity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityListByGrade {

    private List<Activity> withGrades;
    private List<Activity> withoutGrades;
}

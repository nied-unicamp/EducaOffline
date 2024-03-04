package br.niedunicamp.pojo;

import java.sql.Date;

import br.niedunicamp.annotations.JsonDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseKey {
    private String key;

    @JsonDate
    private Date validUntil;
}

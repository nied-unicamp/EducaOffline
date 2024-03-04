package br.niedunicamp.pojo;

import br.niedunicamp.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinalGrade {
    private String score;
    private User user;
}
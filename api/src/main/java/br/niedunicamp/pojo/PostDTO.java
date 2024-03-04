package br.niedunicamp.pojo;

import javax.validation.constraints.Size;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PostDTO {

    @Size(max = 1000)
    private String text;

    private Boolean isFixed;
}

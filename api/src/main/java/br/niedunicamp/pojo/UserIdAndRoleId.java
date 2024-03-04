package br.niedunicamp.pojo;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserIdAndRoleId {
    public Long userId;
    public Long roleId;
}
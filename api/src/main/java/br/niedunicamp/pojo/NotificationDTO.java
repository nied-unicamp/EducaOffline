package br.niedunicamp.pojo;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NotificationDTO {
    private NotificationType type;

    private Long itemId1;
    private String itemText1;
    private Long itemId2;
    private String itemText2;
}
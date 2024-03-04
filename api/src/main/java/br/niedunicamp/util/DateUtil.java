package br.niedunicamp.util;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import org.springframework.stereotype.Component;

@Component
public class DateUtil {

    public String formatLocalDateTimeToDataBaseStyle(LocalDateTime localD) {
        return DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").format(localD);
    }

    public static Date fromJSONDate(String dateString) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSX");
        // String dateInString = "2014-10-05T15:23:01Z";

        try {
            return formatter.parse(dateString.replaceAll("Z$", "+0000"));
        } catch (Exception e) {
            return null;
        }
    }
}

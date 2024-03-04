package br.niedunicamp.model.interfaces;

import java.util.Date;

import br.niedunicamp.model.User;

/**
 * Created
 */
public interface Created {

    public void setCreatedBy(User createdBy);

    public void setCreatedDate(Date createdDate);

    public User getCreatedBy();

    public Date getCreatedDate();
}
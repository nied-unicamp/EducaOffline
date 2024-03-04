package br.niedunicamp.model.interfaces;

import java.util.Date;

import br.niedunicamp.model.User;

/**
 * LastModified
 */
public interface LastModified {

    public void setLastModifiedBy(User lastModifiedBy);

    public void setLastModifiedDate(Date lastModifiedDate);

    public User getLastModifiedBy();

    public Date getLastModifiedDate();
}
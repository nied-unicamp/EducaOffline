package br.niedunicamp.model.interfaces;

import br.niedunicamp.model.Course;
import br.niedunicamp.model.Group;

/**
 * Owner
 */
public interface Owner extends Created {

    public void setOwnerGroup(Group group);

    public Group getOwnerGroup();

    public Course getCourse();
}
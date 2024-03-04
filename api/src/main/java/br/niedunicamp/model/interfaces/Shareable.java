package br.niedunicamp.model.interfaces;

import br.niedunicamp.model.Share;

/**
 * Shareable
 */
public interface Shareable {

    Share getSharingInfo();

    void setSharingInfo(Share sharingInfo);
}
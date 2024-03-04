package br.niedunicamp.config;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import br.niedunicamp.model.User;

/**
 * Provides a basic implementation of the UserDetails interface
 */
public class CustomUserDetails implements UserDetails {

    private static final long serialVersionUID = -1065601127499046944L;
    private Collection<? extends GrantedAuthority> authorities;
    private String password;
    private String username;

    public CustomUserDetails(User user) {
        this.username = user.getEmail();
        this.password = user.getPassword();
        // this.authorities = translate(user.getRole());
    }

    /**
     * Translates the List<Role> to a List<GrantedAuthority>
     * @param roles the input list of roles.
     * @return a list of granted authorities
     */
    // private Collection<? extends GrantedAuthority> translate(Role role) {
    //     List<GrantedAuthority> authorities = new ArrayList<>();

    //         String name = role.getName().toUpperCase();
    //         if (!name.startsWith("ROLE_"))
    //             name = "ROLE_" + name;
    //         authorities.add(new SimpleGrantedAuthority(name));

    //     return authorities;
    // }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
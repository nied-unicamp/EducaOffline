package br.niedunicamp.pojo;

import br.niedunicamp.model.Role;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.Email;

public class UserRegistration {

    private Long id;
    private String password;
    private String passwordConfirmation;
    private String name;

    @Email(message = "*Please provide a valid Email")
    private String email;
    private String aboutMe;
    private Date birthDate;
    private String language;

    public UserRegistration() {
    }

    public UserRegistration(Long id, String password, String passwordConfirmation, String name, String email, String aboutMe, Date birthDate) {
        this.id = id;
        this.password = password;
        this.passwordConfirmation = passwordConfirmation;
        this.name = name;
        this.email = email;
        this.aboutMe = aboutMe;
        this.birthDate = birthDate;
    }

    public UserRegistration(String password, String passwordConfirmation, boolean admin, List<Role> roles, String name, String email, String aboutMe, Date birthDate) {
        this.password = password;
        this.passwordConfirmation = passwordConfirmation;
        this.name = name;
        this.email = email;
        this.aboutMe = aboutMe;
        this.birthDate = birthDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPasswordConfirmation() {
        return passwordConfirmation;
    }

    public void setPasswordConfirmation(String passwordConfirmation) {
        this.passwordConfirmation = passwordConfirmation;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAboutMe() {
        return aboutMe;
    }

    public void setAboutMe(String aboutMe) {
        this.aboutMe = aboutMe;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}
    
    
}

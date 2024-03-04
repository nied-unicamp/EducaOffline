package br.niedunicamp.model.enums;

//import br.niedunicamp.exception.ResourceNotFoundException;

public enum Language {
	EN_US(1),
	PT_BR(2);
	
	private int code;
	
	Language(int code) {
		this.code = code;
	}
	
	public int getCode() {
		return this.code;
	}
	
	public static String getLanguageDefault() {
		return "EN_US";
	}
	
}

package com.cts.system.entity;

import java.io.Serializable;


public class User implements Serializable {  
    /**
	 * 
	 */
	private static final long serialVersionUID = -7686167837240839095L;
	private Long id;  
    private String name;  
    private String mobile;
	
    private String password;
    
    public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Long getId() {  
        return id;  
    }  
  
    public void setId(Long id) {  
        this.id = id;  
    }  
  
    public String getName() {  
        return name;  
    }  
  
    public void setName(String name) {  
        this.name = name;  
    }  
  
    public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	@Override  
    public boolean equals(Object o) {  
        if (this == o) return true;  
        if (o == null || getClass() != o.getClass()) return false;  
  
        User user = (User) o;  
  
        if (id != null ? !id.equals(user.id) : user.id != null) return false;  
  
        return true;  
    }  
  
    @Override  
    public int hashCode() {  
        return id != null ? id.hashCode() : 0;  
    }  
    
}  

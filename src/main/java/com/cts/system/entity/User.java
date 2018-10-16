package com.cts.system.entity;

import java.io.Serializable;

import io.swagger.annotations.ApiModelProperty;  

public class User implements Serializable {  
	@ApiModelProperty(value="用户编号", required = true, example = "1")
    private Long id;  
	@ApiModelProperty(value="用户名称", required = true, example = "test")
    private String name;  
  
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

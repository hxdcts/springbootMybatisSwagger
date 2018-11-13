package com.cts.system.entity;

import java.io.Serializable;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;  
@ApiModel(value = "输入参数")
public class UserInput implements Serializable {  

	/**
	 * 
	 */
	private static final long serialVersionUID = -6838057924904383922L;
	@ApiModelProperty(value="用户名称", required = true, example = "test")
    private String name;  
	@ApiModelProperty(value="mobile", required = true, example = "13811210000")
    private String mobile;  
	@ApiModelProperty(value="password", required = true, example = "")
    private String password;  
	
    public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

}  

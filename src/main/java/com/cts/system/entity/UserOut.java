package com.cts.system.entity;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;  
@JsonIgnoreProperties(ignoreUnknown = true)
@ApiModel(value = "输出参数")
public class UserOut<E> implements Serializable {  
	/**
	 * position 表示排序
	 * required 表示是否必须
	 */
	@ApiModelProperty(value="返回码", required = true,position = 1, example = "success")
	private String retCode;
	
	@ApiModelProperty(value = "返回信息", required = true, position = 2, example = "交易成功")
    private String retMsg;

	@ApiModelProperty(value = "交易时间", required = true, position = 3, example = "2018-10-16 12:00:00")
    private String transTime;
	
	@ApiModelProperty(value="用户列表", required = true, position = 4, example = "")
    private List<E> list;
	public String getRetCode() {
		return retCode;
	}
	public void setRetCode(String retCode) {
		this.retCode = retCode;
	}
	public List<E> getList() {
		return list;
	}
	public void setList(List<E> list) {
		this.list = list;
	}
	public String getRetMsg() {
		return retMsg;
	}
	public void setRetMsg(String retMsg) {
		this.retMsg = retMsg;
	}
	public String getTransTime() {
		return transTime;
	}
	public void setTransTime(String transTime) {
		this.transTime = transTime;
	}
	
}  

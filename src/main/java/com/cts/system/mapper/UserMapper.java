package com.cts.system.mapper;

import java.util.List;

import javax.jws.soap.SOAPBinding.Use;

import org.apache.ibatis.annotations.Mapper;

import com.cts.system.entity.User;
import com.cts.system.entity.UserInput;

@Mapper
public interface UserMapper {

	public List<User> findUserInfo(UserInput user);
	public int addUserInfo(User user);
	public int delUserInfo(int id);
	public User findByUserMobile(String name);
	User findUserById(String id);
}

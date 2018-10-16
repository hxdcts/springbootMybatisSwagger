package com.cts.system.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.cts.system.entity.User;
import com.cts.system.entity.UserInput;

@Mapper
public interface UserMapper {

	public List<User> findUserInfo(UserInput user);
	public int addUserInfo(User user);
	public int delUserInfo(int id);
}

package com.cts.system.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cts.system.entity.User;
import com.cts.system.entity.UserInput;
import com.cts.system.mapper.UserMapper;
import com.cts.system.service.UserService;

@Service
public class UserServiceImpl implements UserService{

	@Autowired
    private UserMapper userMapper;

    public List<User> getUserInfo(UserInput user ){
        return userMapper.findUserInfo(user);
    }

    //@Transactional开启事务
    @Transactional
	public void insert(User user) {
		userMapper.addUserInfo(user);
//		int i=1/0;
//		userMapper.addUserInfo(user);
		
	}
}

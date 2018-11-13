package com.cts.system.service;

import java.util.List;

import com.cts.system.entity.User;
import com.cts.system.entity.UserInput;

public interface UserService {
    public List<User> getUserInfo(UserInput user);
    
    public void insert(User user);
    public User findByUserMobile(String username);
    public User findUserById(String  id);
}

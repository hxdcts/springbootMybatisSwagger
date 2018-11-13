package com.cts.system.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.cts.system.entity.User;
import com.cts.system.entity.UserInput;
import com.cts.system.mapper.UserMapper;
import com.cts.system.redis.pool.sentinel.JedisSentinelPool;
import com.cts.system.service.UserRedisService;
import com.cts.system.service.UserService;
import com.cts.system.service.mq.UserMqService;

import redis.clients.jedis.ShardedJedis;

@Service
public class UserServiceImpl implements UserService{

	@Autowired
    private UserMapper userMapper;
	@Autowired
	JedisSentinelPool jedisSentinelPool;
	@Autowired
	UserMqService userMqService;
	@Autowired
	UserRedisService redisService;
	
    public List<User> getUserInfo(UserInput user ){
    	userMqService.send(user);
		final ShardedJedis jedis = jedisSentinelPool.getResource();
    	List<User> list = userMapper.findUserInfo(user);
		jedis.set("user:info:id", user.getName());
		list.forEach(u->{
			jedis.lpush("user:info", u.getId()+"");
		});
		redisService.setUser(user);
        return list;
    }

    //@Transactional开启事务
    @Transactional
	public void insert(User user) {
		userMapper.addUserInfo(user);
//		int i=1/0;
//		userMapper.addUserInfo(user);
		
	}
    
    public User findByUserMobile(String username) {
    	User managerInfo = userMapper.findByUserMobile(username);
        if (managerInfo == null) {
            return null;
        }
        return managerInfo;
    }
    public User findUserById(String  id){
    	return userMapper.findUserById(id);
    }
}

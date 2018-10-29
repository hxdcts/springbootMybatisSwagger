package com.cts.system.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.cts.system.config.redis.sentinel.JedisSentinelPool;
import com.cts.system.entity.User;
import com.cts.system.entity.UserInput;
import com.cts.system.entity.UserOut;
import com.cts.system.service.UserService;
import io.swagger.annotations.ApiOperation;
import redis.clients.jedis.ShardedJedis;
  
@RestController  
@RequestMapping("/user")  
public class UserController {  
	@Autowired
	private UserService userService;
	
	@RequestMapping(value="/getUserInfo", method = RequestMethod.POST)
    @ApiOperation(value="用户查询")
	public UserOut<User> getUserInfo(@RequestBody UserInput u) {
		UserOut<User> userOut = new UserOut<User>();
		List<User> user = userService.getUserInfo(u);
		userOut.setList(user);
		userOut.setRetCode("成功");
        return userOut;
    }
	/**
	 * @return
	 */
	@RequestMapping(value="/addUserInfo", method = RequestMethod.POST)
    public UserOut<User> addUserInfo(@RequestBody UserInput u) {
		User user = new User();
		UserOut<User> userOut = new UserOut<>();
		user.setId(u.getId());
		user.setName(u.getName());
		userService.insert(user);
		createOut(userOut,user);
        return userOut;
    }
	private void createOut(UserOut<User> userOut,User user){
		List<User> list = new ArrayList<User>();
		list.add(user);
		userOut.setList(list);
		userOut.setRetCode("success");
		userOut.setRetMsg("成功");
		userOut.setTransTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
	}
	
	
}  

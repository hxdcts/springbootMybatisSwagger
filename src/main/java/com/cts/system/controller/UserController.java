package com.cts.system.controller;

import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.digest.Md5Crypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.cts.system.annotation.UserLoginToken;
import com.cts.system.entity.User;
import com.cts.system.entity.UserInput;
import com.cts.system.entity.UserOut;
import com.cts.system.jwt.JwtUtils;
import com.cts.system.service.UserService;
import io.swagger.annotations.ApiOperation;
  
@RestController  
@RequestMapping("/user")  
public class UserController {  
	@Autowired
	private UserService userService;
	
	@RequestMapping(value="/getUserInfo", method = RequestMethod.POST)
    @ApiOperation(value="用户查询")
	@UserLoginToken(required=true)
	public UserOut<User> getUserInfo(@RequestBody UserInput u,HttpServletRequest request) {
		String token = request.getHeader("token");
		UserOut<User> userOut = new UserOut<User>();
		List<User> list = userService.getUserInfo(u);
		userOut.setList(list);
		userOut.setRetCode("成功");
		if(list!=null && list.size()>0){
			User user =   list.get(0);
			boolean verifyResult = 	JwtUtils.verify(token, user.getName(), user.getPassword());
			userOut.setRetMsg("verifyResult = "+verifyResult);
		}

        return userOut;
    }
	/**
	 * @return
	 */
	@RequestMapping(value="/addUserInfo", method = RequestMethod.POST)
	@ApiOperation(value="用户新增")
    public UserOut<User> addUserInfo(@RequestBody UserInput u) {
		User user = new User();
		UserOut<User> userOut = new UserOut<>();
		user.setName(u.getName());
		user.setMobile(u.getMobile());
		user.setPassword(Md5Crypt.md5Crypt(u.getPassword().getBytes()));
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
	@RequestMapping(value="login",method=RequestMethod.POST)
	@ApiOperation(value="用户登录")
	public UserOut<User> login(@RequestBody UserInput input){
		UserOut<User> userOut = new UserOut<>();

		User user = userService.findByUserMobile(input.getMobile());
		if(user==null){
			userOut.setRetCode("fail");
			userOut.setRetMsg("用户信息不存在");
			return userOut;
		}
        List<User> list = new ArrayList<>();
        list.add(user);
        userOut.setList(list);
        userOut.setRetCode("success");
        userOut.setRetMsg(JwtUtils.sign(input.getName(),input.getMobile(),user.getPassword()));
        return userOut;
	}
	@RequestMapping(value="searchByMobile",method=RequestMethod.POST)
	@ApiOperation(value="用户个人查询")
	public UserOut<User> findByUserMobile(@RequestBody UserInput input) throws IllegalArgumentException, UnsupportedEncodingException{
		User user = userService.findByUserMobile(input.getMobile());
		UserOut<User> userOut = new UserOut<>();
        List<User> list = new ArrayList<>();
        list.add(user);
        userOut.setList(list);
        userOut.setRetCode("success");
        return userOut;
	}
	public static void main(String[] args) {
		System.out.println(Md5Crypt.md5Crypt("123".getBytes()));
	}
}  

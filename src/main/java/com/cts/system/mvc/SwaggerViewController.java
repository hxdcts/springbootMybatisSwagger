package com.cts.system.mvc;

import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * swagger页面跳转控制类
 *
 */
@Controller
public class SwaggerViewController {

    @RequestMapping(value = "/swagger", method = RequestMethod.GET)
    public String toSwagger(HttpServletRequest request, ModelMap modelMap) {
        modelMap.addAttribute("title", "Swagger-UI-前后端API接口文档");
        modelMap.addAttribute("projectName", "Swagger-Bootstrap-UI RESTful APIs");
        modelMap.addAttribute("projectNote", "Swagger-Bootstrap-UI RESTful APIs");
        modelMap.addAttribute("projectVersion", "1.0");
        modelMap.addAttribute("serverIp", "127.0.0.1");
        modelMap.addAttribute("serverURL", request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + "/");
        modelMap.addAttribute("onlineDebug","true");// 是否开启调试
        return "swagger-ui";
    }
}

package com.cts.system.config;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.ApiSelectorBuilder;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * Swagger 配置类
 * 启动注册bean
 */
@Configuration
@EnableSwagger2
public class SwaggerConfig {
	/**
     * 项目名字，用于Swagger简介里面，配置文件里面定义
     */
	@Value(value = "${spring.application.name}")
    private String applicationName;
	/**
     * 项目描述，用于Swagger简介里面，配置文件里面定义
     */
    @Value(value = "${spring.application.description}")
    private String applicationDesc;
    
    /**
     * 哪个包下面，配置文件里面定义
     */
    @Value(value = "${rest.basePackage}")
    private String basePackage;
    /**
     * 模块名字，配置文件里面定义
     */
    @Value(value="${rest.moduleUrl}")
    private String restModuleUrl;
    @Bean
    public Docket createRestApi() {
        ApiSelectorBuilder apiSelectorBuilder = new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo()).select();
        if (StringUtils.isNotBlank(basePackage)) {
            apiSelectorBuilder.apis(RequestHandlerSelectors.basePackage(basePackage));
        }
        return apiSelectorBuilder.paths(PathSelectors.any()).build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder().title(applicationName + " RESTful APIs").description(applicationDesc).version("1.0").build();
    }
    
    
    @Bean
    public FilterRegistrationBean<RestControllerFilter> restControllerFilterRegistration() {
        FilterRegistrationBean<RestControllerFilter> filterRegistration = new FilterRegistrationBean<>();
        RestControllerFilter restControllerFilter = new RestControllerFilter();
        if (StringUtils.isNotBlank(restModuleUrl)) {
            restControllerFilter = new RestControllerFilter();
            filterRegistration.addInitParameter("restModuleUrl", restModuleUrl);
        }
        filterRegistration.setFilter(restControllerFilter);
        filterRegistration.addUrlPatterns("/*");
        filterRegistration.setName("restControllerFilter");
        return filterRegistration;
    }
}

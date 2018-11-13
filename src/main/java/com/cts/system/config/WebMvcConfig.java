package com.cts.system.config;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.autoconfigure.http.HttpMessageConverters;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.context.support.ServletContextResource;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import org.springframework.web.servlet.handler.SimpleUrlHandlerMapping;
import org.springframework.web.servlet.resource.PathResourceResolver;
import org.springframework.web.servlet.resource.ResourceHttpRequestHandler;
import org.springframework.web.servlet.resource.ResourceResolver;
import org.springframework.web.servlet.resource.ResourceUrlProvider;
import org.springframework.web.servlet.resource.ResourceUrlProviderExposingInterceptor;

import com.alibaba.fastjson.serializer.SerializerFeature;
import com.alibaba.fastjson.support.config.FastJsonConfig;
import com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter;
import com.cts.system.interceptor.AuthenticationInterceptor;

/**
 * spring boot集成spring mvc的配置类
 *
 * @author guoguifang
 */
@Configuration
public class WebMvcConfig extends WebMvcConfigurationSupport {

    @Bean
    public HttpMessageConverters fastjsonHttpMessageConverters() {
        // 1.先定义一个convert转换消息的对象
        FastJsonHttpMessageConverter fastJsonHttpMessageConverter = new FastJsonHttpMessageConverter();

        // 2.添加fastJson的配置信息，比如：是否要格式化返回的json数据
        FastJsonConfig fastJsonConfig = new FastJsonConfig();
        fastJsonConfig.setSerializerFeatures(SerializerFeature.WriteMapNullValue, SerializerFeature.QuoteFieldNames);

        // 3.在convert中添加配置信息
        fastJsonHttpMessageConverter.setFastJsonConfig(fastJsonConfig);

        List<MediaType> supportedMediaTypes = new ArrayList<>();
        supportedMediaTypes.add(MediaType.TEXT_HTML);
        supportedMediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
        fastJsonHttpMessageConverter.setSupportedMediaTypes(supportedMediaTypes);

        // 4.将fastJsonConverter添加到HttpMessageConverters中
        return new HttpMessageConverters(fastJsonHttpMessageConverter);
    }

    @Bean
    public ResourceHttpRequestHandler resourceHttpRequestHandler() {
        ResourceHttpRequestHandler resourceHttpRequestHandler = new ResourceHttpRequestHandler();
        List<Resource> locations = new ArrayList<>();
        locations.add(new ServletContextResource(getServletContext(), "/"));
        locations.add(new ClassPathResource("META-INF/resources"));
        locations.add(new ClassPathResource("resources/"));
        locations.add(new ClassPathResource("static/"));
        locations.add(new ClassPathResource("public/"));
        resourceHttpRequestHandler.setLocations(locations);
        resourceHttpRequestHandler.setApplicationContext(getApplicationContext());
        List<ResourceResolver> resourceResolvers = new ArrayList<>();
        PathResourceResolver resourceResolver = new PathResourceResolver();
        resourceResolver.setAllowedLocations(new ServletContextResource(getServletContext(), "/"), new ClassPathResource("META-INF/resources"),
                new ClassPathResource("resources/"), new ClassPathResource("static/"), new ClassPathResource("public/"));
        resourceResolvers.add(resourceResolver);
        resourceHttpRequestHandler.setResourceResolvers(resourceResolvers);
        return resourceHttpRequestHandler;
    }

    @Bean
    public SimpleUrlHandlerMapping simpleUrlHandlerMapping(ResourceHttpRequestHandler resourceHttpRequestHandler) {
        SimpleUrlHandlerMapping simpleUrlHandlerMapping = new SimpleUrlHandlerMapping();
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("/**", resourceHttpRequestHandler);
        simpleUrlHandlerMapping.setUrlMap(map);
        ResourceUrlProvider resourceUrlProvider = new ResourceUrlProvider();
        Map<String, ResourceHttpRequestHandler> handlerMap = new LinkedHashMap<>();
        handlerMap.put("/**", resourceHttpRequestHandler);
        resourceUrlProvider.setHandlerMap(handlerMap);
        simpleUrlHandlerMapping.setInterceptors(new ResourceUrlProviderExposingInterceptor(resourceUrlProvider));
        return simpleUrlHandlerMapping;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        //将templates目录下的CSS、JS文件映射为静态资源，防止Spring把这些资源识别成thymeleaf模版
        registry.addResourceHandler("/templates/**.js").addResourceLocations("classpath:/templates/");
        registry.addResourceHandler("/templates/**.css").addResourceLocations("classpath:/templates/");
        //其他静态资源
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
    }
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authenticationInterceptor())
                .addPathPatterns("/**");   
    }
    @Bean
    public AuthenticationInterceptor authenticationInterceptor() {
        return new AuthenticationInterceptor();
    }

}

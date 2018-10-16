package com.cts.system.config;


import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * RestControllerFilter拦截器
 *
 */
public class RestControllerFilter implements Filter {

    private String restModuleUrl;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;
        String url = httpServletRequest.getRequestURI().substring(httpServletRequest.getContextPath().length());
        // restful服务都是通过post方式接入
        if (!"POST".equalsIgnoreCase(httpServletRequest.getMethod())) {
            // 当打开根地址的时候自动跳转到swagger页面
            if ("/".equals(url)) {
                httpServletResponse.sendRedirect("/swagger");
                return;
            }
             filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        // 如果POST方式调用的不是rest的服务则返回
        if (restModuleUrl == null || !url.startsWith(restModuleUrl + "/")) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        // 跳转到总控类处理request请求
        servletRequest.getRequestDispatcher(url.replace(restModuleUrl, "")).forward(servletRequest, servletResponse);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        restModuleUrl = filterConfig.getInitParameter("restModuleUrl");
    }

    @Override
    public void destroy() {
    }

}
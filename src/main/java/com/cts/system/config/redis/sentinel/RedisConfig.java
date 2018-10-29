package com.cts.system.config.redis.sentinel;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import redis.clients.jedis.JedisPoolConfig;

import java.util.List;
import java.util.Set;

/**
 * spring boot Redis缓存配置类
 *
 */
@Configuration
public class RedisConfig {

    @Value(value = "#{'${redis.masters}'.split(',')}")
    private List<String> masters;

    @Value(value = "#{'${redis.sentinels}'.split(',')}")
    private Set<String> sentinels;

    @Bean
    public JedisSentinelPool jedisSentinelPool(JedisPoolConfig jedisPoolConfig) {
    	System.out.println("========="+masters.size()+" ========="+sentinels.size());
        return new JedisSentinelPool(jedisPoolConfig, masters, sentinels);
    }

    @Bean
    @ConfigurationProperties(prefix = "redis")
    public JedisPoolConfig jedisPoolConfig() {
        return new JedisPoolConfig();
    }

}

package springbootMybatis;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.cts.system.Application;
import com.cts.system.entity.UserInput;
import com.cts.system.redis.pool.sentinel.JedisSentinelPool;
import com.cts.system.redis.pool.slave.RedisHelperImpl;
import com.cts.system.service.UserService;

import redis.clients.jedis.ShardedJedis;
@RunWith(SpringRunner.class)
@SpringBootTest(classes=Application.class)
public class TestUser {
	
	@Autowired
	private UserService userService;
	@Autowired
	 private RedisHelperImpl redisHelper;
	@Autowired
	public  JedisSentinelPool jedisSentinelPool ;

	public void testQuery(){
			UserInput input = new UserInput();
			input.setName("test");
			userService.getUserInfo(input);
			
		}
		private  ShardedJedis getShardedJedis() {
	        ShardedJedis shardedJedis = jedisSentinelPool.getResource();
	        shardedJedis.setDataSource(jedisSentinelPool);
	        return shardedJedis;
	    }
		@Test
	public void testRedis() throws InterruptedException{
			System.out.println();
			ShardedJedis shardedJedis = this.getShardedJedis();
			System.out.println("================="+shardedJedis.ttl("myZSet2"));
			System.out.println("================="+shardedJedis.hget("redis_hash", "mobile"));
			shardedJedis.set("member:user:1", "jy001");
		 try {
//			 System.out.println("================="+redisHelper.hashGet("redis_hash", "mobile"));
//			for(int i =0;i<100;i++){
//				redisHelper.hashPut("test_hash", "test"+i, i);
//				redisHelper.zset("test_set_score", "test"+i, i);
//			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}

###rabbitmq的发送和接收客户端。

1.0.2 增加设置接收端重入队列的时间间隔。
1.1.0 增加死信延迟队列的功能。
1.1.1 修改消费者接收消息异常堵塞的问题。
1.1.2 在接收消息时，如果调用处理接口异常时，也延时nackTime再重入队列。
1.1.3 在发送消息时，设置可以不传过期时间，即永不过期，以及可以设置消息持久化。
1.1.4 在接收消息时，将同步接收函数改成异步接收函数，解决多层内部异步函数出现异常捕获不到的问题。
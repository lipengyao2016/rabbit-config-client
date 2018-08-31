const amqp = require('amqplib');

const AmqpBaseClient = require('./amqpBaseClient');
const _ = require('lodash');
let co = require('co');
class AmqpLibRecvClient extends AmqpBaseClient {
    constructor(clientName,amqpServerInfo) {
        super(clientName,amqpServerInfo);

    };


    async reQueue(msg,nackTime)
    {
        let ctx = this;
        setTimeout(function () {
            console.log('AmqpLibRecvClient requeue nack msg... ');
            /** 2018/7/31 第二个参数，是否拒绝所有的消息,true拒绝所有，false拒绝当前。
             lpy-modifyed 第三个参数，是否将此消息重入队列。
             */
            ctx.channel.nack(msg, false, true);
        },nackTime);
    }

    async ack(msg)
    {
        return await  this.channel.ack(msg);
    }

    async createConsumer(queueName,recvFunc,consumerOptions)
    {
        let curConsumerOptions = {noAck: false};
        curConsumerOptions = _.extend(curConsumerOptions,consumerOptions);
        return  await this.channel.consume(queueName, recvFunc, curConsumerOptions);
    }


    /** 2018/7/30  创建接收的消费者。  设置重入队列的间隔时间。单位MS.
     lpy-modifyed  */
    async createRecverConsumer(queueName,recvFunc, context,nackTime = 3000) {

        let ctx = this;
        function onRecvMsg(msg) {
            try
            {
                let msgValue = msg.content.toString();
                //console.log("AmqpLibRecvClient->onRecvMsg  routingKey:%s  data:%s", msg.fields.routingKey, msgValue);
                co.wrap(recvFunc).call(context, msg)
                    .then(function (ret) {
                        /*                    console.log('AmqpLibRecvClient recv msg dispatch  ' + (ret ? 'success' : 'failed')
                                                + ',msgValue: ' + msgValue  );*/
                        if (ret) {
                            ctx.ack(msg);
                        }
                        else {
                            console.log('AmqpLibRecvClient recv msg dispatch  failed,msgValue: ' + msgValue);
                            ctx.reQueue(msg,nackTime);
                        }

                    });
            }
            catch(e)
            {
                console.log('AmqpLibRecvClient recv msg dispatch ,error:' + e);
                //ctx.channel.nack(msg, false, true);
                ctx.reQueue(msg,nackTime);
            }

        }

        await this.createConsumer(queueName,onRecvMsg,{});
        return true;
    };

}


module.exports = AmqpLibRecvClient;












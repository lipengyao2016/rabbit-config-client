
const _ = require('lodash');
const amqp = require('amqplib');

class AmqpBaseClient  {
    constructor(clientName,amqpServerInfo) {
        console.log('AmqpBaseClient->constructor clientName:' + clientName);

        this.amqpServer = amqpServerInfo;

        this.clientName = clientName;

        this.amqpUrl = `amqp://${this.amqpServer['user']}:${this.amqpServer['password']}@${this.amqpServer['host']}:${this.amqpServer['port']}`;

        this.conn = null;
        this.channel = null;
        this.exchangeMap = {};
        this.queueMap = {};

        let ctx = this;

        /*  ctx.client.on('started', function(data) {
              console.log('eureka has started,data' + data);
          });*/

    };

    async createConnAndChannel(channelOptions)
    {
        if(!this.conn)
        {
            this.conn = await amqp.connect(this.amqpUrl);
            this.conn.on('error', function(err) {
                console.log(`amqp base connection error client:${this.clientName} err:${err}` );
            });
        }

        if(!this.channel)
        {
            this.channel = await this.conn.createConfirmChannel();
            this.channel.on('error', function(err) {
                console.log(`amqp base channel error client:${this.clientName} err:${err}` );
            });

            this.channel.on('return', function(msg) {
                console.log(`amqp base channel client:${this.clientName} return not route msg  msg:${msg.content.toString()}` );
            });

            let defChannelOptions = {prefetchCnt:20};
            defChannelOptions = _.extend(defChannelOptions,channelOptions);

            await this.setChannelParams(defChannelOptions);
            console.log('AmqpBaseClient->checkConn, clientName:' + this.clientName +
                ' ret:' + (this.conn && this.channel ? 'success' : 'failed'));


        }

        return {connection:this.conn,channel:this.channel};
    }


    async createExchange(exchangeName,exchangeType)
    {
        if(!this.exchangeMap[exchangeName])
        {
            let exchangeOptions = {
                durable: true,
                autoDelete: false,
            };

            this.exchangeMap[exchangeName] = await this.channel.assertExchange(exchangeName, exchangeType, exchangeOptions);

            console.log('AmqpBaseClient->createExchange clientName:' + this.clientName +',exchangeName:' + exchangeName
                +',exchangeType:' + exchangeType + ',ret:' + (this.exchangeMap[exchangeName] ? 'success' : 'failed'));
        }

        return this.exchangeMap[exchangeName];
    }


    async createQueue(queueName,queueOptions)
    {
        if (!this.queueMap[queueName]) {

            let curQueueOptions = {
                durable: true,
                autoDelete: false
            };

            curQueueOptions = _.extend(curQueueOptions,queueOptions);

            this.queueMap[queueName] = await this.channel.assertQueue(queueName, curQueueOptions);

            console.log('AmqpBaseClient->createQueue clientName:' + this.clientName  +',queueName:' + queueName
                + ',ret:' + (this.queueMap[queueName] ? 'success' : 'failed'));

        }

        return true;
    }

    async bindQueue(exchangeName,queueName,routeKey)
    {
        if(!_.isEmpty(routeKey)) {

            console.log('AmqpBaseClient->bindQueue bind routekey to queue routingKey:' + routeKey
            +',queueName:' + queueName);

            return await this.channel.bindQueue(queueName, exchangeName, routeKey);
        }
        else
        {
            return false;
        }
    }





    async InitChannelAndExchange(channelOptions,exchangeName,exchangeType)
    {
        await  this.createConnAndChannel(channelOptions);
        await  this.createExchange(exchangeName,exchangeType);
        return true;
    }

    async InitQueue(exchangeName,queueName,queueOptions,routingKey)
    {
        await  this.createQueue(queueName,queueOptions);
        await  this.bindQueue(exchangeName,queueName,routingKey);
        return true;
    }

    async setChannelParams(options)
    {
        if(options && options.prefetchCnt)
        {
            return await this.channel.prefetch(options.prefetchCnt);
        }
        else
        {
            return false;
        }
    }



    async Init(exchangeName,exchangeType,routingKey,queueName,queueOptions={},channelOptions={})
    {

        /*       queueOptions = {
           deadLetterExchange:dlxExchangeName,
           deadLetterRoutingKey:dlxExchangeRoutingKey,
       };*/

        await  this.InitChannelAndExchange(channelOptions,exchangeName,exchangeType);
        await  this.InitQueue(exchangeName,queueName,queueOptions,routingKey);
        return true;
    }






}



module.exports = AmqpBaseClient;
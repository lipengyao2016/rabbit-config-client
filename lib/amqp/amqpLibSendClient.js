
const amqp = require('amqplib');

const AmqpBaseClient = require('./amqpBaseClient');
const _ = require('lodash');

class AmqpLibSendClient extends  AmqpBaseClient {
    constructor(clientName,amqpServerInfo) {
        super(clientName,amqpServerInfo);
    };


    async sendMsg(exchageName,routeKey,msgValue,expirationTime,bPersistent = true)
    {
        let ctx = this;

        let msgOptions = {
            mandatory:true,
            persistent:bPersistent,
        };
        if(!_.isEmpty(expirationTime))
        {
            msgOptions['expiration'] = expirationTime;
        }

        return await  new Promise(function (resolve, reject) {
            ctx.channel.publish(exchageName, routeKey, Buffer.from(msgValue),msgOptions,function(err, ok){
                if (err !== null)
                {
                    console.warn('AmqpBaseClient->publishMsg sendFailed !msg:%s,',msgValue);
                    reject(err);
                }
                else
                {
                    console.log('AmqpBaseClient->publishMsg send ok');
                    resolve('ok');
                }
            });

        });
    };



}



module.exports = AmqpLibSendClient;










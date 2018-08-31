const  AmqpLibSendClient= require('../amqp/amqpLibSendClient');


var args = process.argv.slice(2);
var severity = (args.length > 0) ? args[0] : 'info';
var inputMessage = args.slice(1).join(' ') || 'Hello World!';

let amqpHost = '192.168.7.26',amqpPort =5672 ,amqpUser = 'admin',amqpPwd = 'admin'
    ,exchangeName = 'name_msg_swimxx',exchangeType = 'direct',queueName = 'queue_swimxx'
    ,routeKey='swimxx';

let bDirectToQueue = false;

let amqpLibSendClient = new AmqpLibSendClient('amqpSender',amqpHost,amqpPort,amqpUser,amqpPwd);


routeKey = severity;



let i = 0;
setInterval(function() {

    let message = /*{name:'lily',index:i}*/ inputMessage + ',index:' + i;
    let msgValue = JSON.stringify(message);
    if(bDirectToQueue)
    {
        amqpLibSendClient.sendMsg('','','',queueName,msgValue).then(data=>{
            // console.log('sendmsg ok data:' + data);
        });

    }
    else
    {
        amqpLibSendClient.sendMsg(exchangeName,exchangeType,routeKey,queueName,msgValue).then(data=>{
            // console.log('sendmsg ok data:' + data);
        });
    }

    i++;
}, 1000);


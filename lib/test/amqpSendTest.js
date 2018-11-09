const  AmqpLibSendClient= require('../amqp/amqpLibSendClient');


var args = process.argv.slice(2);
var severity = (args.length > 0) ? args[0] : 'info';
var inputMessage = args.slice(1).join(' ') || 'Hello World!';


let bDirectToQueue = false;


let amqpServer = {
    host:'192.168.7.150',
    port:5672,
    user:'admin',
    password:'admin',
};

let refundMQInfo ={
    exchangeName : 'exchange_logstash',
    exchangeType : 'direct',
    routeKey : 'logstash',
    queueName : 'queue_logstash',
}


let amqpLibSendClient = new AmqpLibSendClient('amqpSender',amqpServer);
amqpLibSendClient.Init(refundMQInfo.exchangeName,refundMQInfo.exchangeType,refundMQInfo.routeKey,refundMQInfo.queueName)
    .then(data=>{
        let i = 0;
        setInterval(function() {

            let message = /*{name:'lily',index:i}*/ inputMessage + ',index:' + i;
            let msgValue = JSON.stringify(message);
            if(bDirectToQueue)
            {
                amqpLibSendClient.sendMsg('','','',refundMQInfo.queueName,msgValue).then(data=>{
                     console.log('sendmsg ok data:' + data);
                });

            }
            else
            {
                amqpLibSendClient.sendMsg(refundMQInfo.exchangeName,refundMQInfo.routeKey,msgValue).then(data=>{
                    console.log('sendmsg ok data:' + data);
                });
            }

            i++;
        }, 1000);

    });



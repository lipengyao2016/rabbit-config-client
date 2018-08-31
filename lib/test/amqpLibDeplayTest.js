const  AmqpLibSendClient= require('../amqp/amqpLibSendClient');
const  AmqpLibRecvClient= require('../amqp/amqpLibRecvClient');

let exchangeName = 'exchange_delay',dlx_exchange_name = 'exchange_dlx_delay';
let queueName = 'queue_delay',dlxQueueName='queue_dlx_delay';
let routeKey = 'info',dlxRouteKey='dlx_info';
let exchangeType = 'direct';

let amqpServer = {
    host:'192.168.7.26',
    port:5672,
    user:'admin',
    password:'admin',
};

let ctx = {name:'ddd'};
async function recvData(data) {
    console.log('recvData data:'+ JSON.stringify(data,null,2));
    return true;
    /* let context = this;

   return await  new Promise(function (resolve, reject) {
       setTimeout(function () {
           resolve(true);
       },500)
   })*/
}


let amqpLibSendClient = new AmqpLibSendClient('delayAmqpSender', amqpServer);
let amqpDlxRecvClient = new AmqpLibRecvClient('dlxDelayAmqpRecver', amqpServer);

amqpLibSendClient.Init(exchangeName, exchangeType, routeKey, queueName, {
    deadLetterExchange: dlx_exchange_name,
    deadLetterRoutingKey: dlxRouteKey,
})
/*    .then(data => {
    return amqpDlxRecvClient.Init(dlx_exchange_name, exchangeType, dlxRouteKey, dlxQueueName);
}).then(data=>{
       return amqpDlxRecvClient.createRecverConsumer(dlxQueueName, recvData, ctx);
})*/
    .then(data=>{

    let i = 0;
    setTimeout(function () {
        let message = {name: 'delayMsg20', index: i};
        amqpLibSendClient.sendMsg(exchangeName, routeKey, JSON.stringify(message), '20000').then(data => {
            console.log('sendmsg ok data:' + data);
        });
        i++;
    }, 1000);

    return true;
})

















const  AmqpLibRecvClient= require('../amqp/amqpLibRecvClient');

let amqpServer = {
    host:'192.168.7.150',
    port:5672,
    user:'admin',
    password:'admin',
};

let refundMQInfo ={
 /*   exchangeName : 'exchange_refund',
    exchangeType : 'direct',
    routeKey : 'refund_order',
    queueName : 'queue_refund',*/

    exchangeName : 'exchange_logstash',
    exchangeType : 'direct',
    routeKey : 'logstash',
    queueName : 'queue_logstash',
}

let bDirectToQueue = false;


let ctx = {name:'ddd'};
let j = 0;
async function recvData(data) {
    console.log(`recvData  ,data:${data.content.toString()},msgId:${data.properties.messageId}`);

    return true;
    /*  let context = this;

       let bRet = false;
       if(j%3 ==0)
       {
           j++;
           bRet = true;
       }
       else
       {
           j++;
           bRet =  false;
       }

       return bRet;*/

    /*  return await  new Promise(function (resolve, reject) {
          setTimeout(function () {
              //console.log('recvData handle ok...');
              resolve(bRet);
          },500)
      })
  */
    /*    let message = JSON.parse(data.content.toString());
        if (!message['retryCnt']) {
            message['retryCnt'] = 1;

            amqpLibSendClient.sendMsg('info',message).then(data=>{
                //console.log('resendmsg ok data:' + data);
            });

            return true;
        }
        else if (message['retryCnt'] < 3) {
            message['retryCnt'] = message['retryCnt'] + 1;

            amqpLibSendClient.sendMsg('info',message).then(data=>{
                //console.log('resendmsg ok data:' + data);
            });

            return true;
        }
        else {
            return true;
        }*/


}

let amqpLibRecvClient = new AmqpLibRecvClient('amqpRecver',amqpServer);
amqpLibRecvClient.Init(refundMQInfo.exchangeName,refundMQInfo.exchangeType,refundMQInfo.routeKey,refundMQInfo.queueName)
    .then(data=>{
        return amqpLibRecvClient.createRecverConsumer(refundMQInfo.queueName, recvData,ctx).then(data=>{
            console.log(' createRecverConsumer ok data:' + data);
        });
    })





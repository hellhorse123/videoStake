const cron = require('node-cron');
const shell = require('shelljs');
const http = require('http');

const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
var yandexCheckout = require('yandex-checkout')({ shopId: 'your_shopId', secretKey: 'your_secretKey' });

const callbackQiwi = require('node-qiwi-api').callbackApi;
const asyncQiwi = require('node-qiwi-api').asyncApi;

const token = '87ec90806001049d35f39a7e37891f6f';
 
const callbackWallet = new callbackQiwi(token);
const asyncWallet = new asyncQiwi(token);





/*const publicKey = '48e7qUxn9T7RyYE1MVZswX1FRSbE6iyCj2gCRwwF3Dnh5XrasNTx3BGPiMsyXQFNKQhvukniQG8RTVhYm3iPxZRZpCwhVePepa3xwLRNow9oKtSc9YD2HfQEy8vHHaYm3REmXVr2wpmhonEVeXWZboy2tnhwaqXGvsLCrft23SLA7C2AWoZyGu6D9t7cg';
const secretKey = 'eyJ2ZXJzaW9uIjoiUDJQIiwiZGF0YSI6eyJwYXlpbl9tZXJjaGFudF9zaXRlX3VpZCI6InYxczdkYS0wMCIsInVzZXJfaWQiOiI3OTI4OTAyNTI5NyIsInNlY3JldCI6IjU2NWQ1MGY1NTcyYjQ4ZWU4OTQ5NDMzYzUzZTNiMjQ2ZGM4MDZkN2M0NjIzZjgwYjdlYTRkYmZiY2E5NzlhMDUifX0=';
const qiwiApi = new QiwiBillPaymentsAPI(secretKey);

const paramsClientPay = {
    publicKey,
    amount: 3.00,
    currency: 'RUB',
    billId: '+79289025297',
    successUrl: 'https://merchant.com/payment/success?billId=893794793973'
};

const link = qiwiApi.createPaymentForm(paramsClientPay);//Ссылка для выставления счета клиенту (Клиент -> Сервер)

console.log(link);

const paramsPayouts = '';

function createPayouts(paramsPayouts){
    const ID = '31652'
    const URL = `https://edge.qiwi.com/sinap/api/v2/terms/${ID}/payments`
    
    let options = {
        host: 'https://edge.qiwi.com',
        path: '/',
        port: '1338',
        //This is the only line that is new. `headers` is an object with the headers to request
        headers: {'custom': 'Custom Header Demo works'}
      };

}*/

cron.schedule('5 * * * * *', () => {
    console.log(`Cron start ` + Date());


    /*callbackWallet.toCard({ amount: '1', comment: 'test', account: '2202201955511460' }, (err, data) => {
        if(err) {
          console.log(err);
          }
        console.log(data);
      })*/

})
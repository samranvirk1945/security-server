const axios = require('axios');
const { token } = require('morgan');
let driverServerKey = 'AAAAF2lpFpU:APA91bGbuQTa3Z6JOFwpF4yWBFN9Hoej3BiuPc3MF_nGTO1c704mtl9TnZNN5FtBAnVJnnFyLmoal4F56aLifQpmv9xtff-1wVz9SXH9cuqayl9_WVc7svHShAA2qGWcjwNKxK3J5HMp'
let clientKey = 'AAAAC3ITJGk:APA91bHnTUALtN41OmlroJm5bblfh4jL0orSkvyxTgHTgoCnIC-wc69j9_sBq56tRuPXIa09rknqkZdj_P1gmeg-7FNVMTjk6VAwTTGzVrtVSnBfWLGyWj1aNZYsbKnje-IUufuD1OdE'

const onSendNotifications = async (token, title, body, data, type) => {
    console.log(token)
    console.log(title)
    console.log(body)
    console.log(data)
    console.log(type)
    console.log(type == 2 ? clientKey : driverServerKey)
    // let sampleToken = "dT9_cC-2Rs-0PqbVAt9AeX:APA91bH72jVl-UFK27RmJn--dJcrIJklClbqzhWcphQGW6FX4_pLzviW6orPLRE4CrX-oZ07NhM8Ef5udGOol5j14CrAzXwU6PZGxWjrJSZyDltMhDIAZf65NABTxbq6AmvSW3dU5wzk"
    // let data = {
    //     "Action_name": "orderAssigned",
    //     "order_id": 1
    // }
    // let titleSample="samran you are super hero"
    // let bodySample="Jabar your are owsem"
    let notificationBody = {
        "to": token,
        "priority": "high",
        "notification": {
            "title": title,
            "body": body,
            "sound": "default",
            "icon": "myicon"
        },
        "data": data
    }
    axios.post("https://fcm.googleapis.com/fcm/send",
        notificationBody
        , {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "key=" + (type == 2 ? clientKey : driverServerKey)
            }
        })
        .then(response => {
            // console.log('----Success---------', response)
        })
        .catch(error => {
            console.log("------------------error------------------", error);
        });
    // fetch(url, fetchProperties)
    //     .then((res) => {
    //         callback(true);
    //     })
    //     .catch((error) => {
    //         console.log("Fetch Error ====>>> ", error);
    //         callback(false);
    //     });
};




module.exports = {
    onSendNotifications
}
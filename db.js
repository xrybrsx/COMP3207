const axios = require('axios');


const KEY = 'K70CRUZ6mFJIdnQqYrkM5dDJ6xO8nFfvxMqo9sycOKZ7/RievbsFyg==';
const api_login = 'https://cvlibrary.azurewebsites.net/api/user/login';
const api_register = 'https://cvlibrary.azurewebsites.net/api/user/register'

var api = {
    login: function(username, password) {

        console.log("Handling login of " + username + " password is " + password);
        return axios.get('https://cvlibrary.azurewebsites.net/api/user/login', {
            headers: { 'x-functions-key': KEY },
            params: {
                username: username,
                password: password
            }
        }).then((res) =>
            res.data
        ).then((out) => {

            return out;
        }).catch(e => {});
    },
    register: function(username, password) {

        console.log("Handling login of " + username + " password is " + password);
        return axios.get('https://cvlibrary.azurewebsites.net/api/user/register', {
            headers: { 'x-functions-key': KEY },
            params: {
                username: username,
                password: password
            }
        }).then((res) =>
            res.data
        ).then((out) => {

            return out;
        }).catch(e => {});
    }
}
module.exports = api
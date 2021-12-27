const axios = require('axios');


const KEY = 'K70CRUZ6mFJIdnQqYrkM5dDJ6xO8nFfvxMqo9sycOKZ7/RievbsFyg==';
const api_login = 'https://cvlibrary.azurewebsites.net/api/user/login';
const api_register = 'https://cvlibrary.azurewebsites.net/api/user/register'

var api = {
    login: function(email, password) {

        console.log("Handling login of " + email + " password is " + password);
        //return 
        return axios.post('https://cvlibrary.azurewebsites.net/api/user/login', {
            email: email,
            password: password
        }).then((out) => {
            return out;
        }).catch(function(error) {
            if (error.response) {
                return error.response;
            }
        });
    },

    register: function(email, password, firstName, lastName, dateOfBirth, education, address) {

        console.log(email, password, firstName, lastName, dateOfBirth, address, education);
        return axios.post('https://cvlibrary.azurewebsites.net/api/user/register', {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            education: education,
            address: address
        }).then((out) => {
            return out;
        }).catch(function(error) {
            if (error.response) {
                return error.response;
            }
        });

    }
}
module.exports = api
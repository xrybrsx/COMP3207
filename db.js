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

    register: function(email, password, firstName, lastName, dateOfBirth, gender, education, address) {

        console.log(email, password, firstName, lastName, dateOfBirth, gender, address, education);
        return axios.post('https://cvlibrary.azurewebsites.net/api/user/register', {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            education: education,
            address: address,
            gender: gender
        }).then((out) => {
            return out;
        }).catch(function(error) {
            if (error.response) {
                return error.response;
            }
        });

    },
    filter: function(jobTitle) {
        console.log(jobTitle);
        return axios.post('https://cvlibrary.azurewebsites.net/api/cv/search', {
            jobTitle: jobTitle
        }).then((out) => {
            console.log(out);
            return out;
        }).catch(function(error) {
            if (error.response) {
                console.log(error);
                return error.response;
            }
        });

    },
    upload: function(userId, jobTitle, jobOffers, cvFile) {
        console.log(userId, jobTitle, jobOffers, cvFile);
        return axios.post('http://cvlibrary.azurewebsites.net/api/cv/upload', {
            userId: userId,
            jobTitle: jobTitle,
            jobOffers: jobOffers,
            cvFile: cvFile
        }).then((out) => {
            console.log(out);
            return out;
        }).catch(function(error) {
            if (error.response) {
                console.log(error);
                return error.response;
            }
        });

    }
}
module.exports = api
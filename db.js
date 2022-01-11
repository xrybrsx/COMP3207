const axios = require('axios');
const { response } = require('express');


const KEY = 'K70CRUZ6mFJIdnQqYrkM5dDJ6xO8nFfvxMqo9sycOKZ7/RievbsFyg==';


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

    register: function(email, password, firstName, lastName, dateOfBirth, education, address, gender) {


        console.log(email, password, firstName, lastName, dateOfBirth, education, address, gender);
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
            console.log(out);
            return out;
        }).catch(function(error) {
            if (error.response) {
                return error.response;
            }
        });

    },
    filter: function(jobTitle) {
        console.log(jobTitle);
        return axios.post('https://cvlibrary.azurewebsites.net/api/cv/searchByJobTitle', {
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
    getCV: function(cvId) {
        console.log(cvId);
        return axios.post('https://cvlibrary.azurewebsites.net/api/cv/searchById', {
            cvId: cvId
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

    getCvByUserId: function(userid) {
        console.log(userid);
        return axios.post('https://cvlibrary.azurewebsites.net/api/cv/searchbyuserid', {
            userid: userid
        }).then((out) => {
            console.log("db out: " + out);
            return out;
        }).catch(err => {
            console.log("db err: " + err);
            return err.response;
        });
    },

    upload: function(data) {
        var config = {
            method: 'post',
            url: 'http://cvlibrary.azurewebsites.net/api/cv/upload',
            headers: {
                ...data.getHeaders()
            },
            data: data
        };

        return axios(config)
            .then(function(response) {
                console.log(response);
                return (response);

            })
            .catch(function(error) {
                console.log(error);
                return response;
            });

    },
    get_k_CVs: function(k) {
        console.log(k);
        return axios.post('https://cvlibrary.azurewebsites.net/api/cv/topcvs', {
            n: n


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
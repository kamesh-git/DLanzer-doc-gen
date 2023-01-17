import { show_popup_alert, hide_popup_alert } from "./popup_alert.js"

$("#username").html(sessionStorage.getItem('UserName'))
$("#useremail").html(sessionStorage.getItem('UserEmail'))
$("#logout_user").click(function(){
    sessionStorage.clear()
    location.reload()
})

const base_url = 'https://doc.dlanzer.com/laravel/public/'
const authToken = sessionStorage.getItem('token')
console.log(authToken)
if (authToken === null || authToken === 'undefined' || authToken == "") {
    window.location.href = "/sign-in.html"
}
function apirequest(method, endpoint, Body = {}) {
    return new Promise(function (resolve, reject) {
        console.log(base_url + endpoint, 'Bearer ' + authToken)
        if (method === "GET" || method === "DELETE") {
            fetch(base_url + endpoint, {
                method: method,
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).then(resp => {
                if (resp.ok) {
                    resp.json().then(data => { console.log(data); resolve(data) })
                }
                else {
                    resp.json().then(data => { console.log(data); reject(data) })
                }
            }).catch(err => { reject(err) })
        }

        else if (method === "POST" || method === "PUT") {
            fetch(base_url + endpoint, {
                method: method,
                body: JSON.stringify(Body),
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).then(resp => {
                if (resp.ok) {
                    resp.json().then(data => { console.log(data); resolve(data) })
                }
                else {
                    resp.json().then(data => { console.log(data); reject(data) })
                }
            }).catch(err => { reject(err) })
        }
    })
}
const apirequestDELETE = function (method, endpoint) {
    return new Promise(function (resolve, reject) {
        var resp;
        $.ajax({
            type: method,
            url: base_url + endpoint,
            ContentType: 'application/json',
            dataType: 'json',
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + authToken) },
            success: function (data) {
                resolve(data)
            },
            error: function (error) {
                reject(new Error(error))
            }
        });
    })
}
const apirequestPOST = function (method, endpoint, Body) {
    console.log(Body)
    return new Promise(function (resolve, reject) {
        console.log(base_url + endpoint, 'Bearer ' + authToken)
        fetch(base_url + endpoint, {
            method: 'POST',
            body: JSON.stringify(Body),
            headers: {
                'Authorization': 'Bearer ' + authToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(resp => {
            if (resp.ok) {
                resp.json().then(data => { console.log(data); resolve(data) })
            }
            else {
                resp.json().then(data => { console.log(data); reject(data) })
            }
        }).catch(err => { reject(err) })
    })
}
const apirequestPUT = function (method, endpoint, Body) {
    return new Promise(function (resolve, reject) {
        console.log(Body)
        var resp;
        $.ajax({
            type: method,
            url: base_url + endpoint,
            ContentType: 'application/json',
            dataType: 'json',
            data: Body,
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + authToken) },
            success: function (data) {
                resolve(data)
            },
            error: function (error) {
                reject(new Error(error))
            }
        });
    })
}
let mastersData, document_details;
function storeInput() {
    return new Promise(async function (resolve, reject) {
        mastersData = await apirequest("GET", "api/master").then(resp => resp, err => { hide_popup_alert(err.message, 1, 5000) })
        document_details = await apirequest("GET", "api/Document").then(resp => resp, err => { hide_popup_alert(err.message, 1, 5000) })
        // users = await apirequest("GET", "api/user").then(resp => {
        //     $("#username").text(resp)
        //     $("#useremail").text(resp)
        //     return(resp)
        // }, err => { hide_popup_alert(err.message, 1, 5000);return(null) })
        resolve("success")
    })
}

export { mastersData, document_details, apirequest, apirequestDELETE, apirequestPOST, apirequestPUT, storeInput }

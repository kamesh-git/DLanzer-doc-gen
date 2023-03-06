import { show_popup_alert, hide_popup_alert } from "./popup_alert.js"

$("#username").html(sessionStorage.getItem('UserName'))
$("#useremail").html(sessionStorage.getItem('UserEmail'))
$("#hello_username").html('Hello '+sessionStorage.getItem('UserName'))
$("#logout_user").click(function () {
    sessionStorage.clear()
    location.reload()
})
$("#change_password").submit(function (e) {
    e.preventDefault();
    const oldPassword = $(this).find("#oldPassword").val()
    const newPassword = $(this).find("#newPassword").val()
    const confirmPassword = $(this).find("#confirmPassword").val()

    if (newPassword !== confirmPassword) {
        const error_handler = `<div id="error_handler" class="mb-3">
            <p class="text-danger">Passwords did not match</p>
        </div>`
        $(this).find("#error_handler").remove()
        $(error_handler).appendTo($(this).find(".modal-body"))
        throw new Error("passwords mismatch")
    }
    show_popup_alert()
    apirequest("POST", 'api/Auth/ChangePassword', {
        OldPassword: oldPassword,
        NewPassword: newPassword,
        ConfirmPassword: confirmPassword
    }).then(resp => {
        hide_popup_alert(resp.message)
        $('#exampleModal').modal('hide')
    }, err => hide_popup_alert(err.message,1))
})

const base_url = 'https://doc.dlanzer.com/laravel/v1/public/'
const authToken = sessionStorage.getItem('token')
if (authToken === null || authToken === 'undefined' || authToken == "") {
    window.location.href = location.href.slice(0, location.href.lastIndexOf('/')) + "/sign-in.html";
}
function apirequest(method, endpoint, Body = {}) {
    return new Promise(function (resolve, reject) {
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
                    resp.json().then(data => { resolve(data) })
                }
                else {
                    if(resp.status == 401){
                        sessionStorage.clear();
                        location.reload()
                    };
                    resp.json().then(data => { reject(data) })
                }
            }).catch(err => { 
                console.log(err)
                reject(err) 
            })
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
                    resp.json().then(data => { resolve(data) })
                }
                else {
                    resp.json().then(data => { reject(data) })
                }
            }).catch(err => { reject(err) })
        }
    })
}


let mastersData, document_details;

function storeInput() {
    console.log('store input called')
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

export { mastersData, document_details, apirequest, storeInput }

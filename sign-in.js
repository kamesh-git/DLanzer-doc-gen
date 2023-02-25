import { show_popup_alert, hide_popup_alert } from './popup_alert.js'
const base_url = 'https://doc.dlanzer.com/laravel/v1/public/'

if (localStorage.getItem("token")) {
    window.location.href = location.href.slice(0, location.href.lastIndexOf('/')) + '/document.html'
}

function apirequest(method, endpoint, authToken, Body = {}) {
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
                    resp.json().then(data => { reject(data) })
                }
            }).catch(err => { reject(err) })
        }

        else if (method === "POST") {
            fetch(base_url + endpoint, {
                method: method,
                body: JSON.stringify(Body),
                headers: {
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
$("form#user_signIn").submit(function (e) {
    e.preventDefault();
    const email = $("form#user_signIn input#email").val()
    const password = $("form#user_signIn input#password").val()
    apirequest("POST", "api/Auth/Login", '', {
        UserEmail: email,
        UserPassword: password
    }).then(async (resp) => {
        localStorage.setItem("token", resp.token)

        //   save username and email
        await apirequest("GET", "api/Auth/User", resp.token).then((resp) => {
            localStorage.setItem('UserName', resp.UserName)
            localStorage.setItem('UserEmail', resp.UserEmail)
        })


        hide_popup_alert(resp.message)
        setTimeout(() => {
            location.reload()
        }, 2000);
    }, (err) => {
        hide_popup_alert(err.message, 1, 5000)
    }).catch(err => {
        hide_popup_alert(err.message, 1)
    })
    show_popup_alert()
})

export { apirequest }
import { show_popup_alert, hide_popup_alert } from './popup_alert.js'
const base_url = 'https://doc.dlanzer.com/laravel/public/'
function apirequest(method, endpoint,authToken, Body = {}) {
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
                   resp.json().then(data => { console.log(data); resolve(data) })
               }
               else {
                   resp.json().then(data => { console.log(data); reject(data) })
               }
           }).catch(err => { reject(err) })
       }
   })
}
$("form#user_signIn").submit(function (e) {
   e.preventDefault();
   const email = $("form#user_signIn input#email").val()
   const password = $("form#user_signIn input#password").val()
   apirequest("POST", "api/Auth/Login",'', {
      UserEmail: email,
      UserPassword: password
   }).then(async (resp) => {
      sessionStorage.setItem("token", resp.token)

    //   save username and email
      await apirequest("GET","api/Auth/User",resp.token).then((resp) => {
        sessionStorage.setItem('UserName',resp.UserName)
        sessionStorage.setItem('UserEmail',resp.UserEmail)
      })


      hide_popup_alert(resp.message)
      setTimeout(() => {
         window.location.href = '/document.html'
      }, 2000);
   },(err) => {
      hide_popup_alert(err.message,1,5000)
   }).catch(err => {
      console.log(err)
      hide_popup_alert(err.message, 1)
   })
   show_popup_alert()
})
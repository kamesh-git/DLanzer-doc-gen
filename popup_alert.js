const popup_alert_container = `<div style="z-index: 9999;" class="position-fixed row top-0 end-0 text-warning bg-white z-3 popup_alert">
<div class="col-md-12 m-3">
   <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
   <span class="sr-only popup_alert_msg">Loading...</span>
</div>
</div>`

function show_popup_alert(msg = 'loading...') {
    $(popup_alert_container).appendTo('body')
    $('.popup_alert .popup_alert_msg').text(msg)
}

function hide_popup_alert(msg = "Success", msg_type = 0,waiting_time=2000) {
    const text_color = ['success','danger']
    const msg_svg = [`                            <svg width="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.67 2H16.34C19.73 2 22 4.38 22 7.92V16.091C22 19.62 19.73 22 16.34 22H7.67C4.28 22 2 19.62 2 16.091V7.92C2 4.38 4.28 2 7.67 2ZM11.43 14.99L16.18 10.24C16.52 9.9 16.52 9.35 16.18 9C15.84 8.66 15.28 8.66 14.94 9L10.81 13.13L9.06 11.38C8.72 11.04 8.16 11.04 7.82 11.38C7.48 11.72 7.48 12.27 7.82 12.62L10.2 14.99C10.37 15.16 10.59 15.24 10.81 15.24C11.04 15.24 11.26 15.16 11.43 14.99Z" fill="currentColor"></path></svg>`,`                            <svg width="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">                            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4773 4.44209L21.746 17.0572C21.906 17.4338 21.976 17.7399 21.996 18.058C22.036 18.8012 21.776 19.5236 21.2661 20.0795C20.7562 20.6334 20.0663 20.9604 19.3164 21H4.6789C4.36896 20.9812 4.05901 20.9108 3.76906 20.8018C2.3193 20.2172 1.61942 18.5723 2.20932 17.1464L9.52809 4.43317C9.77804 3.98628 10.158 3.60082 10.6279 3.35309C11.9877 2.59902 13.7174 3.09447 14.4773 4.44209ZM12.8675 12.7557C12.8675 13.2314 12.4776 13.6287 11.9977 13.6287C11.5178 13.6287 11.1178 13.2314 11.1178 12.7557V9.95248C11.1178 9.47585 11.5178 9.09039 11.9977 9.09039C12.4776 9.09039 12.8675 9.47585 12.8675 9.95248V12.7557ZM11.9977 17.0176C11.5178 17.0176 11.1178 16.6202 11.1178 16.1456C11.1178 15.669 11.5178 15.2726 11.9977 15.2726C12.4776 15.2726 12.8675 15.6601 12.8675 16.1347C12.8675 16.6202 12.4776 17.0176 11.9977 17.0176Z" fill="currentColor"></path></svg>`]
    const popup_alert_container = `<div style="z-index: 9999;" class="position-fixed row top-0 end-0 text-${text_color[msg_type]} bg-white z-3 popup_alert">
<div class="col-md-12 m-3">
   <span aria-hidden="true">${msg_svg[msg_type]}</span>
   <span class="sr-only popup_alert_msg">${msg}</span>
</div>
</div>`
    $('.popup_alert').remove()
    $(popup_alert_container).appendTo('body')
    $('.popup_alert .popup_alert_msg').text(msg)
    setTimeout(() => {
        $('.popup_alert').remove()
    }, waiting_time);
}

export { show_popup_alert, hide_popup_alert }
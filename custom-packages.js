Date.prototype.toShortFormat = function () {

    const monthNames = ["January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"];

    const day = this.getDate();

    const monthIndex = this.getMonth();
    const monthName = monthNames[monthIndex];

    const year = this.getFullYear();

    if (day == 1 || day == 21 || day == 31) { return `${day}st ${monthName} ${year}`; }
    else if (day == 2 || day == 22) { return `${day}nd ${monthName} ${year}`; }
    else if (day == 3 || day == 23) { return `${day}rd ${monthName} ${year}`; }
    else { return `${day}th ${monthName} ${year}`; }
}
const DatetoOriginalFormat = function (obj) {
    let [date,month,year] = obj.split(" ")
    date = date.replace('th','').replace('st','').replace('nd','').replace('rd','')
    const monthNames = ["January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"];

    month = String(monthNames.indexOf(month))
    month = month.padStart(2,0)
     return `${year}-${month}-${date}`;
}

const a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
const b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

function priceInWords (num) {
    const number = num
    console.log(num)
    if ((num = num.toString()).length > 9) return 'overflow';
    var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return [str,parseInt(number).toLocaleString('en-IN')];
}

var newline = function () {
    return [{
        type: 'lang',
        filter: function(text) {
            return text.replace(/^( *(\d+\.  {1,4}|[\w\<\'\">\-*+])[^\n]*)\n{1}(?!\n| *\d+\. {1,4}| *[-*+] +|#|$)/gm, function(e) {
                return e.trim() + "  \n";
            })
        }
    }];
};
export {priceInWords,newline,DatetoOriginalFormat}
import { mastersData, storeInput, apirequest } from "./data.js"
import { hide_popup_alert, show_popup_alert } from "./popup_alert.js";

let putData, putID, putAPI, postData, postAPI;
const updateDataButton = `<button id="updateData" style="width: 106px;" class="btn btn-md btn-primary mt-2 mt-sm-0 ms-0 ms-sm-2 col-md-4 col-sm-3">Update</button>`

let table;
async function set_document_details_tableBody() {
    show_popup_alert()
    await storeInput()
    hide_popup_alert("Table Loaded Successfully")
    $('table').each(function () { $(this).DataTable().clear().draw() })
    table = $("#CustomerGenderTable").DataTable()
    let indexValue = 0;
    let content = []
    mastersData.CustomerGenders.map(item => {
        indexValue++;
        content.push([indexValue, item.CustomerGenderTitle, item.CustomerGenderValue, `<button style="margin: 0 20px ;"   masterType="CustomerGenders" itemValue="${item.CustomerGenderValue}" itemTitle="${item.CustomerGenderTitle}" value="${item.CustomerGenderID}" class="document_edit btn btn-secondary">Edit</button><button  class="document_delete btn btn-danger" masterType="CustomerGenders" value=${item.CustomerGenderID}>Delete</button>`])
    })
    table.rows.add(content).draw()

    table = $("#CustomerRelationshipsTable").DataTable()
    indexValue = 0;
    content = []
    mastersData.CustomerRelationships.map(item => {
        indexValue++;
        const gender = mastersData.CustomerGenders.filter(item1 => item1.CustomerGenderID == item.CustomerGenderID)[0]
        content.push([indexValue, item.CustomerRelationshipTitle, item.CustomerRelationshipValue,gender.CustomerGenderTitle, `<button style="margin: 0 20px ;"   masterType="CustomerRelationships" itemGender="${gender.CustomerGenderID}" itemValue="${item.CustomerRelationshipValue}" itemTitle="${item.CustomerRelationshipTitle}" value="${item.CustomerRelationshipID}" class="document_edit btn btn-secondary">Edit</button><button  class="document_delete btn btn-danger" masterType="CustomerRelationships" value=${item.CustomerRelationshipID}>Delete</button>`])
    })
    table.rows.add(content).draw()

    table = $("#CustomerTypeTable").DataTable()
    indexValue = 0;
    content = []
    mastersData.CustomerType.map(item => {
        indexValue++;
        content.push([indexValue, item.CustomerTypeTitle, `<button style="margin: 0 20px ;"   masterType="CustomerType" itemValue="${item.CustomerTypeTitle}" itemTitle="${item.CustomerTypeTitle}" value="${item.CustomerTypeID}" class="document_edit btn btn-secondary">Edit</button><button  class="document_delete btn btn-danger" masterType="CustomerTypes" value=${item.CustomerTypeID}>Delete</button>`])
    })
    table.rows.add(content).draw()

    table = $("#CustomerCategoryTable").DataTable()
    indexValue = 0;
    content = []
    mastersData.CustomerCategory.map(item => {
        let customertype;
        mastersData.CustomerType.forEach(item1 => { if (item1.CustomerTypeID == item.CustomerTypeID) { customertype = item1.CustomerTypeTitle } })
        indexValue++;
        content.push([indexValue, customertype, item.CustomerCategoryTitle, `<button style="margin: 0 20px ;"   masterType="CustomerCategory" itemValue="${item.CustomerTypeID}" itemTitle="${item.CustomerCategoryTitle}" value="${item.CustomerCategoryID}" class="document_edit btn btn-secondary">Edit</button><button  class="document_delete btn btn-danger" masterType="CustomerCategory" value=${item.CustomerCategoryID}>Delete</button>`])
    })
    table.rows.add(content).draw()
    eventListeners()

}

function eventListeners() {
    $(".document_edit").each(function () {
        $(this).click(function () {
            $(".add_fields").each(function () { $(this).addClass('d-none') })
            $(".update_fields").each(function () { $(this).removeClass('d-none') })
            if (this.getAttribute("masterType") == 'CustomerGenders') {
                putID = this.value
                putAPI = "CustomerGenders"
                const text = `<input type="text" dataKey="CustomerGenderValue" class="putData form-control col-sm" name="" id=""
                placeholder="Gender Value" value="${this.getAttribute('itemValue')}" /><input value="${this.getAttribute('itemTitle')}" dataKey="CustomerGenderTitle" type="text" class="putData form-control col-sm" name="" id=""
                placeholder="Gender Title" />`
                $(".update_fields_CustomerGenders").html(text)
                $(updateDataButton).appendTo(".update_fields_CustomerGenders")

            }
            if (this.getAttribute("masterType") == 'CustomerRelationships') {
                putID = this.value
                putAPI = "CustomerRelationships"
                const customerGenderID = this.getAttribute("itemGender")
                const text = `<select type="text" dataKey="CustomerGenderID" class="putData form-select col-sm" name="" id=""
                placeholder="Customer Category"><option value="">Select</option>
                ${mastersData.CustomerGenders.map(item => (`<option value="${item.CustomerGenderID}" ${item.CustomerGenderID == customerGenderID ? "selected" : ""}>${item.CustomerGenderTitle}</option>`))}
                </select><input type="text" value="${this.getAttribute('itemTitle')}" dataKey="CustomerRelationshipTitle" class="putData form-control col-sm" name="" id=""
                placeholder="Relationship Title" /><input dataKey="CustomerRelationshipValue" type="text" class="putData form-control col-sm" name="" id=""
                placeholder="Relationship Value" value="${this.getAttribute('itemValue')}" />`
                $(".update_fields_CustomerRelationships").html(text)
                $(updateDataButton).appendTo(".update_fields_CustomerRelationships")

            }
            if (this.getAttribute("masterType") == 'CustomerType') {
                putID = this.value
                putAPI = "CustomerTypes"
                const text = `<input value="${this.getAttribute('itemTitle')}" type="text" dataKey="CustomerTypeTitle" class="putData form-control col-sm" name="" id=""
                placeholder="Customer Type Title" />`
                $(".update_fields_CustomerType").html(text)
                $(updateDataButton).appendTo(".update_fields_CustomerType")
            }
            if (this.getAttribute("masterType") == 'CustomerCategory') {
                putID = this.value
                putAPI = "CustomerCategory"
                const customerTypeID = this.getAttribute('itemValue')
                const text = `<select value="${this.getAttribute('itemValue')}" type="text" dataKey="CustomerTypeID" class="putData form-select col-sm" name="" id=""
                placeholder="Customer Category"><option value="">Select</option>
                ${mastersData.CustomerType.map(item => (`<option value="${item.CustomerTypeID}" ${item.CustomerTypeID == customerTypeID ? "selected" : ""}>${item.CustomerTypeTitle}</option>`))}
                </select><input value="${this.getAttribute('itemTitle')}" type="text" dataKey="CustomerCategoryTitle" class="putData form-control col-sm" name="" id=""
                placeholder="Customer Type Title" />`
                $(".update_fields_CustomerCategory").html(text)
                $(updateDataButton).appendTo(".update_fields_CustomerCategory")
            }
            window.scrollTo(0, 0);

            $("#updateData").click(function () {
                show_popup_alert()
                putData = {}
                $(".putData").each(function () {
                    console.log(this)
                    const attr = this.getAttribute('dataKey')
                    const data = JSON.parse(`{"${attr}":"${this.value}"}`)
                    putData = { ...putData, ...data }
                })
                apirequest('PUT', `api/${putAPI}/${putID}`, putData).then(resp => {
                    hide_popup_alert(resp.message)
                    set_document_details_tableBody()
                    $(".new_data_fields").trigger('click')
                }).catch(err => { hide_popup_alert(err.message, 1, 3000) })
                // 

            })
        })
    })
    $(".document_delete").each(function () {
        $(this).click(function () {
            show_popup_alert()
            apirequest("DELETE", `api/${this.getAttribute('masterType')}/${this.value}`).then(resp => {
                $("table").each(function () {
                    $(this).DataTable().clear()
                })
                set_document_details_tableBody()
                hide_popup_alert(resp.message)
            })
        })
    })
    $(".new_data_fields").each(function () {
        $(this).click(function () {
            $(".add_fields input").each(function () { $(this).val('') })
            $(".update_fields").each(function () { $(this).addClass('d-none') })
            $(".add_fields").each(function () { $(this).removeClass('d-none') })
            window.scrollTo(0, 0);
        })
    })
    let text = '<option value="">Select Type</option>' + mastersData.CustomerType.map(item => (`<option value="${item.CustomerTypeID}">${item.CustomerTypeTitle}</option>`)).join("")
    $(".add_fields_CustomerCategory select").html(text)
    text = '<option value="">Select Type</option>' + mastersData.CustomerGenders.map(item => (`<option value="${item.CustomerGenderID}">${item.CustomerGenderTitle}</option>`)).join("")
    $(".add_fields_CustomerRelationships select").html(text)


}

$(".addData").each(function () {
    $(this).click(function () {
        postAPI = this.getAttribute('postAPI')
        postData = {} //put
        $(`.add_fields_${postAPI} input.postData,.add_fields_${postAPI} select.postData`).each(function () {
            const attr = this.getAttribute('dataKey')
            const data = JSON.parse(`{"${attr}":"${this.value}"}`)
            postData = { ...postData, ...data }
        })

        show_popup_alert()
        apirequest('POST', `api/${postAPI}`, postData).then(resp => {
            set_document_details_tableBody()
            hide_popup_alert(resp.message)
            $(".new_data_fields").trigger('click')
        }).catch(err => { hide_popup_alert(err.message, 1, 3000) })

    })
})


set_document_details_tableBody()
$(".datatable_show").each(function () {
    $(this).click(function () {
        $('.update_fields').empty()
        $(".update_fields").each(function () { $(this).addClass('d-none') })
        $(".add_fields").each(function () { $(this).removeClass('d-none') })
        $(".datatable_show").each(function () { $(this).removeClass('active') })
        $(this).addClass('active')
        $(".datatable").each(function () { $(this).removeClass('d-none') })
        $(".datatable").each(function () { $(this).addClass('d-none') })
        $(".datatable").eq(this.getAttribute('value') - 1).removeClass('d-none')
    })
})



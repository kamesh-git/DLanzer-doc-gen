import { mastersData, apirequest, storeInput } from "./data.js"
import { show_popup_alert, hide_popup_alert } from "./popup_alert.js";

let putData, putID, putAPI, postData, postAPI;
const updateDataButton = `<button id="updateData" class="btn btn-md btn-primary ms-2">Update</button>`

async function set_document_details_tableBody() {
    show_popup_alert()
    await storeInput()
    hide_popup_alert("Table Loaded Successfully")
    $('table').each(function () { $(this).DataTable().clear().draw() })
    let table = $("#DocumentLanguagesTable").DataTable()
    let indexValue = 0;
    let content = []
    mastersData.DocumentLanguages.map(item => {
        indexValue++;
        content.push([indexValue, item.DocumentLanguageTitle, `<button style="margin: 0 20px ;"   masterType="DocumentLanguages" itemValue="${item.DocumentLanguageTitle}" itemTitle="${item.DocumentLanguageTitle}" value="${item.DocumentLanguageID}" class="document_edit btn btn-secondary">Edit</button><button  class="document_delete btn btn-danger" masterType="DocumentLanguage" value=${item.DocumentLanguageID}>Delete</button>`])
    })
    table.rows.add(content).draw()

    table = $("#DocumentTemplatesTable").DataTable()
    indexValue = 0;
    content = []
    mastersData.DocumentTemplates.map(item => {
        indexValue++;
        content.push([indexValue, item.DocumentTemplateHTML, `<button style="margin: 0 20px ;"   masterType="DocumentTemplates" itemType="${item.DocumentTypeID}" itemLanguage="${item.DocumentLanguageID}" itemHTML="${item.DocumentTemplateHTML}" value="${item.DocumentTemplateID}" class="document_edit btn btn-secondary">Edit</button><button  class="document_delete btn btn-danger" masterType="DocumentTemplate" value=${item.DocumentTemplateID}>Delete</button>`])
    })
    table.rows.add(content).draw()

    table = $("#DocumentTypesTable").DataTable()
    indexValue = 0;
    content = []
    mastersData.DocumentTypes.map(item => {
        indexValue++;
        content.push([indexValue, item.DocumentTypeTitle, `<button style="margin: 0 20px ;"   masterType="DocumentTypes" itemValue="${item.DocumentTypeTitle}" itemTitle="${item.DocumentTypeTitle}" value="${item.DocumentTypeID}" class="document_edit btn btn-secondary">Edit</button><button  class="document_delete btn btn-danger" masterType="DocumentType" value=${item.DocumentTypeID}>Delete</button>`])
    })
    table.rows.add(content).draw()

    table = $("#PropertyTypesTable").DataTable()
    indexValue = 0;
    content = []
    mastersData.PropertyTypes.map(item => {
        indexValue++;
        content.push([indexValue, item.PropertyTypeTitle, `<button style="margin: 0 20px ;"   masterType="PropertyTypes" itemValue="${item.PropertyTypeTitle}" itemTitle="${item.PropertyTypeTitle}" value="${item.PropertyTypeID}" class="document_edit btn btn-secondary">Edit</button><button  class="document_delete btn btn-danger" masterType="PropertyType" value=${item.PropertyTypeID}>Delete</button>`])
    })
    table.rows.add(content).draw()
    eventListeners()


}

function eventListeners() {
    $(".document_edit").each(function () {
        $(this).click(function () {
            $(".add_fields").each(function () { $(this).addClass('d-none') })
            $(".update_fields").each(function () { $(this).removeClass('d-none') })
            $(".update_fields").each(function () { $(this).addClass('d-flex') })
            if (this.getAttribute("masterType") == 'DocumentLanguages') {
                putID = this.value
                putAPI = "DocumentLanguage"
                const text = `<input type="text" dataKey="DocumentLanguageTitle" class="putData form-control" name="" id=""
                placeholder="Document Language" value="${this.getAttribute('itemValue')}" />`
                $(".update_fields").html(text)
                $(updateDataButton).appendTo(".update_fields_DocumentLanguage")

            }
            if (this.getAttribute("masterType") == 'DocumentTemplates') {
                putID = this.value
                putAPI = "DocumentTemplate"
                const DocumentTypeID = this.getAttribute('itemType')
                const DocumentLanguageID = this.getAttribute('itemLanguage')
                const text = `
                <select value="${this.getAttribute('itemType')}" type="text" dataKey="DocumentTypeID" class="putData form-select" name="" id=""
                placeholder="Document Type"><option value="">Select</option>
                ${mastersData.DocumentTypes.map(item => (`<option value="${item.DocumentTypeID}" ${item.DocumentTypeID == DocumentTypeID ? "selected" : ""}>${item.DocumentTypeTitle}</option>`))}
                </select>
                <select value="${this.getAttribute('itemLanguage')}" type="text" dataKey="DocumentLanguageID" class="putData form-select" name="" id=""
                placeholder="Document Language"><option value="">Select</option>
                ${mastersData.DocumentLanguages.map(item => (`<option value="${item.DocumentLanguageID}" ${item.DocumentLanguageID == DocumentLanguageID ? "selected" : ""}>${item.DocumentLanguageTitle}</option>`))}
                </select>
                <input dataKey="DocumentTemplateHTML" type="text" class="putData form-control" name="" id=""
                placeholder="Template HTML" value="${this.getAttribute('itemHTML')}" />`
                $(".update_fields").html(text)
            }
            if (this.getAttribute("masterType") == 'DocumentTypes') {
                putID = this.value
                putAPI = "DocumentType"
                const text = `<input value="${this.getAttribute('itemTitle')}" type="text" dataKey="DocumentTypeTitle" class="putData form-control" name="" id=""
                placeholder="Document Type" />`
                $(".update_fields").html(text)
                $(updateDataButton).appendTo(".update_fields_DocumentType")

            }
            if (this.getAttribute("masterType") == 'PropertyTypes') {
                putID = this.value
                putAPI = "PropertyType"
                const text = `<input value="${this.getAttribute('itemTitle')}" type="text" dataKey="PropertyTypeTitle" class="putData form-control" name="" id=""
                placeholder="Customer Type Title" />`
                $(".update_fields").html(text)
                $(updateDataButton).appendTo(".update_fields_PropertyType")

            }
            window.scrollTo(0, 0);

            $("#updateData").click(function () {
                show_popup_alert()
                putData = {}
                $(".putData").each(function () {
                    const attr = this.getAttribute('dataKey')
                    const data = JSON.parse(`{"${attr}":"${this.value}"}`)
                    putData = { ...putData, ...data }
                })
                apirequest('PUT', `api/${putAPI}/${putID}`, putData).then(resp => {
                    hide_popup_alert(resp.message)
                    set_document_details_tableBody()
                }).catch(err => { hide_popup_alert(err.message, 1, 3000) })
                // 
                // })
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
    let i = 0
    
    $(".new_data_fields").each(function () {
        $(this).click(function () {
            $(".add_fields input").each(function () { $(this).val('') })
            $(".update_fields").each(function () { $(this).addClass('d-none') })
            $(".add_fields").each(function () { $(this).removeClass('d-none') })
            window.scrollTo(0, 0);
        })
    })
}
$(".addData").each(function () {
    $(this).click(function () {
        postAPI = this.getAttribute('postAPI')
        postData = {} //put
        $(`.add_fields_${postAPI} input.postData`).each(function () {
            const attr = this.getAttribute('dataKey')
            const data = JSON.parse(`{"${attr}":"${this.value}"}`)
            postData = { ...postData, ...data }
        })
        show_popup_alert()
        apirequest('POST', `api/${postAPI}`, postData).then(resp => {
            set_document_details_tableBody()
            hide_popup_alert(resp.message)
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



import { mastersData, storeInput, apirequest, document_details } from './data.js'
import { hide_popup_alert, show_popup_alert } from './popup_alert.js'

// main function starts

storeInput().then(resp => {
    setdocFields();
    inputEventListner();
    selectEventListner();
    clickEventListner();  //should be called only once
    setTable()

    // select picker styles
    $("[data-id='inputVendorMultiCompany'],[data-id='inputPurchaserMultiCompany']").each(function () {
        $(this).css({
            'background-color': 'transparent',
            'height': "58px",
            'padding-top': '24px',
            'padding-left': '17px',
            'border-radius': '0.5rem',
            'border': '1px solid #eee'
        })
    })
    $(".bootstrap-select").each(function () {
        $(this).css({
            'padding': '0',
        })
    })

})

// table js starts

Date.prototype.toShortFormat = function () {

    const monthNames = ["January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"];

    const day = this.getDate();

    const monthIndex = this.getMonth();
    const monthName = monthNames[monthIndex];

    const year = this.getFullYear();

    if (day == 1) { return `${day}st ${monthName} ${year}`; }
    else if (day == 2) { return `${day}nd ${monthName} ${year}`; }
    else if (day == 3) { return `${day}rd ${monthName} ${year}`; }
    else { return `${day}th ${monthName} ${year}`; }
}


let table = $("table#document_details_tableBody").DataTable({
    "language": {
        "zeroRecords": "Loading..."
    }
});


async function setTable() {

    await storeInput()

    $('table#document_details_tableBody').DataTable().clear().draw()
    const data = document_details.Documents.map(item => {

        const application_no = item.DocumentApplicationNo.replace("Application No. ", "")
        const new_date = new Date(item.DocumentExecutionDate)

        return [application_no, item.DocumentExecutionPlace, new_date.toShortFormat(), `<button value=${item.DocumentID} class="document_view btn btn-primary">View</button><button style="margin: 0 20px ;" value=${item.DocumentID} class="document_edit btn btn-warning">Edit</button><button class="document_delete btn btn-danger" value=${item.DocumentID}>Delete</button>`]
    })
    if (data.length) {
        table.rows.add(data).draw()
    }
    else {
        table.clear().draw()
        hide_popup_alert("No Data in the table", 1, 5000)
    }
    // table.draw()
    $(".document_view").each(function () {
        $(this).addClass('document_display_toggle')
        $("#document_display .document_edit").val(this.value)
        $(this).click(function () {
            document_details.Documents.forEach(item => {
                if (item.DocumentID == this.value) {
                    document.getElementById("deed_body_view").innerHTML = item.DocumentTemplateHTML
                }
            })
        })
    })
    $(".document_delete").each(function () {
        $(this).click(function () {
            show_popup_alert()
            apirequest("DELETE", `api/Document/${this.value}`).then(resp => {
                setTable()
                hide_popup_alert(resp.message, 0, 5000)
            })
        })
    })

    $(".download_DOC").each(function () {
        $(this).click(function () {
            var o = {
                filename: 'test.doc'
            };
            $(document).googoose(o);
        })
    })
    $(".download_PDF").each(function () {
        $(this).click(function () {
            const { jsPDF } = window.jspdf;
            var doc = new jsPDF();
            $("#hidden_use_element").html("")
            $("#deed_body_view").clone().css('width', '600px').appendTo('#hidden_use_element');
            // $('#hidden_use_element #deed_body_view *').each(function () { $(this).css('color', 'black') })
            var source = $("#hidden_use_element").html()
            console.log(source)
            doc.html(source, {
                callback: function (doc) {
                    doc.save();
                },
                autoPaging: 'text',
                margin: [12, 8, 15, 8],
                html2canvas: {
                    scale: 0.3
                }
            });
        })
    })
    tableEventListeners()

}


function tableReset() {

    $("button[name=previous]").trigger("click")



    for (let i = vendorIterationCount; i > 0; i--) {
        $("#vendorInfoRemoveClone").trigger("click")
    }
    for (let i = purchaserIterationCount; i > 0; i--) {
        $("#purchaserInfoRemoveClone").trigger("click")
    }
    for (let i = witnessIterationCount; i > 0; i--) {
        $("#witnessInfoRemoveClone").trigger("click")
    }

    $("#new_document_entry input").each(function () {
        this.value = ""
    })
    $("#new_document_entry select").each(function () {
        try {
            $(this).val("").change()
        }
        catch { }
    })
    $("#new_document_entry textarea").each(function () {
        $(this).val("")
    })
    $(".PropertyDetailsFormClone").empty()
    $(".TransferDetailsFormClone").empty()
    $(".PaymentDetailsFormClone").empty()

    $("#deed_body").html("")
    $("#save_button").text("Submit").attr('api', "POST")



}

function tableEventListeners() {

    $(".table_display_toggle").each(function () {
        $(this).click(function () {
            $("#table_display").removeClass("d-none")
            $("#document_display").addClass("d-none")
            $("#new_document_entry").addClass("d-none")
        })

    })
    $(".document_display_toggle").each(function () {
        $(this).click(function () {
            $("#table_display").addClass("d-none")
            $("#document_display").removeClass("d-none")
            $("#new_document_entry").addClass("d-none")
        })

    })
    $("#new_document_entry_toggle").click(function () {
        tableReset()
        $("#table_display").addClass("d-none")
        $("#document_display").addClass("d-none")
        $("#new_document_entry").removeClass("d-none")
    })


    $(".document_edit").each(function () {
        $(this).click(function () {
            tableReset()
            const document = document_details.Documents.filter(item => (item.DocumentID == this.value))[0]

            // cloning 
            for (let i = 1; i < document.document_vendor.length; i++) {
                $("#vendorInfoClone").trigger("click")
            }
            for (let i = 1; i < document.document_purchaser.length; i++) {
                $("#purchaserInfoClone").trigger("click")
            }
            for (let i = 1; i < document.document_witness.length; i++) {
                $("#witnessInfoClone").trigger("click")
            }

            // setting input fields
            $("#hidden_use_element").html(document.DocumentTemplateHTML)
            $("#hidden_use_element span").each(function () {
                try {
                    $(`input[deed_id=${this.getAttribute('id')}`)[0].value = this.innerHTML
                }
                catch { }
            })


            // setting select fields
            $("#inputDoucumentType").val(document.DocumentTypeID).trigger("change")
            $("#inputDoucumentLanguage").val(document.DocumentLanguageID).trigger("change")
            $("#inputApplicationNo").val(document.DocumentApplicationNo)
            $("#inputSaleDeedExecution").val(document.DocumentExecutionDate)
            $("#inputVendorType").val(document.DocumentVendorTypeID).trigger("change")
            $("#inputPurchaserType").val(document.DocumentPurchaserTypeID).trigger("change")
            $("#inputPropertyType").val(document.DocumentPropertyTypeID).trigger("change")

            document.document_vendor.forEach((item, index) => {
                $(`select[deed_id=documentVendorCategory_${index}]`).val(item.DocumentVendorCategoryID)
                $(`select[deed_id=documentFirstPersonTitle_${index}]`).val(item.DocumentVendorGenderID)
                $(`select[deed_id=documentFirstPersonRelationshipTitle_${index}]`).val(item.DocumentVendorRelationshipID)
                $(`input[deed_id=documentFirstPersonDOB_${index}]`).val(item.DocumentVendorDateOfBirth)
            })
            document.document_purchaser.forEach((item, index) => {
                $(`select[deed_id=documentSecondPersonCategory_${index}]`).val(item.DocumentPurchaserCategoryID)
                $(`select[deed_id=documentSecondPersonTitle_${index}]`).val(item.DocumentPurchaserGenderID)
                $(`select[deed_id=documentSecondPersonRelationshipTitle_${index}]`).val(item.DocumentPurchaserRelationshipID)
                $(`input[deed_id=documentSecondPersonDOB_${index}]`).val(item.DocumentPurchaserDateOfBirth)
            })
            document.document_witness.forEach((item, index) => {
                $(`select[deed_id=documentWitnessPersonTitle_${index}]`).val(item.DocumentWitnessGenderID)
                $(`select[deed_id=documentWitnessPersonRelationshipTitle_${index}]`).val(item.DocumentWitnessRelationshipID)
                $(`input[deed_id=documentWitnessPersonDOB_${index}]`).val(item.DocumentWitnessDateOfBirth)
            })


            // clone textarea fields
            for (let i = 1; i < document.property_detail.length; i++) {
                $("#clonePropertyDetailsFormInput").trigger('click')
            }
            for (let i = 1; i < document.transfer_detail.length; i++) {
                $("#cloneTransferDetailsFormInput").trigger('click')
            }
            for (let i = 1; i < document.payment_detail.length; i++) {
                $("#clonePaymentDetailsFormInput").trigger('click')
            }

            // set textarea fields
            document.property_detail.forEach((item, index) => {
                $(".property_details").eq(index).val(item.PropertyDetailContent)
            })
            document.transfer_detail.forEach((item, index) => {
                $(".transfer_details").eq(index).val(item.TransferDetailContent)
            })
            document.payment_detail.forEach((item, index) => {
                $(".payment_details").eq(index).val(item.PaymentDetailContent)
            })

            $('textarea').each(function () {
                this.style.height = 0;
                this.style.height = (this.scrollHeight) + "px";
            });

            $("#deed_body").html(document.DocumentTemplateHTML)

            $("#save_button").text("Update").attr('api', `${document.DocumentID}`)

            $("#table_display").addClass("d-none")
            $("#document_display").addClass("d-none")
            $("#new_document_entry").removeClass("d-none")
        })
    })
}


// table js ends

// document js starts
let vendorIterationCount = 0
let purchaserIterationCount = 0
let witnessIterationCount = 0
let deed_documentTemplateid, deed_content;

function setdocFields() {
    let text;

    // set Doc types
    text = `<option value="">Document Type</option>` + mastersData.DocumentTypes.map(item => (`<option value=${item.DocumentTypeID} data-token=${item.DocumentTypeTitle}>${item.DocumentTypeTitle}</option>`))
    $("#inputDoucumentType").html(text)


    // set vendor types
    text = `<option value="">Vendor type</option>` + mastersData.CustomerType.map(item => (`<option value=${item.CustomerTypeID} data-token=${item.CustomerTypeTitle}>${item.CustomerTypeTitle}</option>`)).join("")
    $("#inputVendorType").html(text)


    text = `<option value="">Title</option>` + mastersData.CustomerGenders.map(item => (`<option value=${item.CustomerGenderID} data-token="${item.CustomerGenderTitle} ${item.CustomerGenderValue}">${item.CustomerGenderValue}</option>`)).join("")
    $("#inputVendorTitle").html(text)
    $("#inputVendorRepresenterTitle").html(text)

    text = `<option value="">Title</option>` + mastersData.CustomerRelationships.map(item => (`<option value=${item.CustomerRelationshipID} data-token=${item.CustomerRelationshipValue}>${item.CustomerRelationshipValue}</option>`)).join("")
    $("#inputVendorRelationship").html(text)
    $("#inputVendorRepresenterRelationship").html(text)



    // set purchaser type

    text = `<option value="">Purchaser type</option>` + mastersData.CustomerType.map(item => (`<option value=${item.CustomerTypeID} data-token=${item.CustomerTypeTitle}>${item.CustomerTypeTitle}</option>`)).join("")
    $("#inputPurchaserType").html(text)

    text = `<option value="">Title</option>` + mastersData.CustomerGenders.map(item => (`<option value=${item.CustomerGenderID} data-token="${item.CustomerGenderTitle} ${item.CustomerGenderValue}">${item.CustomerGenderValue}</option>`)).join("")
    $("#inputPurchaserTitle").html(text)
    $("#inputPurchaserRepresenterTitle").html(text)


    text = `<option value="">Title</option>` + mastersData.CustomerRelationships.map(item => (`<option value=${item.CustomerRelationshipID} data-token=${item.CustomerRelationshipValue}>${item.CustomerRelationshipValue}</option>`)).join("")
    $("#inputPurchaserRelationship").html(text)
    $("#inputPurchaserRepresenterRelationship").html(text)

    // set witness type

    text = `<option value="">Witness type</option>` + mastersData.CustomerType.map(item => (`<option value=${item.CustomerTypeID} data-token=${item.CustomerTypeTitle}>${item.CustomerTypeTitle}</option>`)).join("")
    $("#inputWitnessType").html(text)

    text = `<option value="">Title</option>` + mastersData.CustomerGenders.map(item => (`<option value=${item.CustomerGenderID} data-token="${item.CustomerGenderTitle} ${item.CustomerGenderValue}">${item.CustomerGenderValue}</option>`)).join("")
    $("#inputWitnessTitle").html(text)

    text = `<option value="">Title</option>` + mastersData.CustomerRelationships.map(item => (`<option value=${item.CustomerRelationshipID} data-token=${item.CustomerRelationshipValue}>${item.CustomerRelationshipValue}</option>`)).join("")
    $("#inputWitnessRelationship").html(text)


    // set property type
    text = `<option value="">Property Type</option>` + mastersData.PropertyTypes.map(item => (`<option value=${item.PropertyTypeID} data-token=${item.PropertyTypeTitle}>${item.PropertyTypeTitle}</option>`))
    $("#inputPropertyType").html(text)
}



function inputEventListner() {
    function diff_years(dt2, dt1) {

        var diff = (dt1.getTime() - dt2.getTime()) / 1000;
        diff /= (60 * 60 * 24);
        console.log(diff)
        return Math.floor(Math.abs(diff / 365.25));

    }
    $("#new_document_entry input").on("input", function () {
        this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1)
        $(`#${this.getAttribute("deed_id")}`).html(this.value)
        if (this.getAttribute('type') == 'date') {
            let new_date = new Date(this.value)
            const age = diff_years(new_date, new Date())
            $(this).parent().parent().next().find('[deed_id*=Age]').val(age).trigger('input')
            $(`#${this.getAttribute("deed_id")}`).html(new_date.toShortFormat())

        }
    })

    // vendor
    $("#new_document_entry .inputVendorInfo input").on("input", function () {
        this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1)
        $(`#${this.getAttribute("deed_id")}_${vendorIterationCount}`).html(this.value)
        if (this.getAttribute('type') == 'date') {
            let new_date = new Date(this.value)
            $(`#${this.getAttribute("deed_id")}_${vendorIterationCount}`).html(new_date.toShortFormat())
        }
    })
    $("#new_document_entry .inputVendorRepresenterInfo input").on("input", function () {
        this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1)
        $(`#${this.getAttribute("deed_id")}_${vendorIterationCount}`).html(this.value)
        if (this.getAttribute('type') == 'date') {
            let new_date = new Date(this.value)
            $(`#${this.getAttribute("deed_id")}_${vendorIterationCount}`).html(new_date.toShortFormat())
        }
    }) 
    $(".inputVendorInfo select[id!=inputVendorMultiCompany]").on("change", function () {
        $(`#${this.getAttribute("deed_id")}_${vendorIterationCount}`).html(this.options[this.selectedIndex].getAttribute('data-token') || this.options[this.selectedIndex].innerHTML)
    })
    $(".inputVendorRepresenterInfo select").on("change", function () {
        $(`#${this.getAttribute("deed_id")}_${vendorIterationCount}`).html(this.options[this.selectedIndex].getAttribute('data-token') || this.options[this.selectedIndex].innerHTML)
    })

    // purchaser
    $("#new_document_entry .inputPurchaserInfo input").on("input", function () {
        this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1)
        $(`#${this.getAttribute("deed_id")}_${purchaserIterationCount}`).html(this.value)
        if (this.getAttribute('type') == 'date') {
            let new_date = new Date(this.value)
            $(`#${this.getAttribute("deed_id")}_${purchaserIterationCount}`).html(new_date.toShortFormat())
        }
    })
    $("#new_document_entry .inputPurchaserRepresenterInfo input").on("input", function () {
        this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1)
        $(`#${this.getAttribute("deed_id")}_${purchaserIterationCount}`).html(this.value)
        if (this.getAttribute('type') == 'date') {
            let new_date = new Date(this.value)
            $(`#${this.getAttribute("deed_id")}_${purchaserIterationCount}`).html(new_date.toShortFormat())
        }
    })
    $(".inputPurchaserInfo select[id!=inputPurchaserMultiCompany]").on("change", function () {
        $(`#${this.getAttribute("deed_id")}_${purchaserIterationCount}`).html(this.options[this.selectedIndex].getAttribute('data-token') || this.options[this.selectedIndex].innerHTML)
    })
    $(".inputPurchaserRepresenterInfo select").on("change", function () {
        $(`#${this.getAttribute("deed_id")}_${purchaserIterationCount}`).html(this.options[this.selectedIndex].getAttribute('data-token') || this.options[this.selectedIndex].innerHTML)
    })

    // witness
    $("#new_document_entry .inputWitnessInfo input").on("input", function () {
        this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1)
        $(`#${this.getAttribute("deed_id")}_${witnessIterationCount}`).html(this.value)
        if (this.getAttribute('type') == 'date') {
            let new_date = new Date(this.value)
            $(`#${this.getAttribute("deed_id")}_${witnessIterationCount}`).html(new_date.toShortFormat())
        }
    })

    $(".inputWitnessInfo select[id!=inputWitnessMultiCompany]").on("change", function () {
        $("#Witness_person_details_0").parent().removeClass('d-none')
        $(`#${this.getAttribute("deed_id")}_${witnessIterationCount}`).html(this.options[this.selectedIndex].getAttribute('data-token') || this.options[this.selectedIndex].innerHTML)
    })


    $("#new_document_entry input[deed_id*='Age'], #new_document_entry input[deed_id*='Phone']").each(function () {
        $(this).on("input", function () {
            this.value = this.value.slice(0, this.getAttribute('maxlength'))
        })
    })


    $("#inputVendorPan,#inputPurchaserPan,#inputWitnessPan").each(function () {
        $(this).on("input", function () {
            this.value = this.value.toUpperCase()
            $(`#${this.getAttribute("deed_id")}`).html(this.value)
        })
    })


    // gender based title
    $("#inputVendorTitle").change(function () {
        if (this.value == 2) {
            $("#inputVendorRelationship option[data-token]:odd").each(function () { $(this).removeClass('d-none') })
            $("#inputVendorRelationship option[data-token]:even").each(function () { $(this).addClass('d-none') })
        }
        if (this.value == 1) {
            $("#inputVendorRelationship option[data-token]:odd").each(function () { $(this).addClass('d-none') })
            $("#inputVendorRelationship option[data-token]:even").each(function () { $(this).removeClass('d-none') })
        }
    })
    $("#inputPurchaserTitle").change(function () {
        if (this.value == 2) {
            $("#inputPurchaserRelationship option[data-token]:odd").each(function () { $(this).removeClass('d-none') })
            $("#inputPurchaserRelationship option[data-token]:even").each(function () { $(this).addClass('d-none') })
        }
        if (this.value == 1) {
            $("#inputPurchaserRelationship option[data-token]:odd").each(function () { $(this).addClass('d-none') })
            $("#inputPurchaserRelationship option[data-token]:even").each(function () { $(this).removeClass('d-none') })
        }
    })
    $("#inputWitnessTitle").change(function () {
        if (this.value == 2) {
            $("#inputWitnessRelationship option[data-token]:odd").each(function () { $(this).removeClass('d-none') })
            $("#inputWitnessRelationship option[data-token]:even").each(function () { $(this).addClass('d-none') })
        }
        if (this.value == 1) {
            $("#inputWitnessRelationship option[data-token]:odd").each(function () { $(this).addClass('d-none') })
            $("#inputWitnessRelationship option[data-token]:even").each(function () { $(this).removeClass('d-none') })
        }
    })




    // text area input listeners

    $('textarea').each(function () {
        $(this).on('input', function () {
            this.style.height = 0;
            this.style.height = (this.scrollHeight) + "px";
        })
    });


    

}




function selectEventListner() {

    $("#inputDoucumentType").change(function () {
        const docTypeSelected = document.getElementById("inputDoucumentType").value
        const docLanguageIDs = []
        mastersData.DocumentTemplates.map(item => {
            if (item.DocumentTypeID == docTypeSelected) {
                deed_documentTemplateid = item.DocumentTemplateID
                docLanguageIDs.push(item.DocumentLanguageID)
            }
        })
        var langLists = [];
        docLanguageIDs.forEach(langID => {
            return mastersData.DocumentLanguages.forEach(item => {
                if (langID == item.DocumentLanguageID) {
                    langLists.push([item.DocumentLanguageTitle, item.DocumentLanguageID])
                }
            })
        })
        const text = `<option value="">Document Language</option>` + langLists.map(item => (`<option value="${item[1]}" data-token=${item[0]}>${item[0]}</option>`))
        $("#inputDoucumentLanguage").html(text)
    })
    $("#inputVendorType").change(function () {
        // vendorTable = []
        let text = `<option value="">Designation</option>` + mastersData.CustomerCategory.map(item => {
            if (item.CustomerTypeID == this.value) {
                return (`<option value=${item.CustomerCategoryID} data-token=${item.CustomerCategoryTitle}>${item.CustomerCategoryTitle}</option>`)
            }
            else { return "" }
        }).join("")
        $("[id=inputVendorCategory]").each(function () { $(this).html(text) })
        if (this.value == 2) {
            $("#toggleVendorRepresenter").parent().removeClass("d-none")
            $("#showVendorCompanyToggler").addClass("d-none")
            $("#vendorInfoTable_individual").removeClass("d-none")
            $("#vendorInfoTable_company").addClass("d-none")
            $("#inputVendorCategory").parent().parent().addClass('d-none')
            $("#append_vendor_clone").removeClass("d-none")
            $(".inputVendorInfo").removeClass('d-none')
            console.log($(".inputVendorInfo input[id*='Company'],.inputVendorInfo select[id*='Company']"))
            $("#company_info_vendor").addClass('d-none')
            $(".inputVendorInfo select[id*='Company']").each(function () { $(this).parent().parent().parent().addClass('d-none') })
        }
        else if (this.value == 1) {
            $(`#firstPersonRepresenterDetails_${vendorIterationCount}`).addClass('d-none')
            $(".inputVendorRepresenterInfo").addClass('d-none')    
            $("#toggleVendorRepresenter").prop('checked', false).parent().addClass("d-none")
            $("#showVendorCompanyToggler").removeClass("d-none")
            $("#vendorInfoTable_individual").addClass("d-none")
            $("#vendorInfoTable_company").removeClass("d-none")
            $("#inputVendorCategory").parent().parent().removeClass('d-none')
            $("#append_vendor_clone").removeClass("d-none")
            $(".inputVendorInfo").addClass('d-none')
            console.log($(".inputVendorInfo input[id*='Company'],.inputVendorInfo select[id*='Company']"))
            $("#company_info_vendor").removeClass('d-none')
            $(".inputVendorInfo select[id*='Company']").each(function () { $(this).parent().parent().parent().removeClass('d-none') })
        }
        else {
            $("#append_vendor_clone").addClass("d-none")
        }

    })
    $("#inputPurchaserType").change(function () {
        // purchaserTable = []
        let text = `<option value="">Designation</option>` + mastersData.CustomerCategory.map(item => {
            if (item.CustomerTypeID == this.value) {
                return (`<option value=${item.CustomerCategoryID} data-token=${item.CustomerCategoryTitle}>${item.CustomerCategoryTitle}</option>`)
            }
            else { return "" }
        }).join("")
        $("[id=inputPurchaserCategory]").each(function () { $(this).html(text) })
        if (this.value == 2) {
            $("#togglePurchaserRepresenter").parent().removeClass("d-none")
            $("#showPurchaserCompanyToggler").addClass("d-none")
            $(".inputPurchaserInfo").removeClass('d-none')
            $("#purchaserInfoTable_individual").removeClass("d-none")
            $("#purchaserInfoTable_company").addClass("d-none")
            $("#inputPurchaserCategory").parent().parent().addClass('d-none')
            $("#append_purchaser_clone").removeClass("d-none")
            console.log($(".inputPurchaserInfo input[id*='Company'],.inputPurchaserInfo select[id*='Company']"))
            $("#company_info_purchaser").addClass('d-none')
            $(".inputPurchaserInfo select[id*='Company']").each(function () { $(this).parent().parent().parent().addClass('d-none') })
        }
        else if (this.value == 1) {
            $(`#secondPersonRepresenterDetails_${purchaserIterationCount}`).addClass('d-none')
            $(".inputPurchaserRepresenterInfo").addClass('d-none')    
            $("#togglePurchaserRepresenter").prop('checked', false).parent().addClass("d-none")
            $("#showPurchaserCompanyToggler").removeClass("d-none")
            $(".inputPurchaserInfo").addClass('d-none')
            $("#purchaserInfoTable_individual").addClass("d-none")
            $("#purchaserInfoTable_company").removeClass("d-none")
            $("#inputPurchaserCategory").parent().parent().removeClass('d-none')
            $("#append_purchaser_clone").removeClass("d-none")
            console.log($(".inputPurchaserInfo input[id*='Company'],.inputPurchaserInfo select[id*='Company']"))
            $("#company_info_purchaser").removeClass('d-none')
            $(".inputPurchaserInfo select[id*='Company']").each(function () { $(this).parent().parent().parent().removeClass('d-none') })
        }
        else {
            $("#append_purchaser_clone").addClass("d-none")
        }
    })
    $("#inputDoucumentLanguage").change(function () {
        const docTypeSelected = document.getElementById("inputDoucumentType").value
        const langTypeSelected = document.getElementById("inputDoucumentLanguage").value
        mastersData.DocumentTemplates.forEach(item => {
            if (item.DocumentTypeID == docTypeSelected && item.DocumentLanguageID == langTypeSelected) {
                deed_content = item.DocumentTemplateHTML
            }
        })
        let deed_doucument_Type = $("#inputDoucumentType option:selected").text()
        deed_content = deed_content.replace("#Doucument_Type", deed_doucument_Type)
        deed_content = deed_content.replace("Apllication Number", "")
        $("#deed_body").html(deed_content)
        cloneformEventList()
    })
    
    $("#inputScheduleProp").change(function () {
        $("#deed_body #DocumentScheduleProp").text(this.value)
        $("#deed_body #DocumentSchedulePropType").text($("#inputScheduleProp option:selected").text())
    })
}




function conjuctionRefresh() {
    let length = 0
    $(".vendorConjuction").each(function () { if ($(this).parent().css('display') != 'none') { length++ } })
    if (length > 1) {
        $(".vendorPlural").text('VENDORS')
        $(".vendorConjuction").each(function (index) { this.innerHTML = `<br>${index + 1}.` })
    }
    else {
        $(".vendorPlural").text('VENDOR')
        $(".vendorConjuction").each(function (index) { this.innerHTML = '' })
    }



    length = 0
    $(".purchaserConjuction").each(function () { if ($(this).parent().css('display') != 'none') { length++ } })
    if (length > 1) {
        $(".purchaserPlural").text('PURCHASERS')
        $(".purchaserConjuction").each(function (index) { this.innerHTML = `<br>${index + 1}.` })
    }
    else {
        $(".purchaserPlural").text('PURCHASER')
        $(".purchaserConjuction").each(function (index) { this.innerHTML = '' })
    }


    length = 0
    $(".witnessConjuction").each(function () { if ($(this).parent().css('display') != 'none') { length++ } })
    if (length > 1) {
        $(".witnessConjuction").each(function (index) { this.innerHTML = `<br>${index + 1}.` })
    }
    else {
        $(".witnessConjuction").each(function (index) { this.innerHTML = '' })
    }


}


let vendorTable = []
let companyTableVendor = []
let purchaserTable = []
let companyTablePurchaser = []
let witnessTable = []


function setVendorTable(type) {
    console.log(vendorTable)
    let i = 0
    if (type == 1) {
        $("#vendorInfoTable_company tbody").html(
            vendorTable.map((item, index) => {
                if (item != 'undefined') {
                    return (
                        `<tr>
                            <td> ${++i} </td>
                            <td>${item.DocumentVendorName}</td>
                            <td>${item.DocumentVendorCompany.map(item1 => item1.DocumentVendorCompanyName).join(',')}</td>
                            <td>${mastersData.CustomerCategory.filter(item1 => item1.CustomerCategoryID == item.DocumentVendorCategoryID)[0].CustomerCategoryTitle}</td>
                            <td>
                            <button type="button" class="edit_vendor_table btn btn-warning" value="${index}">Edit</button>
                            <button type="button" class="delete_vendor_table btn btn-danger" value="${index}">Delete</button>
                            </td>
                        </tr>`
                    )
                }
                else { return "" }
            }).join('')
        )

    }
    else if (type == 2) {
        $("#vendorInfoTable_individual tbody").html(
            vendorTable.map((item, index) => {
                if (item != 'undefined') {
                    return (
                        `<tr>
                        <td> ${++i} </td>
                        <td>${item.DocumentVendorName}</td>
                        <td>
                        <button type="button" class="edit_vendor_table btn btn-warning" value="${index}">Edit</button>
                        <button type="button" class="delete_vendor_table btn btn-danger" value="${index}">Delete</button>
                        </td>
                    </tr>`
                    )
                }
                else { return "" }
            }).join("")
        )
    }
    $(".edit_vendor_table").each(function () {
        $(this).click(function () {
            for (let key in vendorTable[this.value]) {
                $(`input[save_id = ${key}]`).val(vendorTable[this.value][key]).trigger('input')
                $(`select[save_id = ${key}]`).val(vendorTable[this.value][key]).trigger('change')
            }
            $(`#first_person_details_${this.value}`).remove()
            vendorTable = vendorTable.map((item, index) => { if (index == this.value) { return 'undefined' } else { return item } })
            setVendorTable($("#inputVendorType").val())
            console.log(vendorTable)
            conjuctionRefresh()
        })
    })
    $(".delete_vendor_table").each(function () {
        $(this).click(function () {
            vendorTable = vendorTable.map((item, index) => { if (index == this.value) { return "undefined" } else { return item } })
            $(`#first_person_details_${this.value}`).remove()
            setVendorTable($("#inputVendorType").val())
            console.log(vendorTable)
            conjuctionRefresh()
        })
    })
}
function setPurchaserTable(type) {
    console.log(purchaserTable)
    let i = 0
    if (type == 1) {
        $("#purchaserInfoTable_company tbody").html(
            purchaserTable.map((item, index) => {
                if (item != 'undefined') {
                    return (
                        `<tr>
                            <td> ${++i} </td>
                            <td>${item.DocumentPurchaserName}</td>
                            <td>${item.DocumentPurchaserCompany.map(item1 => item1.DocumentPurchaserCompanyName).join(',')}</td>
                            <td>${mastersData.CustomerCategory.filter(item1 => item1.CustomerCategoryID == item.DocumentPurchaserCategoryID)[0].CustomerCategoryTitle}</td>
                            <td>
                            <button type="button" class="edit_purchaser_table btn btn-warning" value="${index}">Edit</button>
                            <button type="button" class="delete_purchaser_table btn btn-danger" value="${index}">Delete</button>
                            </td>
                        </tr>`
                    )
                }
                else { return "" }
            }).join('')
        )

    }
    else if (type == 2) {
        $("#purchaserInfoTable_individual tbody").html(
            purchaserTable.map((item, index) => {
                if (item != 'undefined') {
                    return (
                        `<tr>
                        <td> ${++i} </td>
                        <td>${item.DocumentPurchaserName}</td>
                        <td>
                        <button type="button" class="edit_purchaser_table btn btn-warning" value="${index}">Edit</button>
                        <button type="button" class="delete_purchaser_table btn btn-danger" value="${index}">Delete</button>
                        </td>
                    </tr>`
                    )
                }
                else { return "" }
            }).join("")
        )
    }

    $(".edit_purchaser_table").each(function () {
        $(this).click(function () {
            for (let key in purchaserTable[this.value]) {
                $(`input[save_id = ${key}]`).val(purchaserTable[this.value][key]).trigger('input')
                $(`select[save_id = ${key}]`).val(purchaserTable[this.value][key]).trigger('change')
            }
            $(`#second_person_details_${this.value}`).remove()
            purchaserTable = purchaserTable.map((item, index) => { if (index == this.value) { return 'undefined' } else { return item } })
            setPurchaserTable($("#inputPurchaserType").val())
            console.log(purchaserTable)
            conjuctionRefresh()
        })
    })
    $(".delete_purchaser_table").each(function () {
        $(this).click(function () {
            purchaserTable = purchaserTable.map((item, index) => { if (index == this.value) { return "undefined" } else { return item } })
            $(`#second_person_details_${this.value}`).remove()
            setPurchaserTable($("#inputPurchaserType").val())
            console.log(purchaserTable)
            conjuctionRefresh()
        })
    })
}

function setWitnessTable() {
    $("#witnessInfoTable").html(witnessTable.map((item, index) => {
        if (item == 'undefined') { return "" }
        else {
            return (
                `<tr>
                        <th scope="row">${index + 1}</th>
                        <td>${item.DocumentWitnessName}</td>
                        <td>
                            <button type="button" class="edit_witness_table btn btn-warning" value="${index}">Edit</button>
                            <button type="button" class="delete_witness_table btn btn-danger" value="${index}">Delete</button>
                        </td>
                      </tr>
                     `
            )
        }
    }).join("")
    )

    $(".edit_witness_table").each(function () {
        $(this).click(function () {
            for (let key in witnessTable[this.value]) {
                $(`input[save_id = ${key}]`).val(witnessTable[this.value][key]).trigger('input')
                $(`select[save_id = ${key}]`).val(witnessTable[this.value][key]).trigger('change')
            }
            $(`#Witness_person_details_${this.value}`).remove()
            witnessTable = witnessTable.map((item, index) => { if (index == this.value) { return 'undefined' } else { return item } })
            setWitnessTable($("#inputWitnessType").val())
            console.log(witnessTable)
            conjuctionRefresh()
        })
    })
    $(".delete_witness_table").each(function () {
        $(this).click(function () {
            witnessTable = witnessTable.map((item, index) => { if (index == this.value) { return "undefined" } else { return item } })
            $(`#Witness_person_details_${this.value}`).remove()
            setWitnessTable($("#inputWitnessType").val())
            console.log(witnessTable)
            conjuctionRefresh()
        })
    })
}

function clickEventListner() {

    $("#save_button").click(async function () {

        const payment_detail = []
        $(".payment_details").each(async function () {
            payment_detail.push({
                PaymentDetailContent: this.value
            })
        })

        const property_detai = []
        $(".property_details").each(async function () {
            property_detai.push({
                PropertyDetailContent: this.value
            })
        })


        const transfer_detail = []
        $(".transfer_details").each(async function () {
            transfer_detail.push({
                TransferDetailContent: this.value
            })
        })


        vendorTable = vendorTable.filter(item => item != 'undefined')
        purchaserTable = purchaserTable.filter(item => item != 'undefined')
        witnessTable = witnessTable.filter(item => item != 'undefined')

        const details = {
            DocumentTypeID: parseInt(document.getElementById("inputDoucumentType").value),
            DocumentLanguageID: parseInt(document.getElementById("inputDoucumentLanguage").value),
            DocumentTemplateID: parseInt(deed_documentTemplateid),
            DocumentVendorTypeID: parseInt(document.getElementById("inputVendorType").value),
            DocumentPurchaserTypeID: parseInt(document.getElementById("inputPurchaserType").value),
            DocumentPropertyTypeID: parseInt(document.getElementById("inputPropertyType").value),
            DocumentApplicationNo: document.getElementById("inputApplicationNo").value,
            DocumentExecutionPlace: document.getElementById("inputExcutionPlace").value,
            DocumentExecutionDate: document.getElementById("inputSaleDeedExecution").value,
            DocumentTemplateHTML: document.getElementById("deed_body").innerHTML,
            document_vendor: vendorTable,
            document_purchaser: purchaserTable,
            document_witness: witnessTable,
            payment_details: payment_detail,
            property_details: property_detai,
            transfer_details: transfer_detail
        }
        console.log(details)

        function validateObject(obj) {
            if (obj instanceof Array) {
                obj.forEach(item => {
                    if (item instanceof Array || item instanceof Object) { validateObject(item) }
                    else if (item === undefined || item === null || !(!isNaN(item) || typeof item === 'string') || item === "") { hide_popup_alert('property details field is required', 1, 5000); throw new Error("Null values are present") }
                })
            }
            else if (obj instanceof Object) {
                for (let key in obj) {
                    if (obj[key] instanceof Array || obj[key] instanceof Object) { validateObject(obj[key]) }
                    else if (obj[key] === undefined || obj[key] === null || !(!isNaN(obj[key]) || typeof obj[key] === 'string') || obj[key] === "") { hide_popup_alert(`${key} field is required`, 1, 5000); throw new Error("Null values are present") }
                }
            }
        }

        for (let key in details) {
            if (details[key] instanceof Array || details[key] instanceof Object) {
                validateObject(details[key])
            }
            else if (details[key] === undefined || details[key] === null || !(!isNaN(details[key]) || typeof details[key] === 'string') || details[key] === "") { hide_popup_alert(`${key} field is required`, 1, 5000); throw new Error("Null values are present") }
        }


        show_popup_alert()
        if (this.getAttribute('api') == 'POST') {
            // apirequest("POST", "api/Document", details).then(resp => {
            //     hide_popup_alert(resp.message)
            //     setTimeout(() => {
            //         location.reload()
            //     }, 2000);
            // }, error => {
            //     hide_popup_alert(error.message)
            // })
        }
        else {
            // apirequest("POST", "api/Document", details).then(resp => {
            //     apirequest("DELETE", `api/Document/${this.getAttribute('api')}`).then(() => {
            //         hide_popup_alert("Document updated successfully")
            //         setTimeout(() => {
            //             location.reload()
            //         }, 2000);
            //     }, error => {
            //         hide_popup_alert(error.message)
            //     })
            // }, err => {
            //     hide_popup_alert(err.message)
            // })
        }
    })
    $("#DocumentVendorAddCompany").click(function () {
        let companyTableVendorTemp = {}
        $("#company_info_vendor input").each(function () {
            if (this.value == "") {
                hide_popup_alert(`${this.getAttribute('save_id')} field is required`, 1);
                throw new Error(`${this.getAttribute('save_id')} field is required`)
            }
            companyTableVendorTemp[this.getAttribute('save_id')] = this.value
        })
        companyTableVendor.push(companyTableVendorTemp)
        $("#inputVendorMultiCompany").html(companyTableVendor.map((item, index) => (`<option value="${index}">${item.DocumentVendorCompanyName}</option>`)).join(''))
        $("#inputVendorMultiCompany").selectpicker('refresh')
        $("#inputVendorMultiCompany").change(function () {
            const length = $("#inputVendorMultiCompany").val().length
            if (length) {
                $(`#deed_body #DocumentVendorCompanyDetails_${vendorIterationCount}`).html(
                    $("#inputVendorMultiCompany").val().map((item, index) => {
                        item = parseInt(item)
                        return (`${companyTableVendor[item]['DocumentVendorCompanyName']}, Reg No ${companyTableVendor[item]['DocumentVendorCompanyRegNo']}, ${companyTableVendor[item]['DocumentVendorCompanyAddress']} ${index == length - 1 ? '' : index == length - 2 ? ' and ' : ','}`)
                    }).join('') + 'represented by, '
                )
            }
            else { $(`#deed_body #DocumentVendorCompanyDetails_${vendorIterationCount}`).html('') }
        })
        $("#company_info_vendor input").each(function () { this.value = "" })
        $("#inputVendorMultiCompany").selectpicker('refresh')
        $("#vendorCompanyTable tbody").html(companyTableVendor.map((item,index) => `<tr> <td>${index+1}</td>
        ${Object.values(item).map(item1 => (
            `<td> ${item1} </td>`
        ))}
         </tr>`))
    })
    $("#vendorInfoClone").click(function () {
        const vendorTableTemp = {}
        $(".inputVendorInfo select:not(.inputVendorRepresenterInfo select),.inputVendorInfo input:not(.inputVendorRepresenterInfo input)[type!=checkbox]").each(function () {
            if ($(this).val() === "") {
                if (!($("#inputVendorType").val() == 2 && this.getAttribute('id') == 'inputVendorCategory')) {
                    hide_popup_alert(`${this.getAttribute('save_id')} field is required`, 1);
                    throw new Error(`${this.getAttribute('save_id')} field is required`)
                }
            }
            else if (this.getAttribute("id") !== 'inputVendorMultiCompany') {
                vendorTableTemp[this.getAttribute('save_id')] = $(this).val()
            }
            else {
                if ($("#inputVendorType").val() == 1) {
                    if (!$(this).val().length) { hide_popup_alert(`${this.getAttribute('save_id')} field is required`, 1); throw new Error(`${this.getAttribute('save_id')} field is required`) }
                    vendorTableTemp['DocumentVendorCompany'] = []
                    $(this).val().forEach((item, index) => {
                        vendorTableTemp['DocumentVendorCompany'].push(companyTableVendor[parseInt(item)])
                    })
                }
            }
        })
        vendorIterationCount += 1;
        console.log(vendorIterationCount)



        vendorTable[vendorIterationCount - 1] = vendorTableTemp

        setVendorTable($("#inputVendorType").val())
        console.log('vendorinfoclone')



        console.log(vendorTable)



        $('#hidden_use_element').html(deed_content)
        $('#hidden_use_element').html($('#hidden_use_element #first_person_details_0').html())
        $("#hidden_use_element span").each(function () {
            let changeid = this.getAttribute('id')
            changeid = changeid.slice(0, changeid.indexOf('_')) + `_${vendorIterationCount}`
            this.setAttribute('id', changeid)
        })
        let text = `<span id='first_person_details_${vendorIterationCount}' style="display:none;">${$("#hidden_use_element").html()}</span>`
        $(text).insertAfter(`#deed_body #first_person_details_${vendorIterationCount - 1}`)
        $("#append_vendor_clone input,#append_vendor_clone select").each(function () { this.value = "" })
        $("#inputVendorMultiCompany").selectpicker('refresh')
        inputEventListner()
        conjuctionRefresh()
        $("#inputVendorTitle").change(function () { $(`#first_person_details_${vendorIterationCount}`).css("display", ""); conjuctionRefresh() })
        


    }
    )
    $("#DocumentPurchaserAddCompany").click(function () {
        let companyTablePurchaserTemp = {}
        $("#company_info_purchaser input").each(function () {
            if (this.value == "") {
                hide_popup_alert(`${this.getAttribute('save_id')} field is required`, 1);
                throw new Error(`${this.getAttribute('save_id')} field is required`)
            }
            companyTablePurchaserTemp[this.getAttribute('save_id')] = this.value
        })
        companyTablePurchaser.push(companyTablePurchaserTemp)
        $("#inputPurchaserMultiCompany").html(companyTablePurchaser.map((item, index) => (`<option value="${index}">${item.DocumentPurchaserCompanyName}</option>`)).join(''))
        $("#inputPurchaserMultiCompany").selectpicker('refresh')
        $("#inputPurchaserMultiCompany").change(function () {
            const length = $("#inputPurchaserMultiCompany").val().length
            if (length) {
                $(`#deed_body #DocumentPurchaserCompanyDetails_${purchaserIterationCount}`).html(
                    $("#inputPurchaserMultiCompany").val().map((item, index) => {
                        item = parseInt(item)
                        return (`${companyTablePurchaser[item]['DocumentPurchaserCompanyName']}, Reg No ${companyTablePurchaser[item]['DocumentPurchaserCompanyRegNo']}, ${companyTablePurchaser[item]['DocumentPurchaserCompanyAddress']}${index == length - 1 ? '' : index == length - 2 ? ' and ' : ','} `)
                    }).join('') + 'represented by, '
                )
            }
            else { $(`#deed_body #DocumentPurchaserCompanyDetails_${purchaserIterationCount}`).html('') }
        })

        $("#purchaserCompanyTable tbody").html(companyTablePurchaser.map((item,index) => `<tr> <td>${index+1}</td>
        ${Object.values(item).map(item1 => (
            `<td> ${item1} </td>`
        ))}
         </tr>`))

        $("#company_info_purchaser input").each(function () { this.value = "" })
    })
    $("#purchaserInfoClone").click(function () {
        const purchaserTableTemp = {}



        $(".inputPurchaserInfo select:not(.inputPurchaserRepresenterInfo select),.inputPurchaserInfo input:not(.inputPurchaserRepresenterInfo input)[type!=checkbox]").each(function () {
            if ($(this).val() === "") {
                if (!($("#inputPurchaserType").val() == 2 && this.getAttribute('id') == 'inputPurchaserCategory')) {
                    hide_popup_alert(`${this.getAttribute('save_id')} field is required`, 1);
                    throw new Error(`${this.getAttribute('save_id')} field is required`)
                }
            }
            else if (this.getAttribute("id") !== 'inputPurchaserMultiCompany') {
                purchaserTableTemp[this.getAttribute('save_id')] = $(this).val()
            }
            else {
                if ($("#inputPurchaserType").val() == 1) {
                    if (!$(this).val().length) { hide_popup_alert(`${this.getAttribute('save_id')} field is required`, 1); throw new Error(`${this.getAttribute('save_id')} field is required`) }
                    purchaserTableTemp['DocumentPurchaserCompany'] = []
                    $(this).val().forEach(item => {
                        purchaserTableTemp['DocumentPurchaserCompany'].push(companyTablePurchaser[parseInt(item)])
                    })
                }
            }
        })
        purchaserIterationCount += 1;


        purchaserTable[purchaserIterationCount - 1] = purchaserTableTemp


        console.log(purchaserTable)

        setPurchaserTable($("#inputPurchaserType").val())



        console.log(purchaserTable)


        $('#hidden_use_element').html(deed_content)
        $('#hidden_use_element').html($('#hidden_use_element #second_person_details_0').html())
        $("#hidden_use_element span").each(function () {
            let changeid = this.getAttribute('id')
            changeid = changeid.slice(0, changeid.indexOf('_')) + `_${purchaserIterationCount}`
            this.setAttribute('id', changeid)
        })
        let text = `<span id='second_person_details_${purchaserIterationCount}' style="display: none;">${$("#hidden_use_element").html()}</span>`
        $(text).insertAfter(`#deed_body #second_person_details_${purchaserIterationCount - 1}`)
        $("#append_purchaser_clone input,#append_purchaser_clone select").each(function () { this.value = "" })
        $("#inputPurchaserMultiCompany").selectpicker('refresh')
        inputEventListner()
        conjuctionRefresh()
        $("#inputPurchaserTitle").change(function () { $(`#second_person_details_${purchaserIterationCount}`).css("display", ""); conjuctionRefresh() })

    }
    )
    $("#purchaserInfoRemoveClone").click(
        function () {
            if (purchaserIterationCount > 0) {
                $('.inputPurchaserInfo').eq(purchaserIterationCount).remove();
                $(`span#Second_person_details_${purchaserIterationCount}`).remove()
                purchaserIterationCount -= 1
                conjuctionRefresh()
            }
        }
    )
    $("#witnessInfoClone").click(
        function () {
            let witnessTableTemp = {}


            $(".inputWitnessInfo select,.inputWitnessInfo input").each(function () {
                if ($(this).val() === "") {
                    hide_popup_alert(`${this.getAttribute('save_id')} field is required`, 1);
                    throw new Error(`${this.getAttribute('save_id')} field is required`)
                }
                else {
                    witnessTableTemp[this.getAttribute('save_id')] = $(this).val()
                }
            })

            witnessIterationCount += 1;

            witnessTable[witnessIterationCount - 1] = witnessTableTemp


            console.log(witnessTable)

            setWitnessTable()



            console.log(witnessTable)


            $('#hidden_use_element').html(deed_content)
            $('#hidden_use_element').html($('#hidden_use_element #Witness_person_details_0').html())
            $("#hidden_use_element span").each(function () {
                let changeid = this.getAttribute('id')
                changeid = changeid.slice(0, changeid.indexOf('_')) + `_${witnessIterationCount}`
                this.setAttribute('id', changeid)
            })
            let text = `<span id='Witness_person_details_${witnessIterationCount}' style="display:none;"'>${$("#hidden_use_element").html()}</span>`
            $(text).insertAfter(`#deed_body #Witness_person_details_${witnessIterationCount - 1}`)
            $(".inputWitnessInfo input,.inputWitnessInfo select").each(function () { console.log(this); this.value = "" })
            inputEventListner()
            conjuctionRefresh()
            $("#inputWitnessTitle").change(function () { $(`#Witness_person_details_${witnessIterationCount}`).css("display", ""); conjuctionRefresh() })
        }
    )
    $("#witnessInfoRemoveClone").click(
        function () {
            if (witnessIterationCount > 0) {
                $('.inputWitnessInfo').eq(witnessIterationCount).remove();
                $(`span#Witness_person_details_${witnessIterationCount}`).remove()
                witnessIterationCount -= 1
                conjuctionRefresh()
            }
        }
    )

    $(".cloneDetailsFormInput").each(function () {
        $(this).click(function () {
            let formcss = this.getAttribute('clone_id') + 'DetailsFormInput'
            let formclonecss = this.getAttribute('clone_id') + 'DetailsFormClone'
            $("." + formcss).clone().removeClass(formcss).addClass(formcss + "Clone").appendTo("." + formclonecss).find('textarea').val("");
            cloneformEventList()
        })
    })

    $(".removeCloneDetailsFormInput").each(function () {
        $(this).click(function () {
            let removeformcss = this.getAttribute('clone_id') + 'DetailsFormInputClone'
            var count = $("." + removeformcss).length;
            $("." + removeformcss).eq(count - 1).remove();
            cloneformEventList()
            $(".property_details,.transfer_details,.payment_details").each(function () { console.log(this); $(this).trigger('input') })
        })
    })

    $("#showVendorCompanyToggler #show_company_details").click(function(){
        $(".inputVendorInfo").addClass('d-none')
        $("#company_info_vendor").removeClass('d-none')

    })
    $("#showVendorCompanyToggler #show_vendor_details").click(function(){
        $(".inputVendorInfo").removeClass('d-none')
        $("#company_info_vendor").addClass('d-none')

    })
    $("#toggleVendorRepresenter").change(function(){
        $(`#firstPersonRepresenterDetails_${vendorIterationCount}`).toggleClass('d-none')
        $(".inputVendorRepresenterInfo").toggleClass('d-none')
})
    $("#showPurchaserCompanyToggler #show_company_details").click(function(){
        $(".inputPurchaserInfo").addClass('d-none')
        $("#company_info_purchaser").removeClass('d-none')

    })
    $("#showPurchaserCompanyToggler #show_purchaser_details").click(function(){
        $(".inputPurchaserInfo").removeClass('d-none')
        $("#company_info_purchaser").addClass('d-none')

    })
    $("#togglePurchaserRepresenter").change(function(){
        $(`#secondPersonRepresenterDetails_${purchaserIterationCount}`).toggleClass('d-none')
        $(".inputPurchaserRepresenterInfo").toggleClass('d-none')
})

}

function cloneformEventList() {
    $(".property_details").each(function () {
        $(this).on('input', function () {
            const text = [];
            const length = $(".property_details").length
            const schedule_title = ['of property',...'BCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')]
            $(".property_details").each(function (index) {
                text.push(`<h6 style="text-align:center;">Schedule ${length > 1 ? schedule_title[index] : 'of Property'}</h6>${this.value}`)
            })
            document.getElementById("Property_Details").innerHTML = "<p>" + text.join("<br><br>") + "</p>"
            const inputScheduleProp = []
            $(".property_details").each((index, item) => {
                inputScheduleProp.push(`<option value="${item.value}">Schedule ${length > 1 ? schedule_title[index] : 'of Property'}</option>`)
            })
            $("#inputScheduleProp").html(inputScheduleProp.join(''))
            $("#inputScheduleProp").trigger('change')
        })
    })
    $(".transfer_details").each(function () {
        $(this).on('input', function () {
            const text = [];
            $(".transfer_details").each(function () {
                text.push(this.value)
            })
            document.getElementById("transfer_details").innerHTML = "<p>" + text.join("<br><br>") + "</p>"
        })
    })
    $(".payment_details").each(function () {
        $(this).on('input', function () {
            const text = [];
            $(".payment_details").each(function () {
                text.push(this.value)
            })
            document.getElementById("payment_Details").innerHTML = "<p>" + text.join("<br><br>") + "</p>"
        })
    })
    $('textarea').each(function () {
        $(this).on('input', function () {
            this.style.height = 0;
            this.style.height = (this.scrollHeight) + "px";
        })
    });
}
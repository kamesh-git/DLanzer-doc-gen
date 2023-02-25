import { mastersData, storeInput, apirequest, document_details } from './data.js'
import { hide_popup_alert, show_popup_alert } from './popup_alert.js'
import { DatetoOriginalFormat, newline, priceInWords } from './custom-packages.js'

// main function starts
let today;
storeInput().then(resp => {
    var now = new Date();
    var month = (now.getMonth() + 1);
    var day = now.getDate();
    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;
    today = now.getFullYear() + '-' + month + '-' + day;
    setdocFields();
    inputEventListner();
    selectEventListner();
    clickEventListner();  //should be called only once
    setTable()
    // getting today's date
    document.getElementById('inputSaleDeedExecution').value = today
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
            $("#deed_body_view .d-none").remove()
            $('#deed_body_view .d-block').css('display','block')
            $("#deed_body_view h5,h6").css('font-size','20px')
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
        // tableReset()
        $("#table_display").addClass("d-none")
        $("#document_display").addClass("d-none")
        $("#new_document_entry").removeClass("d-none")
        $("#save_button").attr('api','POST').text('Save')
    })


    $(".document_edit").each(function () {
        $(this).click(function () {
            $("#new_document_entry_toggle").trigger('click')
            const doc = document_details.Documents.filter(item => item.DocumentID == this.value)[0]
            console.log(doc)
            // $("#hidden_use_element").html(doc.DocumentTemplateHTML)
            // wizard 1
            $("#inputDoucumentType").val(doc.DocumentTypeID).trigger('change')
            $("#inputDoucumentLanguage").val(doc.DocumentLanguageID).trigger('change')
            $("#inputApplicationNo").val(doc.DocumentApplicationNo)
            $("#inputExcutionPlace").val(doc.DocumentExecutionPlace)
            $("#inputSaleDeedExecution").val(doc.DocumentExecutionDate)
            $("#deed_body").html(doc.DocumentTemplateHTML)

            vendorTable = []
            companyTableVendor = []
            // vendor
            $("#deed_body [id*=first_person_details_]:not(.d-none)").each(function (index, item) {
                $("#inputVendorType").val('2').trigger('change')
                let inputvendorTemp = {}
                $(item).find('span:not([id*=Representer]):not([class*=Company]):not([id*=Company]):not([id*=Conjuction])').each(function (index1, item1) {
                    const id = item1.id.slice(0, item1.id.indexOf('_'))
                    inputvendorTemp[id] = item1.innerHTML
                })
                // vendor company
                $(item).find('[id*=DocumentVendorCompanyDetails_]').each(function (index1, item1) {
                    if ($(item1).html() != '') {
                        $("#inputVendorType").val('1').trigger('change')
                        inputvendorTemp.DocumentVendorCompany = []
                        $(item1).find('.vendorCompany').each(function (index, item2) {
                            const DocumentVendorCompanyTemp = {}
                            DocumentVendorCompanyTemp.DocumentVendorCompanyName = $(item2).find('.vendorCompanyName').text()
                            DocumentVendorCompanyTemp.DocumentVendorCompanyRegNo = $(item2).find('.vendorCompanyRegNo').text()
                            DocumentVendorCompanyTemp.DocumentVendorCompanyAddress = $(item2).find('.vendorCompanyAddress').text()
                            if (companyTableVendor == 0 || companyTableVendor.filter(item3 => item3.DocumentVendorCompanyName != DocumentVendorCompanyTemp.DocumentVendorCompanyName || item3.DocumentVendorCompanyRegNo != DocumentVendorCompanyTemp.DocumentVendorCompanyRegNo || item3.DocumentVendorCompanyAddress != DocumentVendorCompanyTemp.DocumentVendorCompanyAddress)[0]) {
                                companyTableVendor.push(DocumentVendorCompanyTemp)
                            }
                            inputvendorTemp.documentFirstPersonCategory = mastersData.CustomerCategory.filter(item => item.CustomerCategoryTitle == inputvendorTemp.documentFirstPersonCategory)[0].CustomerCategoryID
                            inputvendorTemp.DocumentVendorCompany.push(DocumentVendorCompanyTemp)
                        })
                        setVendorCompanyTable()
                        $("#inputVendorMultiCompany").html(companyTableVendor.map((item, index) => (`<option data-token="${item.DocumentVendorCompanyRegNo}" value="${index}">${item.DocumentVendorCompanyName}</option>`)).join(''))
                        $("#inputVendorMultiCompany").selectpicker('refresh')
                        $("#inputVendorMultiCompany").change(function () {
                            const length = $("#inputVendorMultiCompany").val().length
                            if (length) {
                                $(`#deed_body #DocumentVendorCompanyDetails_${vendorIterationCount}`).html(
                                    $("#inputVendorMultiCompany").val().map((item, index) => {
                                        item = parseInt(item)
                                        return (`<span class="vendorCompany"><span class="vendorCompanyName">${companyTableVendor[item]['DocumentVendorCompanyName']}</span>, Reg No <span class="vendorCompanyRegNo">${companyTableVendor[item]['DocumentVendorCompanyRegNo']}</span>, <span class="vendorCompanyAddress">${companyTableVendor[item]['DocumentVendorCompanyAddress']}</span> ${index == length - 1 ? '' : index == length - 2 ? ' and ' : ','}</span>`)
                                    }).join('') + 'represented by, '
                                )
                            }
                            else { $(`#deed_body #DocumentVendorCompanyDetails_${vendorIterationCount}`).html('') }
                        })
                    }
                })
                // vendor representer
                $(item).find('[id*=firstPersonRepresenterDetails_]:not(.d-none)').each(function (index1, item1) {
                    delete inputvendorTemp.documentFirstPersonCategory
                    $(item1).find('[id*=_]').each(function (index2, item2) {
                        const id = item2.id.slice(0, item2.id.indexOf('_'))
                        inputvendorTemp[id] = item2.innerHTML
                    })
                    inputvendorTemp.documentFirstPersonRepresenterDOB = DatetoOriginalFormat(inputvendorTemp.documentFirstPersonRepresenterDOB)
                    inputvendorTemp.documentFirstPersonRepresenterTitle = mastersData.CustomerGenders.filter(item => item.CustomerGenderValue == inputvendorTemp.documentFirstPersonRepresenterTitle)[0].CustomerGenderID
                    inputvendorTemp.documentFirstPersonRepresenterRelationshipTitle = mastersData.CustomerRelationships.filter(item => item.CustomerRelationshipValue == inputvendorTemp.documentFirstPersonRepresenterRelationshipTitle)[0].CustomerRelationshipID
                })

                inputvendorTemp.documentFirstPersonTitle = mastersData.CustomerGenders.filter(item => item.CustomerGenderValue == inputvendorTemp.documentFirstPersonTitle)[0].CustomerGenderID
                inputvendorTemp.documentFirstPersonRelationshipTitle = mastersData.CustomerRelationships.filter(item => item.CustomerRelationshipValue == inputvendorTemp.documentFirstPersonRelationshipTitle)[0].CustomerRelationshipID
                inputvendorTemp.documentFirstPersonDOB = DatetoOriginalFormat(inputvendorTemp.documentFirstPersonDOB)
                vendorTable.push(inputvendorTemp)
            })

            // purchaser
            purchaserTable = []
            companyTablePurchaser = []
            $("#deed_body [id*=second_person_details_]:not(.d-none)").each(function (index, item) {
                $("#inputPurchaserType").val('2').trigger('change')
                let inputpurchaserTemp = {}
                $(item).find('span:not([id*=Representer]):not([class*=Company]):not([id*=Company]):not([id*=Conjuction])').each(function (index1, item1) {
                    const id = item1.id.slice(0, item1.id.indexOf('_'))
                    inputpurchaserTemp[id] = item1.innerHTML
                })
                // purchaser company
                $(item).find('[id*=DocumentPurchaserCompanyDetails_]').each(function (index1, item1) {
                    if ($(item1).html() != '') {
                        $("#inputPurchaserType").val('1').trigger('change')
                        inputpurchaserTemp.DocumentPurchaserCompany = []
                        $(item1).find('.purchaserCompany').each(function (index, item2) {
                            const DocumentPurchaserCompanyTemp = {}
                            DocumentPurchaserCompanyTemp.DocumentPurchaserCompanyName = $(item2).find('.purchaserCompanyName').text()
                            DocumentPurchaserCompanyTemp.DocumentPurchaserCompanyRegNo = $(item2).find('.purchaserCompanyRegNo').text()
                            DocumentPurchaserCompanyTemp.DocumentPurchaserCompanyAddress = $(item2).find('.purchaserCompanyAddress').text()
                            if (companyTablePurchaser == 0 || companyTablePurchaser.filter(item3 => item3.DocumentPurchaserCompanyName != DocumentPurchaserCompanyTemp.DocumentPurchaserCompanyName || item3.DocumentPurchaserCompanyRegNo != DocumentPurchaserCompanyTemp.DocumentPurchaserCompanyRegNo || item3.DocumentPurchaserCompanyAddress != DocumentPurchaserCompanyTemp.DocumentPurchaserCompanyAddress)[0]) {
                                companyTablePurchaser.push(DocumentPurchaserCompanyTemp)
                            }
                            inputpurchaserTemp.documentSecondPersonCategory = mastersData.CustomerCategory.filter(item => item.CustomerCategoryTitle == inputpurchaserTemp.documentSecondPersonCategory)[0].CustomerCategoryID
                            inputpurchaserTemp.DocumentPurchaserCompany.push(DocumentPurchaserCompanyTemp)
                        })
                        setPurchaserCompanyTable()
                        $("#inputPurchaserMultiCompany").html(companyTablePurchaser.map((item, index) => (`<option data-token="${item.DocumentPurchaserCompanyRegNo}" value="${index}">${item.DocumentPurchaserCompanyName}</option>`)).join(''))
                        $("#inputPurchaserMultiCompany").selectpicker('refresh')
                        $("#inputPurchaserMultiCompany").change(function () {
                            const length = $("#inputPurchaserMultiCompany").val().length
                            if (length) {
                                $(`#deed_body #DocumentPurchaserCompanyDetails_${purchaserIterationCount}`).html(
                                    $("#inputPurchaserMultiCompany").val().map((item, index) => {
                                        item = parseInt(item)
                                        return (`<span class="purchaserCompany"><span class="purchaserCompanyName">${companyTablePurchaser[item]['DocumentPurchaserCompanyName']}</span>, Reg No <span class="purchaserCompanyRegNo">${companyTablePurchaser[item]['DocumentPurchaserCompanyRegNo']}</span>, <span class="purchaserCompanyAddress">${companyTablePurchaser[item]['DocumentPurchaserCompanyAddress']}</span>${index == length - 1 ? '' : index == length - 2 ? ' and ' : ','} `)
                                    }).join('') + 'represented by, '
                                )
                            }
                            else { $(`#deed_body #DocumentPurchaserCompanyDetails_${purchaserIterationCount}`).html('') }
                        })
                    }
                })
                // purchaser representer
                $(item).find('[id*=secondPersonRepresenterDetails_]:not(.d-none)').each(function (index1, item1) {
                    delete inputpurchaserTemp.documentSecondPersonCategory
                    $(item1).find('[id*=_]').each(function (index2, item2) {
                        const id = item2.id.slice(0, item2.id.indexOf('_'))
                        inputpurchaserTemp[id] = item2.innerHTML
                    })
                    inputpurchaserTemp.documentSecondPersonRepresenterDOB = DatetoOriginalFormat(inputpurchaserTemp.documentSecondPersonRepresenterDOB)
                    inputpurchaserTemp.documentSecondPersonRepresenterTitle = mastersData.CustomerGenders.filter(item => item.CustomerGenderValue == inputpurchaserTemp.documentSecondPersonRepresenterTitle)[0].CustomerGenderID
                    inputpurchaserTemp.documentSecondPersonRepresenterRelationshipTitle = mastersData.CustomerRelationships.filter(item => item.CustomerRelationshipValue == inputpurchaserTemp.documentSecondPersonRepresenterRelationshipTitle)[0].CustomerRelationshipID
                })
                inputpurchaserTemp.documentSecondPersonDOB = DatetoOriginalFormat(inputpurchaserTemp.documentSecondPersonDOB)
                inputpurchaserTemp.documentSecondPersonTitle = mastersData.CustomerGenders.filter(item => item.CustomerGenderValue == inputpurchaserTemp.documentSecondPersonTitle)[0].CustomerGenderID
                inputpurchaserTemp.documentSecondPersonRelationshipTitle = mastersData.CustomerRelationships.filter(item => item.CustomerRelationshipValue == inputpurchaserTemp.documentSecondPersonRelationshipTitle)[0].CustomerRelationshipID
                purchaserTable.push(inputpurchaserTemp)
            })

            // witness
            witnessTable = []
            $("#deed_body [id*=Witness_person_details_]:not(.d-none)").each(function (index, item) {
                let inputwitnessTemp = {}
                $(item).find('span:not([id*=Conjuction])').each(function (index1, item1) {
                    const id = item1.id.slice(0, item1.id.indexOf('_'))
                    inputwitnessTemp[id] = item1.innerHTML
                })
                inputwitnessTemp.documentWitnessPersonDOB = DatetoOriginalFormat(inputwitnessTemp.documentWitnessPersonDOB)
                inputwitnessTemp.documentWitnessPersonTitle = mastersData.CustomerGenders.filter(item => item.CustomerGenderValue == inputwitnessTemp.documentWitnessPersonTitle)[0].CustomerGenderID
                inputwitnessTemp.documentWitnessPersonRelationshipTitle = mastersData.CustomerRelationships.filter(item => item.CustomerRelationshipValue == inputwitnessTemp.documentWitnessPersonRelationshipTitle)[0].CustomerRelationshipID
                witnessTable.push(inputwitnessTemp)
            })

            // property
            propertyTable = []
            $("[id*=schedule_property_details_]:not(.d-none)").each(function (index, item) {
                let inputpropertyTemp = {}
                $(item).find('[id*=_]:not([id*=documentBoundedDetails_]):not([id*=documentScheduleDetails_]):not([id*=documentMeasuringDetails_])').each(function (index1, item1) {
                    const id = item1.id.slice(0, item1.id.indexOf('_'))
                    inputpropertyTemp[id] = item1.innerHTML
                })
                // schedule details
                inputpropertyTemp['property_detail'] = []
                $("[id*=documentScheduleDetails_]").each(function (index1, item1) {
                    $(item1).find('.scheduleDetails').each(function (index2, item2) {
                        inputpropertyTemp['property_detail'].push($(item2).text())
                    })
                })
                console.log(inputpropertyTemp)
                inputpropertyTemp.documentPropertyType = mastersData.PropertyTypes.filter(item => item.PropertyTypeTitle == inputpropertyTemp.documentPropertyType)[0].PropertyTypeID
                inputpropertyTemp['property_detail'].forEach((item3, index3) => {
                    if (item3 == $(`#DocumentScheduleProp_${index}`).text()) {
                        inputpropertyTemp.DocumentSchedulePropID = index3
                    }
                })
                propertyTable.push(inputpropertyTemp)
            })

            // set price
            const price = $('.DocumentPrice')[0].innerHTML.replace('Rs.', "").replace("/-", "").replaceAll(',', "")
            $('#inputPropertyPrice').val(parseInt(price))

            //  transfer details
            $("#deed_body #transfer_details span").each(function (index, item) {
                if (index > 0 > 1) {
                    $("#cloneTransferDetailsFormInput").trigger('click')
                }
            })
            $("textarea.transfer_details").each(function (index, item) {
                $(this).val($("#deed_body #transfer_details span")[index].innerHTML)
            })

            //  payment details
            $("#deed_body #payment_Details p").each(function (index, item) {
                if (index > 0 > 1) {
                    $("#clonePaymentDetailsFormInput").trigger('click')
                }
            })
            $("textarea.payment_details").each(function (index, item) {
                $(this).val($("#deed_body #payment_Details p")[index].innerHTML)
            })

            setVendorTable($("#inputVendorType").val())
            setPurchaserTable($("#inputPurchaserType").val())
            setWitnessTable()
            setPropertyTable()
            vendorIterationCount = vendorTable.length
            purchaserIterationCount = purchaserTable.length
            witnessIterationCount = witnessTable.length
            propertyIterationCount = propertyTable.length
            // console.log(vendorTable, vendorIterationCount)
            console.log(propertyTable)
            $("#inputVendorTitle").change(function () { $(`#first_person_details_${vendorIterationCount}`).removeClass("d-none"); conjuctionRefresh() })
            $("#inputPurchaserTitle").change(function () { $(`#second_person_details_${vendorIterationCount}`).removeClass("d-none"); conjuctionRefresh() })
            $("#inputWitnessTitle").change(function () { $(`#Witness_person_details_${vendorIterationCount}`).removeClass("d-none"); conjuctionRefresh() })
            $("#inputPropertyType").change(function () { $(`#schedule_property_details_${propertyIterationCount},#documentPropertySchedule_${propertyIterationCount}`).removeClass('d-none') })
            $("#save_button").attr('api','PUT').val(this.value).text('Update')
        })
    })
}


// table js ends

// document js starts
let vendorIterationCount = 0
let purchaserIterationCount = 0
let witnessIterationCount = 0
let propertyIterationCount = 0
let deed_documentTemplateid, deed_content;

function setdocFields() {
    let text;

    // set Doc types
    text = `<option value="">Document Type</option>` + mastersData.DocumentTypes.map(item => (`<option value=${item.DocumentTypeID} data-token=${item.DocumentTypeTitle}>${item.DocumentTypeTitle}</option>`))
    $("#inputDoucumentType").html(text)


    // set vendor types
    text = `<option value="">Vendor type</option>` + mastersData.CustomerType.map(item => (`<option value=${item.CustomerTypeID} data-token=${item.CustomerTypeTitle}>${item.CustomerTypeTitle}</option>`)).join("")
    $("#inputVendorType").html(text)


    text = `<option value="">Title</option>` + mastersData.CustomerGenders.map(item => (`<option value=${item.CustomerGenderID} data-token="${item.CustomerGenderTitle}">${item.CustomerGenderValue}</option>`)).join("")
    $("#inputVendorTitle").html(text)
    $("#inputVendorRepresenterTitle").html(text)

    text = `<option value="">Title</option>` + mastersData.CustomerRelationships.map(item => (`<option value=${item.CustomerRelationshipID} data-token=${item.CustomerGenderID}>${item.CustomerRelationshipValue}</option>`)).join("")
    $("#inputVendorRelationship").html(text)
    $("#inputVendorRepresenterRelationship").html(text)



    // set purchaser type

    text = `<option value="">Purchaser type</option>` + mastersData.CustomerType.map(item => (`<option value=${item.CustomerTypeID} data-token=${item.CustomerTypeTitle}>${item.CustomerTypeTitle}</option>`)).join("")
    $("#inputPurchaserType").html(text)

    text = `<option value="">Title</option>` + mastersData.CustomerGenders.map(item => (`<option value=${item.CustomerGenderID} data-token="${item.CustomerGenderTitle}">${item.CustomerGenderValue}</option>`)).join("")
    $("#inputPurchaserTitle").html(text)
    $("#inputPurchaserRepresenterTitle").html(text)


    text = `<option value="">Title</option>` + mastersData.CustomerRelationships.map(item => (`<option value=${item.CustomerRelationshipID} data-token=${item.CustomerGenderID}>${item.CustomerRelationshipValue}</option>`)).join("")
    $("#inputPurchaserRelationship").html(text)
    $("#inputPurchaserRepresenterRelationship").html(text)

    // set witness type

    text = `<option value="">Witness type</option>` + mastersData.CustomerType.map(item => (`<option value=${item.CustomerTypeID} data-token=${item.CustomerTypeTitle}>${item.CustomerTypeTitle}</option>`)).join("")
    $("#inputWitnessType").html(text)

    text = `<option value="">Title</option>` + mastersData.CustomerGenders.map(item => (`<option value=${item.CustomerGenderID} data-token="${item.CustomerGenderTitle}">${item.CustomerGenderValue}</option>`)).join("")
    $("#inputWitnessTitle").html(text)

    text = `<option value="">Title</option>` + mastersData.CustomerRelationships.map(item => (`<option value=${item.CustomerRelationshipID} data-token=${item.CustomerGenderID}>${item.CustomerRelationshipValue}</option>`)).join("")
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
        return Math.floor(diff / 365.25);

    }
    $("#new_document_entry input").on("input", function () {
        this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1)
        console.log(this.value)
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
        const date = this.value
        this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1)
        $(`#${this.getAttribute("deed_id")}_${vendorIterationCount}`).html(this.value)
        if (this.getAttribute('type') == 'date') {
            let new_date = new Date(this.value)
            $(`#${this.getAttribute("deed_id")}_${vendorIterationCount}`).html(new_date.toShortFormat()).attr('date', date)
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
        console.log(`${this.getAttribute("deed_id")}_${vendorIterationCount}`,this.options[this.selectedIndex])
        $(`#${this.getAttribute("deed_id")}_${vendorIterationCount}`).html(this.options[this.selectedIndex].innerHTML)
    })
    $(".inputVendorRepresenterInfo select").on("change", function () {
        $(`#${this.getAttribute("deed_id")}_${vendorIterationCount}`).html(this.options[this.selectedIndex].innerHTML)
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
        $(`#${this.getAttribute("deed_id")}_${purchaserIterationCount}`).html(this.options[this.selectedIndex].innerHTML)
    })
    $(".inputPurchaserRepresenterInfo select").on("change", function () {
        $(`#${this.getAttribute("deed_id")}_${purchaserIterationCount}`).html(this.options[this.selectedIndex].innerHTML)
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
        $(`#${this.getAttribute("deed_id")}_${witnessIterationCount}`).html(this.options[this.selectedIndex].innerHTML)
    })
    $("#new_document_entry input[deed_id*='Age'], #new_document_entry input[deed_id*='Phone']").each(function () {
        $(this).on("input", function () {
            this.value = this.value.slice(0, this.getAttribute('maxlength'))
        })
    })
    $("input[deed_id*=PAN]").each(function () {
        $(this).on("input", function () {
            this.value = this.value.toUpperCase()
            $(`#${this.getAttribute("deed_id")}`).html(this.value)
        })
    })

    // property
    $("#new_document_entry .schedule-part input").on("input", function () {
        $(`#${this.getAttribute("deed_id")}_${propertyIterationCount}`).html(this.value)
    })
    $("#new_document_entry .schedule-part select").on("change", function () {
        console.log(this, $(this).find('option:selected').text(), $(`#${this.getAttribute("deed_id")}_${propertyIterationCount}`))
        $(`#${this.getAttribute("deed_id")}_${propertyIterationCount}`).html($(this).find('option:selected').text())
    })

    // gender based title
    $("#inputVendorTitle").change(function () {
        $(`#documentFirstPersonGender_${vendorIterationCount}`).html(mastersData.CustomerGenders.filter(item => item.CustomerGenderID == this.value)[0].CustomerGenderTitle)
        $(`#inputVendorRelationship option:not([data-token=${this.value}])`).each(function () { $(this).addClass('d-none') })
        $(`#inputVendorRelationship option[data-token=${this.value}],#inputVendorRelationship option:eq(0)`).each(function () { $(this).removeClass('d-none') })
        $('#inputVendorRelationship').val("")
    })
    $("#inputPurchaserTitle").change(function () {
        $(`#documentSecondPersonGender_${purchaserIterationCount}`).html(mastersData.CustomerGenders.filter(item => item.CustomerGenderID == this.value)[0].CustomerGenderTitle)
        $(`#inputPurchaserRelationship option:not([data-token=${this.value}])`).each(function () { $(this).addClass('d-none') })
        $(`#inputPurchaserRelationship option[data-token=${this.value}],#inputPurchaserRelationship option:eq(0)`).each(function () { $(this).removeClass('d-none') })
        $('#inputPurchaserRelationship').val("")    
    })
    $("#inputWitnessTitle").change(function () {
        $(`#inputWitnessRelationship option:not([data-token=${this.value}])`).each(function () { $(this).removeClass('d-none') })
        $(`#inputWitnessRelationship option[data-token=${this.value}],#inputWitnessRelationship option:eq(0)`).each(function () { $(this).addClass('d-none') })
        $('#inputWitnessRelationship').val("")
    })
    $("#inputVendorRepresenterTitle").change(function () {
        $(`#documentFirstPersonRepresenterGender_${vendorIterationCount}`).html(mastersData.CustomerGenders.filter(item => item.CustomerGenderID == this.value)[0].CustomerGenderTitle)
        $(`#inputVendorRepresenterRelationship option:not([data-token=${this.value}])`).each(function () { $(this).addClass('d-none') })
        $(`#inputVendorRepresenterRelationship option[data-token=${this.value}],#inputVendorRepresenterRelationship option:eq(0)`).each(function () { $(this).removeClass('d-none') })
        $('#inputVendorRepresenterRelationship').val("")
    })
    $("#inputPurchaserRepresenterTitle").change(function () {
        $(`#documentSecondPersonRepresenterGender_${purchaserIterationCount}`).html(mastersData.CustomerGenders.filter(item => item.CustomerGenderID == this.value)[0].CustomerGenderTitle)
        $(`#inputPurchaserRepresenterRelationship option:not([data-token=${this.value}])`).each(function () { $(this).addClass('d-none') })
        $(`#inputPurchaserRepresenterRelationship option[data-token=${this.value}],#inputPurchaserRepresenterRelationship option:eq(0)`).each(function () { $(this).removeClass('d-none') })
        $('#inputPurchaserRepresenterRelationship').val("")
    })


    // inputSaleDeedExecution date
    $("input[type=date]").on('input', function () {
        let new_date = new Date(this.value)
        const age = diff_years(new_date, new Date())
        if (age < 0) {
            this.value = today;
            $(this).trigger('input')
        }
    }).attr('max', today)

    // text area input listeners

    $('textarea').each(function () {
        $(this).on('input', function () {
            this.style.height = 0;
            this.style.height = (this.scrollHeight) + "px";
        })
    });

    // price event listner
    $("#inputPropertyPrice").on('input', function () {
        const price = priceInWords(this.value)
        $(".DocumentPriceWords").html(`(${price[0]})`)
        $(".DocumentPrice").html(`Rs.${price[1]}/-`)
    })



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
        $("#inputSaleDeedExecution").trigger('input')
    })

    $("#inputScheduleProp").change(function () {
        $(`#deed_body #DocumentScheduleProp_${propertyIterationCount}`).text($(`.PropertyDetailsFormClone textarea:eq(${this.value})`).val())
        $(`#deed_body #DocumentSchedulePropType_${propertyIterationCount}`).text($("#inputScheduleProp option:selected").text())
        $(".PropertyDetailsFormClone div.order-1").removeClass('order-1').addClass('order-2')
        $($(".PropertyDetailsFormClone div")[this.value]).removeClass('order-2').addClass('order-1')
    })
}




function conjuctionRefresh() {
    let length = 0
    $(".vendorConjuction").each(function () { if ($(this).parent().css('display') != 'none') { length++ } })
    if (length > 1) {
        $(".vendorPlural").text('VENDORS')
        $(".vendorConjuction").each(function (index) { this.innerHTML = `${index > 0 ? '<br><br>' : '<br>'}${index + 1}.` })
    }
    else {
        $(".vendorPlural").text('VENDOR')
        $(".vendorConjuction").each(function (index) { this.innerHTML = '' })
    }



    length = 0
    $(".purchaserConjuction").each(function () { if ($(this).parent().css('display') != 'none') { length++ } })
    if (length > 1) {
        $(".purchaserPlural").text('PURCHASERS')
        $(".purchaserConjuction").each(function (index) { this.innerHTML = `${index > 0 ? '<br><br>' : ''}${index + 1}.` })
    }
    else {
        $(".purchaserPlural").text('PURCHASER')
        $(".purchaserConjuction").each(function (index) { this.innerHTML = '' })
    }


    length = 0
    $(".witnessConjuction").each(function () { if ($(this).parent().css('display') != 'none') { length++ } })
    if (length > 1) {
        $(".witnessConjuction").each(function (index) { this.innerHTML = `${index > 0 ? '<br><br>' : ''}${index + 1}.` })
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
let propertyTable = []


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
                            <td>${item.documentFirstPersonName}</td>
                            <td>${item.DocumentVendorCompany.map(item1 => item1.DocumentVendorCompanyName).join(',')}</td>
                            <td>${mastersData.CustomerCategory.filter(item1 => item1.CustomerCategoryID == item.documentFirstPersonCategory)[0].CustomerCategoryTitle}</td>
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
                        <td>${item.documentFirstPersonName}</td>
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
                $(`input[deed_id = ${key}]`).val(vendorTable[this.value][key]).trigger('input')
                $(`select[deed_id = ${key}]`).val(vendorTable[this.value][key]).trigger('change')
            }
            if (vendorTable[this.value]['DocumentVendorCompany'] != undefined) {
                vendorTable[this.value]['DocumentVendorCompany'].forEach(item => {
                    $(`#inputVendorMultiCompany [data-token=${item.DocumentVendorCompanyRegNo}]`).prop('selected', true).trigger('change')
                })
            }
            $("#inputVendorMultiCompany").selectpicker('refresh')
            if (vendorTable[this.value]['documentFirstPersonRepresenterTitle'] != undefined) {
                $("#toggleVendorRepresenter").prop('checked', true).trigger('change')
            }
            $(`#first_person_details_${this.value}`).remove()
            vendorTable = vendorTable.map((item, index) => { if (index == this.value) { return 'undefined' } else { return item } })
            setVendorTable($("#inputVendorType").val())
            if (vendorTable.filter(item => item != 'undefined').length == 0) { $("#inputVendorType").prop('disabled', false) }
            conjuctionRefresh()
        })
    })
    $(".delete_vendor_table").each(function () {
        $(this).click(function () {
            vendorTable = vendorTable.map((item, index) => { if (index == this.value) { return "undefined" } else { return item } })
            $(`#first_person_details_${this.value}`).remove()
            setVendorTable($("#inputVendorType").val())
            if (vendorTable.filter(item => item != 'undefined').length == 0) { $("#inputVendorType").prop('disabled', false) }
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
                    console.log(mastersData.CustomerCategory.filter(item1 => item1.CustomerCategoryID == item.DocumentPurchaserCategoryID));
                    return (
                        `<tr>
                            <td> ${++i} </td>
                            <td>${item.documentSecondPersonName}</td>
                            <td>${item.DocumentPurchaserCompany.map(item1 => item1.DocumentPurchaserCompanyName).join(',')}</td>
                            <td>${mastersData.CustomerCategory.filter(item1 => item1.CustomerCategoryID == item.documentSecondPersonCategory)[0].CustomerCategoryTitle}</td>
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
                        <td>${item.documentSecondPersonName}</td>
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
                $(`input[deed_id = ${key}]`).val(purchaserTable[this.value][key]).trigger('input')
                $(`select[deed_id = ${key}]`).val(purchaserTable[this.value][key]).trigger('change')
            }
            if (purchaserTable[this.value]['DocumentPurchaserCompany'] != undefined) {
                purchaserTable[this.value]['DocumentPurchaserCompany'].forEach(item => {
                    $(`#inputPurchaserMultiCompany [data-token=${item.DocumentPurchaserCompanyRegNo}]`).prop('selected', true).trigger('change')
                })
            }
            $("#inputPurchaserMultiCompany").selectpicker('refresh')

            if (purchaserTable[this.value]['documentSecondPersonRepresenterTitle'] != undefined) {
                $("#togglePurchaserRepresenter").prop('checked', true).trigger('change')
            }
            $(`#second_person_details_${this.value}`).remove()
            purchaserTable = purchaserTable.map((item, index) => { if (index == this.value) { return 'undefined' } else { return item } })
            setPurchaserTable($("#inputPurchaserType").val())
            if (purchaserTable.filter(item => item != 'undefined').length == 0) { $("#inputPurchaserType").prop('disabled', false) }
            conjuctionRefresh()
            $("#inputPurchaserMultiCompany").selectpicker('refresh')
        })
    })
    $(".delete_purchaser_table").each(function () {
        $(this).click(function () {
            purchaserTable = purchaserTable.map((item, index) => { if (index == this.value) { return "undefined" } else { return item } })
            $(`#second_person_details_${this.value}`).remove()
            setPurchaserTable($("#inputPurchaserType").val())
            if (purchaserTable.filter(item => item != 'undefined').length == 0) { $("#inputPurchaserType").prop('disabled', false) }
            conjuctionRefresh()
        })
    })
}

function setWitnessTable() {
    $("#witnessInfoTable").html(witnessTable.map((item, index) => {
        let i=0
        if (item == 'undefined') { return "" }
        else {
            return (
                `<tr>
                        <th scope="row">${++i}</th>
                        <td>${item.documentWitnessPersonName}</td>
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
                $(`input[deed_id = ${key}]`).val(witnessTable[this.value][key]).trigger('input')
                $(`select[deed_id = ${key}]`).val(witnessTable[this.value][key]).trigger('change')
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

function setVendorCompanyTable() {
    $("#vendorCompanyTable tbody").html(companyTableVendor.map((item, index) => `<tr> <td>${index + 1}</td>
    ${Object.values(item).map(item1 => (
        `<td> ${item1} </td>`
    ))}
    <td> 
    <button type="button" value="${Object.values(item)[1]}" class="btn btn-warning changeVendorCompany" action="edit">Edit</button> 
    <button type="button" value="${Object.values(item)[1]}" class="btn btn-danger changeVendorCompany" action="delete">Delete</button>
    </td>
     </tr>`))
    $(".changeVendorCompany").each(function () {
        $(this).click(function () {
            const regNo = this.value
            vendorTable.forEach((item, index) => {
                if (item != 'undefined') {
                    item['DocumentVendorCompany'].forEach((item1, index1) => {
                        if (item1['DocumentVendorCompanyRegNo'] == regNo) {
                            hide_popup_alert(`Delete Corrensponding Vendor Details`, 1);
                            throw new Error(`Delete Corrensponding Vendor Details`)
                        }
                    })
                }
            })
            if (this.getAttribute('action') == 'edit') {
                let doc = companyTableVendor.filter(item => item['DocumentVendorCompanyRegNo'] == regNo)[0]
                console.log(doc)
                $("#company_info_vendor #inputVendorCompanyName").val(doc['DocumentVendorCompanyName'])
                $("#company_info_vendor #inputVendorCompanyRegNo").val(doc['DocumentVendorCompanyRegNo'])
                $("#company_info_vendor #inputVendorCompanyAddress").val(doc['DocumentVendorCompanyAddress'])
            }
            companyTableVendor = companyTableVendor.filter(item => item['DocumentVendorCompanyRegNo'] != regNo)
            setVendorCompanyTable()
        })
    })
}
function setPurchaserCompanyTable() {
    $("#purchaserCompanyTable tbody").html(companyTablePurchaser.map((item, index) => `<tr> <td>${index + 1}</td>
    ${Object.values(item).map(item1 => (
        `<td> ${item1} </td>`
    ))}
    <td> 
    <button type="button" value="${Object.values(item)[1]}" class="btn btn-warning changePurchaserCompany" action="edit">Edit</button> 
    <button type="button" value="${Object.values(item)[1]}" class="btn btn-danger changePurchaserCompany" action="delete">Delete</button>
    </td>
     </tr>`))
    $(".changePurchaserCompany").each(function () {
        $(this).click(function () {
            const regNo = this.value
            purchaserTable.forEach((item, index) => {
                if (item != 'undefined') {
                    item['DocumentPurchaserCompany'].forEach((item1, index1) => {
                        if (item1['DocumentPurchaserCompanyRegNo'] == regNo) {
                            hide_popup_alert(`Delete Corrensponding Purchaser Details`, 1);
                            throw new Error(`Delete Corrensponding Purchaser Details`)
                        }
                    })
                }
            })
            if (this.getAttribute('action') == 'edit') {
                let doc = companyTablePurchaser.filter(item => item['DocumentPurchaserCompanyRegNo'] == regNo)[0]
                console.log(doc)
                $("#company_info_purchaser #inputPurchaserCompanyName").val(doc['DocumentPurchaserCompanyName'])
                $("#company_info_purchaser #inputPurchaserCompanyRegNo").val(doc['DocumentPurchaserCompanyRegNo'])
                $("#company_info_purchaser #inputPurchaserCompanyAddress").val(doc['DocumentPurchaserCompanyAddress'])
            }
            companyTablePurchaser = companyTablePurchaser.filter(item => item['DocumentPurchaserCompanyRegNo'] != regNo)
            setPurchaserCompanyTable()
        })
    })
}
function setPropertyTable() {
    let i = 1
    const list = propertyTable.map((item, index) => {
        if (item != 'undefined') {
            return (`
            <tr>
            <td>${i++}</td>
            <td>${mastersData.PropertyTypes.filter(item1 => item1.PropertyTypeID == item.documentPropertyType)[0].PropertyTypeTitle}</td>
            <td>${item.documentPropertyTaxNo}</td>
            <td>${item.documentElecServiceNo}</td>
            <td>
            <button type="button" class="btn btn-warning edit_property_table" value="${index}">Edit</button>
            <button type="button" class="btn btn-danger delete_property_table" value="${index}">Delete</button>
            </td>
            </tr>
            `)
        }
    })
    $("#schedule_property_table tbody").html(list.join(''))
    $(".edit_property_table").each(function () {
        $(this).click(function () {
            const doc = propertyTable[this.value]
            for (let i = 0; i < doc['property_detail'].length - 1; i++)$("#clonePropertyDetailsFormInput").trigger('click');
            $("textarea.property_details").each(function (index, item) { $(this).val(doc.property_detail[index]) })
            for (let key in propertyTable[this.value]) {
                $(`.schedule-part input[deed_id=${key}]`).val(propertyTable[this.value][key]).trigger('input')
                $(`.schedule-part select[deed_id=${key}]`).val(propertyTable[this.value][key]).trigger('change')
            }
            $(`#schedule_property_details_${this.value}`).remove()
            $(`#documentPropertySchedule_${this.value}`).remove()
            propertyTable = propertyTable.map((item, index) => { if (index == this.value) { return 'undefined' } else { return item } })
            setPropertyTable()
        })
    })
    $(".delete_property_table").each(function () {
        $(this).click(function () {
            $(this).parent().find('button.edit_property_table').trigger('click')
            $("#addPropertyDetails .clear").trigger('click')
        })
    })
}

function clickEventListner() {

    $("#save_button").click(async function () {

        $("#vendorInfoCloneClear,#DocumentPurchaserAddCompany .clear,#addPropertyDetails .clear,#witnessInfoCloneClear").trigger('click')
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
        $("[id*=first_person_details_]").each(function (index, elem) {
            $(elem).find('span[id*=_]').each(function () {
                let changeid = this.getAttribute('id')
                changeid = changeid.slice(0, changeid.indexOf('_')) + `_${index}`
                this.setAttribute('id', changeid)
            })
            $(elem).attr('id', `first_person_details_${index}`)
        })
        $("[id*=second_person_details_]").each(function (index, elem) {
            $(elem).find('span[id*=_]').each(function () {
                let changeid = this.getAttribute('id')
                changeid = changeid.slice(0, changeid.indexOf('_')) + `_${index}`
                this.setAttribute('id', changeid)
            })
            $(elem).attr('id', `second_person_details_${index}`)
        })

        $("[id*=Witness_person_details_]").each(function (index, elem) {
            $(elem).find('span[id*=_]').each(function () {
                let changeid = this.getAttribute('id')
                changeid = changeid.slice(0, changeid.indexOf('_')) + `_${index}`
                this.setAttribute('id', changeid)
            })
            $(elem).attr('id', `Witness_person_details_${index}`)
        })
        $("[id*=schedule_property_details_]").each(function (index, elem) {
            $(elem).find('[id*=_]').each(function () {
                let changeid = this.getAttribute('id')
                changeid = changeid.slice(0, changeid.indexOf('_')) + `_${index}`
                this.setAttribute('id', changeid)
            })
            $(elem).attr('id', `schedule_property_details_${index}`)
        })


        const details = {
            DocumentTypeID: parseInt(document.getElementById("inputDoucumentType").value),
            DocumentLanguageID: parseInt(document.getElementById("inputDoucumentLanguage").value),
            DocumentTemplateID: parseInt(deed_documentTemplateid),
            DocumentVendorTypeID: parseInt(document.getElementById("inputVendorType").value),
            DocumentPurchaserTypeID: parseInt(document.getElementById("inputPurchaserType").value),
            DocumentApplicationNo: document.getElementById("inputApplicationNo").value,
            DocumentExecutionPlace: document.getElementById("inputExcutionPlace").value,
            DocumentExecutionDate: document.getElementById("inputSaleDeedExecution").value,
            DocumentTemplateHTML: document.getElementById("deed_body").innerHTML,
            document_vendor: vendorTable,
            document_purchaser: purchaserTable,
            document_witness: witnessTable,
            payment_details: payment_detail,
            transfer_details: transfer_detail
        }

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

        const upload_detail = {
            DocumentTypeID: details.DocumentTypeID,
            DocumentLanguageID: details.DocumentLanguageID,
            DocumentTemplateID: details.DocumentTemplateID,
            DocumentApplicationNo: details.DocumentApplicationNo,
            DocumentExecutionPlace: details.DocumentExecutionPlace,
            DocumentExecutionDate: details.DocumentExecutionDate,
            DocumentTemplateHTML: details.DocumentTemplateHTML,
        }
        show_popup_alert()
        if (this.getAttribute('api') == 'POST') {
            apirequest("POST", "api/Document", upload_detail).then(resp => {
                hide_popup_alert(resp.message)
                setTimeout(() => {
                    location.reload()
                }, 2000);
            }, error => {
                hide_popup_alert(error.message)
            })
        }
        else {
            apirequest("PUT", `api/Document/${this.value}`, upload_detail).then(resp => {
                hide_popup_alert(resp.message)
                setTimeout(() => {
                    location.reload()
                }, 2000);
            }, error => {
                hide_popup_alert(error.message)
            })
        }
    })

    // vendor

    $("#DocumentVendorAddCompany .clear").click(function () { $("#company_info_vendor input").val('') })
    $("#DocumentVendorAddCompany .add").click(function () {
        let companyTableVendorTemp = {}
        $("#company_info_vendor input").each(function () {
            if (this.value == "") {
                hide_popup_alert(`${this.getAttribute('save_id')} field is required`, 1);
                throw new Error(`${this.getAttribute('save_id')} field is required`)
            }
            companyTableVendorTemp[this.getAttribute('save_id')] = this.value
        })
        companyTableVendor.push(companyTableVendorTemp)
        $("#inputVendorMultiCompany").html(companyTableVendor.map((item, index) => (`<option data-token="${item.DocumentVendorCompanyRegNo}" value="${index}">${item.DocumentVendorCompanyName}</option>`)).join(''))
        $("#inputVendorMultiCompany").selectpicker('refresh')
        $("#inputVendorMultiCompany").change(function () {
            const length = $("#inputVendorMultiCompany").val().length
            if (length) {
                $(`#deed_body #DocumentVendorCompanyDetails_${vendorIterationCount}`).html(
                    $("#inputVendorMultiCompany").val().map((item, index) => {
                        item = parseInt(item)
                        return (`<span class="vendorCompany"><span class="vendorCompanyName">${companyTableVendor[item]['DocumentVendorCompanyName']}</span>, Reg No <span class="vendorCompanyRegNo">${companyTableVendor[item]['DocumentVendorCompanyRegNo']}</span>, <span class="vendorCompanyAddress">${companyTableVendor[item]['DocumentVendorCompanyAddress']}</span> ${index == length - 1 ? '' : index == length - 2 ? ' and ' : ','}</span>`)
                    }).join('') + 'represented by, '
                )
            }
            else { $(`#deed_body #DocumentVendorCompanyDetails_${vendorIterationCount}`).html('') }
        })
        $("#company_info_vendor input").each(function () { this.value = "" })
        $("#inputVendorMultiCompany").selectpicker('refresh')
        setVendorCompanyTable()
        $("#show_vendor_details").prop('disabled', false)
        $(".vendorCompanyTooltip").addClass('d-none')
    })
    $("#vendorInfoCloneClear").click(function () {
        $('#hidden_use_element').html(deed_content)
        $('#hidden_use_element').html($('#hidden_use_element #first_person_details_0').html())
        $("#hidden_use_element span").each(function () {
            let changeid = this.getAttribute('id')
            changeid = changeid.slice(0, changeid.indexOf('_')) + `_${vendorIterationCount}`
            this.setAttribute('id', changeid)
        })
        if (vendorTable.filter(item => item != 'undefined').length == 0) {
            $(`#deed_body #first_person_details_${vendorIterationCount}`).html($("#hidden_use_element").html())
        }
        else {
            $(`#deed_body #first_person_details_${vendorIterationCount}`).remove()
            let text = `<span id='first_person_details_${vendorIterationCount}' class="d-none">${$("#hidden_use_element").html()}</span>`
            $(text).insertAfter(`#deed_body #first_person_details_${vendorIterationCount - 1}`)
        }
        $("#append_vendor_clone input,#append_vendor_clone select").each(function () { this.value = "" })
        conjuctionRefresh()
    })
    $("#vendorInfoClone").click(function () {
        const vendorTableTemp = {}
        $(".inputVendorInfo select,.inputVendorInfo input[type!=checkbox]").each(function () {
            if ($(this).val() === "" && !(this.getAttribute('id').includes('Representer') && !document.getElementById('toggleVendorRepresenter').checked)) {
                if (!($("#inputVendorType").val() == 2 && this.getAttribute('id') == 'inputVendorCategory')) {
                    hide_popup_alert(`${this.getAttribute('save_id')} field is required`, 1);
                    throw new Error(`${this.getAttribute('save_id')} field is required`)
                }
            }
            else if (this.getAttribute("id") !== 'inputVendorMultiCompany' && !(this.getAttribute('id').includes('Representer') && !document.getElementById('toggleVendorRepresenter').checked)) {
                vendorTableTemp[this.getAttribute('deed_id')] = $(this).val()
            }
            else if (this.getAttribute("id") == 'inputVendorMultiCompany') {
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
        let text = `<span id='first_person_details_${vendorIterationCount}' class="d-none">${$("#hidden_use_element").html()}</span>`
        $(text).insertAfter(`#deed_body #first_person_details_${vendorIterationCount - 1}`)
        $("#append_vendor_clone input,#append_vendor_clone select").each(function () { this.value = "" })
        $("#inputVendorMultiCompany").selectpicker('refresh')
        inputEventListner()
        conjuctionRefresh()
        $("#inputVendorTitle").change(function () { $(`#first_person_details_${vendorIterationCount}`).removeClass("d-none"); conjuctionRefresh() })
        $("#toggleVendorRepresenter").prop('checked', false)
        $(".inputVendorRepresenterInfo").addClass('d-none')
        $("#inputVendorType").prop('disabled', true)

    }
    )

    // purchaser


    $("#DocumentPurchaserAddCompany .clear").click(function () { $("#company_info_purchaser input").val('') })
    $("#DocumentPurchaserAddCompany .add").click(function () {
        let companyTablePurchaserTemp = {}
        $("#company_info_purchaser input").each(function () {
            if (this.value == "") {
                hide_popup_alert(`${this.getAttribute('save_id')} field is required`, 1);
                throw new Error(`${this.getAttribute('save_id')} field is required`)
            }
            companyTablePurchaserTemp[this.getAttribute('save_id')] = this.value
        })
        companyTablePurchaser.push(companyTablePurchaserTemp)
        $("#inputPurchaserMultiCompany").html(companyTablePurchaser.map((item, index) => (`<option data-token="${item.DocumentPurchaserCompanyRegNo}" value="${index}">${item.DocumentPurchaserCompanyName}</option>`)).join(''))
        $("#inputPurchaserMultiCompany").selectpicker('refresh')
        $("#inputPurchaserMultiCompany").change(function () {
            const length = $("#inputPurchaserMultiCompany").val().length
            if (length) {
                $(`#deed_body #DocumentPurchaserCompanyDetails_${purchaserIterationCount}`).html(
                    $("#inputPurchaserMultiCompany").val().map((item, index) => {
                        item = parseInt(item)
                        return (`<span class="purchaserCompany"><span class="purchaserCompanyName">${companyTablePurchaser[item]['DocumentPurchaserCompanyName']}</span>, Reg No <span class="purchaserCompanyRegNo">${companyTablePurchaser[item]['DocumentPurchaserCompanyRegNo']}</span>, <span class="purchaserCompanyAddress">${companyTablePurchaser[item]['DocumentPurchaserCompanyAddress']}</span>${index == length - 1 ? '' : index == length - 2 ? ' and ' : ','} `)
                    }).join('') + 'represented by, '
                )
            }
            else { $(`#deed_body #DocumentPurchaserCompanyDetails_${purchaserIterationCount}`).html('') }
        })
        setPurchaserCompanyTable()

        $("#company_info_purchaser input").each(function () { this.value = "" })
        $("#show_purchaser_details").prop('disabled', false)
        $(".purchaserCompanyTooltip").addClass('d-none')

    })
    $("#purchaserInfoCloneClear").click(function () {

        if (purchaserTable.filter(item => item != 'undefined').length == 0) {
            console.log(purchaserTable.length)
            $('#hidden_use_element').html(deed_content)
            $('#hidden_use_element').html($('#hidden_use_element #second_person_details_0').html())
            $("#hidden_use_element span").each(function () {
                let changeid = this.getAttribute('id')
                changeid = changeid.slice(0, changeid.indexOf('_')) + `_${purchaserIterationCount}`
                this.setAttribute('id', changeid)
            })
            $(`#deed_body #second_person_details_${purchaserIterationCount}`).html($("#hidden_use_element").html())
        }
        else {
            console.log(purchaserTable.length)
            $(`#deed_body #second_person_details_${purchaserIterationCount}`).remove()
            $('#hidden_use_element').html(deed_content)
            $('#hidden_use_element').html($('#hidden_use_element #second_person_details_0').html())
            $("#hidden_use_element span").each(function () {
                let changeid = this.getAttribute('id')
                changeid = changeid.slice(0, changeid.indexOf('_')) + `_${purchaserIterationCount}`
                this.setAttribute('id', changeid)
            })
            let text = `<span id='second_person_details_${purchaserIterationCount}' class="d-none">${$("#hidden_use_element").html()}</span>`
            $(text).insertAfter(`#deed_body #second_person_details_${purchaserIterationCount - 1}`)
        }
        $("#append_purchaser_clone input,#append_purchaser_clone select").each(function () { this.value = "" })
        conjuctionRefresh()
    })
    $("#purchaserInfoClone").click(function () {
        const purchaserTableTemp = {}



        $(".inputPurchaserInfo select,.inputPurchaserInfo input[type!=checkbox]").each(function () {
            if ($(this).val() === "" && !(this.getAttribute('id').includes('Representer') && !document.getElementById('togglePurchaserRepresenter').checked)) {
                if (!($("#inputPurchaserType").val() == 2 && this.getAttribute('id') == 'inputPurchaserCategory')) {
                    hide_popup_alert(`${this.getAttribute('save_id')} field is required`, 1);
                    throw new Error(`${this.getAttribute('save_id')} field is required`)
                }
            }
            else if (this.getAttribute("id") !== 'inputPurchaserMultiCompany' && !(this.getAttribute('id').includes('Representer') && !document.getElementById('togglePurchaserRepresenter').checked)) {
                purchaserTableTemp[this.getAttribute('deed_id')] = $(this).val()
            }
            else if (this.getAttribute("id") == 'inputPurchaserMultiCompany') {
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



        setPurchaserTable($("#inputPurchaserType").val())



        console.log(purchaserTable)


        $('#hidden_use_element').html(deed_content)
        $('#hidden_use_element').html($('#hidden_use_element #second_person_details_0').html())
        $("#hidden_use_element span").each(function () {
            let changeid = this.getAttribute('id')
            changeid = changeid.slice(0, changeid.indexOf('_')) + `_${purchaserIterationCount}`
            this.setAttribute('id', changeid)
        })
        let text = `<span id='second_person_details_${purchaserIterationCount}' class="d-none">${$("#hidden_use_element").html()}</span>`
        $(text).insertAfter(`#deed_body #second_person_details_${purchaserIterationCount - 1}`)
        $("#append_purchaser_clone input,#append_purchaser_clone select").each(function () { this.value = "" })
        $("#inputPurchaserMultiCompany").selectpicker('refresh')
        inputEventListner()
        conjuctionRefresh()
        $("#inputPurchaserTitle").change(function () { $(`#second_person_details_${purchaserIterationCount}`).removeClass("d-none"); conjuctionRefresh() })
        $("#togglePurchaserRepresenter").prop('checked', false)
        $(".inputPurchaserRepresenterInfo").addClass('d-none')
        $("#inputPurchaserType").prop('disabled', true)

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

    // witness


    $("#witnessInfoCloneClear").click(function () {
        $('#hidden_use_element').html(deed_content)
        $('#hidden_use_element').html($('#hidden_use_element #Witness_person_details_0').html())
        $("#hidden_use_element span").each(function () {
            let changeid = this.getAttribute('id')
            changeid = changeid.slice(0, changeid.indexOf('_')) + `_${witnessIterationCount}`
            this.setAttribute('id', changeid)
        })
        if (vendorTable.length == 0) {
            $(`#deed_body #Witness_person_details_${witnessIterationCount}`).html($("#hidden_use_element").html())
        }
        else {
            $(`#deed_body #Witness_person_details_${witnessIterationCount}`).remove()
            let text = `<span id='Witness_person_details_${witnessIterationCount}' class="d-none">${$("#hidden_use_element").html()}</span>`
            $(text).insertAfter(`#deed_body #Witness_person_details_${witnessIterationCount - 1}`)
        }
        $(".inputWitnessInfo input,.inputWitnessInfo select").each(function () { console.log(this); this.value = "" })
        conjuctionRefresh()
    })
    $("#witnessInfoClone").click(function () {
        let witnessTableTemp = {}


        $(".inputWitnessInfo select,.inputWitnessInfo input").each(function () {
            if ($(this).val() === "") {
                hide_popup_alert(`${this.getAttribute('save_id')} field is required`, 1);
                throw new Error(`${this.getAttribute('save_id')} field is required`)
            }
            else {
                witnessTableTemp[this.getAttribute('deed_id')] = $(this).val()
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
        let text = `<span id='Witness_person_details_${witnessIterationCount}' class="d-none">${$("#hidden_use_element").html()}</span>`
        $(text).insertAfter(`#deed_body #Witness_person_details_${witnessIterationCount - 1}`)
        $(".inputWitnessInfo input,.inputWitnessInfo select").each(function () { console.log(this); this.value = "" })
        inputEventListner()
        conjuctionRefresh()
        $("#inputWitnessTitle").change(function () { $(`#Witness_person_details_${witnessIterationCount}`).removeClass("d-none"); conjuctionRefresh() })
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

    // property details
    $("#addPropertyDetails .add").click(function () {
        const schedule_part = {}
        $(".schedule-part input,.schedule-part select,.schedule-part textarea").each(function () {
            if (this.value == "") {
                hide_popup_alert(`${this.getAttribute('save_id')} has null values`, 1)
                throw new Error(`${this.getAttribute('save_id')} has null values`)
            }
        })
        $(".schedule-part input,.schedule-part select").each(function () {
            schedule_part[this.getAttribute('deed_id')] = this.value
        })
        schedule_part['property_detail'] = []
        $(".schedule-part textarea").each(function () {
            schedule_part['property_detail'].push(this.value)
        })
        console.log(schedule_part)
        propertyTable[propertyIterationCount] = schedule_part
        setPropertyTable()

        propertyIterationCount++;
        $('#hidden_use_element').html(deed_content)
        $('#hidden_use_element').html($('#hidden_use_element #schedule_property_details_0').html())
        $("#hidden_use_element span,#hidden_use_element p[id*=_]").each(function () {
            let changeid = this.getAttribute('id')
            console.log(this)
            changeid = changeid.slice(0, changeid.indexOf('_')) + `_${propertyIterationCount}`
            this.setAttribute('id', changeid)
        })
        let text = `<div id='schedule_property_details_${propertyIterationCount}' class="d-none">${$("#hidden_use_element").html()}</div>`
        $(text).insertAfter(`#deed_body #schedule_property_details_${propertyIterationCount - 1}`)
        $(".schedule-part input,.schedule-part select,.schedule-part textarea").val('')
        $(".PropertyDetailsFormInputClone").remove()


        $('#hidden_use_element').html(deed_content)
        $('#hidden_use_element').html($('#hidden_use_element #documentPropertySchedule_0').html())
        $("#hidden_use_element span[class!=vendorPlural]").each(function () {
            let changeid = this.getAttribute('id')
            console.log(this)
            changeid = changeid.slice(0, changeid.indexOf('_')) + `_${propertyIterationCount}`
            this.setAttribute('id', changeid)
        })
        text = `<p class='p-2 pt-0 pb-2 mb-0 d-none' id='documentPropertySchedule_${propertyIterationCount}' >${$("#hidden_use_element").html()}</p class='p-2 pt-0 pb-2 mb-0 '>`
        $(text).insertAfter(`#deed_body #documentPropertySchedule_${propertyIterationCount - 1}`)
        $("#inputPropertyType").change(function () { $(`#schedule_property_details_${propertyIterationCount},#documentPropertySchedule_${propertyIterationCount}`).removeClass('d-none') })


    })
    $("#addPropertyDetails .clear").click(function () {
        $('#hidden_use_element').html(deed_content)
        $('#hidden_use_element').html($('#hidden_use_element #schedule_property_details_0').html())
        $("#hidden_use_element span").each(function () {
            let changeid = this.getAttribute('id')
            console.log(this)
            changeid = changeid.slice(0, changeid.indexOf('_')) + `_${propertyIterationCount}`
            this.setAttribute('id', changeid)
        })
        if (propertyTable.filter(item => item != 'undefined').length == 0) {
            $(`#deed_body #schedule_property_details_${propertyIterationCount}`).html($("#hidden_use_element").html())
        }
        else {
            $(".PropertyDetailsFormInputClone").remove()
            let text = `<div id='schedule_property_details_${propertyIterationCount}' class="d-none">${$("#hidden_use_element").html()}</div>`
            $(text).insertAfter(`#deed_body #schedule_property_details_${propertyIterationCount - 1}`)
        }
        $(".schedule-part input,.schedule-part select,.schedule-part textarea").val('')

    })

    // others
    $(".cloneDetailsFormInput").each(function () {
        $(this).click(function () {
            let formcss = this.getAttribute('clone_id') + 'DetailsFormInput'
            let formclonecss = this.getAttribute('clone_id') + 'DetailsFormClone'
            const clone = $("." + formcss).clone()
            clone.removeClass(formcss).addClass(formcss + "Clone").find('textarea').val("")
            if (this.getAttribute('clone_id') == "Property") {
                clone.removeClass('order-1').addClass('order-2')
                const schedule_title = ['of property', ...'BCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')]
                const length = $(`.${formclonecss} textarea`).length
                const label = 'Schedule ' + schedule_title[length]
                clone.find('label').text(label);
                clone.appendTo("." + formclonecss)
                const inputScheduleProp = []
                $(".property_details").each((index, item) => {
                    inputScheduleProp.push(`<option nof_id='${index}' value="${index}">Schedule ${schedule_title[index]}</option>`)
                })
                $("#inputScheduleProp").html(inputScheduleProp.join(''))
            }
            else {
                clone.appendTo("." + formclonecss)
            }
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

    $("#showVendorCompanyToggler #show_company_details").click(function () {
        $(this).addClass('active').addClass('btn-primary').removeClass('btn-outline-primary')
        $('#showVendorCompanyToggler #show_vendor_details').removeClass('active').removeClass('btn-primary').addClass('btn-outline-primary')
        $(".inputVendorInfo").addClass('d-none')
        $("#company_info_vendor").removeClass('d-none')

    })
    $("#showVendorCompanyToggler #show_vendor_details").click(function () {
        if (companyTableVendor.length == 0) {
            hide_popup_alert(`Please enter company Details`, 1);
            throw new Error(`Please enter company Details`)
        }
        $(this).addClass('active').addClass('btn-primary').removeClass('btn-outline-primary')
        $('#showVendorCompanyToggler #show_company_details').removeClass('active').removeClass('btn-primary').addClass('btn-outline-primary')
        $(".inputVendorInfo").removeClass('d-none')
        $("#company_info_vendor").addClass('d-none')

    })
    $("#toggleVendorRepresenter").change(function () {
        console.log(this.checked)
        if (this.checked) {
            $(`#firstPersonRepresenterDetails_${vendorIterationCount}`).removeClass('d-none')
            $(".inputVendorRepresenterInfo").removeClass('d-none')
        }
        else {
            $(`#firstPersonRepresenterDetails_${vendorIterationCount}`).addClass('d-none')
            $(".inputVendorRepresenterInfo").addClass('d-none')
        }
    })
    $("#showPurchaserCompanyToggler #show_company_details").click(function () {
        $(this).addClass('active').addClass('btn-primary').removeClass('btn-outline-primary')
        $('#showPurchaserCompanyToggler #show_purchaser_details').removeClass('active').removeClass('btn-primary').addClass('btn-outline-primary')
        $(".inputPurchaserInfo").addClass('d-none')
        $("#company_info_purchaser").removeClass('d-none')

    })
    $("#showPurchaserCompanyToggler #show_purchaser_details").click(function () {
        if (companyTablePurchaser.length == 0) {
            hide_popup_alert(`Please enter company Details`, 1);
            throw new Error(`Please enter company Details`)
        }
        $(this).addClass('active').addClass('btn-primary').removeClass('btn-outline-primary')
        $('#showPurchaserCompanyToggler #show_company_details').removeClass('active').removeClass('btn-primary').addClass('btn-outline-primary')
        $(".inputPurchaserInfo").removeClass('d-none')
        $("#company_info_purchaser").addClass('d-none')

    })
    $("#togglePurchaserRepresenter").change(function () {
        if (this.checked) {
            $(`#secondPersonRepresenterDetails_${purchaserIterationCount}`).removeClass('d-none')
            $(".inputPurchaserRepresenterInfo").removeClass('d-none')
        }
        else {
            $(`#secondPersonRepresenterDetails_${purchaserIterationCount}`).addClass('d-none')
            $(".inputPurchaserRepresenterInfo").addClass('d-none')

        }
    })

}

function cloneformEventList() {
    $(".property_details").each(function () {
        $(this).on('input', function () {
            const text = [];
            const length = $(".property_details").length
            const schedule_title = ['of property', ...'BCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')]
            $(".property_details").each(function (index) {
                text.push(`<h6 style="text-align:center;">Schedule ${length > 1 ? schedule_title[index] : 'of Property'}</h6><span class="scheduleDetails">${this.value}</span>`)
            })
            $("#inputScheduleProp").trigger('change')

            document.getElementById(`documentScheduleDetails_${propertyIterationCount}`).innerHTML = "<p>" + text.join("<br><br>") + "</p>"
        })
    })
    $(".transfer_details").each(function () {
        $(this).on('input', function () {
            const text = [];
            $(".transfer_details").each(function () {
                text.push(this.value)
            })
            document.getElementById("transfer_details").innerHTML = "<span>" + text.join("</span><br><span>") + "</span>"
        })
    })
    $(".payment_details").each(function () {
        window.showdown.extensions.newline = newline
        var converter = new showdown.Converter();
        $(this).on('input', function () {
            var convText = this.value,
                html = converter.makeHtml(convText);
            console.log(html)
            const text = [];
            $(".payment_details").each(function () {
                text.push(html)
            })
            document.getElementById("payment_Details").innerHTML = "<span>" + text.join("<br>") + "</span>"
        })
    })
    $('textarea').each(function () {
        $(this).on('input', function () {
            this.style.height = 0;
            this.style.height = (this.scrollHeight) + "px";
        })
    });
}
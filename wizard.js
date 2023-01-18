import { mastersData, storeInput, apirequest } from './data.js'
import { hide_popup_alert, show_popup_alert } from './popup_alert.js'
const base_url = "https://doc.dlanzer.com/laravel/public/";
const authToken = "2|J8MC9BBpBHdX1ZbLXprO3gWoXlbrsWfWHQXuMqqm"
// const base_url = "http://localhost/dlanzer/document-generator/public/";
// const authToken = "4|QscZTGUbbOMbB7izc8tg8i4tz35cQM4Z44ih5vaK"

let deed_documentTemplateid, deed_content;

function setdocFields() {
    let text;

    // set Doc types
    text = `<option value="">Document Type</option>` + mastersData.DocumentTypes.map(item => (`<option value=${item.DocumentTypeID} data-token=${item.DocumentTypeTitle}>${item.DocumentTypeTitle}</option>`))
    $("#inputDoucumentType").html(text)


    // set vendor types
    text = `<option value="">Vendor type</option>` + mastersData.CustomerType.map(item => (`<option value=${item.CustomerTypeID} data-token=${item.CustomerTypeTitle}>${item.CustomerTypeTitle}</option>`)).join("")
    $("#inputVendorType").html(text)


    text = `<option value="">Title</option>` + mastersData.CustomerGenders.map(item => (`<option value=${item.CustomerGenderID} data-token=${item.CustomerGenderValue}>${item.CustomerGenderValue}</option>`)).join("")
    $("#inputVendorTitle").html(text)

    text = `<option value="">Title</option>` + mastersData.CustomerRelationships.map(item => (`<option value=${item.CustomerRelationshipID} data-token=${item.CustomerRelationshipTitle}>${item.CustomerRelationshipTitle}</option>`)).join("")
    $("#inputVendorRelationship").html(text)



    // set purchaser type

    text = `<option value="">Purchaser type</option>` + mastersData.CustomerType.map(item => (`<option value=${item.CustomerTypeID} data-token=${item.CustomerTypeTitle}>${item.CustomerTypeTitle}</option>`)).join("")
    $("#inputPurchaserType").html(text)

    text = `<option value="">Title</option>` + mastersData.CustomerGenders.map(item => (`<option value=${item.CustomerGenderID} data-token=${item.CustomerGenderValue}>${item.CustomerGenderValue}</option>`)).join("")
    $("#inputPurchaserTitle").html(text)

    text = `<option value="">Title</option>` + mastersData.CustomerRelationships.map(item => (`<option value=${item.CustomerRelationshipID} data-token=${item.CustomerRelationshipTitle}>${item.CustomerRelationshipTitle}</option>`)).join("")
    $("#inputPurchaserRelationship").html(text)

    // set witness type

    text = `<option value="">Witness type</option>` + mastersData.CustomerType.map(item => (`<option value=${item.CustomerTypeID} data-token=${item.CustomerTypeTitle}>${item.CustomerTypeTitle}</option>`)).join("")
    $("#inputWitnessType").html(text)

    text = `<option value="">Title</option>` + mastersData.CustomerGenders.map(item => (`<option value=${item.CustomerGenderID} data-token=${item.CustomerGenderValue}>${item.CustomerGenderValue}</option>`)).join("")
    $("#inputWitnessTitle").html(text)

    text = `<option value="">Title</option>` + mastersData.CustomerRelationships.map(item => (`<option value=${item.CustomerRelationshipID} data-token=${item.CustomerRelationshipTitle}>${item.CustomerRelationshipTitle}</option>`)).join("")
    $("#inputWitnessRelationship").html(text)


    // set property type
    text = `<option value="">Property Type</option>` + mastersData.PropertyTypes.map(item => (`<option value=${item.PropertyTypeID} data-token=${item.PropertyTypeTitle}>${item.PropertyTypeTitle}</option>`))
    $("#inputPropertyType").html(text)
}



function inputEventListner() {
    $("#new_document_entry input").on("input", function () {
        this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1)
        $(`#${this.getAttribute("deed_id")}`).html(this.value)
    })
    $("#inputVendorPan,#inputPurchaserPan,#inputWitnessPan").each(function () {
        $(this).on("input", function () {
            this.value = this.value.toUpperCase()
            $(`#${this.getAttribute("deed_id")}`).html(this.value)
        })
    })
    $("select").on("change", function () {
        $(`#${this.getAttribute("deed_id")}`).html(this.options[this.selectedIndex].innerHTML)
    })
    $("input[type='date']").on("input", function () {
        let new_date = new Date(this.value)
        console.log(new_date.toShortFormat())
        $(`#${this.getAttribute("deed_id")}`).html(new_date.toShortFormat())

    })
    $('textarea').each(function () {
        $(this).on('input', function () {
            this.style.height = 0;
            this.style.height = (this.scrollHeight) + "px";
        })
    });

}



storeInput().then(resp => {
    console.log(resp)
    setdocFields();
    inputEventListner();
    selectEventListner();
    clickEventListner();
})



function selectEventListner() {

    document.getElementById("inputDoucumentType").addEventListener("change", function () {
        const docTypeSelected = document.getElementById("inputDoucumentType").value
        const docLanguageIDs = []
        mastersData.DocumentTemplates.map(item => {
            if (item.DocumentTypeID == docTypeSelected) {
                console.log(item)
                deed_documentTemplateid = item.DocumentTemplateID
                docLanguageIDs.push(item.DocumentLanguageID)
            }
        })
        var langLists = [];
        docLanguageIDs.forEach(langID => {
            return mastersData.DocumentLanguages.forEach(item => {
                if (langID == item.DocumentLanguageID) {
                    console.log(item)
                    langLists.push([item.DocumentLanguageTitle, item.DocumentLanguageID])
                }
            })
        })
        const text = `<option value="">Document Language</option>` + langLists.map(item => (`<option value="${item[1]}" data-token=${item[0]}>${item[0]}</option>`))
        $("#inputDoucumentLanguage").html(text)
    })
    document.getElementById("inputVendorType").addEventListener("change", function () {
        let text = `<option value="">Category</option>` + mastersData.CustomerCategory.map(item => {
            if (item.CustomerTypeID == this.value) {
                return (`<option value=${item.CustomerCategoryID} data-token=${item.CustomerCategoryTitle}>${item.CustomerCategoryTitle}</option>`)
            }
            else { return "" }
        }).join("")
        console.log(text)
        $("[id=inputVendorCategory]").each(function () { $(this).html(text) })

    })
    document.getElementById("inputPurchaserType").addEventListener("change", function () {
        let text = `<option value="">Category</option>` + mastersData.CustomerCategory.map(item => {
            if (item.CustomerTypeID == this.value) {
                return (`<option value=${item.CustomerCategoryID} data-token=${item.CustomerCategoryTitle}>${item.CustomerCategoryTitle}</option>`)
            }
            else { return "" }
        }).join("")
        $("[id=inputPurchaserCategory]").each(function () { $(this).html(text) })
    })
    document.getElementById("inputDoucumentLanguage").addEventListener("change", function () {
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
        $(".property_details").each(function () {
            this.addEventListener("input", function () {
                const text = [];
                $(".property_details").each(function () {
                    text.push(this.value)
                })
                console.log(text)
                document.getElementById("Property_Details").innerHTML = "<p><b>Property Details:</b></p>" + "<p>" + text.join("<br>") + "</p>"
            })
        })
        $(".transfer_details").each(function () {
            this.addEventListener("input", function () {
                const text = [];
                $(".transfer_details").each(function () {
                    text.push(this.value)
                })
                document.getElementById("transfer_details").innerHTML = "<p><b>Transfer Details:</b></p>" + "<p>" + text.join("<br>") + "</p>"
            })
        })
        $(".payment_details").each(function () {
            this.addEventListener("input", function () {
                const text = [];
                $(".payment_details").each(function () {
                    text.push(this.value)
                })
                document.getElementById("payment_Details").innerHTML = "<p><b>Payment Details:</b></p>" + "<p>" + text.join("<br>") + "</p>"
            })
        })
    })
}
let vendorIterationCount = 0
let purchaserIterationCount = 0
let witnessIterationCount = 0



function conjuctionRefresh() {
    let length = $(".vendorConjuction").length
    $(".vendorConjuction").each(function (index) {
        if (index == length - 1) {
            $(this).text(" and ")
        }
        else { $(this).text(", ") }
    })


    length = $(".purchaserConjuction").length
    $(".purchaserConjuction").each(function (index) {
        if (index == length - 1) {
            $(this).text(" and ")
        }
        else { $(this).text(", ") }
    })


    length = $(".witnessConjuction").length
    $(".witnessConjuction").each(function (index) {
        if (index == length - 1) {
            $(this).text(" and ")
        }
        else { $(this).text(", ") }
    })
}
function clickEventListner() {

    document.getElementById("save_button").addEventListener("click", async function () {
        const document_vendor = []
        for (let i = 0; i <= vendorIterationCount; i++) {
            document_vendor.push({
                DocumentVendorID: i + 1,
                DocumentVendorGenderID: parseInt($(`[deed_id=documentFirstPersonTitle_${i}]`).val()),
                DocumentVendorCategoryID: parseInt($(`[deed_id=documentVendorCategory_${i}]`).val()),
                DocumentVendorRelationshipID: parseInt($(`[deed_id=documentFirstPersonRelationshipTitle_${i}]`).val()),
                DocumentVendorAge: $(`[deed_id=documentFirstPersonAge_${i}]`).val(),
                DocumentVendorDateOfBirth: $(`[deed_id=documentFirstPersonDOB_${i}]`).val(),
                DocumentVendorRelationName: $(`[deed_id=documentFirstPersonRelationshipName_${i}]`).val(),
                DocumentVendorName: $(`[deed_id=documentFirstPersonName_${i}]`).val(),
                DocumentVendorPAN: $(`[deed_id=documentFirstPersonPAN_${i}]`).val(),
                DocumentVendorAadharNumber: $(`[deed_id=documentFirstPersonAadhar_${i}]`).val(),
                DocumentVendorPhoneNumber: $(`[deed_id=documentFirstPersonPhone_${i}]`).val(),
                DocumentVendorDoorNo: $(`[deed_id=documentFirstPersonDoorNo_${i}]`).val(),
                DocumentVendorStreet: $(`[deed_id=documentFirstPersonStreet_${i}]`).val(),
                DocumentVendorDistrict: $(`[deed_id=documentFirstPersonDistrict_${i}]`).val(),
                DocumentVendorTaluk: $(`[deed_id=documentFirstPersonTaluk_${i}]`).val(),
                DocumentVendorState: $(`[deed_id=documentFirstPersonState_${i}]`).val(),
                DocumentVendorPinCode: $(`[deed_id=documentFirstPersonPincode_${i}]`).val(),

            })
        }
        const document_purchaser = []
        for (let i = 0; i <= purchaserIterationCount; i++) {
            document_purchaser.push({

                DocumentPurchaserID: i + 1,
                DocumentPurchaserGenderID: parseInt($(`[deed_id=documentSecondPersonTitle_${i}]`).val()),
                DocumentPurchaserCategoryID: parseInt($(`[deed_id=documentSecondPersonTitle_${i}]`).val()),
                DocumentPurchaserRelationshipID: parseInt($(`[deed_id=documentSecondPersonRelationshipTitle_${i}]`).val()),
                DocumentPurchaserAge: $(`[deed_id=documentSecondPersonAge_${i}]`).val(),
                DocumentPurchaserDateOfBirth: $(`[deed_id=documentSecondPersonDOB_${i}]`).val(),
                DocumentPurchaserRelationName: $(`[deed_id=documentSecondPersonRelationshipName_${i}]`).val(),
                DocumentPurchaserName: $(`[deed_id=documentSecondPersonName_${i}]`).val(),
                DocumentPurchaserPAN: $(`[deed_id=documentSecondPersonPAN_${i}]`).val(),
                DocumentPurchaserAadharNumber: $(`[deed_id=documentSecondPersonAadhar_${i}]`).val(),
                DocumentPurchaserPhoneNumber: $(`[deed_id=documentSecondPersonPhone_${i}]`).val(),
                DocumentPurchaserDoorNo: $(`[deed_id=documentSecondPersonDoorNo_${i}]`).val(),
                DocumentPurchaserStreet: $(`[deed_id=documentSecondPersonStreet_${i}]`).val(),
                DocumentPurchaserDistrict: $(`[deed_id=documentSecondPersonDistrict_${i}]`).val(),
                DocumentPurchaserTaluk: $(`[deed_id=documentSecondPersonTaluk_${i}]`).val(),
                DocumentPurchaserState: $(`[deed_id=documentSecondPersonState_${i}]`).val(),
                DocumentPurchaserPinCode: $(`[deed_id=documentSecondPersonPincode_${i}]`).val(),
            })
        }
        const document_witness = []
        for (let i = 0; i <= witnessIterationCount; i++) {
            document_witness.push({
                DocumentWitnessID: i + 1,
                DocumentWitnessGenderID: parseInt($(`[deed_id=documentWitnessPersonTitle_${i}]`).val()),
                DocumentWitnessRelationshipID: parseInt($(`[deed_id=documentWitnessPersonRelationshipTitle_${i}]`).val()),
                DocumentWitnessAge: $(`[deed_id=documentWitnessPersonAge_${i}]`).val(),
                DocumentWitnessDateOfBirth: $(`[deed_id=documentWitnessPersonDOB_${i}]`).val(),
                DocumentWitnessRelationName: $(`[deed_id=documentWitnessPersonRelationshipName_${i}]`).val(),
                DocumentWitnessName: $(`[deed_id=documentWitnessPersonName_${i}]`).val(),
                DocumentWitnessPAN: $(`[deed_id=documentWitnessPersonPAN_${i}]`).val(),
                DocumentWitnessAadharNumber: $(`[deed_id=documentWitnessPersonAadhar_${i}]`).val(),
                DocumentWitnessPhoneNumber: $(`[deed_id=documentWitnessPersonPhone_${i}]`).val(),
                DocumentWitnessDoorNo: $(`[deed_id=documentWitnessPersonDoorNo_${i}]`).val(),
                DocumentWitnessStreet: $(`[deed_id=documentWitnessPersonStreet_${i}]`).val(),
                DocumentWitnessDistrict: $(`[deed_id=documentWitnessPersonDistrict_${i}]`).val(),
                DocumentWitnessTaluk: $(`[deed_id=documentWitnessPersonTaluk_${i}]`).val(),
                DocumentWitnessState: $(`[deed_id=documentWitnessPersonState_${i}]`).val(),
                DocumentWitnessPinCode: $(`[deed_id=documentWitnessPersonPincode_${i}]`).val(),
            })
        }

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
            document_vendor: document_vendor,
            document_purchaser: document_purchaser,
            document_witness: document_witness,
            payment_details: payment_detail,
            property_details: property_detai,
            transfer_details: transfer_detail
        }
        console.log(details)
        function validateObject(obj) {
            if (obj instanceof Array) {
                obj.forEach(item => {
                    if (item instanceof Array || item instanceof Object) { validateObject(item) }
                    else if (item === undefined || item === null || item === NaN || item === "") { console.log(obj); hide_popup_alert('property details has null values', 1, 5000); throw new Error("Null values are present") }
                })
            }
            else if (obj instanceof Object) {
                for (let key in obj) {
                    if (obj[key] instanceof Array || obj[key] instanceof Object) { validateObject(obj[key]) }
                    else if (obj[key] === undefined || obj[key] === null || obj[key] === NaN || obj[key] === "") { console.log(key); hide_popup_alert(`${key} has null values`, 1, 5000); throw new Error("Null values are present") }
                }
            }
        }

        for (let key in details) {
            if (details[key] instanceof Array || details[key] instanceof Object) {
                validateObject(details[key])
            }
            else if (details[key] === undefined || details[key] === null || details[key] === NaN || details[key] === "") { console.log(key); hide_popup_alert(`${key} has null values`, 1, 5000); throw new Error("Null values are present") }
        }



        show_popup_alert()
        apirequest("POST", "api/Document", details).then(resp => {
            hide_popup_alert(resp.message)
            setTimeout(() => {
                location.reload()
            }, 2000);
        }).catch(error => {
            console.log(error)
            hide_popup_alert(error.message)
        })
    })
    $("#vendorInfoClone").click(
        function () {
            vendorIterationCount += 1;
            $('#hidden_use_element').html($($(".inputVendorInfo")[0]).clone())
            $('#hidden_use_element input[deed_id],#hidden_use_element select[deed_id]').each(function () {
                this.value = ""
                let deed_id = this.getAttribute('deed_id')
                console.log(deed_id.slice(0, deed_id.indexOf('_') + 1))
                this.setAttribute('deed_id', deed_id.slice(0, deed_id.indexOf('_') + 1) + vendorIterationCount)
            })
            $($("#hidden_use_element .inputVendorInfo")).appendTo('#append_vendor_clone')


            $('#hidden_use_element').html(deed_content)
            $('#hidden_use_element').html($('#hidden_use_element #first_person_details').html())
            $("#hidden_use_element span").each(function () {
                let changeid = this.getAttribute('id')
                changeid = changeid.slice(0, changeid.indexOf('_')) + `_${vendorIterationCount}`
                this.setAttribute('id', changeid)
            })
            let text = `<span id='first_person_details_${vendorIterationCount}'><span class="vendorConjuction"></span>${$("#hidden_use_element").html()}</span>`
            $(text).appendTo('#deed_body #first_person_details')
            inputEventListner()
            conjuctionRefresh()

        }
    )


    $("#vendorInfoRemoveClone").click(
        function () {
            if (vendorIterationCount > 0) {
                $('.inputVendorInfo').eq(vendorIterationCount).remove();
                $(`span#first_person_details_${vendorIterationCount}`).remove()
                vendorIterationCount--;
                conjuctionRefresh()
            }
        }
    )
    $("#purchaserInfoClone").click(
        function () {
            purchaserIterationCount += 1

            $('#hidden_use_element').html($($(".inputPurchaserInfo")[0]).clone())
            $('#hidden_use_element input[deed_id],#hidden_use_element select[deed_id]').each(function () {
                this.value = ""
                let deed_id = this.getAttribute('deed_id')
                console.log(deed_id.slice(0, deed_id.indexOf('_') + 1))
                this.setAttribute('deed_id', deed_id.slice(0, deed_id.indexOf('_') + 1) + purchaserIterationCount)
            })
            $($("#hidden_use_element .inputPurchaserInfo")).appendTo('#append_purchaser_clone')

            $('#hidden_use_element').html(deed_content)
            $('#hidden_use_element').html($('#hidden_use_element #Second_person_details').html())
            $("#hidden_use_element span").each(function () {
                let changeid = this.getAttribute('id')
                changeid = changeid.slice(0, changeid.indexOf('_')) + `_${purchaserIterationCount}`
                this.setAttribute('id', changeid)
            })
            let text = `<span id='Second_person_details_${purchaserIterationCount}'><span class="purchaserConjuction"></span>${$("#hidden_use_element").html()}</span>`
            $(text).appendTo('#deed_body #Second_person_details')
            inputEventListner()
            conjuctionRefresh()
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
            witnessIterationCount += 1;

            $('#hidden_use_element').html($($(".inputWitnessInfo")[0]).clone())
            $('#hidden_use_element input[deed_id],#hidden_use_element select[deed_id]').each(function () {
                this.value = ""
                let deed_id = this.getAttribute('deed_id')
                console.log(deed_id.slice(0, deed_id.indexOf('_') + 1))
                this.setAttribute('deed_id', deed_id.slice(0, deed_id.indexOf('_') + 1) + witnessIterationCount)
            })
            console.log($('.inputWitnessInfo').last()[0])
            $($("#hidden_use_element .inputWitnessInfo")).insertAfter($('.inputWitnessInfo').eq(witnessIterationCount-1))

            $('#hidden_use_element').html(deed_content)
            $('#hidden_use_element').html($('#hidden_use_element #Witness_person_details').html())
            $("#hidden_use_element span").each(function () {
                let changeid = this.getAttribute('id')
                changeid = changeid.slice(0, changeid.indexOf('_')) + `_${witnessIterationCount}`
                this.setAttribute('id', changeid)
            })
            let text = `<span id='Witness_person_details_${witnessIterationCount}'><span class="witnessConjuction"></span>${$("#hidden_use_element").html()}</span>`
            $(text).appendTo('#deed_body #Witness_person_details')
            inputEventListner()
            conjuctionRefresh()
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

}


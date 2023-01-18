import { mastersData, apirequest, document_details, storeInput } from "./data.js"
import { show_popup_alert,hide_popup_alert } from "./popup_alert.js";
const html2canvas = window.html2canvas
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

    $('table').each(function(){$(this).DataTable().clear().draw()})
    const data = document_details.Documents.map(item => {

        const application_no = item.DocumentApplicationNo.replace("Application No. ", "")
        const new_date = new Date(item.DocumentExecutionDate)

        return [application_no, item.DocumentExecutionPlace, new_date.toShortFormat(), `<button value=${item.DocumentID} class="document_view btn btn-primary">View</button><button style="margin: 0 20px ;" value=${item.DocumentID} class="document_edit btn btn-warning">Edit</button><button class="document_delete btn btn-danger" value=${item.DocumentID}>Delete</button>`]
    })
    if(data.length){
        table.rows.add(data).draw()
    }
    else{
        table.clear().draw()
        hide_popup_alert("No Data in the table",1,5000)
    }
    // table.draw()
    $(".document_view").each(function () {
        $(this).addClass('document_display_toggle')
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
                console.log(resp);
                setTable()
                hide_popup_alert(resp.message,0,5000)
            })
        })
    })

    $('.document_edit').each(function () {
        this.addEventListener('click', edit_document_entry_display)
    })
    $(".download_DOC").each(function () {
        $(this).click(function () {
            const jsPDF = window.jspdf;
            var doc = new jsPDF({ lineHeight: 2 });
            var source = $("#deed_body_view").text()
            console.log(source, typeof source)
            source = doc.splitTextToSize(source, 240)
            doc.setFontSize(12)
            doc.text(source, 10, 10)
            // doc.save()
            var o = {
                filename: 'test.doc'
            };
            $(document).googoose(o);
        })
    })
    $(".download_PDF").each(function () {
        $(this).click(function () {
            const jsPDF = window.jspdf;
            const html2pdf = window.html2pdf
            var doc = new jsPDF();
            $("#hidden_use_element").html("")
            $("#deed_body_view").clone().appendTo('#hidden_use_element');
            $('#hidden_use_element #deed_body_view *').each(function () { $(this).css('color', 'black'); console.log(this) })
            var source = $("#hidden_use_element #deed_body_view")[0]
            console.log(source, typeof source)
            doc.fromHTML(source,
                15,
                15,
                {
                    'width': 180,
                })
            doc.save()
        })
    })
    eventListeners()

}


setTable()



function eventListeners() {

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
    $(".new_document_entry_toggle").each(function () {
        $(this).click(function () {
            $("#table_display").addClass("d-none")
            $("#document_display").addClass("d-none")
            $("#new_document_entry").removeClass("d-none")
        })

    })
}

function edit_document_entry_display() {
    const rendered_document = document_details.Documents.filter(item => (item.DocumentID == this.value))[0]

    const test = CustomerGenders.map(item => (`<option value=${item.CustomerGenderID} data-token=${item.CustomerGenderValue}>${item.CustomerGenderValue}</option>`)).join("")
    console.log(test)




    let text = `<div class="row">
    <div class="col-sm-12 col-lg-6">
        <div class="card">
            <div class="card-header d-flex justify-content-between">
                <div class="header-title">
                    <h4 class="card-title">Create Document</h4>
                </div>
            </div>
            <div class="card-body">
                <form id="form-wizard1" class="mt-3 text-center">
                    <ul id="top-tab-list" class="p-0 row list-inline">
                        <li class="mb-2 col-lg-3 col-md-3 text-start active" id="account">
                            <a class="d-flex align-items-center flex-column" href="javascript:void();">
                                <div class="iq-icon">
                                    <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" height="20"
                                        width="20" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span style="font-size:medium;" class="dark-wizard">Document</span>
                            </a>
                        </li>
                        <li id="personal" class="mb-2 col-lg-3 col-md-3 text-start">
                            <a class="d-flex align-items-center flex-column" href="javascript:void();">
                                <div class="iq-icon">
                                    <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" height="20"
                                        width="20" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span style="font-size:medium;" class="dark-wizard">Vendor</span>
                            </a>
                        </li>
                        <li id="payment" class="mb-2 col-lg-3 col-md-3 text-start">
                            <a class="d-flex align-items-center flex-column" href="javascript:void();">
                                <div class="iq-icon">
                                    <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" height="20"
                                        width="20" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <span style="font-size:medium;" class="dark-wizard">Purchaser</span>
                            </a>
                        </li>
                        <li id="confirm" class="mb-2 col-lg-3 col-md-3 text-start">
                            <a class="d-flex align-items-center flex-column" href="javascript:void();">
                                <div class="iq-icon">
                                    <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" height="20"
                                        width="20" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span style="font-size:medium;" class="dark-wizard">Other</span>
                            </a>
                        </li>
                    </ul>
                    <!-- fieldsets -->
                    <fieldset>
                        <div class="form-card text-start">
                            <div class="row">
                                <div class="col-7">
                                    <h3 class="mb-4">Doc Information:</h3>
                                </div>
                                <div class="col-5">
                                    <button type="button" style="width: 208px;" class="table_display_toggle btn btn-secondary">View
                                        Table</button>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <div class="form-floating" id="inputDoucumentTypeDiv">
                                        <select class="form-control selectpicker"
                                            data-live-search="true" name="" id="inputDoucumentType">
                                            <option value="">Document Type</option>
                                            ${mastersData.DocumentTypes.map(item => (`<option value=${item.DocumentTypeID} data-token="${item.DocumentTypeTitle}" ${rendered_document.DocumentTypeID == item.DocumentTypeID ? "selected" : ""}>${item.DocumentTypeTitle}</option>`))}
                                        </select>
                                        <!-- <label for="inputDoucumentType">Document Type</label> -->
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <div class="form-floating" id="inputDoucumentLanguagediv">
                                        <select class="form-control selectpicker"
                                            ata-show-subtext="true" data-live-search="true" name=""
                                            id="inputDoucumentLanguage">
                                            <option value="#Document_Language">Document Language
                                            </option>
                                        </select>
                                        <!-- <label for="inputDoucumentLanguage">Document Language</label> -->
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating">
                                        <input type="text" value="${rendered_document.DocumentApplicationNo.replace("Application No. ", "")}" class="form-control" name=""
                                            deed_id="application_number" id="inputApplicationNo"
                                            placeholder="Enter Application No" />
                                        <label for="inputApplicationNo">Application No</label>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating">
                                        <input type="date" value="${rendered_document.DocumentExecutionDate}" class="form-control" name=""
                                            id="inputSaleDeedExecution" deed_id="deed_execution"
                                            placeholder="Enter Deed Execution" />
                                        <label for="inputSaleDeedExecution">Deed Execution</label>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating">
                                        <input type="text" value="${rendered_document.DocumentExecutionPlace}" class="form-control" name=""
                                            id="inputExcutionPlace" deed_id="execution_place"
                                            placeholder="Enter Execution Place" />
                                        <label for="inputExcutionPlace">Execution Place</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type="button" name="next"
                            class="btn btn-primary next action-button float-end"
                            value="Next">Next</button>
                    </fieldset>
                    <fieldset>
                        <div class="form-card text-start">
                            <div class="row">
                                <div class="col-7">
                                    <h3 class="mb-4">Vendor Information:</h3>
                                </div>
                                <div class="col-5">
                                    <button type="button"
                                        class="btn btn-dark float-md-end me-1 d-sm-none">Remove</button>
                                    <button type="button" id="vendorInfoClone"
                                        class="btn btn-primary float-md-end">Add</button>
                                    <button type="button" id="vendorInfoRemoveClone"
                                        class="btn btn-dark float-md-end me-1 d-none d-md-block">Remove</button>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 mb-12">
                                    <div class="form-floating" id="inputVendorTypeDiv">
                                        <select class="form-control selectpicker"
                                            data-live-search="true" name="" id="inputVendorType">
                                            <option value="#inputVendorType">Vendor Type</option>
                                            ${mastersData.CustomerType.map(item => (`<option value="${item.CustomerTypeID}" data-token="${item.CustomerTypeTitle}" ${rendered_document.DocumentVendorTypeID == item.CustomerTypeID ? "selected" : ""}>${item.CustomerTypeTitle}</option>`)).join("")}
                                        </select>
                                    </div>
                                </div>
                                ${rendered_document.document_vendor.map((itemp, index) => (
        `<div class="row justify-content-between" id="inputVendorInfo">
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating" id="inputVendorCategoryDiv">
                                            <select class="form-control selectpicker"
                                                data-live-search="true" name=""
                                                id="inputVendorCategory">
                                                <option value="#inputVendorType">Category</option>
                                                ${mastersData.CustomerCategory.map(item => {
            if (item.CustomerTypeID == rendered_document.DocumentVendorTypeID) {
                return (`<option value=${item.CustomerCategoryID} data-token="${item.CustomerCategoryTitle}" ${itemp.DocumentVendorCategoryID == item.CustomerCategoryID ? "selected" : ""}>${item.CustomerCategoryTitle}</option>`)
            }
            else { return "" }
        }).join("")}
                                            </select>
                                        </div>
                                    </div>

                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating" id="inputVendorTitleDiv">
                                            <select deed_id="documentFirstPersonTitle_${index}"
                                                class="form-control selectpicker"
                                                data-live-search="true" name="" id="inputVendorTitle">
                                                <option value="#inputVendorTitle">Title</option>

                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input deed_id="documentFirstPersonName_0" type="text"
                                                class="form-control" name="" id="inputVendorName"
                                                placeholder="Enter Name" />
                                            <label for="inputVendorName">Name</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input deed_id="documentFirstPersonDOB_0" type="date"
                                                class="form-control" name="" id="inputVendorDOB"
                                                placeholder="Enter D.O.B" />
                                            <label for="inputVendorDOB">D.O.B</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input deed_id="documentFirstPersonAge_0" type="text"
                                                class="form-control" name="" id="inputVendorAge"
                                                placeholder="Enter Age" />
                                            <label for="inputVendorAge">Age</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input deed_id="documentFirstPersonPAN_0" type="text"
                                                class="form-control" name="" id="inputVendorPan"
                                                placeholder="Enter Pan" />
                                            <label for="inputVendorPan">Pan</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating" id="inputVendorRelationshipDiv">
                                            <select deed_id="documentFirstPersonRelationshipTitle_0"
                                                class="form-control selectpicker"
                                                data-live-search="true" name=""
                                                id="inputVendorRelationship">
                                                <option value="#inputVendorRelationship">RelationShip
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input deed_id="documentFirstPersonRelationshipName_0"
                                                type="text" class="form-control" name=""
                                                id="inputVendorRelationName"
                                                placeholder="Relation Name" />
                                            <label for="inputVendorRelationName">Relation Name</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input type="text" deed_id="documentFirstPersonAadhar_0"
                                                class="form-control" name="" id="inputVendorAadhar"
                                                placeholder="Aadhar No" />
                                            <label for="inputVendorAadhar">Aadhar No</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" name=""
                                                id="inputVendorPhone" placeholder="Phone No" />
                                            <label for="inputVendorPhone">Phone No</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" name=""
                                                id="inputVendorAddress"
                                                deed_id="documentFirstPersonAddress_0"
                                                placeholder="Address" />
                                            <label for="inputVendorAddress">Address</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input type="text" deed_id="documentFirstPersonDistrict_0"
                                                class="form-control" name="" id="inputVendorDistrict"
                                                placeholder="District" />
                                            <label for="inputVendorDistrict">District</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input type="text" deed_id="documentFirstPersonTaluk_0"
                                                class="form-control" name="" id="inputVendorTaluk"
                                                placeholder="Taluk" />
                                            <label for="inputVendorTaluk">Taluk</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input type="text" deed_id="documentFirstPersonCity_0"
                                                class="form-control" name="" id="inputVendorCity"
                                                placeholder="City" />
                                            <label for="inputVendorCity">City</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input type="text" deed_id="documentFirstPersonState_0"
                                                class="form-control" name="" id="inputVendorState"
                                                placeholder="State" />
                                            <label for="inputVendorState">State</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" name=""
                                                id="inputVendorPincode"
                                                deed_id="documentFirstPersonPincode_0"
                                                placeholder="Pincode" />
                                            <label for="inputVendorPincode">Pincode</label>
                                        </div>
                                    </div>
                                </div>`
    ))}

                            </div>
                            <button type="button" name="next"
                                class="btn btn-primary next action-button float-end"
                                value="Next">Next</button>
                            <button type="button" name="previous"
                                class="btn btn-dark previous action-button-previous float-end me-1"
                                value="Previous">Previous</button>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-card text-start">
                            <div class="row">
                                <div class="col-7">
                                    <h3 class="mb-4">Purchaser Information:</h3>
                                </div>
                                <div class="col-5">
                                    <button type="button"
                                        class="btn btn-dark float-md-end me-1 d-sm-none">Remove</button>
                                    <button type="button" class="btn btn-primary float-md-end"
                                        id="purchaserInfoClone">Add</button>
                                    <button type="button" id="purchaserInfoRemoveClone"
                                        class="btn btn-dark float-md-end me-1 d-none d-md-block">Remove</button>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating" id="inputPurchaserTypeDiv">
                                        <select class="form-control selectpicker"
                                            data-live-search="true" name="" id="inputPurchaserType">
                                            <option value="#inputPurchaserType">Purchaser Type</option>
                                        </select>
                                        <!-- <label for="inputPurchaserType">Purchaser Type</label> -->
                                    </div>
                                </div>
                                <div class="row" id="inputPurchaserInfo">
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating" id="inputPurchaserCategoryDiv">
                                            <select class="form-control selectpicker"
                                                data-live-search="true" name=""
                                                id="inputPurchaserCategory">
                                                <option value="#inputPurchaserType">Category</option>
                                            </select>
                                            <!-- <label for="inputPurchaserType">Purchaser Type</label> -->
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating" id="inputPurchaserTitleDiv">
                                            <select deed_id="documentSecondPersonTitle_0"
                                                class="form-control selectpicker"
                                                data-live-search="true" name=""
                                                id="inputPurchaserTitle">
                                                <option value="#inputPurchaserType">Title</option>
                                            </select>
                                            <!-- <label for="inputPurchaserType">Purchaser Type</label> -->
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input deed_id="documentSecondPersonName_0" type="text"
                                                class="form-control" name="" id="inputPurchaserName"
                                                placeholder="Enter Name" />
                                            <label for="inputPurchaserName">Name</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input deed_id="documentSecondPersonDOB_0" type="date"
                                                class="form-control" name="" id="inputPurchaserDOB"
                                                placeholder="Enter D.O.B" />
                                            <label for="inputPurchaserDOB">D.O.B</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input deed_id="documentSecondPersonAge_0" type="text"
                                                class="form-control" name="" id="inputPurchaserAge"
                                                placeholder="Enter Age" />
                                            <label for="inputPurchaserAge">Age</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input deed_id="documentSecondPersonPAN_0" type="text"
                                                class="form-control" name="" id="inputPurchaserPan"
                                                placeholder="Enter Pan" />
                                            <label for="inputPurchaserPan">Pan</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating" id="inputPurchaserRelationshipDiv">
                                            <select deed_id="documentSecondPersonRelationshipTitle_0"
                                                class="form-control selectpicker"
                                                data-live-search="true" name=""
                                                id="inputPurchaserRelationship">
                                                <option value="#inputPurchaserRelationship">RelationShip
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input deed_id="documentSecondPersonRelationshipName_0"
                                                type="text" class="form-control" name=""
                                                id="inputPurchaserRelationName"
                                                placeholder="Relation Name" />
                                            <label for="inputPurchaserRelationName">Relation
                                                Name</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input type="text" deed_id="documentSecondPersonAadhar_0"
                                                class="form-control" name="" id="inputPurchaserAadhar"
                                                placeholder="Aadhar No" />
                                            <label for="inputPurchaserAadhar">Aadhar No</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" name=""
                                                id="inputPurchaserPhone" placeholder="Phone No" />
                                            <label for="inputPurchaserPhone">Phone No</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" name=""
                                                id="inputPurchaserAddress"
                                                deed_id="documentSecondPersonAddress_0"
                                                placeholder="Address" />
                                            <label for="inputPurchaserAddress">Address</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input type="text" deed_id="documentSecondPersonDistrict_0"
                                                class="form-control" name="" id="inputPurchaserDistrict"
                                                placeholder="District" />
                                            <label for="inputPurchaserDistrict">District</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input type="text" deed_id="documentSecondPersonTaluk_0"
                                                class="form-control" name="" id="inputPurchaserTaluk"
                                                placeholder="Taluk" />
                                            <label for="inputPurchaserTaluk">Taluk</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input type="text" deed_id="documentSecondPersonCity_0"
                                                class="form-control" name="" id="inputPurchaserCity"
                                                placeholder="City" />
                                            <label for="inputPurchaserCity">City</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input type="text" deed_id="documentSecondPersonState_0"
                                                class="form-control" name="" id="inputPurchaserState"
                                                placeholder="State" />
                                            <label for="inputPurchaserState">State</label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" name=""
                                                id="inputPurchaserPincode"
                                                deed_id="documentSecondPersonPincode_0"
                                                placeholder="Pincode" />
                                            <label for="inputPurchaserPincode">Pincode</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="button" name="next"
                                class="btn btn-primary next action-button float-end"
                                value="Next">Next</button>
                            <button type="button" name="previous"
                                class="btn btn-dark previous action-button-previous float-end me-1"
                                value="Previous">Previous</button>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div class="form-card">
                            <div class="row">
                                <div class="col-7">
                                    <h3 class="mb-4 text-left">Property Details:</h3>
                                </div>
                                <div class="col-5">
                                    <h2 class="steps">Step 4 - 4</h2>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating" id="inputWitnessTypeDiv">
                                        <select class="form-control selectpicker"
                                            data-live-search="true" name="" id="inputWitnessType">
                                            <option value="#inputWitnessType">Witness Type</option>
                                        </select>
                                        <!-- <label for="inputWitnessType">Witness Type</label> -->
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating" id="inputWitnessCategoryDiv">
                                        <select class="form-control selectpicker"
                                            data-live-search="true" name="" id="inputWitnessCategory">
                                            <option value="#inputWitnessType">Category</option>
                                        </select>
                                        <!-- <label for="inputWitnessType">Witness Type</label> -->
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating" id="inputWitnessTitleDiv">
                                        <select deed_id="documentWitnessPersonTitle"
                                            class="form-control selectpicker" data-live-search="true"
                                            name="" id="inputWitnessTitle">
                                            <option value="#inputWitnessType">Title</option>
                                        </select>
                                        <!-- <label for="inputWitnessType">Witness Type</label> -->
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating">
                                        <input deed_id="documentWitnessPersonName" type="text"
                                            deed_id="Witness_Name" class="form-control" name=""
                                            id="inputWitnessName" placeholder="Enter Name" />
                                        <label for="inputWitnessName">Name</label>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating">
                                        <input deed_id="documentWitnessPersonDOB" type="date"
                                            class="form-control" name="" id="inputWitnessDOB"
                                            placeholder="Enter D.O.B" />
                                        <label for="inputWitnessDOB">D.O.B</label>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating">
                                        <input deed_id="documentWitnessPersonAge" type="text"
                                            class="form-control" name="" id="inputWitnessAge"
                                            placeholder="Enter Age" />
                                        <label for="inputWitnessAge">Age</label>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating">
                                        <input deed_id="documentWitnessPersonPAN" type="text"
                                            class="form-control" name="" id="inputWitnessPan"
                                            placeholder="Enter Pan" />
                                        <label for="inputWitnessPan">Pan</label>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating" id="inputWitnessRelationshipDiv">
                                        <select deed_id="documentWitnessPersonRelationshipTitle"
                                            class="form-control selectpicker" data-live-search="true"
                                            name="" id="inputWitnessRelationship">
                                            <option value="#inputWitnessRelationship">RelationShip
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating">
                                        <input deed_id="documentWitnessPersonRelationshipName"
                                            type="text" class="form-control" name=""
                                            id="inputWitnessRelationName" placeholder="Relation Name" />
                                        <label for="inputWitnessRelationName">Relation Name</label>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating">
                                        <input type="text" deed_id="documentWitnessPersonAadhar"
                                            class="form-control" name="" id="inputWitnessAadhar"
                                            placeholder="Aadhar No" />
                                        <label for="inputWitnessAadhar">Aadhar No</label>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating">
                                        <input type="text" class="form-control" name=""
                                            id="inputWitnessPhone" placeholder="Phone No" />
                                        <label for="inputWitnessPhone">Phone No</label>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating">
                                        <input type="text" class="form-control" name=""
                                            id="inputWitnessAddress"
                                            deed_id="documentWitnessPersonAddress"
                                            placeholder="Address" />
                                        <label for="inputWitnessAddress">Address</label>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating">
                                        <input type="text" deed_id="documentWitnessPersonDistrict"
                                            class="form-control" name="" id="inputWitnessDistrict"
                                            placeholder="District" />
                                        <label for="inputWitnessDistrict">District</label>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating">
                                        <input type="text" deed_id="documentWitnessPersonTaluk"
                                            class="form-control" name="" id="inputWitnessTaluk"
                                            placeholder="Taluk" />
                                        <label for="inputWitnessTaluk">Taluk</label>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating">
                                        <input type="text" deed_id="documentWitnessPersonCity"
                                            class="form-control" name="" id="inputWitnessCity"
                                            placeholder="City" />
                                        <label for="inputWitnessCity">City</label>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating">
                                        <input type="text" deed_id="documentWitnessPersonState"
                                            class="form-control" name="" id="inputWitnessState"
                                            placeholder="State" />
                                        <label for="inputWitnessState">State</label>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating">
                                        <input type="text" class="form-control" name=""
                                            id="inputWitnessPincode"
                                            deed_id="documentWitnessPersonPincode"
                                            placeholder="Pincode" />
                                        <label for="inputWitnessPincode">Pincode</label>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <div class="form-floating" id="inputPropertyTypeDiv">
                                        <select class="form-control selectpicker" name=""
                                            data-live-search="true" id="inputPropertyType">
                                            <option value="#inputPropertyType">Property Type</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <div class="row">
                                        <div class="col-md-4 mb-3">
                                            <h6 class="card-title">Property Details</h6>
                                        </div>
                                        <div class="col-md-8 float-md-end">
                                            <button type="button"
                                                onclick="removecloneform('PropertyDetailsFormInputClone')"
                                                class="btn btn-dark float-md-end me-1 d-sm-none">Remove</button>
                                            <button type="button"
                                                onclick="cloneform('PropertyDetailsFormInput','PropertyDetailsFormClone')"
                                                class="btn btn-primary float-md-end">Add</button>
                                            <button type="button"
                                                onclick="removecloneform('PropertyDetailsFormInputClone')"
                                                class="btn btn-dark float-md-end me-1 d-none d-md-block">Remove</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class=" mb-3 PropertyDetailsFormInput">
                                        <div class="form-floating">
                                            <textarea class="property_details form-control"
                                                name="inputPropertyDetails[]" id="" cols="30"
                                                rows="10"></textarea>
                                            <label for="inputPropertyDetails">Property Details</label>
                                        </div>
                                    </div>
                                </div>
                                <!-- Clone Form -->
                                <div class="PropertyDetailsFormClone"></div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <div class="row">
                                        <div class="col-md-4 mb-3">
                                            <h6 class="card-title">Transfer Details</h6>
                                        </div>
                                        <div class="col-md-8 float-md-end">
                                            <button type="button"
                                                onclick="removecloneform('TransferDetailsFormInputClone')"
                                                class="btn btn-dark float-md-end me-1 d-sm-none">Remove</button>
                                            <button type="button"
                                                onclick="cloneform('TransferDetailsFormInput','TransferDetailsFormClone')"
                                                class="btn btn-primary float-md-end">Add</button>
                                            <button type="button"
                                                onclick="removecloneform('TransferDetailsFormInputClone')"
                                                class="btn btn-dark float-md-end me-1 d-none d-md-block">Remove</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="mb-3 TransferDetailsFormInput">
                                        <div class="form-floating">
                                            <textarea class="transfer_details form-control"
                                                name="inputTransferDetails[]" cols="30"
                                                rows="10"></textarea>
                                            <label for="inputTransferDetails">Transfer Details</label>
                                        </div>
                                    </div>
                                </div>
                                <!-- Clone Form -->
                                <div class="TransferDetailsFormClone"></div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <div class="row">
                                        <div class="col-md-4 mb-3">
                                            <h6 class="card-title">Payment Details</h6>
                                        </div>
                                        <div class="col-md-8 float-md-end">
                                            <button type="button"
                                                onclick="removecloneform('PaymentDetailsFormInputClone')"
                                                class="btn btn-dark float-md-end me-1 d-sm-none">Remove</button>
                                            <button type="button"
                                                onclick="cloneform('PaymentDetailsFormInput','PaymentDetailsFormClone')"
                                                class="btn btn-primary float-md-end">Add</button>
                                            <button type="button"
                                                onclick="removecloneform('PaymentDetailsFormInputClone')"
                                                class="btn btn-dark float-md-end me-1 d-none d-md-block">Remove</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class=" mb-3 PaymentDetailsFormInput">
                                        <div class="form-floating">
                                            <textarea class="payment_details form-control"
                                                name="inputPaymentDetails[]" cols="30"
                                                rows="10"></textarea>
                                            <label for="inputPaymentDetails">Payment Details</label>
                                        </div>
                                    </div>
                                </div>
                                <!-- Clone Form -->
                                <div class="PaymentDetailsFormClone"></div>
                            </div>
                            <br><br>
                            <br>
                            <br><br>
                            <button type="button" name="next" id="save_button"
                                class="btn btn-primary float-end me-1" value="">Save</button>
                            <button type="button" name="previous"
                                class="btn btn-dark previous action-button-previous float-end me-1"
                                value="Previous">Previous</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    </div>
    <div class="col-sm-12 col-lg-6">
        <div class="card max-height-vh-70">
            <div class="card-header pb-0 px-3 d-flex align-items-center justify-content-center">
                <h3>DEED</h3>
            </div>
            <div class="d-flex align-items-center justify-content-center text-center">
                <img class="img-fluid rounded" src="../../assets/svg/graphic-stamp-paper.svg" alt="">
            </div>
            <div class="card-body p-2 overflow-auto h-75" id="deed_body">
            </div>
        </div>

    </div>
</div>`




}

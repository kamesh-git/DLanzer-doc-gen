import { show_popup_alert, hide_popup_alert } from "./popup_alert.js"

$("#username").html(localStorage.getItem('UserName'))
$("#useremail").html(localStorage.getItem('UserEmail'))
$("#hello_username").html('Hello '+localStorage.getItem('UserName'))
$("#logout_user").click(function () {
    localStorage.clear()
    location.reload()
})
$("#change_password").submit(function (e) {
    e.preventDefault();
    const oldPassword = $(this).find("#oldPassword").val()
    const newPassword = $(this).find("#newPassword").val()
    const confirmPassword = $(this).find("#confirmPassword").val()

    if (newPassword !== confirmPassword) {
        const error_handler = `<div id="error_handler" class="mb-3">
            <p class="text-danger">Passwords did not match</p>
        </div>`
        $(this).find("#error_handler").remove()
        $(error_handler).appendTo($(this).find(".modal-body"))
        throw new Error("passwords mismatch")
    }
    show_popup_alert()
    apirequest("POST", 'api/Auth/ChangePassword', {
        OldPassword: oldPassword,
        NewPassword: newPassword,
        ConfirmPassword: confirmPassword
    }).then(resp => {
        hide_popup_alert(resp.message)
        $('#exampleModal').modal('hide')
    }, err => hide_popup_alert(err.message,1))
})

const base_url = 'https://doc.dlanzer.com/laravel/public/'
const authToken = localStorage.getItem('token')
if (authToken === null || authToken === 'undefined' || authToken == "") {
    window.location.href = location.href.slice(0, location.href.lastIndexOf('/')) + "/sign-in.html";
}
function apirequest(method, endpoint, Body = {}) {
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
                    if(resp.status == 401){
                        localStorage.clear();
                        location.reload()
                    };
                    resp.json().then(data => { reject(data) })
                }
            }).catch(err => { 
                console.log(err)
                reject(err) 
            })
        }

        else if (method === "POST" || method === "PUT") {
            fetch(base_url + endpoint, {
                method: method,
                body: JSON.stringify(Body),
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
    })
}


let mastersData, document_details;
const addObj = [
    {            
    "DocumentID": 4,
    "DocumentTypeID": 1,
    "DocumentLanguageID": 1,
    "DocumentTemplateID": 1,
    "DocumentVendorTypeID": 1,
    "DocumentPurchaserTypeID": 2,
    "DocumentPropertyTypeID": 1,
    "DocumentApplicationNo": "test",
    "DocumentExecutionPlace": "Chennai",
    "DocumentExecutionDate": "2023-02-22",
    "DocumentTemplateHTML": "<p class=\"p-2 pb-2 pt-3 mb-0 \"><b>THIS DEED OF SALE</b> executed at <span id=\"execution_place\">Chennai</span> on this <span id=\"deed_execution\">22nd February 2023</span>,  <span id=\"first_person_details_0\"><span id=\"Conjuction_0\" class=\"vendorConjuction\"></span><span id=\"DocumentVendorCompanyDetails_0\"><span class=\"vendorCompany\"><span class=\"vendorCompanyName\">Dlanzer</span>, Reg No <span class=\"vendorCompanyRegNo\">2020108011</span>, <span class=\"vendorCompanyAddress\">No:11 Ramar Street Ashok Nagar Avadi</span> </span> represented by, </span> <span id=\"documentFirstPersonCategory_0\">Proprietor</span> <span id=\"documentFirstPersonTitle_0\">Mr.</span><span id=\"documentFirstPersonName_0\">KAMESH A</span><b> (Phone:<span id=\"documentFirstPersonPhone_0\">8610769361</span>, PAN:<span id=\"documentFirstPersonPAN_0\">CATPV2244J</span>, Aadhar:<span id=\"documentFirstPersonAadhar_0\">75985867</span>)</b> <span id=\"documentFirstPersonRelationshipTitle_0\">Husband of</span> <span id=\"documentFirstPersonRelationshipName_0\">Vimala</span>  aged about <span id=\"documentFirstPersonAge_0\">20</span>-Years residing at <span id=\"documentFirstPersonAddress_0\">No:11 Ramar Street Ashok Nagar Avadi</span>, <span id=\"documentFirstPersonDistrict_0\">Vellore</span> <span id=\"documentFirstPersonCity_0\">Chennai</span>-<span id=\"documentFirstPersonPincode_0\">600062</span> <span class=\"\" id=\"firstPersonRepresenterDetails_0\">represented by, <span id=\"documentFirstPersonRepresenterType_0\"></span> <span id=\"documentFirstPersonRepresenterTitle_0\">#first_person_representer_Title</span><span id=\"documentFirstPersonRepresenterName_0\">#first_person_representer_Name</span><b> (Phone:<span id=\"documentFirstPersonRepresenterPhone_0\">#first_person_representer_Phone</span>, PAN:<span id=\"documentFirstPersonRepresenterPAN_0\">#first_person_representer_PAN</span>, Aadhar:<span id=\"documentFirstPersonRepresenterAadhar_0\">#first_person_representer_Aadhar</span>)</b> <span id=\"documentFirstPersonRepresenterRelationshipTitle_0\">#first_person_representer_Relationship_Title</span> <span id=\"documentFirstPersonRepresenterRelationshipName_0\">#first_person_representer_Relationship_Name</span> aged about <span id=\"documentFirstPersonRepresenterAge_0\">#first_person_representer_Age</span>-Years, residing at <span id=\"documentFirstPersonRepresenterAddress_0\">#first_person_representer_Address</span>,<span id=\"documentFirstPersonRepresenterDistrict_0\">#First_Person_representer_District</span> <span id=\"documentFirstPersonRepresenterCity_0\">#first_person_representer_City</span>-<span id=\"documentFirstPersonRepresenterPincode_0\">#first_person_representer_Pincode</span></span></span><span id=\"first_person_details_1\" class=\"d-none\"><span id=\"Conjuction_1\" class=\"vendorConjuction\"></span><span id=\"DocumentVendorCompanyDetails_1\"></span> <span id=\"documentFirstPersonCategory_1\"></span> <span id=\"documentFirstPersonTitle_1\">#First_Person_Title</span><span id=\"documentFirstPersonName_1\">#First_Person_Name</span><b> (Phone:<span id=\"documentFirstPersonPhone_1\">#First_Person_Phone</span>, PAN:<span id=\"documentFirstPersonPAN_1\">#First_Person_PAN</span>, Aadhar:<span id=\"documentFirstPersonAadhar_1\">#First_Person_Aadhar</span>)</b> <span id=\"documentFirstPersonRelationshipTitle_1\">#First_Person_Relationship_Title</span> <span id=\"documentFirstPersonRelationshipName_1\">#First_Person_Relationship_Name</span>  aged about <span id=\"documentFirstPersonAge_1\">#First_Person_Age</span>-Years residing at <span id=\"documentFirstPersonAddress_1\">#First_Person_Address</span>, <span id=\"documentFirstPersonDistrict_1\">#First_Person_District</span> <span id=\"documentFirstPersonCity_1\">#First_Person_City</span>-<span id=\"documentFirstPersonPincode_1\">#First_Person_Pincode</span> <span class=\"d-none\" id=\"firstPersonRepresenterDetails_1\">represented by, <span id=\"documentFirstPersonRepresenterType_1\"></span> <span id=\"documentFirstPersonRepresenterTitle_1\">#first_person_representer_Title</span><span id=\"documentFirstPersonRepresenterName_1\">#first_person_representer_Name</span><b> (Phone:<span id=\"documentFirstPersonRepresenterPhone_1\">#first_person_representer_Phone</span>, PAN:<span id=\"documentFirstPersonRepresenterPAN_1\">#first_person_representer_PAN</span>, Aadhar:<span id=\"documentFirstPersonRepresenterAadhar_1\">#first_person_representer_Aadhar</span>)</b> <span id=\"documentFirstPersonRepresenterRelationshipTitle_1\">#first_person_representer_Relationship_Title</span> <span id=\"documentFirstPersonRepresenterRelationshipName_1\">#first_person_representer_Relationship_Name</span> aged about <span id=\"documentFirstPersonRepresenterAge_1\">#first_person_representer_Age</span>-Years, residing at <span id=\"documentFirstPersonRepresenterAddress_1\">#first_person_representer_Address</span>,<span id=\"documentFirstPersonRepresenterDistrict_1\">#First_Person_representer_District</span> <span id=\"documentFirstPersonRepresenterCity_1\">#first_person_representer_City</span>-<span id=\"documentFirstPersonRepresenterPincode_1\">#first_person_representer_Pincode</span></span></span> hereinafter called the <b><span class=\"vendorPlural\">VENDOR</span></b> of ONE PART </p><h5 class=\"p-3 pt-0 pb-0 d-flex align-items-center justify-content-center\">TO AND IN FAVOUR OF</h5><p class=\"p-2 pt-0 pb-2 mb-0 \"><span id=\"second_person_details_0\"><span id=\"Conjuction_0\" class=\"purchaserConjuction\"></span><span id=\"DocumentPurchaserCompanyDetails_0\"><span class=\"purchaserCompany\"><span class=\"purchaserCompanyName\">Dlanzer</span>, Reg No <span class=\"purchaserCompanyRegNo\">2020108011</span>, <span class=\"purchaserCompanyAddress\">No:11 Ramar Street Ashok Nagar Avadi</span> represented by, </span></span>  <span id=\"documentSecondPersonCategory_0\"></span> <span id=\"documentSecondPersonTitle_0\">Mr.</span><span id=\"documentSecondPersonName_0\">KAMESH A</span><b> (Phone:<span id=\"documentSecondPersonPhone_0\">8610769361</span>, PAN:<span id=\"documentSecondPersonPAN_0\">98790867</span>, Aadhar:<span id=\"documentSecondPersonAadhar_0\">9769769786</span>)</b> <span id=\"documentSecondPersonRelationshipTitle_0\">Husband of</span> <span id=\"documentSecondPersonRelationshipName_0\">Veeran</span>  aged about <span id=\"documentSecondPersonAge_0\">20</span>-Years, residing at <span id=\"documentSecondPersonAddress_0\">No:11 Ramar Street Ashok Nagar Avadi</span>,<span id=\"documentSecondPersonDistrict_0\">Thiruvallur</span> <span id=\"documentSecondPersonCity_0\">Chennai</span>-<span id=\"documentSecondPersonPincode_0\">600062</span><span class=\"\" id=\"secondPersonRepresenterDetails_0\">represented by, <span id=\"documentSecondPersonRepresenterType_0\">Guardian</span> <span id=\"documentSecondPersonRepresenterTitle_0\">Mr.</span><span id=\"documentSecondPersonRepresenterName_0\">KAMESH A</span><b> (Phone:<span id=\"documentSecondPersonRepresenterPhone_0\">8610769361</span>, PAN:<span id=\"documentSecondPersonRepresenterPAN_0\">HDHDH83736</span>, Aadhar:<span id=\"documentSecondPersonRepresenterAadhar_0\">9079687685</span>)</b> <span id=\"documentSecondPersonRepresenterRelationshipTitle_0\">Husband of</span> <span id=\"documentSecondPersonRepresenterRelationshipName_0\">Vimala</span> aged about <span id=\"documentSecondPersonRepresenterAge_0\">20</span>-Years, residing at <span id=\"documentSecondPersonRepresenterAddress_0\">No:11 Ramar Street Ashok Nagar Avadi</span>,<span id=\"documentSecondPersonRepresenterDistrict_0\">Tn</span> <span id=\"documentSecondPersonRepresenterCity_0\">Chennai</span>-<span id=\"documentSecondPersonRepresenterPincode_0\">600062</span></span></span><span id=\"second_person_details_1\" class=\"d-none\"><span id=\"Conjuction_1\" class=\"purchaserConjuction\"></span><span id=\"DocumentPurchaserCompanyDetails_1\"></span>  <span id=\"documentSecondPersonCategory_1\"></span> <span id=\"documentSecondPersonTitle_1\">#Second_Person_Title</span><span id=\"documentSecondPersonName_1\">#Second_Person_Name</span><b> (Phone:<span id=\"documentSecondPersonPhone_1\">#Second_Person_Phone</span>, PAN:<span id=\"documentSecondPersonPAN_1\">#Second_Person_PAN</span>, Aadhar:<span id=\"documentSecondPersonAadhar_1\">#Second_Person_Aadhar</span>)</b> <span id=\"documentSecondPersonRelationshipTitle_1\">#Second_Person_Relationship_Title</span> <span id=\"documentSecondPersonRelationshipName_1\">#Second_Person_Relationship_Name</span>  aged about <span id=\"documentSecondPersonAge_1\">#Second_Person_Age</span>-Years, residing at <span id=\"documentSecondPersonAddress_1\">#Second_Person_Address</span>,<span id=\"documentSecondPersonDistrict_1\">#Second_Person_District</span> <span id=\"documentSecondPersonCity_1\">#Second_Person_City</span>-<span id=\"documentSecondPersonPincode_1\">#Second_Person_Pincode</span><span class=\"d-none\" id=\"secondPersonRepresenterDetails_1\">represented by, <span id=\"documentSecondPersonRepresenterType_1\"></span> <span id=\"documentSecondPersonRepresenterTitle_1\">#Second_person_representer_Title</span><span id=\"documentSecondPersonRepresenterName_1\">#Second_person_representer_Name</span><b> (Phone:<span id=\"documentSecondPersonRepresenterPhone_1\">#Second_person_representer_Phone</span>, PAN:<span id=\"documentSecondPersonRepresenterPAN_1\">#Second_person_representer_PAN</span>, Aadhar:<span id=\"documentSecondPersonRepresenterAadhar_1\">#Second_person_representer_Aadhar</span>)</b> <span id=\"documentSecondPersonRepresenterRelationshipTitle_1\">#Second_person_representer_Relationship_Title</span> <span id=\"documentSecondPersonRepresenterRelationshipName_1\">#Second_person_representer_Relationship_Name</span> aged about <span id=\"documentSecondPersonRepresenterAge_1\">#Second_person_representer_Age</span>-Years, residing at <span id=\"documentSecondPersonRepresenterAddress_1\">#Second_person_representer_Address</span>,<span id=\"documentSecondPersonRepresenterDistrict_1\">#Second_person_representer_District</span> <span id=\"documentSecondPersonRepresenterCity_1\">#Second_person_representer_City</span>-<span id=\"documentSecondPersonRepresenterPincode_1\">#Second_person_representer_Pincode</span></span></span> hereinafter called the <b><span class=\"purchaserPlural\">PURCHASER</span></b> of OTHER PART </p><p class=\"p-2 pt-0 pb-2 mb-0 \">The terms “the <span class=\"vendorPlural\">VENDOR</span> and the <span class=\"purchaserPlural\">PURCHASER</span>” shall mean and include wherever the context so requires, or permits, them/their heirs, legal representatives, executors, administrators, nominees and assigns:</p><p class=\"p-2 pt-0 pb-2 mb-0 \" id=\"documentPropertySchedule_1\" style=\"\">WHEREAS the <span class=\"vendorPlural\">VENDOR</span> <span id=\"DocumentScheduleProp_1\">hkbhbjhvb</span>, in <span id=\"DocumentSchedulePropType_1\">Schedule B</span>.</p><p class=\"p-2 pt-0 pb-2 mb-0 \" id=\"documentPropertySchedule_2\" style=\"display:none;\">WHEREAS the <span class=\"vendorPlural\">VENDOR</span> <span id=\"DocumentScheduleProp_2\">#property schedule</span>, in <span id=\"DocumentSchedulePropType_2\">schedule of property</span>.</p> <p class=\"p-2 pt-0 pb-2 mb-0 \" id=\"transfer_details\"><span>hjvgkjbsjhjhdvjhdvjhy</span></p><p class=\"p-2 pt-0 pb-2 mb-0 \">WHEREAS the <span class=\"vendorPlural\">VENDOR</span> has been in continuous, uninterrupted peaceful possession and absolute enjoyment thereof, paying all taxes to the Government and Local authorities till this date, with full powers of alienation without any let or hindrance, having got valid and marketable title to the said property WHEREAS the <span class=\"vendorPlural\">VENDOR</span> herein are desirous of selling their property more fully described in the SCHEDULE PROPERTY hereunder to the PURCHASER herein due to various reason and made an offer to sell out the same and PURCHASER accepted to the offer made by the <span class=\"vendorPlural\">VENDOR</span> in purchasing the same, free from all encumbrances.Whereas the <span class=\"vendorPlural\">VENDOR</span> have agreed to sell and the Purchaser has agreed to purchase the SCHEDULE PROPERTY for a total consideration of <span class=\"DocumentPrice\">Rs.3,50,000/-</span> <span class=\"DocumentPriceWords\">(three lakh fifty thousand )</span> free from all encumbrances, charges and liens.</p> <div><p class=\"p-2 pt-0 pb-2 mb-0 \"><b>II- NOW THIS DEED OF SALE WITNESSETH AS FOLLOWS </b></p> <p class=\"p-2 pt-0 pb-2 mb-0 \">The <span class=\"vendorPlural\">VENDOR</span> hereby agrees to sell to the PURCHASER and the PURCHASER agrees to purchase the property more fully described in the Schedule hereunder for a total sale consideration of <span class=\"DocumentPrice\">Rs.3,50,000/-</span> <span class=\"DocumentPriceWords\">(three lakh fifty thousand )</span> from all encumbrances.</p><div class=\"p-2 pt-0 pb-2 mb-0 \" id=\"payment_Details\"><span><p>,mcm nksxbcksbdc</p></span></div><p class=\"p-2 pt-0 pb-2 mb-0 \"> 1. The <span class=\"vendorPlural\">VENDOR</span> do hereby covenant that they are the absolute and exclusive owner of the property hereby sold and that no one else has or have any claim or legal heirs of <span class=\"vendorPlural\">VENDOR</span>, right or interest in the same and that the <span class=\"vendorPlural\">VENDOR</span> have not done or suffered to be done any act deed or thing by which their absolute and exclusive title hereby conveyed is in any way affected and that notwithstanding anything done or omitted to be done or suffered to be done, the <span class=\"vendorPlural\">VENDOR</span> have at present full and absolute right and title to the property hereby sold in the manner herein done. The <span class=\"vendorPlural\">VENDOR</span> further covenant and declare that the property hereby sold is not subject to any mortgage, charge, claim, lien, attachment and it has not been furnished as security or guarantee and the said property is being sold free from all encumbrances. <br><br> 2. The <span class=\"vendorPlural\">VENDOR</span> further declare that there is no suit or any proceedings in any court in respect of the title of the said property. <br><br> 3. The <span class=\"vendorPlural\">VENDOR</span> further covenant and undertake to indemnify the <span class=\"purchaserPlural\">PURCHASER</span> against any loss or damages by reason of any defect in title or encumbrances whether patent or latent and also undertake to the cost to depend any action against the <span class=\"purchaserPlural\">PURCHASER</span> in respect of the property hereby sold and will keep the <span class=\"purchaserPlural\">PURCHASER</span> harmless and keep them fully indemnified. <br><br> 4. The <span class=\"purchaserPlural\">PURCHASER</span> shall be entitled to effect mutation of their names in the records of Corporation Registry and Government Revenue records by virtue of this Sale Deed and that the <span class=\"vendorPlural\">VENDOR</span> do hereby agree that they will execute and sign all such documents that may be necessary in this behalf. <br><br> 5. The <span class=\"vendorPlural\">VENDOR</span> have this day put the <span class=\"purchaserPlural\">PURCHASER</span> in vacant possession of the property hereby convey <br><br> 6. The <span class=\"vendorPlural\">VENDOR</span> covenant with the <span class=\"purchaserPlural\">PURCHASER</span> that the land has been surveyed and the measurements descriptions of the land and boundaries mentioned in the schedule here underwritten are correct and that there are no encroachments in relation to any part of the sale property. </p></div><span id=\"schedule_property_details_1\" style=\"\"><p class=\"p-2 pt-0 pb-2 mb-0\" id=\"documentPropertyType_1\">land &amp; Building</p><p class=\"p-2 pt-0 pb-2 mb-0\" id=\"documentScheduleDetails_0\"><h6 style=\"text-align:center;\">Schedule of property</h6><span class=\"scheduleDetails\">ljnckjlvskljvbdk</span><br><br><h6 style=\"text-align:center;\">Schedule B</h6><span class=\"scheduleDetails\">,jbkljbkhjjhjhvhj</span></p><p class=\"p-2 pt-0 pb-2 mb-0\" id=\"documentBoundedDetails_1\"><b class=\"d-block p-2 ps-0 pt-0 pb-2 mb-0\">Bounded on the: -</b>North by: <span id=\"documentBoundedNorthBy_1\">K</span><br>South by: <span id=\"documentBoundedSouthBy_1\">K</span><br>East by: <span id=\"documentBoundedEastBy_1\">K</span><br>West by: <span id=\"documentBoundedWestBy_1\">K</span><br> </p><p class=\"p-2 pt-0 pb-2 mb-0\" id=\"documentMeasuringDetails_1\"><b class=\"d-block p-2 ps-0 pt-0 pb-2 mb-0\">Measuring: -</b>East to West on the Northern side:<span id=\"documentMeasuringEWN_1\">K</span><br>East to West on the Southern side::<span id=\"documentMeasuringEWS_1\">K</span><br>North to South on the Eastern side:<span id=\"documentMeasuringNSE_1\">K</span><br>North to South on the Western side:<span id=\"documentMeasuringNSW_1\">K</span><br></p><p class=\"p-2 pt-0 pb-2 mb-0\">TaxNo:-<span id=\"documentPropertyTaxNo_1\">9</span><br>ElecServiceNo:-<span id=\"documentElecServiceNo_1\">9</span></p></span><span id=\"schedule_property_details_2\" style=\"display:none;\"><p class=\"p-2 pt-0 pb-2 mb-0\" id=\"documentPropertyType_2\">#PropertyType</p><p class=\"p-2 pt-0 pb-2 mb-0\" id=\"documentScheduleDetails_2\">#Property_Details</p><p class=\"p-2 pt-0 pb-2 mb-0\" id=\"documentBoundedDetails_2\"><b class=\"d-block p-2 ps-0 pt-0 pb-2 mb-0\">Bounded on the: -</b>North by: <span id=\"documentBoundedNorthBy_2\">-----</span><br>South by: <span id=\"documentBoundedSouthBy_2\">-----</span><br>East by: <span id=\"documentBoundedEastBy_2\">-----</span><br>West by: <span id=\"documentBoundedWestBy_2\">-----</span><br> </p><p class=\"p-2 pt-0 pb-2 mb-0\" id=\"documentMeasuringDetails_2\"><b class=\"d-block p-2 ps-0 pt-0 pb-2 mb-0\">Measuring: -</b>East to West on the Northern side:<span id=\"documentMeasuringEWN_2\">-----</span><br>East to West on the Southern side::<span id=\"documentMeasuringEWS_2\">-----</span><br>North to South on the Eastern side:<span id=\"documentMeasuringNSE_2\">-----</span><br>North to South on the Western side:<span id=\"documentMeasuringNSW_2\">-----</span><br></p><p class=\"p-2 pt-0 pb-2 mb-0\">TaxNo:-<span id=\"documentPropertyTaxNo_2\">-----</span><br>ElecServiceNo:-<span id=\"documentElecServiceNo_2\">-----</span></p></span><div class=\"p-2 pt-0 d-none pb-2 mb-0\">In total 775 Sq.ft  of vacant house site  situated within the Registration district of North Chennai and  Sub District of Madhavaram .Total Market value: <span class=\"DocumentPrice\">Rs.3,50,000/-</span> <span class=\"DocumentPriceWords\">(three lakh fifty thousand )</span><br> IN WITNESS WHEREOF THE PARTIES HEREIN HAVE HEREUNTO SET AND SUBSCRIBED THEIR RESPECTIVE HANDS AND SIGNATURES ON THE DAY, MONTH AND YEAR FIRST ABOVE WRITTEN IN THE PRESENCE OF THE FOLLOWING WITNESS</div> <p class=\"p-2 pt-0 pb-2 mb-0\"><span class=\"p-2 ps-0 h5 pt-0 pb-0 d-block\">Witness</span><span id=\"Witness_person_details_0\"><span id=\"Conjuction_0\" class=\"witnessConjuction\"></span><span id=\"documentWitnessPersonTitle_0\">Mr.</span><span id=\"documentWitnessPersonName_0\">KAMESH A</span><br><span id=\"documentWitnessPersonRelationshipTitle_0\">Husband of</span> <span id=\"documentWitnessPersonRelationshipName_0\">Vimala</span> <br> <span id=\"documentWitnessPersonAddress_0\">No:11 Ramar Street Ashok Nagar Avadi</span><br><span id=\"documentWitnessPersonTaluk_0\">Chn</span> <br><span id=\"documentWitnessPersonDistrict_0\">Tn</span><br><span id=\"documentWitnessPersonCity_0\">Chennai</span>-<span id=\"documentWitnessPersonPincode_0\">600062</span><br>Aadhar.No:<span id=\"documentWitnessPersonAadhar_0\">0870987987</span></span><span id=\"Witness_person_details_1\" class=\"d-none\" '=\"\"><span id=\"Conjuction_1\" class=\"witnessConjuction\"></span><span id=\"documentWitnessPersonTitle_1\">#Witness_Person_Title</span><span id=\"documentWitnessPersonName_1\">#Witness_Person_Name</span><br><span id=\"documentWitnessPersonRelationshipTitle_1\">#Witness_Person_Relationship_Title</span> <span id=\"documentWitnessPersonRelationshipName_1\">#Witness_Person_Relationship_Name</span> <br> <span id=\"documentWitnessPersonAddress_1\">#Witness_Person_Address</span><br><span id=\"documentWitnessPersonTaluk_1\">#Witness_Person_Taluk</span> <br><span id=\"documentWitnessPersonDistrict_1\">#Witness_Person_District</span><br><span id=\"documentWitnessPersonCity_1\">#Witness_Person_City</span>-<span id=\"documentWitnessPersonPincode_1\">#Witness_Person_Pincode</span><br>Aadhar.No:<span id=\"documentWitnessPersonAadhar_1\">#Aadhar</span></span> </p>",
    "document_vendor": [
        {
            "DocumentVendorCompany": [
                {
                    "DocumentVendorCompanyName": "Dlanzer",
                    "DocumentVendorCompanyRegNo": "2020108011",
                    "DocumentVendorCompanyAddress": "No:11 Ramar Street Ashok Nagar Avadi"
                }
            ],
            "DocumentVendorGenderID": "1",
            "DocumentVendorCategoryID": "1",
            "DocumentVendorName": "KAMESH A",
            "DocumentVendorDateOfBirth": "2002-09-28",
            "DocumentVendorAge": "20",
            "DocumentVendorPAN": "CATPV2244J",
            "DocumentVendorRelationshipID": "1",
            "DocumentVendorRelationName": "Vimala",
            "DocumentVendorAadharNumber": "75985867",
            "DocumentVendorPhoneNumber": "8610769361",
            "DocumentVendorAddress": "No:11 Ramar Street Ashok Nagar Avadi",
            "DocumentVendorTaluk": "Chennai",
            "DocumentVendorDistrict": "Vellore",
            "DocumentVendorCity": "Chennai",
            "DocumentVendorState": "Tamil Nadu",
            "DocumentVendorPinCode": "600062"
        }
    ],
    "document_purchaser": [
        {
            "DocumentPurchaserGenderID": "1",
            "DocumentPurchaserName": "KAMESH A",
            "DocumentPurchaserDateOfBirth": "2002-09-28",
            "DocumentPurchaserAge": "20",
            "DocumentPurchaserPAN": "98790867",
            "DocumentPurchaserRelationshipID": "1",
            "DocumentPurchaserRelationName": "Veeran",
            "DocumentPurchaserAadharNumber": "9769769786",
            "DocumentPurchaserPhoneNumber": "8610769361",
            "DocumentPurchaserAddress": "No:11 Ramar Street Ashok Nagar Avadi",
            "DocumentPurchaserTaluk": "Madhavaram",
            "DocumentPurchaserDistrict": "Thiruvallur",
            "DocumentPurchaserCity": "Chennai",
            "DocumentPurchaserState": "Tamil Nadu",
            "DocumentPurchaserPinCode": "600062",
            "DocumentPurchaserRepresenterType": "Guardian",
            "DocumentPurchaserRepresenterGenderID": "1",
            "DocumentPurchaserRepresenterName": "KAMESH A",
            "DocumentPurchaserRepresenterDateOfBirth": "2002-09-28",
            "DocumentPurchaserRepresenterAge": "20",
            "DocumentPurchaserRepresenterPAN": "HDHDH83736",
            "DocumentPurchaserRepresenterRelationshipID": "1",
            "DocumentPurchaserRepresenterRelationName": "Vimala",
            "DocumentPurchaserRepresenterAadharNumber": "9079687685",
            "DocumentPurchaserRepresenterPhoneNumber": "8610769361",
            "DocumentPurchaserRepresenterAddress": "No:11 Ramar Street Ashok Nagar Avadi",
            "DocumentPurchaserRepresenterTaluk": "Chn",
            "DocumentPurchaserRepresenterDistrict": "Tn",
            "DocumentPurchaserRepresenterCity": "Chennai",
            "DocumentPurchaserRepresenterState": "Tamil Nadu",
            "DocumentPurchaserRepresenterPinCode": "600062"
        }
    ],
    "document_witness": [
        {
            "DocumentWitnessGenderID": "1",
            "DocumentWitnessName": "KAMESH A",
            "DocumentWitnessDateOfBirth": "2002-09-28",
            "DocumentWitnessAge": "20",
            "DocumentWitnessPAN": "9887687698",
            "DocumentWitnessRelationshipID": "1",
            "DocumentWitnessRelationName": "Vimala",
            "DocumentWitnessAadharNumber": "0870987987",
            "DocumentWitnessPhoneNumber": "8610769361",
            "DocumentWitnessAddress": "No:11 Ramar Street Ashok Nagar Avadi",
            "DocumentWitnessTaluk": "Chn",
            "DocumentWitnessDistrict": "Tn",
            "DocumentWitnessCity": "Chennai",
            "DocumentWitnessState": "Tamil Nadu",
            "DocumentWitnessPinCode": "600062"
        }
    ],
    "payment_details": [
        {
            "PaymentDetailContent": "ikyhbgvliuvb;iujxbliubvx"
        }
    ],
    "property_details": [
        {
            "PropertyDetailContent": ""
        }
    ],
    "transfer_details": [
        {
            "TransferDetailContent": "hjvgkjbsjhjhdvjhdvjhy"
        }
    ]
},{
    "DocumentID": 5,
    "DocumentTypeID": 1,
    "DocumentLanguageID": 1,
    "DocumentTemplateID": 1,
    "DocumentVendorTypeID": 2,
    "DocumentPurchaserTypeID": 1,
    "DocumentPropertyTypeID": null,
    "DocumentApplicationNo": "Test1",
    "DocumentExecutionPlace": "Chennai",
    "DocumentExecutionDate": "2023-02-23",
    "DocumentTemplateHTML": "<p class=\"p-2 pb-2 pt-3 mb-0 \"><b>THIS DEED OF SALE</b> executed at <span id=\"execution_place\">Chennai</span> on this <span id=\"deed_execution\">23rd February 2023</span>,  <span id=\"first_person_details_0\"><span id=\"Conjuction_0\" class=\"vendorConjuction\"></span><span id=\"DocumentVendorCompanyDetails_0\"></span> <span id=\"documentFirstPersonCategory_0\"></span> <span id=\"documentFirstPersonTitle_0\">Mr.</span><span id=\"documentFirstPersonName_0\">KAMESH A</span><b> born on <span id=\"documentFirstPersonDOB_0\" date=\"2002-09-28\">28th September 2002</span> (Phone:<span id=\"documentFirstPersonPhone_0\">8610769361</span>, PAN:<span id=\"documentFirstPersonPAN_0\">UUHGF7444V</span>, Aadhar:<span id=\"documentFirstPersonAadhar_0\">09769878765</span>)</b> <span id=\"documentFirstPersonRelationshipTitle_0\">Son of</span> <span id=\"documentFirstPersonRelationshipName_0\">Vimala</span>  aged about <span id=\"documentFirstPersonAge_0\">20</span>-Years residing at <span id=\"documentFirstPersonAddress_0\">No:11 Ramar Street Ashok Nagar Avadi</span>, <span id=\"documentFirstPersonTaluk_0\">Chennai</span> taluk <span id=\"documentFirstPersonState_0\">Tamil Nadu</span> <span id=\"documentFirstPersonDistrict_0\">Vellore</span> <span id=\"documentFirstPersonCity_0\">Chennai</span>-<span id=\"documentFirstPersonPincode_0\">600062</span> <span class=\"\" id=\"firstPersonRepresenterDetails_0\">represented by, <span id=\"documentFirstPersonRepresenterType_0\">Guardian</span> <span id=\"documentFirstPersonRepresenterTitle_0\">Mr.</span><span id=\"documentFirstPersonRepresenterName_0\">KAMESH A</span><b> born on <span id=\"documentFirstPersonRepresenterDOB_0\" date=\"2002-09-28\">28th September 2002</span> (Phone:<span id=\"documentFirstPersonRepresenterPhone_0\">8610769361</span>, PAN:<span id=\"documentFirstPersonRepresenterPAN_0\">Utkhbjhbxjhbd</span>, Aadhar:<span id=\"documentFirstPersonRepresenterAadhar_0\">896987698769</span>)</b> <span id=\"documentFirstPersonRepresenterRelationshipTitle_0\">Husband of</span> <span id=\"documentFirstPersonRepresenterRelationshipName_0\">Dinesh</span> aged about <span id=\"documentFirstPersonRepresenterAge_0\">20</span>-Years, residing at <span id=\"documentFirstPersonRepresenterAddress_0\">No:11 Ramar Street Ashok Nagar Avadi</span>, <span id=\"documentFirstPersonRepresenterTaluk_0\">Chen</span> taluk <span id=\"documentFirstPersonRepresenterState_0\">Tamil Nadu</span> <span id=\"documentFirstPersonRepresenterDistrict_0\">Tn</span> <span id=\"documentFirstPersonRepresenterCity_0\">Chennai</span>-<span id=\"documentFirstPersonRepresenterPincode_0\">600062</span></span></span><span id=\"first_person_details_1\" class=\"d-none\"><span id=\"Conjuction_1\" class=\"vendorConjuction\"></span><span id=\"DocumentVendorCompanyDetails_1\"></span> <span id=\"documentFirstPersonCategory_1\"></span> <span id=\"documentFirstPersonTitle_1\">#First_Person_Title</span><span id=\"documentFirstPersonName_1\">#First_Person_Name</span><b> born on <span id=\"documentFirstPersonDOB_1\">#First_Person_DOB</span> (Phone:<span id=\"documentFirstPersonPhone_1\">#First_Person_Phone</span>, PAN:<span id=\"documentFirstPersonPAN_1\">#First_Person_PAN</span>, Aadhar:<span id=\"documentFirstPersonAadhar_1\">#First_Person_Aadhar</span>)</b> <span id=\"documentFirstPersonRelationshipTitle_1\">#First_Person_Relationship_Title</span> <span id=\"documentFirstPersonRelationshipName_1\">#First_Person_Relationship_Name</span>  aged about <span id=\"documentFirstPersonAge_1\">#First_Person_Age</span>-Years residing at <span id=\"documentFirstPersonAddress_1\">#First_Person_Address</span>, <span id=\"documentFirstPersonTaluk_1\">#First_Person_Taluk</span> taluk <span id=\"documentFirstPersonState_1\">#First_Person_State</span> <span id=\"documentFirstPersonDistrict_1\">#First_Person_District</span> <span id=\"documentFirstPersonCity_1\">#First_Person_City</span>-<span id=\"documentFirstPersonPincode_1\">#First_Person_Pincode</span> <span class=\"d-none\" id=\"firstPersonRepresenterDetails_1\">represented by, <span id=\"documentFirstPersonRepresenterType_1\"></span> <span id=\"documentFirstPersonRepresenterTitle_1\">#first_person_representer_Title</span><span id=\"documentFirstPersonRepresenterName_1\">#first_person_representer_Name</span><b> born on <span id=\"documentFirstPersonRepresenterDOB_1\">#First_Person_Representer_DOB</span> (Phone:<span id=\"documentFirstPersonRepresenterPhone_1\">#first_person_representer_Phone</span>, PAN:<span id=\"documentFirstPersonRepresenterPAN_1\">#first_person_representer_PAN</span>, Aadhar:<span id=\"documentFirstPersonRepresenterAadhar_1\">#first_person_representer_Aadhar</span>)</b> <span id=\"documentFirstPersonRepresenterRelationshipTitle_1\">#first_person_representer_Relationship_Title</span> <span id=\"documentFirstPersonRepresenterRelationshipName_1\">#first_person_representer_Relationship_Name</span> aged about <span id=\"documentFirstPersonRepresenterAge_1\">#first_person_representer_Age</span>-Years, residing at <span id=\"documentFirstPersonRepresenterAddress_1\">#first_person_representer_Address</span>, <span id=\"documentFirstPersonRepresenterTaluk_1\">#First_Person__Taluk</span> taluk <span id=\"documentFirstPersonRepresenterState_1\">#First_Person_Representer_State</span> <span id=\"documentFirstPersonRepresenterDistrict_1\">#First_Person_representer_District</span> <span id=\"documentFirstPersonRepresenterCity_1\">#first_person_representer_City</span>-<span id=\"documentFirstPersonRepresenterPincode_1\">#first_person_representer_Pincode</span></span></span> hereinafter called the <b><span class=\"vendorPlural\">VENDOR</span></b> of ONE PART </p><h5 class=\"p-3 pt-0 pb-0 d-flex align-items-center justify-content-center\">TO AND IN FAVOUR OF</h5><p class=\"p-2 pt-0 pb-2 mb-0 \"><span id=\"second_person_details_0\"><span id=\"Conjuction_0\" class=\"purchaserConjuction\"></span><span id=\"DocumentPurchaserCompanyDetails_0\"><span class=\"purchaserCompany\"><span class=\"purchaserCompanyName\">Dlanzer</span>, Reg No <span class=\"purchaserCompanyRegNo\">2020108011</span>, <span class=\"purchaserCompanyAddress\">No:11 Ramar Street Ashok Nagar Avadi</span> represented by, </span></span>  <span id=\"documentSecondPersonCategory_0\">Proprietor</span> <span id=\"documentSecondPersonTitle_0\">Mr.</span><span id=\"documentSecondPersonName_0\">KAMESH A</span><b> born on <span id=\"documentSecondPersonDOB_0\">28th September 2002</span> (Phone:<span id=\"documentSecondPersonPhone_0\">8610769361</span>, PAN:<span id=\"documentSecondPersonPAN_0\">98790867</span>, Aadhar:<span id=\"documentSecondPersonAadhar_0\">769768976</span>)</b> <span id=\"documentSecondPersonRelationshipTitle_0\">Son of</span> <span id=\"documentSecondPersonRelationshipName_0\">Veeran</span>  aged about <span id=\"documentSecondPersonAge_0\">20</span>-Years, residing at <span id=\"documentSecondPersonAddress_0\">No:11 Ramar Street Ashok Nagar Avadi</span>, <span id=\"documentFirstPersonTaluk_0\">#First_Person_Taluk</span> taluk <span id=\"documentSecondPersonState_0\">Tamil Nadu</span> <span id=\"documentSecondPersonDistrict_0\">Thiruvallur</span> <span id=\"documentSecondPersonDistrict_0\">#Second_Person_District</span> <span id=\"documentSecondPersonCity_0\">Chennai</span>-<span id=\"documentSecondPersonPincode_0\">600062</span><span class=\"d-none\" id=\"secondPersonRepresenterDetails_0\">represented by, <span id=\"documentSecondPersonRepresenterType_0\"></span> <span id=\"documentSecondPersonRepresenterTitle_0\">#Second_person_representer_Title</span><span id=\"documentSecondPersonRepresenterName_0\">#Second_person_representer_Name</span><b> born on <span id=\"documentSecondPersonRepresenterDOB_0\">#Second_Person_Representer_DOB</span> (Phone:<span id=\"documentSecondPersonRepresenterPhone_0\">#Second_person_representer_Phone</span>, PAN:<span id=\"documentSecondPersonRepresenterPAN_0\">#Second_person_representer_PAN</span>, Aadhar:<span id=\"documentSecondPersonRepresenterAadhar_0\">#Second_person_representer_Aadhar</span>)</b> <span id=\"documentSecondPersonRepresenterRelationshipTitle_0\">#Second_person_representer_Relationship_Title</span> <span id=\"documentSecondPersonRepresenterRelationshipName_0\">#Second_person_representer_Relationship_Name</span> aged about <span id=\"documentSecondPersonRepresenterAge_0\">#Second_person_representer_Age</span>-Years, residing at <span id=\"documentSecondPersonRepresenterAddress_0\">#Second_person_representer_Address</span>, <span id=\"documentSecondPersonRepresenterTaluk_0\">#Seond_Person_Representer_Taluk</span> taluk <span id=\"documentSecondPersonRepresenterState_0\">#Seond_Person_Representer_Representer_State</span> <span id=\"documentSecondPersonRepresenterDistrict_0\">#Second_person_representer_District</span> <span id=\"documentSecondPersonRepresenterCity_0\">#Second_person_representer_City</span>-<span id=\"documentSecondPersonRepresenterPincode_0\">#Second_person_representer_Pincode</span></span></span><span id=\"second_person_details_1\" class=\"d-none\"><span id=\"Conjuction_1\" class=\"purchaserConjuction\"></span><span id=\"DocumentPurchaserCompanyDetails_1\"></span>  <span id=\"documentSecondPersonCategory_1\"></span> <span id=\"documentSecondPersonTitle_1\">#Second_Person_Title</span><span id=\"documentSecondPersonName_1\">#Second_Person_Name</span><b> born on <span id=\"documentSecondPersonDOB_1\">#Second_Person_DOB</span> (Phone:<span id=\"documentSecondPersonPhone_1\">#Second_Person_Phone</span>, PAN:<span id=\"documentSecondPersonPAN_1\">#Second_Person_PAN</span>, Aadhar:<span id=\"documentSecondPersonAadhar_1\">#Second_Person_Aadhar</span>)</b> <span id=\"documentSecondPersonRelationshipTitle_1\">#Second_Person_Relationship_Title</span> <span id=\"documentSecondPersonRelationshipName_1\">#Second_Person_Relationship_Name</span>  aged about <span id=\"documentSecondPersonAge_1\">#Second_Person_Age</span>-Years, residing at <span id=\"documentSecondPersonAddress_1\">#Second_Person_Address</span>, <span id=\"documentFirstPersonTaluk_1\">#First_Person_Taluk</span> taluk <span id=\"documentSecondPersonState_1\">#Second_Person_State</span> <span id=\"documentSecondPersonDistrict_1\">#Second_Person_District</span> <span id=\"documentSecondPersonDistrict_1\">#Second_Person_District</span> <span id=\"documentSecondPersonCity_1\">#Second_Person_City</span>-<span id=\"documentSecondPersonPincode_1\">#Second_Person_Pincode</span><span class=\"d-none\" id=\"secondPersonRepresenterDetails_1\">represented by, <span id=\"documentSecondPersonRepresenterType_1\"></span> <span id=\"documentSecondPersonRepresenterTitle_1\">#Second_person_representer_Title</span><span id=\"documentSecondPersonRepresenterName_1\">#Second_person_representer_Name</span><b> born on <span id=\"documentSecondPersonRepresenterDOB_1\">#Second_Person_Representer_DOB</span> (Phone:<span id=\"documentSecondPersonRepresenterPhone_1\">#Second_person_representer_Phone</span>, PAN:<span id=\"documentSecondPersonRepresenterPAN_1\">#Second_person_representer_PAN</span>, Aadhar:<span id=\"documentSecondPersonRepresenterAadhar_1\">#Second_person_representer_Aadhar</span>)</b> <span id=\"documentSecondPersonRepresenterRelationshipTitle_1\">#Second_person_representer_Relationship_Title</span> <span id=\"documentSecondPersonRepresenterRelationshipName_1\">#Second_person_representer_Relationship_Name</span> aged about <span id=\"documentSecondPersonRepresenterAge_1\">#Second_person_representer_Age</span>-Years, residing at <span id=\"documentSecondPersonRepresenterAddress_1\">#Second_person_representer_Address</span>, <span id=\"documentSecondPersonRepresenterTaluk_1\">#Seond_Person_Representer_Taluk</span> taluk <span id=\"documentSecondPersonRepresenterState_1\">#Seond_Person_Representer_Representer_State</span> <span id=\"documentSecondPersonRepresenterDistrict_1\">#Second_person_representer_District</span> <span id=\"documentSecondPersonRepresenterCity_1\">#Second_person_representer_City</span>-<span id=\"documentSecondPersonRepresenterPincode_1\">#Second_person_representer_Pincode</span></span></span> hereinafter called the <b><span class=\"purchaserPlural\">PURCHASER</span></b> of OTHER PART </p><p class=\"p-2 pt-0 pb-2 mb-0 \">The terms “the <span class=\"vendorPlural\">VENDOR</span> and the <span class=\"purchaserPlural\">PURCHASER</span>” shall mean and include wherever the context so requires, or permits, them/their heirs, legal representatives, executors, administrators, nominees and assigns:</p><p id=\"documentPropertySchedule_0\" class=\"p-2 pt-0 pb-2 mb-0 \">WHEREAS the <span class=\"vendorPlural\">VENDOR</span> <span id=\"DocumentScheduleProp_0\">schedule b prop</span>, in <span id=\"DocumentSchedulePropType_0\">Schedule B</span>.</p><p class=\"p-2 pt-0 pb-2 mb-0 \" id=\"documentPropertySchedule_1\" style=\"display:none;\">WHEREAS the <span class=\"vendorPlural\">VENDOR</span> <span id=\"DocumentScheduleProp_1\">#property schedule</span>, in <span id=\"DocumentSchedulePropType_1\">schedule of property</span>.</p> <p class=\"p-2 pt-0 pb-2 mb-0 \" id=\"transfer_details\"><span>transfer details</span></p><p class=\"p-2 pt-0 pb-2 mb-0 \">WHEREAS the <span class=\"vendorPlural\">VENDOR</span> has been in continuous, uninterrupted peaceful possession and absolute enjoyment thereof, paying all taxes to the Government and Local authorities till this date, with full powers of alienation without any let or hindrance, having got valid and marketable title to the said property WHEREAS the <span class=\"vendorPlural\">VENDOR</span> herein are desirous of selling their property more fully described in the SCHEDULE PROPERTY hereunder to the PURCHASER herein due to various reason and made an offer to sell out the same and PURCHASER accepted to the offer made by the <span class=\"vendorPlural\">VENDOR</span> in purchasing the same, free from all encumbrances.Whereas the <span class=\"vendorPlural\">VENDOR</span> have agreed to sell and the Purchaser has agreed to purchase the SCHEDULE PROPERTY for a total consideration of <span class=\"DocumentPrice\">Rs.35,00,000/-</span> <span class=\"DocumentPriceWords\">(thirty five lakh )</span> free from all encumbrances, charges and liens.</p> <div><p class=\"p-2 pt-0 pb-2 mb-0 \"><b>II- NOW THIS DEED OF SALE WITNESSETH AS FOLLOWS </b></p> <p class=\"p-2 pt-0 pb-2 mb-0 \">The <span class=\"vendorPlural\">VENDOR</span> hereby agrees to sell to the PURCHASER and the PURCHASER agrees to purchase the property more fully described in the Schedule hereunder for a total sale consideration of <span class=\"DocumentPrice\">Rs.35,00,000/-</span> <span class=\"DocumentPriceWords\">(thirty five lakh )</span> from all encumbrances.</p><div class=\"p-2 pt-0 pb-2 mb-0 \" id=\"payment_Details\"><span><p>payment details</p></span></div> <p class=\"p-2 pt-0 pb-2 mb-0 \"> 1. The <span class=\"vendorPlural\">VENDOR</span> do hereby covenant that they are the absolute and exclusive owner of the property hereby sold and that no one else has or have any claim or legal heirs of <span class=\"vendorPlural\">VENDOR</span>, right or interest in the same and that the <span class=\"vendorPlural\">VENDOR</span> have not done or suffered to be done any act deed or thing by which their absolute and exclusive title hereby conveyed is in any way affected and that notwithstanding anything done or omitted to be done or suffered to be done, the <span class=\"vendorPlural\">VENDOR</span> have at present full and absolute right and title to the property hereby sold in the manner herein done. The <span class=\"vendorPlural\">VENDOR</span> further covenant and declare that the property hereby sold is not subject to any mortgage, charge, claim, lien, attachment and it has not been furnished as security or guarantee and the said property is being sold free from all encumbrances. <br><br> 2. The <span class=\"vendorPlural\">VENDOR</span> further declare that there is no suit or any proceedings in any court in respect of the title of the said property. <br><br> 3. The <span class=\"vendorPlural\">VENDOR</span> further covenant and undertake to indemnify the <span class=\"purchaserPlural\">PURCHASER</span> against any loss or damages by reason of any defect in title or encumbrances whether patent or latent and also undertake to the cost to depend any action against the <span class=\"purchaserPlural\">PURCHASER</span> in respect of the property hereby sold and will keep the <span class=\"purchaserPlural\">PURCHASER</span> harmless and keep them fully indemnified. <br><br> 4. The <span class=\"purchaserPlural\">PURCHASER</span> shall be entitled to effect mutation of their names in the records of Corporation Registry and Government Revenue records by virtue of this Sale Deed and that the <span class=\"vendorPlural\">VENDOR</span> do hereby agree that they will execute and sign all such documents that may be necessary in this behalf. <br><br> 5. The <span class=\"vendorPlural\">VENDOR</span> have this day put the <span class=\"purchaserPlural\">PURCHASER</span> in vacant possession of the property hereby convey <br><br> 6. The <span class=\"vendorPlural\">VENDOR</span> covenant with the <span class=\"purchaserPlural\">PURCHASER</span> that the land has been surveyed and the measurements descriptions of the land and boundaries mentioned in the schedule here underwritten are correct and that there are no encroachments in relation to any part of the sale property. </p></div><div id=\"schedule_property_details_0\"><p class=\"p-2 pt-0 pb-2 mb-0\" id=\"documentPropertyType_0\">Apartments</p><div class=\"p-2 pt-0 pb-2 mb-0\" id=\"documentScheduleDetails_0\"><h6 style=\"text-align:center;\">Schedule of property</h6><span class=\"scheduleDetails\">schedule of properties</span><br><h6 style=\"text-align:center;\">Schedule B</h6><span class=\"scheduleDetails\">schedule b prop</span></div><p class=\"p-2 pt-0 pb-2 mb-0\" id=\"documentBoundedDetails_0\"><b class=\"d-block p-2 ps-0 pt-0 pb-2 mb-0\">Bounded on the: -</b>North by: <span id=\"documentBoundedNorthBy_0\">K</span><br>South by: <span id=\"documentBoundedSouthBy_0\">K</span><br>East by: <span id=\"documentBoundedEastBy_0\">K</span><br>West by: <span id=\"documentBoundedWestBy_0\">K</span><br> </p><p class=\"p-2 pt-0 pb-2 mb-0\" id=\"documentMeasuringDetails_0\"><b class=\"d-block p-2 ps-0 pt-0 pb-2 mb-0\">Measuring: -</b>East to West on the Northern side:<span id=\"documentMeasuringEWN_0\">K</span><br>East to West on the Southern side::<span id=\"documentMeasuringEWS_0\">K</span><br>North to South on the Eastern side:<span id=\"documentMeasuringNSE_0\">K</span><br>North to South on the Western side:<span id=\"documentMeasuringNSW_0\">K</span><br></p><p class=\"p-2 pt-0 pb-2 mb-0\">TaxNo:-<span id=\"documentPropertyTaxNo_0\">9</span><br>ElecServiceNo:-<span id=\"documentElecServiceNo_0\">9</span></p></div><span id=\"schedule_property_details_1\" class=\"d-none\"><p class=\"p-2 pt-0 pb-2 mb-0\" id=\"documentPropertyType_1\">#PropertyType</p><p class=\"p-2 pt-0 pb-2 mb-0\" id=\"documentScheduleDetails_1\">#Property_Details</p><p class=\"p-2 pt-0 pb-2 mb-0\" id=\"documentBoundedDetails_1\"><b class=\"d-block p-2 ps-0 pt-0 pb-2 mb-0\">Bounded on the: -</b>North by: <span id=\"documentBoundedNorthBy_1\">-----</span><br>South by: <span id=\"documentBoundedSouthBy_1\">-----</span><br>East by: <span id=\"documentBoundedEastBy_1\">-----</span><br>West by: <span id=\"documentBoundedWestBy_1\">-----</span><br> </p><p class=\"p-2 pt-0 pb-2 mb-0\" id=\"documentMeasuringDetails_1\"><b class=\"d-block p-2 ps-0 pt-0 pb-2 mb-0\">Measuring: -</b>East to West on the Northern side:<span id=\"documentMeasuringEWN_1\">-----</span><br>East to West on the Southern side::<span id=\"documentMeasuringEWS_1\">-----</span><br>North to South on the Eastern side:<span id=\"documentMeasuringNSE_1\">-----</span><br>North to South on the Western side:<span id=\"documentMeasuringNSW_1\">-----</span><br></p><p class=\"p-2 pt-0 pb-2 mb-0\">TaxNo:-<span id=\"documentPropertyTaxNo_1\">-----</span><br>ElecServiceNo:-<span id=\"documentElecServiceNo_1\">-----</span></p></span><div class=\"p-2 pt-0 d-none pb-2 mb-0\">In total 775 Sq.ft  of vacant house site  situated within the Registration district of North Chennai and  Sub District of Madhavaram .Total Market value: <span class=\"DocumentPrice\">Rs.35,00,000/-</span> <span class=\"DocumentPriceWords\">(thirty five lakh )</span><br> IN WITNESS WHEREOF THE PARTIES HEREIN HAVE HEREUNTO SET AND SUBSCRIBED THEIR RESPECTIVE HANDS AND SIGNATURES ON THE DAY, MONTH AND YEAR FIRST ABOVE WRITTEN IN THE PRESENCE OF THE FOLLOWING WITNESS</div> <p class=\"p-2 pt-0 pb-2 mb-0\"><span class=\"p-2 ps-0 h5 pt-0 pb-0 d-block\">Witness</span><span id=\"Witness_person_details_0\"><span id=\"Conjuction_0\" class=\"witnessConjuction\"></span><span id=\"documentWitnessPersonTitle_0\">Mr.</span><span id=\"documentWitnessPersonName_0\">KAMESH A</span><br>D.O.B:<span id=\"documentWitnessPersonDOB_0\">28th September 2002</span><br>Age:<span id=\"documentWitnessPersonAge_0\">20</span><br><span id=\"documentWitnessPersonRelationshipTitle_0\">Son of</span> <span id=\"documentWitnessPersonRelationshipName_0\">Vim</span> <br> <span id=\"documentWitnessPersonAddress_0\">No:11 Ramar Street Ashok Nagar Avadi</span><br><span id=\"documentWitnessPersonTaluk_0\">Madhavaram</span> <br><span id=\"documentWitnessPersonDistrict_0\">Thiruvallur</span> <span id=\"documentWitnessPersonState_0\">Tamil Nadu</span><br><span id=\"documentWitnessPersonCity_0\">Chennai</span>-<span id=\"documentWitnessPersonPincode_0\">600062</span><br>Aadhar.No:<span id=\"documentWitnessPersonAadhar_0\">9769876987</span><br>Phone.No:<span id=\"documentWitnessPersonPhone_0\">8610769361</span><br>PAN.No:<span id=\"documentWitnessPersonPAN_0\">9887687698</span></span><span id=\"Witness_person_details_1\" class=\"d-none\" '=\"\"><span id=\"Conjuction_1\" class=\"witnessConjuction\"></span><span id=\"documentWitnessPersonTitle_1\">#Witness_Person_Title</span><span id=\"documentWitnessPersonName_1\">#Witness_Person_Name</span><br>D.O.B:<span id=\"documentWitnessPersonDOB_1\">#Witness_PersonnDOB</span><br>Age:<span id=\"documentWitnessPersonAge_1\">#Witness_Person_Age</span><br><span id=\"documentWitnessPersonRelationshipTitle_1\">#Witness_Person_Relationship_Title</span> <span id=\"documentWitnessPersonRelationshipName_1\">#Witness_Person_Relationship_Name</span> <br> <span id=\"documentWitnessPersonAddress_1\">#Witness_Person_Address</span><br><span id=\"documentWitnessPersonTaluk_1\">#Witness_Person_Taluk</span> <br><span id=\"documentWitnessPersonDistrict_1\">#Witness_Person_District</span> <span id=\"documentWitnessPersonState_1\">#Witness_Person_State</span><br><span id=\"documentWitnessPersonCity_1\">#Witness_Person_City</span>-<span id=\"documentWitnessPersonPincode_1\">#Witness_Person_Pincode</span><br>Aadhar.No:<span id=\"documentWitnessPersonAadhar_1\">#Aadhar</span><br>Phone.No:<span id=\"documentWitnessPersonPhone_1\">#Phone</span><br>PAN.No:<span id=\"documentWitnessPersonPAN_1\">#PAN</span></span> </p>",
    "document_vendor": [
        {
            "DocumentVendorGenderID": "1",
            "DocumentVendorName": "KAMESH A",
            "DocumentVendorDateOfBirth": "2002-09-28",
            "DocumentVendorAge": "20",
            "DocumentVendorPAN": "UUHGF7444V",
            "DocumentVendorRelationshipID": "3",
            "DocumentVendorRelationName": "Vimala",
            "DocumentVendorAadharNumber": "09769878765",
            "DocumentVendorPhoneNumber": "8610769361",
            "DocumentVendorAddress": "No:11 Ramar Street Ashok Nagar Avadi",
            "DocumentVendorTaluk": "Chennai",
            "DocumentVendorDistrict": "Vellore",
            "DocumentVendorCity": "Chennai",
            "DocumentVendorState": "Tamil Nadu",
            "DocumentVendorPinCode": "600062",
            "DocumentVendorRepresenterType": "Guardian",
            "DocumentVendorRepresenterGenderID": "1",
            "DocumentVendorRepresenterName": "KAMESH A",
            "DocumentVendorRepresenterDateOfBirth": "2002-09-28",
            "DocumentVendorRepresenterAge": "20",
            "DocumentVendorRepresenterPAN": "UTKHBJHBXJHBD",
            "DocumentVendorRepresenterRelationshipID": "1",
            "DocumentVendorRepresenterRelationName": "Dinesh",
            "DocumentVendorRepresenterAadharNumber": "896987698769",
            "DocumentVendorRepresenterPhoneNumber": "8610769361",
            "DocumentVendorRepresenterAddress": "No:11 Ramar Street Ashok Nagar Avadi",
            "DocumentVendorRepresenterTaluk": "Chen",
            "DocumentVendorRepresenterDistrict": "Tn",
            "DocumentVendorRepresenterCity": "Chennai",
            "DocumentVendorRepresenterState": "Tamil Nadu",
            "DocumentVendorRepresenterPinCode": "600062"
        }
    ],
    "document_purchaser": [
        {
            "DocumentPurchaserCompany": [
                {
                    "DocumentPurchaserCompanyName": "Dlanzer",
                    "DocumentPurchaserCompanyRegNo": "2020108011",
                    "DocumentPurchaserCompanyAddress": "No:11 Ramar Street Ashok Nagar Avadi"
                }
            ],
            "DocumentPurchaserCategoryID": "1",
            "DocumentPurchaserGenderID": "1",
            "DocumentPurchaserName": "KAMESH A",
            "DocumentPurchaserDateOfBirth": "2002-09-28",
            "DocumentPurchaserAge": "20",
            "DocumentPurchaserPAN": "98790867",
            "DocumentPurchaserRelationshipID": "3",
            "DocumentPurchaserRelationName": "Veeran",
            "DocumentPurchaserAadharNumber": "769768976",
            "DocumentPurchaserPhoneNumber": "8610769361",
            "DocumentPurchaserAddress": "No:11 Ramar Street Ashok Nagar Avadi",
            "DocumentPurchaserTaluk": "Madhavaram",
            "DocumentPurchaserDistrict": "Thiruvallur",
            "DocumentPurchaserCity": "Chennai",
            "DocumentPurchaserState": "Tamil Nadu",
            "DocumentPurchaserPinCode": "600062"
        }
    ],
    "document_witness": [
        {
            "DocumentWitnessGenderID": "1",
            "DocumentWitnessName": "KAMESH A",
            "DocumentWitnessDateOfBirth": "2002-09-28",
            "DocumentWitnessAge": "20",
            "DocumentWitnessPAN": "9887687698",
            "DocumentWitnessRelationshipID": "3",
            "DocumentWitnessRelationName": "Vim",
            "DocumentWitnessAadharNumber": "9769876987",
            "DocumentWitnessPhoneNumber": "8610769361",
            "DocumentWitnessAddress": "No:11 Ramar Street Ashok Nagar Avadi",
            "DocumentWitnessTaluk": "Madhavaram",
            "DocumentWitnessDistrict": "Thiruvallur",
            "DocumentWitnessCity": "Chennai",
            "DocumentWitnessState": "Tamil Nadu",
            "DocumentWitnessPinCode": "600062"
        }
    ],
    "payment_details": [
        {
            "PaymentDetailContent": "payment details"
        }
    ],
    "property_details": [
        {
            "PropertyDetailContent": ""
        }
    ],
    "transfer_details": [
        {
            "TransferDetailContent": "transfer details"
        }
    ]
}]
function storeInput() {
    return new Promise(async function (resolve, reject) {
        mastersData = await apirequest("GET", "api/master").then(resp => resp, err => { hide_popup_alert(err.message, 1, 5000) })
        document_details = await apirequest("GET", "api/Document").then(resp => resp, err => { hide_popup_alert(err.message, 1, 5000) })
        document_details.Documents.push(...addObj)
        // users = await apirequest("GET", "api/user").then(resp => {
        //     $("#username").text(resp)
        //     $("#useremail").text(resp)
        //     return(resp)
        // }, err => { hide_popup_alert(err.message, 1, 5000);return(null) })
        resolve("success")
    })
}

export { mastersData, document_details, apirequest, storeInput }

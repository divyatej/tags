let codesList=require("./abbreviations.js");
let ui=require('./userInteraction.js');
let regexp=/^[a-z0-9-]{1,10}$/i;
let regexpnonm=/^[a-z0-9-]{0,10}$/i;

let externalTagValidationAPI={
    0:{
        validationMethod:"isValidCountryCode",
        validationError:"Error in country code"
    },
    1:{
        validationMethod:"isValidBusinessUnitCode",
        validationError:"Error in business unit code"
    },
    2:{
        validationMethod:"isValidAgencyUnitCode",
        validationError:"Error in agency code"
    },
    3:{
        validationMethod:"isValidChannelCode",
        validationError:"Error in channel code"
    },
    4:{
        validationMethod:"isValidPlacementOrCampaign",
        validationError:"Error in Placement"
    },
    5:{
        validationMethod:"isValidPlacementOrCampaign",
        validationError:"Error in Campaign"
    },
    6:{
        validationMethod:"isValidPlcOrConOrSegOrKey",
        validationError:"Error in Placement type"
    },
    7:{
        validationMethod:"isValidPlcOrConOrSegOrKey",
        validationError:"Error in Content type"
    },
    8:{
        validationMethod:"isValidPlcOrConOrSegOrKey",
        validationError:"Error in Segment"
    },
    9:{
        validationMethod:"isValidPlcOrConOrSegOrKey",
        validationError:"Error in Key word"
    }
}

let internalTagValidationAPI={
    0:{
        validationMethod:"isValidCountryCode",
        validationError:"Error in country code"
    },
    1:{
        validationMethod:"isValidPlacementOrCampaignInt",
        validationError:"Error in page name"
    },
    2:{
        validationMethod:"isValidPlacementOrCampaignInt",
        validationError:"Error in placement"
    },
    3:{
        validationMethod:"isValidPlacementOrCampaignInt",
        validationError:"Error in campaign name"
    },
    4:{
        validationMethod:"isValidLanguage",
        validationError:"Error in language"
    },
    5:{
        validationMethod:"isValidProduct",
        validationError:"Error in product"
    }
}

let isValidPlacementOrCampaignInt=function(input){
    if(regexp.test(input) && input!=='n'){
        if(isValidLanguage(input) || isValidProduct(input) || isValidCountryCode(input)){
            return false;
        }
        return true;
    }else{
        return false;
    }
}

let isValidLanguage=function(input){
    if(codesList.getLanguageCodeList().split(',').includes(input)){
        return true;
    }else{
        return false;
    }
}

let isValidProduct=function(input){
    if(codesList.getProductCodeList().split(',').includes(input)){
        return true;
    }else{
        return false;
    }
}

let isValidCountryCode=function(input){
    if(codesList.getCountryCodeList().split(',').includes(input)){
        return true;
    }else{
        return false;
    }
}

let isValidBusinessUnitCode=function(input){
    if(codesList.getBusinessUnitCodeList().split(',').includes(input)){
        return true;
    }else{
        return false;
    }
}

let isValidAgencyUnitCode=function(input){
    if(codesList.getAgencyCodeList().split(',').includes(input)){
        return true;
    }else{
        return false;
    }
}

let isValidChannelCode=function(input){
    if(codesList.getChannelCodeList().split(',').includes(input)){
        return true;
    }else{
        return false;
    }
}

let isValidPlacementCode=function(input){
    if(codesList.getPlacementList().split(',').includes(input)){
        return true;
    }else{
        return false;
    }
}

let isValidPlacementOrCampaign=function(input){
    if(regexp.test(input) && input!=='n'){
        if(isValidChannelCode(input) || isValidAgencyUnitCode(input) || isValidCountryCode(input) || isValidCountryCode(input) || isValidPlacementCode(input)){
            return false;
        }
        return true;
    }else{
        return false;
    }
}

let isValidPlcOrConOrSegOrKey=function(input,isKeyWord){
    if(typeof input=="undefined" || input=="" || input=="n"){
        input="--NA--";
    }
    if(regexpnonm.test(input) || isKeyWord){
        if(isValidChannelCode(input) || isValidAgencyUnitCode(input) || isValidCountryCode(input) || isValidCountryCode(input)){
            return false;
        }
        return true;
    }else{
        return false;
    }
}

let isValidURL=function (input){
    try{
        if(!/https|http/.test(input)){
            input='https://'+input;
        }
        const url=new URL(input);
    }catch(error){
        return false;
    }
    return true;
}

let validateChannelsForm=function(){
    let validationData={errorFields:[],errors:[],displayValue:"",topDisplayValue:""};
    validationData.topDisplayValue=document.querySelector('.exisitngInfo').innerText;
    var campaignType=validationData.topDisplayValue.split(' ').join('').split('|')[0];
    if(campaignType=="External"){
        if(document.querySelector('#channel').value=="Select"){
            validationData.errors.push("Please select from dropdown");
            validationData.errorFields.push("#channel");
        }
        if(document.querySelector('#placement').value=="Select"){
            validationData.errors.push("Please select from dropdown");
            validationData.errorFields.push("#placement");
        }
        if(document.querySelector('#placement').value=="other" && !/^[a-z0-9-]{1,10}$/i.test(document.querySelector('#plcment').value)){
            document.querySelector('#plcment').value!==""?validationData.errors.push("Placement cannot include any special characters except \"-\""):validationData.errors.push("Provide a Placement");
            validationData.errorFields.push("#plcment");
        }
        else if(document.querySelector('#placement').value=="other" && !validationmethods.isValidPlacementOrCampaign(document.querySelector('#plcment').value)){
            validationData.errors.push("Placement cannot use any of the standard abbreviations");
            validationData.displayAbbrList=true;
            validationData.errorFields.push("#plcment");
        }
        if(document.querySelector('#ptype').value!=="" && /^[a-z0-9-]{0,10}$/i.test(document.querySelector('#ptype').value)){
            document.querySelector('#ptype').value!==""?validationData.errors.push("Placement type cannot include any special characters except \"-\""):validationData.errors.push("Provide a Placement type");
            validationData.errorFields.push("#ptype");
        }
        else if(document.querySelector('#ptype').value!=="" && !validationmethods.isValidPlcOrConOrSegOrKey(document.querySelector('#ptype').value)){
            validationData.errors.push("Placement type cannot use any of the standard abbreviations");
            validationData.displayAbbrList=true;
            validationData.errorFields.push("#ptype");
        }
        if(document.querySelector('#ctype').value!=="" && /^[a-z0-9-]{0,10}$/i.test(document.querySelector('#ctype').value)){
            document.querySelector('#ctype').value!==""?validationData.errors.push("Content type cannot include any special characters except \"-\""):validationData.errors.push("Provide a Content type");
            validationData.errorFields.push("#ctype");
        }
        else if(document.querySelector('#ctype').value!=="" && !validationmethods.isValidPlcOrConOrSegOrKey(document.querySelector('#ctype').value)){
            validationData.errors.push("Content type cannot use any of the standard abbreviations");
            validationData.displayAbbrList=true;
            validationData.errorFields.push("#ctype");
        }
        if(document.querySelector('#segment').value!=="" && /^[a-z0-9-]{0,10}$/i.test(document.querySelector('#segment').value)){
            document.querySelector('#segment').value!==""?validationData.errors.push("Segment cannot include any special characters except \"-\""):validationData.errors.push("Provide a Segment");
            validationData.errorFields.push("#segment");
        }
        else if(document.querySelector('#segment').value!=="" && !validationmethods.isValidPlcOrConOrSegOrKey(document.querySelector('#segment').value)){
            validationData.errors.push("Segment cannot use any of the standard abbreviations");
            validationData.displayAbbrList=true;
            validationData.errorFields.push("#segment");
        }
        if(document.querySelector('#keywords').value!=="" && /^[a-z0-9-]{0,1000}$/i.test(document.querySelector('#keywords').value)){
            document.querySelector('#keywords').value!==""?validationData.errors.push("Keywords cannot include any special characters except \"-\""):validationData.errors.push("Provide Keywords");
            validationData.errorFields.push("#keywords");
        }
        else if(document.querySelector('#keywords').value!=="" && !validationmethods.isValidPlcOrConOrSegOrKey(document.querySelector('#keywords').value,true)){
            validationData.errors.push("Keywords cannot use any of the standard abbreviations");
            validationData.displayAbbrList=true;
            validationData.errorFields.push("#keywords");
        }
    }
    else{
        if(document.querySelector('#product').value=="Select"){
            validationData.errors.push("Please select from dropdown");
            validationData.errorFields.push("#product");
        }
        if(document.querySelector('#page').value!=="" && /^[a-z0-9-]{1,10}$/i.test(document.querySelector('#page').value)){
            document.querySelector('#page').value!==""?validationData.errors.push("Page cannot include any special characters except \"-\""):validationData.errors.push("Provide a Page");
            validationData.errorFields.push("#page");
        }
        else if(!validationmethods.isValidPlacementOrCampaignInt(document.querySelector('#page').value)){
            validationData.errors.push("Page cannot use any of the standard abbreviations");
            validationData.displayAbbrList=true;
            validationData.errorFields.push("#page");
        }
        if(document.querySelector('#plcment').value!=="" && /^[a-z0-9-]{1,10}$/i.test(document.querySelector('#plcment').value)){
            document.querySelector('#plcment').value!==""?validationData.errors.push("Placement cannot include any special characters except \"-\""):validationData.errors.push("Provide a Placement");
            validationData.errorFields.push("#plcment");
        }
        else if(!validationmethods.isValidPlacementOrCampaignInt(document.querySelector('#plcment').value)){
            validationData.errors.push("Placement cannot use any of the standard abbreviations");
            validationData.displayAbbrList=true;
            validationData.errorFields.push("#plcment");
        }
    }
    if(validationData.errors.length==0){
        validationData.displayValue=campaignType;
        if(campaignType=="External"){
            validationData.displayValue+=(' | '+document.querySelector('#channel').value);
            if(document.querySelector('#placement').value=="other"){
                validationData.displayValue+=(' | '+document.querySelector('#plcment').value);
            }else{
                validationData.displayValue+=(' | '+document.querySelector('#placement').value);
            }
            validationData.displayValue+=(' | '+(document.querySelector('#ptype').value!==""?document.querySelector('#ptype').value:'n'));
            validationData.displayValue+=(' | '+(document.querySelector('#ctype').value!==""?document.querySelector('#ctype').value:'n'));
            validationData.displayValue+=(' | '+(document.querySelector('#segment').value!==""?document.querySelector('#segment').value:'n'));
            validationData.displayValue+=(' | '+(document.querySelector('#keywords').value!==""?document.querySelector('#keywords').value:'n'));
        }else{
            validationData.displayValue+=(' | '+document.querySelector('#product').value);
            validationData.displayValue+=(' | '+(document.querySelector('#page').value!==""?document.querySelector('#page').value:'n'));
            validationData.displayValue+=(' | '+(document.querySelector('#plcment').value!==""?document.querySelector('#plcment').value:'n'));
        }
    }
    return validationData;
}

let validateForm=function(){
    let validationData={errorFields:[],errors:[],displayValue:""};
    if(!(document.querySelector('#externalCampaign').checked || document.querySelector('#internalCampaign').checked)){
        validationData.errors.push("Please select a campaign");
        validationData.errorFields.push("#externalCampaign");
        validationData.errorFields.push("#internalCampaign");
        return validationData;
    }else{
        var isInternalCampaign=document.querySelector('#internalCampaign').checked;
        var isExternalCampaign=document.querySelector('#externalCampaign').checked;
        if(isInternalCampaign && document.querySelector('#language').value=="Select"){
            validationData.errors.push("Please select language from dropdown");
            validationData.errorFields.push("#language");
        }
        if(isExternalCampaign && document.querySelector('#businessUnit').value=="Select"){
            validationData.errors.push("Please select from dropdown");
            validationData.errorFields.push("#businessUnit");
        }
        if(isExternalCampaign && document.querySelector('#agency').value=="Select"){
            validationData.errors.push("Please select from dropdown");
            validationData.errorFields.push("#agency");
        }
        if(!validationmethods.isValidURL(document.querySelector('#link').value)){
            validationData.errors.push("Provide a valid URL. Eg. www.qantas.com/au/en.html");
            validationData.errorFields.push("#link");
        }
        if(!/^[a-z0-9-]{1,10}$/i.test(document.querySelector('#cname').value)){
            document.querySelector('#cname').value!==""?validationData.errors.push("Campaign name cannot include any special characters except \"-\""):validationData.errors.push("Provide a Campaign name");
            validationData.errorFields.push("#cname");
        }
        else if(isInternalCampaign && !validationmethods.isValidPlacementOrCampaignInt(document.querySelector('#cname').value)){
            validationData.errors.push("Campaign name cannot use any of the standard abbreviations");
            validationData.displayAbbrList=true;
            validationData.errorFields.push("#cname");
        }
        else if(isExternalCampaign && !validationmethods.isValidPlacementOrCampaign(document.querySelector('#cname').value)){
            validationData.errors.push("Campaign name cannot use any of the standard abbreviations");
            validationData.displayAbbrList=true;
            validationData.errorFields.push("#cname");
        }
        //Build value string
        if(document.querySelector('#internalCampaign').checked){
            validationData.displayValue+="Internal";
        }
        if(document.querySelector('#externalCampaign').checked){
            validationData.displayValue+="External";
        }
        validationData.displayValue+=(" | "+document.querySelector('#country').value);
        if(!isInternalCampaign){
            validationData.displayValue+=(" | "+document.querySelector('#businessUnit').value);
            validationData.displayValue+=(" | "+document.querySelector('#agency').value);
        }else{
            validationData.displayValue+=(" | "+document.querySelector('#language').value);
        }
        validationData.displayValue+=(" | "+document.querySelector('#cname').value);
        validationData.displayValue+=(" | "+document.querySelector('#link').value);
        return validationData;
    }
}

let validateField=function(){
    var tags=document.querySelector('#existingTags').value;
    localStorage.setItem('validationTags',tags);
    var errorsArray=[];
    tags.split('\n').forEach(function(tag){
        var urlObject={};
        try{
            urlObject.url=tag;
            urlObject.error=[];
            var validationAPI={};
            var urlParam="";
            var isExternalCampaign=false;
            if(tag.indexOf("alt_cam=")!=-1){
                isExternalCampaign=true;
                validationAPI=externalTagValidationAPI;
                urlParam=tag.substring(tag.indexOf("alt_cam="),tag.length).replace("alt_cam=","").trim();
            }else if(tag.indexOf("int_cam=")!=-1){
                validationAPI=internalTagValidationAPI;
                urlParam=tag.substring(tag.indexOf("int_cam="),tag.length).replace("int_cam=","").trim();
            }else{
                urlObject.error.push("Provide a valid URL. Eg. www.qantas.com/au/en.html");
            }
            if(urlParam!="" && urlParam!=null && Object.keys(validationAPI).length>0){
                if(urlParam.split(":").length>0){
                    urlParam.split(":").forEach(function(param,index){
                        var postion=index;
                        if(typeof validationAPI[index].validationMethod=="undefined"){
                            throw "Internal Error";
                        }
                        var isValid=(validationmethods[validationAPI[index].validationMethod](param));
                        if(!isValid){
                            urlObject.error.push(validationAPI[index].validationError+"::"+param);
                        }
                    });
                }else{
                    urlObject.error.push("Not a proper campaign tag");
                }
                if(urlObject.error.length==0){
                    urlObject.success=true;
                }
            }else{
                urlObject.error.push("Not a proper campaign tag");
            }
        }catch(error){
            urlObject.error.push("Internal Error. Please contact team about this--"+error);
        }
    errorsArray.push(urlObject);
    ui.displayResults(errorsArray);
    });
}

let validationmethods={
    isValidCountryCode:isValidCountryCode,
    isValidBusinessUnitCode:isValidBusinessUnitCode,
    isValidAgencyUnitCode:isValidAgencyUnitCode,
    isValidChannelCode:isValidChannelCode,
    isValidPlacementOrCampaign:isValidPlacementOrCampaign,
    isValidPlcOrConOrSegOrKey:isValidPlcOrConOrSegOrKey,
    isValidCountryCode:isValidCountryCode,
    isValidPlacementOrCampaignInt:isValidPlacementOrCampaignInt,
    isValidLanguage:isValidLanguage,
    isValidProduct:isValidProduct,
    isValidURL:isValidURL
}

module.exports={
    validateField:validateField,
    validationmethods:validationmethods,
    validateForm:validateForm,
    validateChannelsForm:validateChannelsForm
}
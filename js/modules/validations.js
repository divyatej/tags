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
        validationError:"Error in agency code"
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
        validationError:"Error in location"
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
    if(codesList.getLanguageCodeList().indexOf(input)!=-1){
        return true;
    }else{
        return false;
    }
}

let isValidProduct=function(input){
    if(codesList.getProductCodeList().indexOf(input)!=-1){
        return true;
    }else{
        return false;
    }
}

let isValidCountryCode=function(input){
    if(codesList.getCountryCodeList().indexOf(input)!=-1){
        return true;
    }else{
        return false;
    }
}

let isValidBusinessUnitCode=function(input){
    if(codesList.getBusinessUnitCodeList().indexOf(input)!=-1){
        return true;
    }else{
        return false;
    }
}

let isValidAgencyUnitCode=function(input){
    if(codesList.getAgencyCodeList().indexOf(input)!=-1){
        return true;
    }else{
        return false;
    }
}

let isValidChannelCode=function(input){
    if(codesList.getChannelCodeList().indexOf(input)!=-1){
        return true;
    }else{
        return false;
    }
}

let isValidPlacementOrCampaign=function(input){
    if(regexp.test(input) && input!=='n'){
        if(isValidChannelCode(input) || isValidAgencyUnitCode(input) || isValidCountryCode(input) || isValidCountryCode(input)){
            return false;
        }
        return true;
    }else{
        return false;
    }
}

let isValidPlcOrConOrSegOrKey=function(input){
    if(typeof input=="undefined" || input=="" || input=="n"){
        input="--NA--";
    }
    if(regexpnonm.test(input)){
        if(isValidChannelCode(input) || isValidAgencyUnitCode(input) || isValidCountryCode(input) || isValidCountryCode(input)){
            return false;
        }
        return true;
    }else{
        return false;
    }
}

let validateField=function(){
    var tags=document.querySelector('#existingTags').value;
    var errorsArray=[];
    tags.split('\n').forEach(function(tag){
        var urlObject={};
        try{
            urlObject.url=tag;
            urlObject.error=[];
            var validationAPI={};
            var urlParam="";
            if(tag.indexOf("alt_cam=")!=-1){
                validationAPI=externalTagValidationAPI;
                urlParam=tag.substring(tag.indexOf("alt_cam="),tag.length).replace("alt_cam=","").trim();
            }else if(tag.indexOf("int_cam=")!=-1){
                validationAPI=internalTagValidationAPI;
                urlParam=tag.substring(tag.indexOf("int_cam="),tag.length).replace("int_cam=","").trim();
            }else{
                urlObject.error.push("Invalid URL");
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
                            urlObject.error.push(validationAPI[index].validationError+"::"+param+" at position::"+(++postion));
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
    isValidProduct:isValidProduct
}

module.exports={
    validateField:validateField,
    validationmethods:validationmethods
}
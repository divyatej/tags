(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Library = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
let countryCodesList='ar,au,at,be,br,ca,cl,cn,fj,fi,fr,pf,de,gl,hk,in,id,ie,it,jp,kr,mx,nl,nc,nz,na,pg,ph,sg,za,sa,es,ch,tw,th,ae,gb,us,vu,vn';
let businessUnitCodesList='qd,re,ql,rp,pro,dg,sbu,qs,eq,cs,fs,pt,om,aq,gc,rs,mv,gcc,gcp,as,ff,ccr,acc';
let agencyCodesList='omd,in,15b,blue 449,zenith opti media,perfomics,iclick,mindshare,maxus';
let channelCodesList='edm,sem,dis,os,ps,pr,prs,bb,tv,rd,ol,af,cm';
let languagesList='en,zh_CN,zh_TW,ja,de,fr,es';
let productsList='flights,cars,hotels,baggage,seats,transfers,activities,insurance,manage-your-trip,qantas-store,epiqure,cash,financial-services,points,online-mall,aquire,golf-club,restaurants,movies,gift-cards-cash,gift-cards-points,assure,frequent-flyer';
module.exports={
    getCountryCodeList:function(){
        return countryCodesList;
    },
    getBusinessUnitCodeList:function(){
        return businessUnitCodesList;
    },
    getAgencyCodeList:function(){
        return agencyCodesList;
    },
    getChannelCodeList:function(){
        return channelCodesList;
    },
    getLanguageCodeList:function(){
        return languagesList;
    },
    getProductCodeList:function(){
        return productsList;
    }
}
},{}],2:[function(require,module,exports){
let getURL=function(url){
    return new Promise(function(resolve,reject){
        var req=new XMLHttpRequest();
        req.open('GET',url);
        req.onload=function(){
            if(req.status==200){
                resolve(req.response);
            }else{
                reject(Error(req.statusText));
            }
        }
        req.onerror=function(){
            reject(Error('Internal Error'));
        }
        req.send();
    });
}

module.exports={
    getURL:getURL
}

},{}],3:[function(require,module,exports){
var requests=require('./requests.js');

let respondToRequest=function(template,displayValue,displayNextValue){
    var values='';
    var valuesHTML='';
    if(document.querySelector('.values')!=null){
        values=document.querySelector('.values').innerText;
        valuesHTML=document.querySelector('.values').innerHTML+'<br/>';
    }
    requests.getURL(template).then(function(response){   
        document.querySelector('.contentSection').innerHTML=response;
        //This is for adding another channel page
        if(typeof displayValue!=="undefined" && typeof displayNextValue!=="undefined" && template.indexOf('createTagsChannels')!=-1){
            //<a href="javascript:void('0');"><i class="fa fa-minus-square" aria-hidden="true"></i>&nbsp;SEO|GOOGLE</a>
            document.querySelector('.exisitngInfo').innerHTML='<u>'+displayValue+'</u>';
            if(valuesHTML!=''){
                document.querySelector('.values').innerHTML=valuesHTML;    
            }
            var icon=document.createElement('a');
            icon.innerHTML="<i class=\"fa fa-minus-square "+displayNextValue.split('|').join("")+"\" aria-hidden=\"true\"></i>";
            icon.href="javascript:lib.removeTag('"+displayNextValue.split('|').join("")+"');";
            document.querySelector('.values').appendChild(icon);
            var element=document.createElement('a');
            element.innerHTML=displayNextValue;
            element.className=displayNextValue.split('|').join("") + " anchorTag";
            element.href="javascript:lib.editTag('"+displayNextValue.split('|').join("")+"');";
            document.querySelector('.values').appendChild(element);
            document.querySelector('.valuesDiv').className=document.querySelector('.valuesDiv').className.replace('hidden','');
        }
        //This is for confirmation page
        else if(typeof displayValue!=="undefined" && typeof displayNextValue!=="undefined"){
            document.querySelector('.exisitngInfo').innerHTML='<u>'+displayValue+'</u>';
            if(values!=null && values!=''){
                    values.split('\n').forEach(function(tag){
                        if(tag!=''){
                            document.querySelector('.exisitngInfoNext').innerHTML+=('<u>'+tag+'</u><br/>');
                            let tags=displayValue.replace("External|","").replace("Internal|","");
                            let url=tags.split('|')[tags.split('|').length-1];
                            tags=tags.replace('|'+url,'');
                            tags=tags+'|'+(tag.replace("External|","").replace("Internal|","").trim());
                            tags=tags.split('|').join(':');
                            document.querySelector('.finalTags').innerHTML+=('<strong>'+url+'?alt_cam='+(tags.toLowerCase())+'<strong><br/>');
                        }
                });
            }
            //Add the things that are present in fields when generate button is clicked
            document.querySelector('.exisitngInfoNext').innerHTML+=('<u>'+displayNextValue+'</u>');
            let tags=displayValue.replace("External|","").replace("Internal|","");
            let url=tags.split('|')[tags.split('|').length-1];
            tags=tags.replace('|'+url,'');
            tags=tags+'|'+(displayNextValue.replace("External|","").replace("Internal|","").trim());
            tags=tags.split('|').join(':');
            document.querySelector('.finalTags').innerHTML+=('<strong>'+url+'?alt_cam='+(tags.toLowerCase())+'<strong><br/>');
        }
        //This is for adding channel page
        else if(typeof displayValue!=="undefined"){
            document.querySelector('.exisitngInfo').innerHTML='<u>'+displayValue+'</u>';
        }
    },function(error){
        console.error('Error',error);
    });
}

let removeTag=function(className){
    document.querySelector(".fa-minus-square."+className).remove();
    document.querySelector("."+className).remove();
}

let editTag=function(className){
    var tagData=document.querySelector("."+className+".anchorTag").innerHTML.replace("External|","").replace("Internal|","").trim();
    document.querySelector(".fa-minus-square."+className).remove();
    document.querySelector("."+className).remove();
    var expanded=false;
    tagData.split('|').forEach(function(tag,index){
        switch(index){
            case 0:document.querySelector('#channel [value="' + tag + '"]').selected = true;break;
            case 1:document.querySelector('#placement [value="' + tag + '"]').selected = true;break;
            case 2:
                if(tag!='n'){
                    !expanded && expandTags() && (expanded=true);
                    document.querySelector('#ptype').value = tag;   
                }
                break;
            case 3:
                if(tag!='n'){
                    !expanded && expandTags() && (expanded=true);
                    document.querySelector('#ctype').value = tag;   
                }
                break;
            case 4:
                if(tag!='n'){
                    !expanded && expandTags() && (expanded=true);
                    document.querySelector('#segment').value = tag;   
                }
                break;
            case 5:
                if(tag!='n'){
                    !expanded && expandTags() && (expanded=true);
                    document.querySelector('#keywords').value = tag;
                }
                break;
            default:break;
        }
    });
}

let validateTags=function(){
    respondToRequest('/include/validateTags.html');
}

let createTags=function(){
    respondToRequest('/include/createTags.html');
}

let clearField=function(){
    document.querySelector('#form').reset();
}

let expandTags=function(){
    if(document.querySelector('.fa-angle-down')!=null){
        Array.from(document.querySelectorAll('.expandField')).forEach(link=>{
            link.className=link.className.replace('hidden','');
        });
        document.querySelector('.fa-angle-down').className=(document.querySelector('.fa-angle-down').className.replace('fa-angle-down','')+'fa-angle-up');
    }
    else{
        Array.from(document.querySelectorAll('.expandField')).forEach(link=>{
            link.className+=' hidden';
        });
        document.querySelector('.fa-angle-up').className=(document.querySelector('.fa-angle-up').className.replace('fa-angle-up','')+'fa-angle-down');
    }
}

let highlightErrors=function(validationData){
    let errorFields=validationData.errorFields;
    validationData.errors.forEach(function(error,index){
        var errorField=errorFields[index];
        document.querySelector(errorField).className+=' is-invalid';
        var divElement=document.createElement('div');
        divElement.innerHTML=error;
        divElement.className='invalid-feedback '+errorField.replace('#','');
        if(typeof document.querySelector(errorField).nextSibling.className=="undefined"){
            document.querySelector(errorField).insertAdjacentElement('afterend',divElement);
        }
    });
    Array.from(document.querySelectorAll('.is-invalid')).forEach(link => {
        link.addEventListener('change', function(event) {
            this.className=this.className.replace(' is-invalid','');
            document.querySelector('.'+this.id)&&document.querySelector('.'+this.id).remove();
        });
        link.addEventListener('keypress', function(event) {
            this.className=this.className.replace(' is-invalid','');
            document.querySelector('.'+this.id)&&document.querySelector('.'+this.id).remove();
        });
    });
}

let nextStep=function(displayValue){
    respondToRequest('/include/createTagsChannels.html',displayValue);
}

let confirm=function(topDisplayValue,displayValue){
    respondToRequest('/include/confirmTags.html',topDisplayValue,displayValue);
}

let addAnotherChannel=function(topDisplayValue,displayValue){
    respondToRequest('/include/createTagsChannels.html',topDisplayValue,displayValue);
}

let displayResults=function(errorsArray){
    requests.getURL('/include/validationResults.html').then(function(response){
        document.querySelector('.contentSection').innerHTML=response;
        if(errorsArray.length>0){
            errorsArray.forEach(function(error){
                if(error.success){
                    document.querySelector('.list-group').innerHTML+=('<a href="javascript:void(\'0\');" class="list-group-item list-group-item-action list-group-item-success"><p>'+error.url+'</p><p>No errors in this campaign tag</p></a>');
                }else{
                    var errors='<p>';
                    error.error.forEach(function(err){
                        errors+=err+'<br/>';
                    })
                    errors+='</p>';
                    document.querySelector('.list-group').innerHTML+=('<a href="javascript:void(\'0\');" class="list-group-item list-group-item-action list-group-item-danger"><p>'+(error.url!=""?error.url:"No url entered for validation")+'</p>'+errors+'</a>');
                }
            });
        }
    },function(error){
        console.error('Error',error);
    });
}

module.exports={
    validateTags:validateTags,
    clearField:clearField,
    displayResults:displayResults,
    createTags:createTags,
    nextStep:nextStep,
    highlightErrors:highlightErrors,
    expandTags:expandTags,
    confirm:confirm,
    addAnotherChannel:addAnotherChannel,
    removeTag:removeTag,
    editTag:editTag
}
},{"./requests.js":2}],4:[function(require,module,exports){
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
    var campaignType=validationData.topDisplayValue.split('|')[0];
    if(document.querySelector('#channel').value=="Select"){
        validationData.errors.push("Please select from dropdown");
        validationData.errorFields.push("#channel");
    }
    if(document.querySelector('#placement').value=="Select"){
        validationData.errors.push("Please select from dropdown");
        validationData.errorFields.push("#placement");
    }
    if(document.querySelector('#ptype').value!=="" && !validationmethods.isValidPlcOrConOrSegOrKey(document.querySelector('#ptype').value)){
        validationData.errors.push("Please enter proper placement type");
        validationData.errorFields.push("#ptype");
    }
    if(document.querySelector('#ctype').value!=="" && !validationmethods.isValidPlcOrConOrSegOrKey(document.querySelector('#ctype').value)){
        validationData.errors.push("Please enter proper content type");
        validationData.errorFields.push("#ctype");
    }
    if(document.querySelector('#segment').value!=="" && !validationmethods.isValidPlcOrConOrSegOrKey(document.querySelector('#segment').value)){
        validationData.errors.push("Please enter proper segment");
        validationData.errorFields.push("#segment");
    }
    if(document.querySelector('#keywords').value!=="" && !validationmethods.isValidPlcOrConOrSegOrKey(document.querySelector('#keywords').value)){
        validationData.errors.push("Please enter proper key words");
        validationData.errorFields.push("#keywords");
    }
    validationData.displayValue=campaignType;
    validationData.displayValue+=('|'+document.querySelector('#channel').value);
    validationData.displayValue+=('|'+document.querySelector('#placement').value);
    validationData.displayValue+=('|'+(document.querySelector('#ptype').value!==""?document.querySelector('#ptype').value:'n'));
    validationData.displayValue+=('|'+(document.querySelector('#ctype').value!==""?document.querySelector('#ctype').value:'n'));
    validationData.displayValue+=('|'+(document.querySelector('#segment').value!==""?document.querySelector('#segment').value:'n'));
    validationData.displayValue+=('|'+(document.querySelector('#keywords').value!==""?document.querySelector('#keywords').value:'n'));
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
        if(document.querySelector('#internalCampaign').checked && document.querySelector('#agency').value!=="internal"){
            validationData.errors.push("Please select internal from dropdown as this is an Internal campaign");
            validationData.errorFields.push("#agency");
        }
        if(document.querySelector('#businessUnit').value=="Select"){
            validationData.errors.push("Please select from dropdown");
            validationData.errorFields.push("#businessUnit");
        }
        if(document.querySelector('#agency').value=="Select"){
            validationData.errors.push("Please select from dropdown");
            validationData.errorFields.push("#agency");
        }
        if(!validationmethods.isValidURL(document.querySelector('#link').value)){
            validationData.errors.push("Please enter proper url");
            validationData.errorFields.push("#link");
        }
        if(document.querySelector('#internalCampaign').checked && !validationmethods.isValidPlacementOrCampaignInt(document.querySelector('#cname').value)){
            validationData.errors.push("Please enter proper campaign name");
            validationData.errorFields.push("#cname");
        }
        if(document.querySelector('#externalCampaign').checked && !validationmethods.isValidPlacementOrCampaign(document.querySelector('#cname').value)){
            validationData.errors.push("Please enter proper campaign name");
            validationData.errorFields.push("#cname");
        }
        //Build value string
        if(document.querySelector('#internalCampaign').checked){
            validationData.displayValue+="Internal";
        }
        if(document.querySelector('#externalCampaign').checked){
            validationData.displayValue+="External";
        }
        validationData.displayValue+=("|"+document.querySelector('#country').value);
        validationData.displayValue+=("|"+document.querySelector('#businessUnit').value);
        validationData.displayValue+=("|"+document.querySelector('#agency').value);
        validationData.displayValue+=("|"+document.querySelector('#cname').value);
        validationData.displayValue+=("|"+document.querySelector('#link').value);
        return validationData;
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
    isValidProduct:isValidProduct,
    isValidURL:isValidURL
}

module.exports={
    validateField:validateField,
    validationmethods:validationmethods,
    validateForm:validateForm,
    validateChannelsForm:validateChannelsForm
}
},{"./abbreviations.js":1,"./userInteraction.js":3}],5:[function(require,module,exports){
let ui=require('./modules/userInteraction.js');
let validation=require('./modules/validations.js');
function Library(){

}

Library.prototype.validateTags=function(){
    ui.validateTags();
}

Library.prototype.clearField=function(){
    ui.clearField();
}

Library.prototype.validateField=function(){
    validation.validateField();
}

Library.prototype.createTags=function(){
    ui.createTags();
}

Library.prototype.nextStep=function(){
    let validationData=validation.validateForm();
    if(validationData.errors.length>0 || validationData.errorFields.length>0){
        ui.highlightErrors(validationData);
    }else{
        ui.nextStep(validationData.displayValue);
    }
}

Library.prototype.expandTags=function(){
    ui.expandTags();
}

Library.prototype.addAnotherChannel=function(){
    let validationData=validation.validateChannelsForm();
    if(validationData.errors.length>0 || validationData.errorFields.length>0){
        ui.highlightErrors(validationData);
    }else{
        ui.addAnotherChannel(validationData.topDisplayValue,validationData.displayValue);
    }
}

Library.prototype.generateTags=function(){
    let validationData=validation.validateChannelsForm();
    if(validationData.errors.length>0 || validationData.errorFields.length>0){
        ui.highlightErrors(validationData);
    }else{
        ui.confirm(validationData.topDisplayValue,validationData.displayValue);
    }
}

Library.prototype.removeTag=function(className){
    ui.removeTag(className);
}

Library.prototype.editTag=function(className){
    ui.editTag(className);
}

module.exports=Library;
},{"./modules/userInteraction.js":3,"./modules/validations.js":4}]},{},[5])(5)
});
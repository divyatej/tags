(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Library = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
let countryCodesList='ar,au,at,be,br,ca,cl,cn,fj,fi,fr,pf,de,gl,hk,in,id,ie,it,jp,kr,mx,nl,nc,nz,na,pg,ph,sg,za,sa,es,ch,tw,th,ae,gb,us,vu,vn';
let businessUnitCodesList='qd,re,ql,rp,pro,dg,sbu,qs,eq,cs,fs,pt,om,aq,gc,rs,mv,gcc,gcp,as,ff,ccr,acc';
let agencyCodesList='omd,in,15b,blue 449,zenith opti media,perfomics,iclick,mindshare,maxus';
let channelCodesList='edm,sem,dis,os,ps,pr,prs,bb,tv,rd,ol,af,cm';
let languagesList='en,zh_CN,zh_TW,ja,de,fr,es';
let productsList='flights,cars,hotels,baggage,seats,transfers,activities,insurance,manage-your-trip,qantas-store,epiqure,cash,financial-services,points,online-mall,aquire,golf-club,restaurants,movies,gift-cards-cash,gift-cards-points,assure,frequent-flyer';
let placementList='fb,tw,gg,bi,yh,yt,gdn,li,inst,etr,pdc,ff';
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
    },
    getPlacementList:function(){
        return placementList;
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

let appendResponse=function(response){
    document.querySelector('.contentSection').innerHTML=response;
}

let respondToRequest=function(template,displayValue,displayNextValue){
    var values='';
    var valuesHTML='';
    if(document.querySelector('.values')!=null){
        values=document.querySelector('.values').innerText;
        valuesHTML=document.querySelector('.values').innerHTML;
    }
    requests.getURL(template).then(function(response){
        history.pushState({pageName:template,response:response},null,template.replace('/include',''));   
        appendResponse(response);
        //This is for adding another channel page
        if(typeof displayValue!=="undefined" && typeof displayNextValue!=="undefined" && (template.indexOf('createTagsChannels')!=-1 || template.indexOf('createInternalTagsChannels')!=-1)){
            //<a href="javascript:void('0');"><i class="fa fa-minus-square" aria-hidden="true"></i>&nbsp;SEO|GOOGLE</a>
            if(template.indexOf('createTagsChannels')!=-1){
                addEventListenerOnPlcmentSelectBox();
            }
            document.querySelector('.exisitngInfo').innerHTML='<a href="javascript:lib.editFirstPageTags();"><u>'+displayValue+'</u></a>';
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
            var breakElement=document.createElement('br');
            breakElement.className=displayNextValue.split('|').join("");
            document.querySelector('.values').appendChild(breakElement);
            document.querySelector('.valuesDiv').className=document.querySelector('.valuesDiv').className.replace('hidden','');
        }
        //Edit the channel page
        else if(typeof displayValue!="undefined" && typeof displayNextValue!=="undefined" && displayNextValue=="editStep"){
            editFirstPageTagsData(displayValue);
        }
        //This is for confirmation page
        else if(typeof displayValue!=="undefined" && typeof displayNextValue!=="undefined"){
            localStorage.setItem('valuesHTML',valuesHTML);
            localStorage.setItem('exisitngInfo',displayValue);
            document.querySelector('.exisitngInfo').innerHTML='<u>'+displayValue+'</u>';
            if(values!=null && values!=''){
                    values.split('\n').forEach(function(tag){
                        if(tag.trim()!=''){
                            document.querySelector('.exisitngInfoNext').innerHTML+=('<u>'+tag+'</u><br/>');
                            let isExternalCampaign=false;
                            if(displayValue.indexOf('External')!=-1){
                                isExternalCampaign=true;
                            }
                            let tags=displayValue.replace("External|","").replace("Internal|","");
                            let url=tags.split('|')[tags.split('|').length-1];
                            tags=tags.replace('|'+url,'');
                            tags=getTagsText(tags,tag,isExternalCampaign);
                            document.querySelector('.finalTags').innerHTML+=('<strong>'+url+(isExternalCampaign?'?alt_cam=':'?int_cam=')+(tags.toLowerCase())+'<strong><br/>');
                        }
                });
            }
            //Add the things that are present in fields when generate button is clicked
            document.querySelector('.exisitngInfoNext').innerHTML+=('<u>'+displayNextValue+'</u>');
            localStorage.setItem('exisitngInfoNext',document.querySelector('.exisitngInfoNext').innerHTML);
            let tags=displayValue.replace("External|","").replace("Internal|","");
            let url=tags.split('|')[tags.split('|').length-1];
            tags=tags.replace('|'+url,'');
            let isExternalCampaign=false;
            if(displayValue.indexOf('External')!=-1){
                isExternalCampaign=true;
            }
            if(displayNextValue!==''){
                tags=getTagsText(tags,displayNextValue,isExternalCampaign);
                document.querySelector('.finalTags').innerHTML+=('<strong>'+url+(isExternalCampaign?'?alt_cam=':'?int_cam=')+(tags.toLowerCase())+'<strong><br/>');
            }
            localStorage.setItem('finalTags',document.querySelector('.finalTags').innerHTML);
        }
        //This is for adding channel page
        else if(typeof displayValue!=="undefined"){
            document.querySelector('.exisitngInfo').innerHTML='<a href="javascript:lib.editFirstPageTags();"><u>'+displayValue+'</u></a>';
            addEventListenerOnPlcmentSelectBox();
        }
        //This is for adding event listeners to campaign checkboxes on first create page
        else if(template=="/include/createTags.html"){
            addEventListenersOnCheckBoxes();
        }
    },function(error){
        console.error('Error',error);
    });
}

let editFirstPageTagsData=function(displayValue){
    addEventListenersOnCheckBoxes();
    addEventListenerOnPlcmentSelectBox();
    var isInternalCampaign=false;
    if(displayValue.indexOf("External|")!=-1){
        document.querySelector('#externalCampaign').click();
    }else{
        document.querySelector('#internalCampaign').click();
        isInternalCampaign=true;
    }
    displayValue=displayValue.replace("External|","").replace("Internal|","").trim();
    displayValue.split('|').forEach(function(tag,index){
        switch(index){
            case 0:document.querySelector('#country [value="' + tag + '"]').selected = true;break;
            case 1:
                if(!isInternalCampaign){
                    document.querySelector('#businessUnit [value="' + tag + '"]').selected = true;
                }else{
                    document.querySelector('#language [value="' + tag + '"]').selected = true;
                }
                break;
            case 2:
                if(!isInternalCampaign){
                    document.querySelector('#agency [value="' + tag + '"]').selected = true;
                }else{
                    if(tag!='n'){
                        document.querySelector('#cname').value = tag;   
                    }
                }
                break;
            case 3:
                if(!isInternalCampaign){
                    if(tag!='n'){
                        document.querySelector('#cname').value = tag;   
                    }
                }else{
                    if(tag!='n'){
                        document.querySelector('#link').value = tag;   
                    }
                }
                break;
            case 4:
                if(tag!='n'){
                    document.querySelector('#link').value = tag;   
                }
                break;
            default:break;
        }
    });
}

let addEventListenerOnPlcmentSelectBox=function(){
    document.querySelector('#placement') && document.querySelector('#placement').addEventListener('change', function(event) {
        if(this.value=="other"){
            document.querySelector('.textField').classList.remove('hidden');
        }else{
            document.querySelector('.textField').classList.add('hidden');
        }
    });
}

let getTagsText=function(tags,displayNextValue,isExternalCampaign){
    if(isExternalCampaign){
        tags=tags+'|'+(displayNextValue.replace("External|","").replace("Internal|","").trim());
        tags=tags.split('|').join(':');
    }
    else{
        let tagSplits=tags.split('|');
        let displaySplits=displayNextValue.replace("External|","").replace("Internal|","").trim().split('|');
        let country=tagSplits[0];
        let page=displaySplits[1];
        let placement=displaySplits[2];
        let campaignName=tagSplits[2];
        let language=tagSplits[1];
        let product=displaySplits[0];
        tags=country+":"+page+":"+placement+":"+campaignName+":"+language+":"+product;
    }
    return tags;
}

let addEventListenersOnCheckBoxes=function(){
    document.querySelector('#internalCampaign').addEventListener('click',function(){
        displayCampaignForm('.internal','.external');
    });
    
    document.querySelector('#externalCampaign').addEventListener('click',function(){
        displayCampaignForm('.external','.internal');
    });
}

let displayCampaignForm=function(campaignType,hideCampaign){
    document.querySelectorAll(campaignType).forEach(function(link){
        link.classList.remove('hidden'); 
    });
    document.querySelectorAll(hideCampaign).forEach(function(link){
        link.classList.add('hidden'); 
    });
}

let removeTag=function(className){
    document.querySelector(".fa-minus-square."+className).parentNode.remove();
    document.querySelector("a."+className).remove();
    document.querySelector("br."+className).remove();
}

let editFirstPageTags=function(){
    var existingTags=document.querySelector('.exisitngInfo >a').innerText;
    respondToRequest('/include/createTags.html',existingTags,"editStep");
}

let editTag=function(className,overrideData){
    let tagData=document.querySelector("."+className+".anchorTag") && document.querySelector("."+className+".anchorTag").innerHTML;
    if(overrideData!=null && overrideData!='' && typeof overrideData!=="undefined"){
        tagData=overrideData;
    }
    let isExternalCampaign=false;
    if(tagData.indexOf('External')!=-1){
        isExternalCampaign=true;
    }
    tagData=tagData.replace("External|","").replace("Internal|","").trim();
    document.querySelector(".fa-minus-square."+className) && document.querySelector(".fa-minus-square."+className).parentNode.remove();
    document.querySelector("a."+className) && document.querySelector("a."+className).remove();
    document.querySelector("br."+className) && document.querySelector("br."+className).remove();
    let expanded=false;
    tagData.split('|').forEach(function(tag,index){
        switch(index){
            case 0:
            if(isExternalCampaign){
                document.querySelector('#channel [value="' + tag + '"]').selected = true;
            }else{
                document.querySelector('#product [value="' + tag + '"]').selected = true;
            }
            break;
            case 1:
            if(isExternalCampaign){
                if(document.querySelector('#placement [value="' + tag + '"]')!=null){
                    document.querySelector('#placement [value="' + tag + '"]').selected = true;
                }else{
                    document.querySelector('#placement [value="other"]').selected = true;
                    document.querySelector('.textField').classList.remove('hidden');
                    document.querySelector('#plcment').value=tag;
                }
                
            }else{
                document.querySelector('#page').value = tag;   
            }
            break;
            case 2:
            if(isExternalCampaign){
                if(tag!='n'){
                    !expanded && expandTags();
                    expanded=true;
                    document.querySelector('#ptype').value = tag;   
                }
            }else{
                document.querySelector('#plcment').value = tag;   
            } 
            break;
            case 3:
                if(tag!='n'){
                    !expanded && expandTags();
                    expanded=true;
                    document.querySelector('#ctype').value = tag;   
                }
                break;
            case 4:
                if(tag!='n'){
                    !expanded && expandTags();
                    expanded=true;
                    document.querySelector('#segment').value = tag;   
                }
                break;
            case 5:
                if(tag!='n'){
                    !expanded && expandTags();
                    expanded=true;
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
    if(displayValue.indexOf('External')!=-1){
        respondToRequest('/include/createTagsChannels.html',displayValue);
    }else{
        respondToRequest('/include/createInternalTagsChannels.html',displayValue);
    }
}

let confirm=function(topDisplayValue,displayValue){
    respondToRequest('/include/confirmTags.html',topDisplayValue,displayValue);
}

let addAnotherChannel=function(topDisplayValue,displayValue){
    if(topDisplayValue.indexOf('External')!=-1){
        respondToRequest('/include/createTagsChannels.html',topDisplayValue,displayValue);
    }else{
        respondToRequest('/include/createInternalTagsChannels.html',topDisplayValue,displayValue);
    }
}

let displayResults=function(errorsArray){
    requests.getURL('/include/validationResults.html').then(function(response){
        document.querySelector('.contentSection').innerHTML=response;
        history.pushState({pageName:'/include/validationResults.html',response:response},null,'validationResults.html');
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
            localStorage.setItem('validationResults',document.querySelector('.list-group').innerHTML);
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
    editTag:editTag,
    editFirstPageTags:editFirstPageTags,
    displayCampaignForm:displayCampaignForm,
    appendResponse:appendResponse,
    editFirstPageTagsData:editFirstPageTagsData
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
    var campaignType=validationData.topDisplayValue.split('|')[0];
    if(campaignType=="External"){
        if(document.querySelector('#channel').value=="Select"){
            validationData.errors.push("Please select from dropdown");
            validationData.errorFields.push("#channel");
        }
        if(document.querySelector('#placement').value=="Select"){
            validationData.errors.push("Please select from dropdown");
            validationData.errorFields.push("#placement");
        }
        if(document.querySelector('#placement').value=="other" && !validationmethods.isValidPlacementOrCampaign(document.querySelector('#plcment').value)){
            validationData.errors.push("Please enter proper placement");
            validationData.errorFields.push("#plcment");
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
        if(document.querySelector('#keywords').value!=="" && !validationmethods.isValidPlcOrConOrSegOrKey(document.querySelector('#keywords').value,true)){
            validationData.errors.push("Please enter proper key words");
            validationData.errorFields.push("#keywords");
        }
    }
    else{
        if(document.querySelector('#product').value=="Select"){
            validationData.errors.push("Please select from dropdown");
            validationData.errorFields.push("#product");
        }
        if(!validationmethods.isValidPlacementOrCampaignInt(document.querySelector('#page').value)){
            validationData.errors.push("Please enter proper page");
            validationData.errorFields.push("#page");
        }
        if(!validationmethods.isValidPlacementOrCampaignInt(document.querySelector('#plcment').value)){
            validationData.errors.push("Please enter proper placement");
            validationData.errorFields.push("#plcment");
        }
    }
    if(validationData.errors.length==0){
        validationData.displayValue=campaignType;
        if(campaignType=="External"){
            validationData.displayValue+=('|'+document.querySelector('#channel').value);
            if(document.querySelector('#placement').value=="other"){
                validationData.displayValue+=('|'+document.querySelector('#plcment').value);
            }else{
                validationData.displayValue+=('|'+document.querySelector('#placement').value);
            }
            validationData.displayValue+=('|'+(document.querySelector('#ptype').value!==""?document.querySelector('#ptype').value:'n'));
            validationData.displayValue+=('|'+(document.querySelector('#ctype').value!==""?document.querySelector('#ctype').value:'n'));
            validationData.displayValue+=('|'+(document.querySelector('#segment').value!==""?document.querySelector('#segment').value:'n'));
            validationData.displayValue+=('|'+(document.querySelector('#keywords').value!==""?document.querySelector('#keywords').value:'n'));
        }else{
            validationData.displayValue+=('|'+document.querySelector('#product').value);
            validationData.displayValue+=('|'+(document.querySelector('#page').value!==""?document.querySelector('#page').value:'n'));
            validationData.displayValue+=('|'+(document.querySelector('#plcment').value!==""?document.querySelector('#plcment').value:'n'));
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
            validationData.errors.push("Please enter proper url");
            validationData.errorFields.push("#link");
        }
        if(isInternalCampaign && !validationmethods.isValidPlacementOrCampaignInt(document.querySelector('#cname').value)){
            validationData.errors.push("Please enter proper campaign name");
            validationData.errorFields.push("#cname");
        }
        if(isExternalCampaign && !validationmethods.isValidPlacementOrCampaign(document.querySelector('#cname').value)){
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
        if(!isInternalCampaign){
            validationData.displayValue+=("|"+document.querySelector('#businessUnit').value);
            validationData.displayValue+=("|"+document.querySelector('#agency').value);
        }else{
            validationData.displayValue+=("|"+document.querySelector('#language').value);
        }
        validationData.displayValue+=("|"+document.querySelector('#cname').value);
        validationData.displayValue+=("|"+document.querySelector('#link').value);
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
let requests=require('./modules/requests.js');
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
        localStorage.setItem('firstStepData',validationData.displayValue);
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
    if((validationData.errors.length>0 || validationData.errorFields.length>0) && document.querySelector('.values').innerText.trim().length==0){
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

Library.prototype.editFirstPageTags=function(){
    ui.editFirstPageTags();
}

Library.prototype.back=function(){
    history.go(-1);
}

Library.prototype.stateManagement=function(){
    window.onpopstate=function(event){
        if(event.state){
            ui.appendResponse(event.state.response);
            //Display values of the form prefilled
            if(document.querySelector('#existingTags')!=null){
                document.querySelector('#existingTags').value=localStorage.getItem('validationTags');
            }
            if(document.querySelector('#externalCampaign')!=null){
                ui.editFirstPageTagsData(localStorage.getItem('firstStepData'));
            }
            if(document.querySelector('.exisitngInfo')!=null){
                document.querySelector('.exisitngInfo').innerHTML=localStorage.getItem('exisitngInfo');
            }
            if(document.querySelector('.exisitngInfoNext')!=null){
                document.querySelector('.exisitngInfoNext').innerHTML=localStorage.getItem('exisitngInfoNext');
            }
            if(document.querySelector('.finalTags')!=null){
                document.querySelector('.finalTags').innerHTML=localStorage.getItem('finalTags');
            }
            if(document.querySelector('.list-group')!=null){
                document.querySelector('.list-group').innerHTML=localStorage.getItem('validationResults');
            }
            if(document.querySelector('.valuesDiv')!=null && localStorage.getItem('valuesHTML').trim()!=''){
                document.querySelector('.valuesDiv').classList.remove('hidden');
                document.querySelector('.values').innerHTML=localStorage.getItem('valuesHTML');
                let value=localStorage.getItem('exisitngInfoNext');
                ui.editTag('na',value.split('<br>')[1].replace('<u>','').replace('</u>',''));
            }else if(document.querySelector('.valuesDiv')!=null){
                let value=localStorage.getItem('exisitngInfoNext');
                ui.editTag('na',value.replace('<u>','').replace('</u>',''));
            }
        }else{
            requests.getURL('/home.html').then(function(response){
                let parser=new DOMParser();
                let doc=parser.parseFromString(response,'text/html');
                let html=doc.querySelector('.contentSection').innerHTML;
                ui.appendResponse(html);
            });
        }
    }
}

module.exports=Library;
},{"./modules/requests.js":2,"./modules/userInteraction.js":3,"./modules/validations.js":4}]},{},[5])(5)
});
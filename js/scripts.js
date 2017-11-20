var countryCodesList='ar,au,at,be,br,ca,cl,cn,fj,fi,fr,pf,de,gl,hk,in,id,ie,it,jp,kr,mx,nl,nc,nz,na,pg,ph,sg,za,sa,es,ch,tw,th,ae,gb,us,vu,vn';
var businessUnitCodesList='qd,re,ql,rp,pro,dg,sbu,qs,eq,cs,fs,pt,om,aq,gc,rs,mv,gcc,gcp,as,ff,ccr,acc';
var agencyCodesList='omd,in,15b,ttas';
var channelCodesList='edm,sem,dis,os,ps,pr,prs,bb,tv,rd,ol,af,cm';
var languagesList='en,zh_CN,zh_TW,ja,de,fr,es';
var productsList='flights,cars,hotels,baggage,seats,transfers,activities,insurance,manage-your-trip,qantas-store,epiqure,cash,financial-services,points,online-mall,aquire,golf-club,restaurants,movies,gift-cards-cash,gift-cards-points,assure,frequent-flyer';
//Not empty and 10 characters
var regexp=/^[a-z0-9-]{1,10}$/i;
var regexpnonm=/^[a-z0-9-]{0,10}$/i;

var getURL=function(url){
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

var externalTagValidationAPI={
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

var internalTagValidationAPI={
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

var isValidPlacementOrCampaignInt=function(input){
    if(regexp.test(input) && input!=='n'){
        if(isValidLanguage(input) || isValidProduct(input) || isValidCountryCode(input)){
            return false;
        }
        return true;
    }else{
        return false;
    }
}

var isValidLanguage=function(input){
    if(languagesList.indexOf(input)!=-1){
        return true;
    }else{
        return false;
    }
}

var isValidProduct=function(input){
    if(productsList.indexOf(input)!=-1){
        return true;
    }else{
        return false;
    }
}

var validateTags=function(){
    getURL('/include/validateTags.html').then(function(response){
        document.querySelector('.contentSection').innerHTML=response;
    },function(error){
        console.error('Error',error);
    });
}

document.querySelector('.validateTags').addEventListener("click",function(){
    validateTags();
});

var clearField=function(){
    document.querySelector('#existingTags').value='';
}

var validateField=function(){
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
                        var isValid=window[validationAPI[index].validationMethod](param);
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
    displayResults(errorsArray);
    });
    console.log(errorsArray);
}

var isValidCountryCode=function(input){
    if(countryCodesList.indexOf(input)!=-1){
        return true;
    }else{
        return false;
    }
}

var displayResults=function(errorsArray){
    getURL('/include/validationResults.html').then(function(response){
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

var isValidBusinessUnitCode=function(input){
    if(businessUnitCodesList.indexOf(input)!=-1){
        return true;
    }else{
        return false;
    }
}

var isValidAgencyUnitCode=function(input){
    if(agencyCodesList.indexOf(input)!=-1){
        return true;
    }else{
        return false;
    }
}

var isValidChannelCode=function(input){
    if(channelCodesList.indexOf(input)!=-1){
        return true;
    }else{
        return false;
    }
}

var isValidPlacementOrCampaign=function(input){
    if(regexp.test(input) && input!=='n'){
        if(isValidChannelCode(input) || isValidAgencyUnitCode(input) || isValidCountryCode(input) || isValidCountryCode(input)){
            return false;
        }
        return true;
    }else{
        return false;
    }
}

var isValidPlcOrConOrSegOrKey=function(input){
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

var numericValidateCount=0;
//No dates logic is to just display message while number is entered
function isNumeric(){
    document.getElementById("typeahead-input-from").addEventListener("keypress", function(event){
        console.log('test');
        var keycode = event.which;
        if ((event.shiftKey == false && (keycode == 46 || keycode == 8 || keycode == 37 || keycode == 39 || (keycode >= 48 && keycode <= 57)))) {
            numericValidateCount++;
        }else{
            numericValidateCount=0;
        }
        if(numericValidateCount==2){
            console.log('Number');
        }
    });    
}

//URL validation
function validateURL(input){
    try{
        const url=new URL(input);
        if (!/https|http/.test(url.protocol)) {
            console.log('wrong protocol');
         }
    }catch(error){
        console.log("Not a valid URI:"+input+" and the error is:"+error);
    }
}

//Custom encryption
function encryptString(input){
    console.log(input);
    var encryptedNumber="";
    for(i=0;i<input.length;i++){
        encryptedNumber=encodeURIComponent(encryptedNumber+input.charCodeAt(i)+"C");
    }
    console.log(encryptedNumber.substring(0,encryptedNumber.length-1));
    return encryptedNumber;
}

function decryptString(input){
    var decryptedString=decodeURIComponent(input);
    var finalDecryptedString="";
    decryptedString.split('C').forEach(function(element) {
        finalDecryptedString+=String.fromCharCode(element);
    }, this);
    console.log(finalDecryptedString);
    return finalDecryptedString;
}
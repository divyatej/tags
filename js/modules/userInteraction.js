var requests=require('./requests.js');

let respondToRequest=function(template,displayValue,displayNextValue){
    requests.getURL(template).then(function(response){
        document.querySelector('.contentSection').innerHTML=response;
        if(typeof displayValue!=="undefined" && typeof displayNextValue!=="undefined" && template.indexOf('createTagsChannels')!=-1){
            //<a href="javascript:void('0');"><i class="fa fa-minus-square" aria-hidden="true"></i>&nbsp;SEO|GOOGLE</a>
            document.querySelector('.exisitngInfo').innerHTML='<u>'+displayValue+'</u>';
            var element=document.createElement('a');
            element.innerHTML="<i class=\"fa fa-minus-square\" aria-hidden=\"true\"></i>&nbsp;"+displayNextValue;
            element.href="javascript:void(''0);";
            document.querySelector('.values').appendChild(element);
            document.querySelector('.valuesDiv').className=document.querySelector('.valuesDiv').className.replace('hidden','');
        }
        else if(typeof displayValue!=="undefined" && typeof displayNextValue!=="undefined"){
            document.querySelector('.exisitngInfo').innerHTML='<u>'+displayValue+'</u>';
            document.querySelector('.exisitngInfoNext').innerHTML='<u>'+displayNextValue+'</u>';
            let tags=displayValue.replace("External|","").replace("Internal|","");
            let url=tags.split('|')[tags.split('|').length-1];
            tags=tags.replace('|'+url,'');
            tags=tags+'|'+(displayNextValue.replace("External|","").replace("Internal|",""));
            tags=tags.split('|').join(':')
            document.querySelector('.finalTags').innerHTML='<strong>'+url+'?alt_cam='+(tags.toLowerCase())+'<strong>';
        }
        else if(typeof displayValue!=="undefined"){
            document.querySelector('.exisitngInfo').innerHTML='<u>'+displayValue+'</u>';
        }
    },function(error){
        console.error('Error',error);
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
    addAnotherChannel:addAnotherChannel
}
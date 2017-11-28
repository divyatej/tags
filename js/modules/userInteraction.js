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
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
            //<a href="javascript:void('0');"><i class="fa fa-minus-circle" aria-hidden="true"></i>&nbsp;SEO|GOOGLE</a>
            if(template.indexOf('createTagsChannels')!=-1 || template.indexOf('createInternalTagsChannels')!=-1){
                addEventListenerOnPlcmentSelectBox();
                addEventListenersOnCheckBoxes();
            }
            document.querySelector('.exisitngInfo').innerHTML='<a class="anchor-display" href="javascript:lib.editFirstPageTags();"><u>'+displayValue+'</u></a>';
            if(valuesHTML!=''){
                document.querySelector('.values').innerHTML=valuesHTML;    
            }
            var icon=document.createElement('a');
            icon.className="anchor-display";
            icon.innerHTML="<i class=\"fa fa-minus-circle "+displayNextValue.split(' ').join('').split('|').join("")+"\" aria-hidden=\"true\"></i>";
            icon.href="javascript:lib.removeTag('"+displayNextValue.split(' ').join('').split('|').join("")+"');";
            document.querySelector('.values').appendChild(icon);
            var element=document.createElement('a');
            element.innerHTML=displayNextValue;
            element.className=displayNextValue.split(' ').join('').split('|').join("") + " anchorTag anchor-display text-margin-top";
            element.href="javascript:lib.editTag('"+displayNextValue.split(' ').join('').split('|').join("")+"');";
            document.querySelector('.values').appendChild(element);
            var breakElement=document.createElement('br');
            breakElement.className=displayNextValue.split(' ').join('').split('|').join("");
            document.querySelector('.values').appendChild(breakElement);
            document.querySelector('.valuesDiv').className=document.querySelector('.valuesDiv').className.replace('hidden','');
        }
        //Edit the channel page
        else if(typeof displayValue!="undefined" && typeof displayNextValue!=="undefined" && displayNextValue=="editStep"){
            editFirstPageTagsData(displayValue);
        }
        //This is for confirmation page
        else if(typeof displayValue!=="undefined" && typeof displayNextValue!=="undefined"){
            localStorage.setItem('exisitngInfo',displayValue);
            document.querySelector('.exisitngInfo').innerHTML='<a class="anchor-display" href="javascript:lib.editFirstPageTags();"><u>'+displayValue+'</u></a>';
            var indexCount=0;
            var isMoreThanOne=false;
            if(values!=null && values!=''){
                values.split('\n').forEach(function(tag,index){
                        if(tag.trim()!=''){
                            isMoreThanOne=true;
                            indexCount=index;
                            let anchorHTML="<a class=\"anchor-display\" href=\"javascript:lib.editFinalTag('"+index+"');\">";
                            document.querySelector('.exisitngInfoNext').innerHTML+=(anchorHTML+'<u>'+tag+'</u></a><br/>');
                            let isExternalCampaign=false;
                            if(displayValue.indexOf('External')!=-1){
                                isExternalCampaign=true;
                            }
                            let tags=displayValue.split(' ').join('').replace("External|","").replace("Internal|","");
                            let url=tags.split('|')[tags.split('|').length-1];
                            tags=tags.replace('|'+url,'');
                            tags=getTagsText(tags,tag,isExternalCampaign);
                            var html='<div><i class="fa fa-clipboard" copytext="'+url+(isExternalCampaign?'?alt_cam=':'?int_cam=')+(tags.split(' ').join('').toLowerCase())+ '"></i><span class="width-handler">'+ url+(isExternalCampaign?'?alt_cam=':'?int_cam=')+(tags.split(' ').join('').toLowerCase()) +'</span>'+'</div>';
                            document.querySelector('.finalTags').innerHTML+=(html);
                        }
                });   
            }
            if(isMoreThanOne){
                indexCount++;
            }
            localStorage.setItem('tagEdited',indexCount);
            //Add the things that are present in fields when generate button is clicked
            let anchorHTML="<a class=\"anchor-display\" href=\"javascript:lib.editFinalTag('"+indexCount+"');\">";
            document.querySelector('.exisitngInfoNext').innerHTML+=(anchorHTML+'<u>'+displayNextValue+'</u></a>');
            localStorage.setItem('exisitngInfoNext',document.querySelector('.exisitngInfoNext').innerText);
            let tags=displayValue.split(' ').join('').replace("External|","").replace("Internal|","");
            let url=tags.split('|')[tags.split('|').length-1];
            tags=tags.replace('|'+url,'');
            let isExternalCampaign=false;
            if(displayValue.indexOf('External')!=-1){
                isExternalCampaign=true;
            }
            if(displayNextValue!==''){
                tags=getTagsText(tags,displayNextValue,isExternalCampaign);
                var html='<div><i class="fa fa-clipboard" copytext="'+url+(isExternalCampaign?'?alt_cam=':'?int_cam=')+(tags.split(' ').join('').toLowerCase())+ '"></i><span class="width-handler">'+ url+(isExternalCampaign?'?alt_cam=':'?int_cam=')+(tags.split(' ').join('').toLowerCase()) +'</span>'+'</div>';
                document.querySelector('.finalTags').innerHTML+=(html);
                var lastAnchor="<a class=\"anchor-display\" href=\"javascript:lib.removeTag('"+displayNextValue.split('').join('').split('|').join('')+"');\"><i class=\"fa fa-minus-circle "+displayNextValue.split(' ').join('').split('|').join('')+"\"></i></a>";
                var anotherAnchor="<a class=\""+displayNextValue.split(' ').join('').split('|').join('')+" anchorTag anchor-display text-margin-top\" href=\"javascript:lib.editTag('"+displayNextValue.split(' ').join('').split('|').join('')+"');\">"+displayNextValue+"</a>";
                var breakElement="<br class=\""+displayNextValue.split(' ').join('').split('|').join('')+"\">";
                valuesHTML=valuesHTML+lastAnchor+anotherAnchor+breakElement;
            }     
            //<a class="Externaledmfbnnnn anchorTag" href="javascript:lib.editTag('Externaledmfbnnnn');">External|edm|fb|n|n|n|n</a><br class="Externaledmfbnnnn">
            localStorage.setItem('valuesHTML',valuesHTML);
            localStorage.setItem('finalTags',document.querySelector('.finalTags').innerHTML);
            document.querySelectorAll('.fa-clipboard').forEach(function(link){
                link.addEventListener('click',function(){
                    let textarea = document.createElement('textarea')
                    textarea.id = 't'
                    textarea.style.height = 0
                    document.body.appendChild(textarea)
                    textarea.value = this.parentNode.querySelector('span').innerText;
                    let selector = document.querySelector('#t')
                    selector.select()
                    document.execCommand('copy')
                    document.body.removeChild(textarea)
                });
            });
            addEventListenerOnPlcmentSelectBox();
            addEventListenersOnCheckBoxes();
        }
        //This is for adding channel page
        else if(typeof displayValue!=="undefined"){
            document.querySelector('.exisitngInfo').innerHTML='<a class=\"anchor-display\" href="javascript:lib.editFirstPageTags();"><u>'+displayValue+'</u></a>';
            addEventListenerOnPlcmentSelectBox();
            addEventListenersOnCheckBoxes();
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
    displayValue=displayValue.split(' ').join('');
    addEventListenersOnCheckBoxes();
    addEventListenerOnPlcmentSelectBox();
    var isInternalCampaign=false;
    if(displayValue.indexOf("External|")!=-1){
        document.querySelector('.externalCampaign').click();
    }else{
        document.querySelector('.internalCampaign').click();
        isInternalCampaign=true;
    }
    displayValue=displayValue.replace("External|","").replace("Internal|","").trim();
    displayValue.split('|').forEach(function(tag,index){
        switch(index){
            case 0:document.querySelector('#country [value="' + tag + '"]').selected = true;
                   document.querySelector('#countrytemp').value=document.querySelector('#country').options[document.querySelector('#country').selectedIndex].text; 
                   break;
            case 1:
                if(!isInternalCampaign){
                    document.querySelector('#businessUnit [value="' + tag + '"]').selected = true;
                    document.querySelector('#businessUnittemp').value=document.querySelector('#businessUnit').options[document.querySelector('#businessUnit').selectedIndex].text; 
                }else{
                    document.querySelector('#language [value="' + tag + '"]').selected = true;
                    document.querySelector('#languagetemp').value=document.querySelector('#language').options[document.querySelector('#language').selectedIndex].text; 
                }
                break;
            case 2:
                if(!isInternalCampaign){
                    document.querySelector('#agency [value="' + tag + '"]').selected = true;
                    document.querySelector('#agencytemp').value=document.querySelector('#agency').options[document.querySelector('#agency').selectedIndex].text; 
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
    document.querySelector('#placementtemp') && document.querySelector('#placementtemp').addEventListener('change', function(event) {
        if(this.value=="other"){
            document.querySelector('.textField').classList.remove('hidden');
        }else{
            document.querySelector('.textField').classList.add('hidden');
        }
    });
}

let getTagsText=function(tags,displayNextValue,isExternalCampaign){
    if(isExternalCampaign){
        let tagSplits=tags.split('|');
        let displaySplits=displayNextValue.split(' ').join('').replace("External|","").replace("Internal|","").trim().split('|');
        let tagArray=[];
        tagArray.push(tagSplits[0]);
        tagArray.push(tagSplits[1]);
        tagArray.push(tagSplits[2]);
        tagArray.push(displaySplits[0]);
        tagArray.push(displaySplits[1]);
        tagArray.push(tagSplits[3]);
        tagArray.push(displaySplits[2]);
        tagArray.push(displaySplits[3]);
        tagArray.push(displaySplits[4]);
        tagArray.push(displaySplits[5]);
        tags=tagArray.join(':');
    }
    else{
        let tagSplits=tags.split('|');
        let displaySplits=displayNextValue.split(' ').join('').replace("External|","").replace("Internal|","").trim().split('|');        
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

    document.querySelectorAll('.qfa1-dropdown-list__list-item') && document.querySelectorAll('.qfa1-dropdown-list__list-item').forEach(function(elem){
      elem.addEventListener('click',function(){
        var id=this.parentNode.parentNode.querySelector('select').id;
        document.querySelector('#'+id+' [value="' + this.attributes['select'].value + '"]').selected = true;
        document.querySelector('#'+id+'temp').value=this.attributes['selectabbr'].value;
        if(id=="placement" && this.attributes['select'].value=="other"){
            document.querySelector('.textField').classList.remove('hidden');
        }else if(id=="placement" && this.attributes['select'].value!=="other"){
            document.querySelector('.textField').classList.add('hidden');
        }
        replaceArrows(this);
    });  
    });

    document.querySelector('.internalCampaign') && document.querySelector('.internalCampaign').addEventListener('click',function(){
        document.querySelector('#internalCampaign').attributes.setNamedItem(document.createAttribute('checked'));
        document.querySelector('#externalCampaign').attributes['checked'] && document.querySelector('#externalCampaign').attributes.removeNamedItem('checked');
        document.querySelector('.radiobutton-icon__check.internalCampaign').classList.remove('hidden');
        document.querySelector('.radiobutton-icon__check.externalCampaign').classList.add('hidden');
        displayCampaignForm('.internal','.external');
    });

    document.querySelector('.externalCampaign') && document.querySelector('.externalCampaign').addEventListener('click',function(){
        document.querySelector('#externalCampaign').attributes.setNamedItem(document.createAttribute('checked'));
        document.querySelector('#internalCampaign').attributes['checked'] && document.querySelector('#internalCampaign').attributes.removeNamedItem('checked');
        document.querySelector('.radiobutton-icon__check.externalCampaign').classList.remove('hidden');
        document.querySelector('.radiobutton-icon__check.internalCampaign').classList.add('hidden');
        displayCampaignForm('.external','.internal');
    });

    document.querySelectorAll('.input-styles') && document.querySelectorAll('.input-styles').forEach(function(elem){
        elem.addEventListener('click',function(e){
            e.stopPropagation();
            replaceArrows(elem);
        })
    });

    document.addEventListener("click",function(){
        document.querySelectorAll('.input-styles').forEach(function(elem){
            var node=typeof elem!=="undefined"?elem.parentNode.parentNode:document;
            if(node.querySelector('.down-arrow').classList.value.includes('hidden')){
                node.querySelector('.down-arrow').classList.remove('hidden');
                node.querySelector('.up-arrow').classList.add('hidden');
                node.querySelector('.qfa1-dropdown-list__list').classList.add('hidden');
            }
        });
    });

    document.querySelectorAll('.down-arrow') && document.querySelectorAll('.down-arrow').forEach(function(elem){
        elem.addEventListener('click',function(){
            replaceArrows();
        });
    });
}

let replaceArrows=function(elem){
        var node=typeof elem!=="undefined"?elem.parentNode.parentNode:document;
        if(node.querySelector('.down-arrow').classList.value.includes('hidden')){
            node.querySelector('.down-arrow').classList.remove('hidden');
            node.querySelector('.up-arrow').classList.add('hidden');
            node.querySelector('.qfa1-dropdown-list__list').classList.add('hidden');
        }else{
            node.querySelector('.up-arrow').classList.remove('hidden');
            node.querySelector('.down-arrow').classList.add('hidden');
            node.querySelector('.qfa1-dropdown-list__list').classList.remove('hidden');
        }
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
    document.querySelector(".fa-minus-circle."+className).parentNode.remove();
    document.querySelector("a."+className).remove();
    document.querySelector("br."+className).remove();
    if(document.querySelector('.values').querySelectorAll('a').length<2){
        document.querySelector('.values').parentNode.classList.add('hidden');
    }
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
    tagData=tagData.split(' ').join('').replace('<span class="hidden">','').replace('</span>','');
    let isExternalCampaign=false;
    if(tagData.indexOf('External')!=-1){
        isExternalCampaign=true;
    }
    tagData=tagData.replace("External|","").replace("Internal|","").trim();
    document.querySelector(".fa-minus-circle."+className) && document.querySelector(".fa-minus-circle."+className).parentNode.remove();
    document.querySelector("a."+className) && document.querySelector("a."+className).remove();
    document.querySelector("br."+className) && document.querySelector("br."+className).remove();
    if(document.querySelector('.values').querySelectorAll('a').length<2){
        document.querySelector('.values').parentNode.classList.add('hidden');
    }
    let expanded=false;
    tagData.split('|').forEach(function(tag,index){
        switch(index){
            case 0:
            if(isExternalCampaign){
                document.querySelector('#channel [value="' + tag + '"]').selected = true;
                document.querySelector('#channeltemp').value=document.querySelector('#channel').options[document.querySelector('#channel').selectedIndex].text; 
            }else{
                document.querySelector('#product [value="' + tag + '"]').selected = true;
                document.querySelector('#producttemp').value=document.querySelector('#product').options[document.querySelector('#product').selectedIndex].text; 
            }
            break;
            case 1:
            if(isExternalCampaign){
                if(document.querySelector('#placement [value="' + tag + '"]')!=null){
                    document.querySelector('#placement [value="' + tag + '"]').selected = true;
                    document.querySelector('#placementtemp').value=document.querySelector('#placement').options[document.querySelector('#placement').selectedIndex].text; 
                }else{
                    document.querySelector('#placement [value="other"]').selected = true;
                    document.querySelector('#placementtemp').value=document.querySelector('#placement').options[document.querySelector('#placement').selectedIndex].text; 
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
    if(typeof overrideData!=="undefined"){
        addEventListenersOnCheckBoxes();
        addEventListenerOnPlcmentSelectBox();
    }
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
    if(document.querySelector('.createTags')!=null && !document.querySelector('.createTags').className.includes('less')){
        Array.from(document.querySelectorAll('.expandField')).forEach(link=>{
            link.className=link.className.replace('hidden','');
        });
        document.querySelector('.createTags').className+=' less';
        document.querySelector('.createTags').text='- Show less data points';
    }
    else{
        Array.from(document.querySelectorAll('.expandField')).forEach(link=>{
            link.querySelector('input').value='';
            link.className+=' hidden';
        });
        document.querySelector('.createTags').className=document.querySelector('.createTags').className.replace('less','');
        document.querySelector('.createTags').text='+ Additional data points (optional)';
    }
}

let highlightErrors=function(validationData){
    let errorFields=validationData.errorFields;
    let displayAbbreviations=validationData.displayAbbrList;
    validationData.errors.forEach(function(error,index){
        var errorField=errorFields[index];
        document.querySelector(errorField).className+=' is-invalid';
        var divElement=document.createElement('div');
        divElement.innerHTML=error;
        divElement.className='invalid-feedback '+errorField.replace('#','');
        if(typeof document.querySelector(errorField).nextSibling.className=="undefined"){
            document.querySelector(errorField).insertAdjacentElement('afterend',divElement);
            document.querySelector(errorField).parentNode.querySelector('.down-arrow') ? document.querySelector(errorField).parentNode.querySelector('.down-arrow').style='top:-36px;' : "";
            document.querySelector(errorField).parentNode.querySelector('.up-arrow') ? document.querySelector(errorField).parentNode.querySelector('.up-arrow').style='top:-36px;' : "";
            if(document.querySelector(errorField).type=="text" && displayAbbreviations){
                var anchor=document.createElement('a');
                anchor.href="/include/abbreviations.html";
                anchor.target="_blank";
                anchor.innerText="Abbreviations list";
                anchor.className=errorField.replace('#','');
                anchor.className+=' anchor-display';
                anchor.style='text-decoration:underline;font-size:18px;'
                document.querySelector(errorField.replace('#','.')).insertAdjacentElement('afterend',anchor);
            }
        }
    });
    Array.from(document.querySelectorAll('.is-invalid')).forEach(link => {
        link.addEventListener('change', function(event) {
            this.className=this.className.replace(' is-invalid','');
            document.querySelector('.'+this.id)&&document.querySelector('.'+this.id).remove();
            document.querySelector('.'+this.id)&&document.querySelector('.'+this.id).remove();
        });
        link.addEventListener('keypress', function(event) {
            this.className=this.className.replace(' is-invalid','');
            document.querySelector('.'+this.id)&&document.querySelector('.'+this.id).remove();
            document.querySelector('.'+this.id)&&document.querySelector('.'+this.id).remove();
        });
        link.addEventListener('click', function(event) {
            this.className=this.className.replace(' is-invalid','');
            document.querySelector('.'+this.id)&&document.querySelector('.'+this.id).remove();
            document.querySelector('.'+this.id)&&document.querySelector('.'+this.id).remove();
            document.querySelector('#'+this.id).parentNode.querySelector('.down-arrow') ? document.querySelector('#'+this.id).parentNode.querySelector('.down-arrow').style='top:10px;':"";
            document.querySelector('#'+this.id).parentNode.querySelector('.up-arrow') ? document.querySelector('#'+this.id).parentNode.querySelector('.up-arrow').style='top:10px;':"";
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
            //{\"key\":\"value\"}
            var exportToExcel={};
            errorsArray.forEach(function(error,index){
                if(error.success){
                    exportToExcel[index]=error.url+',No Errors,'+'';
                    document.querySelector('.appendResults').innerHTML+=('<tr><td class="tableBorder">'+error.url+'</td><td class="tableBorder">No Errors</td><td class="tableBorder"></td></tr>');
                }else{
                    var errors='';
                    var excelErrors='';
                    error.error.forEach(function(err,index){
                        errors+='<li>';
                        if(index>0){
                            excelErrors+='\n'; 
                        }
                        errors+=err;
                        excelErrors+=err;
                        errors+='</li>';
                    })
                    exportToExcel[index]=(error.url!=""?error.url:"No url entered for validation")+',Errors,'+excelErrors;
                    document.querySelector('.appendResults').innerHTML+=('<tr><td class="tableBorder">'+(error.url!=""?error.url:"No url entered for validation")+'</td><td class="tableBorder">Errors</td><td class="tableBorder"><ul>'+errors+'</ul></td></tr>');
                }
                document.querySelector('.excelErrors').innerText=JSON.stringify(exportToExcel);
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
    editTag:editTag,
    editFirstPageTags:editFirstPageTags,
    displayCampaignForm:displayCampaignForm,
    appendResponse:appendResponse,
    editFirstPageTagsData:editFirstPageTagsData
}
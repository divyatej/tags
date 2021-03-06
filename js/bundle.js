(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Library = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
let countryCodesList='ar,au,at,be,br,ca,cl,cn,fj,fi,fr,pf,de,gl,hk,in,id,ie,it,jp,kr,mx,nl,nc,nz,na,pg,ph,sg,za,sa,es,ch,tw,th,ae,gb,us,vu,vn';
let businessUnitCodesList='qd,re,ql,rp,pro,dg,sbu,qs,eq,cs,fs,pt,om,aq,gc,rs,mv,gcc,gcp,as,ff,ccr,acc';
let agencyCodesList='omd,in,15b,blue449,zenith opti media,perfomics,iclick,mindshare,maxus,int';
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
            var exportToExcel={};
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
                            //var html='<div><i class="fa fa-clipboard" copytext="'+url+(isExternalCampaign?'?alt_cam=':'?int_cam=')+(tags.split(' ').join('').toLowerCase())+ '"></i><span class="width-handler">'+ url+(isExternalCampaign?'?alt_cam=':'?int_cam=')+(tags.split(' ').join('').toLowerCase()) +'</span>'+'</div>';
                            var html=('<tr><td class="tableBorder">'+ url+(isExternalCampaign?'?alt_cam=':'?int_cam=')+(tags.split(' ').join('').toLowerCase()) +'</td></tr>');
                            exportToExcel[index]=url+(isExternalCampaign?'?alt_cam=':'?int_cam=')+(tags.split(' ').join('').toLowerCase());
                            document.querySelector('.appendResults').innerHTML+=(html);
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
                //var html='<div><i class="fa fa-clipboard" copytext="'+url+(isExternalCampaign?'?alt_cam=':'?int_cam=')+(tags.split(' ').join('').toLowerCase())+ '"></i><span class="width-handler">'+ url+(isExternalCampaign?'?alt_cam=':'?int_cam=')+(tags.split(' ').join('').toLowerCase()) +'</span>'+'</div>';
                var html=('<tr><td class="tableBorder">'+ url+(isExternalCampaign?'?alt_cam=':'?int_cam=')+(tags.split(' ').join('').toLowerCase()) +'</td></tr>');
                document.querySelector('.appendResults').innerHTML+=(html);
                exportToExcel[indexCount]=url+(isExternalCampaign?'?alt_cam=':'?int_cam=')+(tags.split(' ').join('').toLowerCase());
                var lastAnchor="<a class=\"anchor-display\" href=\"javascript:lib.removeTag('"+displayNextValue.split('').join('').split('|').join('')+"');\"><i class=\"fa fa-minus-circle "+displayNextValue.split(' ').join('').split('|').join('')+"\"></i></a>";
                var anotherAnchor="<a class=\""+displayNextValue.split(' ').join('').split('|').join('')+" anchorTag anchor-display text-margin-top\" href=\"javascript:lib.editTag('"+displayNextValue.split(' ').join('').split('|').join('')+"');\">"+displayNextValue+"</a>";
                var breakElement="<br class=\""+displayNextValue.split(' ').join('').split('|').join('')+"\">";
                valuesHTML=valuesHTML+lastAnchor+anotherAnchor+breakElement;
            }     
            //<a class="Externaledmfbnnnn anchorTag" href="javascript:lib.editTag('Externaledmfbnnnn');">External|edm|fb|n|n|n|n</a><br class="Externaledmfbnnnn">
            localStorage.setItem('valuesHTML',valuesHTML);
            localStorage.setItem('appendResults',document.querySelector('.appendResults').innerHTML);
            document.querySelector('.excelErrors') && (document.querySelector('.excelErrors').innerHTML=JSON.stringify(exportToExcel));
            document.querySelectorAll('.fa-clipboard') && document.querySelectorAll('.fa-clipboard').forEach(function(link){
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
            displayValue=displayValue.split('?')[0];
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
                    if(document.querySelector('#agency [value="' + tag + '"]')!=null){
                        document.querySelector('#agency [value="' + tag + '"]').selected = true;
                        document.querySelector('#agencytemp').value=document.querySelector('#agency').options[document.querySelector('#agency').selectedIndex].text; 
                    }else{
                        document.querySelector('#agency [value="other"]').selected = true;
                        document.querySelector('#agencytemp').value=document.querySelector('#agency').options[document.querySelector('#agency').selectedIndex].text; 
                        document.querySelector('.textField').classList.remove('hidden');
                        document.querySelector('#agncy').value=tag;
                    }
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
        if((id=="placement" || id=="agency") && this.attributes['select'].value=="other"){
            document.querySelector('.textField').classList.remove('hidden');
        }else if((id=="placement" || id=="agency") && this.attributes['select'].value!=="other"){
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
},{"./requests.js":2}],4:[function(require,module,exports){
let codesList=require("./abbreviations.js");
let ui=require('./userInteraction.js');
let regexp=/^[a-z0-9-]{1,25}$/i;
let regexpnonm=/^[a-z0-9-]{0,25}$/i;

let externalTagValidationAPI={
    0:{
        validationMethod:"isValidCountryCode",
        validationError:"Error in country code. Country code should be from Abbreviations list link given on this page",
        validationKey:"country"
    },
    1:{
        validationMethod:"isValidBusinessUnitCode",
        validationError:"Error in business unit code. Business unit code should be from Abbreviations list link given on this page",
        validationKey:"businessUnit"
    },
    2:{
        validationMethod:"isValidAgencyUnitCode",
        validationError:"Error in agency code. Agency code should be from Abbreviations list link given on this page",
        validationKey:"agency"
    },
    3:{
        validationMethod:"isValidChannelCode",
        validationError:"Error in channel code. Channel code should be from Abbreviations list link given on this page",
        validationKey:"channel"
    },
    4:{
        validationMethod:"isValidPlacementCode",
        validationError:"Error in Placement. Placement should be from Abbreviations list link given on this page",
        validationKey:"placement"
    },
    5:{
        validationMethod:"isValidPlacementOrCampaign",
        validationError:"Error in Campaign. Campaign name cannot use any of the standard abbreviations",
        validationKey:"cname"
    },
    6:{
        validationMethod:"isValidPlcOrConOrSegOrKey",
        validationError:"Error in Placement type. Placement type cannot use any of the standard abbreviations",
        validationKey:"ptype"
    },
    7:{
        validationMethod:"isValidPlcOrConOrSegOrKey",
        validationError:"Error in Content type. Content type cannot use any of the standard abbreviations",
        validationKey:"ctype"
    },
    8:{
        validationMethod:"isValidPlcOrConOrSegOrKey",
        validationError:"Error in Segment. Segment cannot use any of the standard abbreviations",
        validationKey:"segment"
    },
    9:{
        validationMethod:"isValidPlcOrConOrSegOrKey",
        validationError:"Error in Key word. Key word cannot use any of the standard abbreviations",
        validationKey:"keywords"
    }
}

let internalTagValidationAPI={
    0:{
        validationMethod:"isValidCountryCode",
        validationError:"Error in country code. Country code should be from Abbreviations list link given on this page",
        validationKey:"country"
    },
    1:{
        validationMethod:"isValidPlacementOrCampaignInt",
        validationError:"Error in page name. Page name cannot use any of the standard abbreviations",
        validationKey:"page"
    },
    2:{
        validationMethod:"isValidPlacementOrCampaignInt",
        validationError:"Error in placement. Placement cannot use any of the standard abbreviations",
        validationKey:"plcment"
    },
    3:{
        validationMethod:"isValidPlacementOrCampaignInt",
        validationError:"Error in campaign name. Campaign name cannot use any of the standard abbreviations",
        validationKey:"cname"
    },
    4:{
        validationMethod:"isValidLanguage",
        validationError:"Error in language. Language should be from Abbreviations list link given on this page",
        validationKey:"language"
    },
    5:{
        validationMethod:"isValidProduct",
        validationError:"Error in product. Product should be from Abbreviations list link given on this page",
        validationKey:"product"
    }
}

let isValidPlacementOrCampaignInt=function(input){
    input=input.toLowerCase();
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
    input=input.toLowerCase();
    if(codesList.getLanguageCodeList().split(',').includes(input)){
        return true;
    }else{
        return false;
    }
}

let isValidProduct=function(input){
    input=input.toLowerCase();
    if(codesList.getProductCodeList().split(',').includes(input)){
        return true;
    }else{
        return false;
    }
}

let isValidCountryCode=function(input){
    input=input.toLowerCase();
    if(codesList.getCountryCodeList().split(',').includes(input)){
        return true;
    }else{
        return false;
    }
}

let isValidBusinessUnitCode=function(input){
    input=input.toLowerCase();
    if(codesList.getBusinessUnitCodeList().split(',').includes(input)){
        return true;
    }else{
        return false;
    }
}

let isValidAgencyUnitCode=function(input){
    input=input.toLowerCase();
    if(codesList.getAgencyCodeList().split(',').includes(input)){
        return true;
    }else{
        return false;
    }
}

let isValidChannelCode=function(input){
    input=input.toLowerCase();
    if(codesList.getChannelCodeList().split(',').includes(input)){
        return true;
    }else{
        return false;
    }
}

let isValidPlacementCode=function(input){
    input=input.toLowerCase();
    if(codesList.getPlacementList().split(',').includes(input)){
        return true;
    }else{
        return false;
    }
}

let isValidPlacementOrCampaign=function(input){
    input=input.toLowerCase();
    if(regexp.test(input) && input!=='n'){
        if(isValidChannelCode(input) || isValidAgencyUnitCode(input) || isValidBusinessUnitCode(input) || isValidCountryCode(input) || isValidPlacementCode(input)){
            return false;
        }
        return true;
    }else{
        return false;
    }
}

let isValidPlcOrConOrSegOrKey=function(input,isKeyWord){
    input=input.toLowerCase();
    if(typeof input=="undefined" || input=="" || input=="n"){
        input="--NA--";
    }
    if(regexpnonm.test(input) || isKeyWord){
        if(isValidChannelCode(input) || isValidAgencyUnitCode(input) || isValidBusinessUnitCode(input) || isValidCountryCode(input) || isValidPlacementCode(input)){
            return false;
        }
        return true;
    }else{
        return false;
    }
}

let isValidURL=function (input){
    input=input.toLowerCase();
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
            validationData.errorFields.push("#channeltemp");
        }
        if(document.querySelector('#placement').value=="Select"){
            validationData.errors.push("Please select from dropdown");
            validationData.errorFields.push("#placementtemp");
        }
        if(document.querySelector('#placement').value=="other" && !/^[a-z0-9-]{1,25}$/i.test(document.querySelector('#plcment').value)){
            document.querySelector('#plcment').value!==""?validationData.errors.push("Placement cannot include any special characters except \"-\""):validationData.errors.push("Provide a Placement");
            validationData.errorFields.push("#plcment");
        }
        else if(document.querySelector('#placement').value=="other" && !validationmethods.isValidPlacementOrCampaign(document.querySelector('#plcment').value)){
            validationData.errors.push("Placement cannot use any of the standard abbreviations");
            validationData.displayAbbrList=true;
            validationData.errorFields.push("#plcment");
        }
        if(document.querySelector('#ptype').value!=="" && !/^[a-z0-9-]{0,25}$/i.test(document.querySelector('#ptype').value)){
            document.querySelector('#ptype').value!==""?validationData.errors.push("Placement type cannot include any special characters except \"-\""):validationData.errors.push("Provide a Placement type");
            validationData.errorFields.push("#ptype");
        }
        else if(document.querySelector('#ptype').value!=="" && !validationmethods.isValidPlcOrConOrSegOrKey(document.querySelector('#ptype').value)){
            validationData.errors.push("Placement type cannot use any of the standard abbreviations");
            validationData.displayAbbrList=true;
            validationData.errorFields.push("#ptype");
        }
        if(document.querySelector('#ctype').value!=="" && !/^[a-z0-9-]{0,25}$/i.test(document.querySelector('#ctype').value)){
            document.querySelector('#ctype').value!==""?validationData.errors.push("Content type cannot include any special characters except \"-\""):validationData.errors.push("Provide a Content type");
            validationData.errorFields.push("#ctype");
        }
        else if(document.querySelector('#ctype').value!=="" && !validationmethods.isValidPlcOrConOrSegOrKey(document.querySelector('#ctype').value)){
            validationData.errors.push("Content type cannot use any of the standard abbreviations");
            validationData.displayAbbrList=true;
            validationData.errorFields.push("#ctype");
        }
        if(document.querySelector('#segment').value!=="" && !/^[a-z0-9-]{0,25}$/i.test(document.querySelector('#segment').value)){
            document.querySelector('#segment').value!==""?validationData.errors.push("Segment cannot include any special characters except \"-\""):validationData.errors.push("Provide a Segment");
            validationData.errorFields.push("#segment");
        }
        else if(document.querySelector('#segment').value!=="" && !validationmethods.isValidPlcOrConOrSegOrKey(document.querySelector('#segment').value)){
            validationData.errors.push("Segment cannot use any of the standard abbreviations");
            validationData.displayAbbrList=true;
            validationData.errorFields.push("#segment");
        }
        if(document.querySelector('#keywords').value!=="" && !/^[a-z0-9-]{0,2500}$/i.test(document.querySelector('#keywords').value)){
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
        if(document.querySelector('#page').value!=="" && !/^[a-z0-9-]{1,25}$/i.test(document.querySelector('#page').value)){
            document.querySelector('#page').value!==""?validationData.errors.push("Page cannot include any special characters except \"-\""):validationData.errors.push("Provide a Page");
            validationData.errorFields.push("#page");
        }
        else if(!validationmethods.isValidPlacementOrCampaignInt(document.querySelector('#page').value)){
            validationData.errors.push("Page cannot use any of the standard abbreviations");
            validationData.displayAbbrList=true;
            validationData.errorFields.push("#page");
        }
        if(document.querySelector('#plcment').value!=="" && !/^[a-z0-9-]{1,25}$/i.test(document.querySelector('#plcment').value)){
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
        if(document.querySelector('#agency').value=="other" && !/^[a-z0-9-]{1,25}$/i.test(document.querySelector('#agncy').value)){
            document.querySelector('#agncy').value!==""?validationData.errors.push("Agency cannot include any special characters except \"-\""):validationData.errors.push("Provide an Agency");
            validationData.errorFields.push("#agncy");
        }
        else if(document.querySelector('#agency').value=="other" && !validationmethods.isValidPlacementOrCampaign(document.querySelector('#agncy').value)){
            validationData.errors.push("Agency cannot use any of the standard abbreviations");
            validationData.displayAbbrList=true;
            validationData.errorFields.push("#agncy");
        }
        if(!validationmethods.isValidURL(document.querySelector('#link').value)){
            validationData.errors.push("Provide a valid URL. Eg. www.qantas.com/au/en.html");
            validationData.errorFields.push("#link");
        }
        if(!/^[a-z0-9-]{1,25}$/i.test(document.querySelector('#cname').value)){
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
            if(document.querySelector('#agency').value=="other"){
                validationData.displayValue+=(' | '+document.querySelector('#agncy').value);
            }else{
                validationData.displayValue+=(' | '+document.querySelector('#agency').value);
            }
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
                        var validationKey=validationAPI[index].validationKey;
                        var isValid=(validationKey=="keywords")?(validationmethods[validationAPI[index].validationMethod](param,true)):(validationmethods[validationAPI[index].validationMethod](param));
                        if(validationKey=="placement" && !/^[a-z0-9-]{1,25}$/i.test(param)){
                            if(param.length>25){
                                urlObject.error.push("Placement cannot be more than 25 characters"+"::"+param);
                                isValid=true;
                            }else{
                                param!==""?urlObject.error.push("Placement cannot include any special characters except \"-\""+"::"+param):urlObject.error.push("Provide a Placement");
                                isValid=true;
                            }
                        }else if(validationKey=="placement"){
                            isValid=true;//Placement can be entered manually
                        }
                        if(validationKey=="agency" && !/^[a-z0-9-]{1,25}$/i.test(param)){
                            if(param.length>25){
                                urlObject.error.push("Agency cannot be more than 25 characters"+"::"+param);
                                isValid=true;
                            }else{
                                param!==""?urlObject.error.push("Agency cannot include any special characters except \"-\""+"::"+param):urlObject.error.push("Provide an Agency");
                                isValid=true;
                            }
                        }else if(validationKey=="agency"){
                            isValid=true;//Agency can be entered manually
                        }
                        if(validationKey=="cname" && !/^[a-z0-9-]{1,25}$/i.test(param)){
                            if(param.length>25){
                                urlObject.error.push("Campaign name cannot be more than 25 characters"+"::"+param);
                                isValid=true;
                            }else{
                                param!==""?urlObject.error.push("Campaign name cannot include any special characters except \"-\""+"::"+param):urlObject.error.push("Provide a Campaign name");
                                isValid=true;
                            }
                        }
                        if(validationKey=="page" && !/^[a-z0-9-]{1,25}$/i.test(param)){
                            if(param.length>25){
                                urlObject.error.push("Page name cannot be more than 25 characters"+"::"+param);
                                isValid=true;
                            }else{
                                param!==""?urlObject.error.push("Page name cannot include any special characters except \"-\""+"::"+param):urlObject.error.push("Provide a Page name");
                                isValid=true;
                            }
                        }
                        if(validationKey=="ptype" && !/^[a-z0-9-]{0,25}$/i.test(param)){
                            if(param.length>25){
                                urlObject.error.push("Placement type cannot be more than 25 characters"+"::"+param);
                                isValid=true;
                            }else{
                                param!==""?urlObject.error.push("Placement type cannot include any special characters except \"-\""+"::"+param):urlObject.error.push("Provide a Placement type");
                                isValid=true;
                            }
                        }
                        if(validationKey=="ctype" && !/^[a-z0-9-]{0,25}$/i.test(param)){
                            if(param.length>25){
                                urlObject.error.push("Campaign type cannot be more than 25 characters"+"::"+param);
                                isValid=true;
                            }else{
                                param!==""?urlObject.error.push("Campaign type cannot include any special characters except \"-\""+"::"+param):urlObject.error.push("Provide a Campaign type");
                                isValid=true;
                            }
                        }
                        if(validationKey=="segment" && !/^[a-z0-9-]{0,25}$/i.test(param)){
                            if(param.length>25){
                                urlObject.error.push("Segment cannot be more than 25 characters"+"::"+param);
                                isValid=true;
                            }else{
                                param!==""?urlObject.error.push("Segment cannot include any special characters except \"-\""+"::"+param):urlObject.error.push("Provide a Segment");
                                isValid=true;
                            }
                        }
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
    isValidPlacementCode:isValidPlacementCode,
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
                var anchor=document.createElement('a');
                anchor.className="anchor-display";
                anchor.href="javascript:lib.editFirstPageTags();";
                anchor.innerHTML=localStorage.getItem('exisitngInfo');
                document.querySelector('.exisitngInfo').appendChild(anchor);
            }
            if(document.querySelector('.exisitngInfoNext')!=null){
                localStorage.getItem('exisitngInfoNext').split('\n').forEach(function(tag,index){
                    let anchorHTML="<a class=\"anchor-display\" href=\"javascript:lib.editFinalTag('"+index+"');\">";
                    document.querySelector('.exisitngInfoNext').innerHTML+=(anchorHTML+'<u>'+tag+'</u></a><br/>');
                })
            }
            if(document.querySelector('.appendResults')!=null){
                document.querySelector('.appendResults').innerHTML=localStorage.getItem('appendResults');
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
            }
            if(document.querySelector('.list-group')!=null){
                document.querySelector('.list-group').innerHTML=localStorage.getItem('validationResults');
            }
            if(document.querySelector('.valuesDiv')!=null && localStorage.getItem('valuesHTML').trim()!=''){
                document.querySelector('.valuesDiv').classList.remove('hidden');
                let value=localStorage.getItem('exisitngInfoNext');
                value=value.split('\n')[localStorage.getItem('tagEdited')];
                document.querySelector('.values').innerHTML=localStorage.getItem('valuesHTML');
                ui.removeTag(value.split(' ').join('').split('|').join(""));
                ui.editTag('na',value);
            }else if(document.querySelector('.valuesDiv')!=null){
                let value=localStorage.getItem('exisitngInfoNext');
                ui.editTag('na',value.split(' ').join(''));
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

Library.prototype.editFinalTag=function(index){
    localStorage.setItem('tagEdited',index);
    history.go(-1);//Check stateManagement for next step
}

Library.prototype.clickHere=function(){
    var xhr=new XMLHttpRequest();
    xhr.open('POST','downloadExcel');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType='blob';
    xhr.onload=function(e){
        if(this.status==200){
            let link=document.createElement('a');
            link.href=window.URL.createObjectURL(this.response);
            link.download="results.xlsx";
            link.click();
        }
    }
    xhr.send(document.querySelector('.excelErrors').innerText);
    //document.querySelector('#downloadExcel').submit();
}

Library.prototype.createTagsExcel=function(){
    var xhr=new XMLHttpRequest();
    xhr.open('POST','downloadExcelCreate');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType='blob';
    xhr.onload=function(e){
        if(this.status==200){
            let link=document.createElement('a');
            link.href=window.URL.createObjectURL(this.response);
            link.download="results.xlsx";
            link.click();
        }
    }
    xhr.send(document.querySelector('.excelErrors').innerText);
    //document.querySelector('#downloadExcel').submit();
}

module.exports=Library;
},{"./modules/requests.js":2,"./modules/userInteraction.js":3,"./modules/validations.js":4}]},{},[5])(5)
});
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
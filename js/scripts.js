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

Library.prototype.stateManagement=function(){
    window.onpopstate=function(event){
        if(event.state){
            ui.appendResponse(event.state.response);
            if(document.querySelector('#existingTags')!=null){
                document.querySelector('#existingTags').value=localStorage.getItem('validationTags');
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
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

module.exports=Library;
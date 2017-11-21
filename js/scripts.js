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

module.exports=Library;
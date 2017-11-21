var requests=require('./requests.js');
let validateTags=function(){
    requests.getURL('/include/validateTags.html').then(function(response){
        document.querySelector('.contentSection').innerHTML=response;
    },function(error){
        console.error('Error',error);
    });
}

let clearField=function(){
    document.querySelector('#existingTags').value='';
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
    displayResults:displayResults
}
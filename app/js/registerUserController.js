/**
 * Created by Akingbade on 27/04/2017.
 */
function registerUser(){
    var userID = $("#regUsername").val();
    var userPass = $("#regPassword").val();
    var userFN = $("#regFName").val();
    var userSN = $("#regLName").val();
    var userTeam = $("#regFTeam").val();

    if(registerValidator(userID, userPass, userFN, userSN, userTeam)){
        createRegisterRequest(userID, userPass, userFN, userSN, userTeam);
        $("#registerDetails").trigger('reset');
    }else{
        console.log("invalid");
    }
}

function registerValidator(un, pw, fn, ln, ft){
    var result = true;
    if(un === '' || pw === '' || fn === '' || ln === '' || ft === ''){
        result = false;
    }
    return result;
}

function createRegisterRequest(un, pw, fn, ln, ft){
    var registerSoapReq =
        "<?xml version='1.0' encoding='UTF-8'?><S:Envelope xmlns:S='http://schemas.xmlsoap.org/soap/envelope/' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>"+
        "<SOAP-ENV:Header/>"+
        "<S:Body>"+
        "<ns2:registerUser xmlns:ns2='http://www.whatscore.com'>"+
        "<arg0>"+un+"</arg0>"+
        "<arg1>"+pw+"</arg1>"+
        "<arg2>"+fn+"</arg2>"+
        "<arg3>"+ln+"</arg3>"+
        "<arg4>"+ft+"</arg4>"+
        "</ns2:registerUser>"+
        "</S:Body>"+
        "</S:Envelope>;";
    registerSoapRequest(registerSoapReq);
}

function registerSoapRequest(soapRequest){
    var wsdlEndPoint = "http://ade:8080/whatscoreWebService/whatscoreCatalogService?wsdl";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", wsdlEndPoint, false);

    if(!xhr){
        console.log("XHR ISSUE");
    };

    xhr.onload = function(){
        var result = xhr.responseText;
        result = parseRegisterResponse(result);
        if(result !== false){
            console.log("Account successfully registered, you can now log in");
        }else{
            console.log("issue with registering account");
        }
    };
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8; text/xml ');
    xhr.send(soapRequest);
}

function parseRegisterResponse(response){
    var xmlDoc = $.parseXML(response),
        $xml = $(xmlDoc);
    if($xml.find("return")) {
        return true;
    }
    return false;
}
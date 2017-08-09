/**
 * Created by Akingbade on 27/04/2017.
 */
function loginUser(){
    var userName = $("#userName").val();
    var userPass = $("#userPass").val();

    if(loginValidator(userName, userPass)){
        createLoginRequest(userName, userPass);
    }else{
        console.log("invalid");
    }
}

function createLoginRequest(name,pass){
    var loginSoapReq =
        "<?xml version='1.0' encoding='UTF-8'?><S:Envelope xmlns:S='http://schemas.xmlsoap.org/soap/envelope/' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>"+
        "<SOAP-ENV:Header/>"+
        "<S:Body>"+
        "<ns2:loginUser xmlns:ns2='http://www.whatscore.com'>"+
        "<arg0>"+name+"</arg0>"+
        "<arg1>"+pass+"</arg1>"+
        "</ns2:loginUser>"+
        "</S:Body>"+
        "</S:Envelope>;";
    loginSoapRequest(loginSoapReq);
}

function loginSoapRequest(soapRequest){
    var wsdlEndPoint = "http://ade:8080/whatscoreWebService/whatscoreCatalogService?wsdl";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", wsdlEndPoint, false);

    if(!xhr){
        console.log("XHR ISSUE");
    };

    xhr.onload = function(){
        var results = xhr.responseText;
        var userDetails = parseResponse(results);
        if(userDetails !== false){
            storeDetails(userDetails);
            setStatusOnline();
            window.location = "/whatScore2/app/views/loginHome.html";
        }else{
            //Some error with login
            console.log("incorrect login details");
        }
    };

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8; text/xml ');
    xhr.send(soapRequest);
}

function loginValidator(name,pass){
    var result = true;
    if(name === '' || pass === '' ){
        result = false;
    }
    return result;
}

function parseResponse(response){
    var xmlDoc = $.parseXML(response),
        $xml = $(xmlDoc),
        $response = $xml.find("return"),
        userDetails = [];
    if($xml.find("return")) {
        userDetails.push($response[0].firstChild.textContent);
        userDetails.push($response[1].firstChild.textContent);
        userDetails.push($response[2].firstChild.textContent);
        userDetails.push($response[3].firstChild.textContent);
        return userDetails;
    }
    return false;
}

function setStatusOnline(){
    $.ajax({
        url: "/whatscore2/app/php/userStatus.php?function=setOnline",
        type: 'update',
        method: 'UPDATE',
        error: function(XMLHttpRequest, textStatus, errorThrown){
            //console.log("Error in setting status online");
        },
        success: function(){
            console.log("setting status worked")
        }
    });
}

function storeDetails(userDetails){
    console.log(userDetails);
    $.ajax({
        url: "/whatscore2/app/php/userDetails.php?function=storeDetails",
        data: {serverData : userDetails},
        type: 'post',
        method: 'POST',
        error: function(XMLHttpRequest, textStatus, errorThrown){
            //console.log("Error in storing details");
        },
        success: function(){
            console.log("details stored");
        }
    });
}
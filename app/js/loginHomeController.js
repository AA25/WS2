/**
 * Created by Akingbade on 24/04/2017.
 */
$( document ).ready(function() {
    checkStatus();
    $("#loaderClubFeed").hide();
    $("#loaderNewsFeed").hide();
});

function checkStatus(){
    $.ajax({
        url: "/whatscore2/app/php/userStatus.php?function=checkStatus",
        data: {},
        type: 'get',
        method:'GET',
        error: function(XMLHttpRequest, textStatus, errorThrown){
            //Error in setting status
            console.log("Error in check status ajax")
        },
        success: function(result){
            if(result == true){
                console.log("status is online");
                retrieveUserData();
                retrieveNewsData();
                retrieveClubNewsData();
            }else{
                console.log("status was offline, redirecting...");
                window.location = "/whatScore2/home";
            }
        }
    });
}

function retrieveUserData(){
    $.ajax({
        url: "/whatscore2/app/php/userDetails.php?function=retrieveDetails",
        type: 'get',
        method:'GET',
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log("Error in ajax request for user details")
        },
        success: function(result){
            result = JSON.parse(result);
            displayUserData(result);
            console.log("user data is displayed");
        }
    });
}

function retrieveNewsData(){
    $.ajax({
        url: "https://skysportsapi.herokuapp.com/sky/getnews/football/v1.0/",
        type: 'get',
        method:'GET',
        error: function(XMLHttpRequest, textStatus, errorThrown){
            //Error in setting status
            console.log("errpr in retrieving news from api for general news")
        },
        success: function(result){
            result = JSON.parse(result);
            presentNewsData(result,'allNews');
        }
    });
}

function retrieveClubNewsData(){
    $.ajax({
        url: "https://skysportsapi.herokuapp.com/sky/football/getteamnews/manchesterunited/v1.0/",
        type: 'get',
        method:'GET',
        error: function(XMLHttpRequest, textStatus, errorThrown){
            //Error in setting status
            console.log("error in retrieving news from api specific news")
        },
        success: function(result){
            result = JSON.parse(result);
            presentNewsData(result,'specificNews');
        }
    });
}

function displayUserData(dataArr){
    console.log(dataArr);
    var welcomeMsg = "Hi, ";
    var introMsg = "Checkout some of the latest news across the top football leagues, or just on the team you support, ";
    var teamNewsTitle = "Specific news from, ";
    var uName = dataArr[0];
    var fName = dataArr[1];
    var sName = dataArr[2];
    var favTeam = dataArr[3];
    $("#userName").text(welcomeMsg + fName + ' ' + sName);
    $("#sidebarDesc").text(introMsg + favTeam + '.');
    $("#logout").attr("id",uName);
    $("#teamNewsHead").text(teamNewsTitle + favTeam + '.');
}

function presentNewsData(jsonFeed,type){
    jsonFeed.map(function(currObj) {
        if(type === 'allNews'){
            createNewsDiv(currObj.imgsrc, currObj.link, currObj.shortdesc, currObj.title, type);
        }else if(type === 'specificNews'){
            createNewsDiv( currObj.imgsrc, currObj.link, currObj.shortdesc, currObj.title, type);
        }
    });
}

function createNewsDiv(imgsrc, link, desc, title, type){
    if(type === 'allNews'){
        var newsDiv = '<div class="newsData bg-color-white border-blr-10 border-brr-10 w-500 marg-auto mb-20">'+
            '<div class="mb-0 bg-color-maroon h-30">'+
            '<p class="newsDataTitle color-white pl-10 pt-5 mb-0 txt-left">'+title+'</p></div>'+
            '<div class="border-blr-10 border-brr-10 mt-0 p-10">'+
            '<div class="newsImage w-478">'+
            '<a href="'+link+'" target="_blank">'+'<img class="w-478 h-249" src="'+imgsrc+'"></a></div>'+
            '<div class="newsShortDesc w-478 mb-0 border-hsss border-w-1 border-grey border-blr-5 border-brr-5">'+
            '<p class="p-5 mb-0">'+desc+'</p></div></div></div>';

        $("#newsFeed").append(newsDiv);
    }else if(type === 'specificNews'){
        var teamNewsDiv = '<div class="newsData bg-color-white border-blr-10 border-brr-10 w-500 marg-auto mb-20">'+
            '<div class="mb-0 bg-color-maroon h-30">'+
            '<p class="newsDataTitle color-white pl-10 pt-5 mb-0 txt-left">'+title+'</p></div>'+
            '<div class="border-blr-10 border-brr-10 mt-0 p-10">'+
            '<div class="newsImage w-478">'+
            '<a href="'+link+'" target="_blank">'+'<img class="w-478 h-249" src="'+imgsrc+'"></a></div>'+
            '<div class="newsShortDesc w-478 mb-0 border-hsss border-w-1 border-grey border-blr-5 border-brr-5">'+
            '<p class="p-5 mb-0">'+desc+'</p></div></div></div>';

        $("#teamNewsFeed").append(teamNewsDiv);
    }

}

function logOutSoapRequest(soapRequest){
    var wsdlEndPoint = "http://ade:8080/whatscoreWebService/whatscoreCatalogService?wsdl";
    var xhr = new XMLHttpRequest();

    xhr.open("POST", wsdlEndPoint, false);
    if(!xhr){
        console.log("XHR ISSUE");
    };

    xhr.onload = function(){
        var results = xhr.responseText;
        var userDetails = parseResponse(results);
        if(parseResponse(results) !== false){
            window.location = "/whatScore2/home";
        }else{
            console.log("issue with updating db with status");
        }
    };

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8; text/xml ');
    xhr.send(soapRequest);
}

function createLogoutRequest(uName){
    var logoutSoapReq =
        '<?xml version="1.0" encoding="UTF-8"?><S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">'+
        '<SOAP-ENV:Header/>'+
        '<S:Body>'+
        '<ns2:logoutUser xmlns:ns2="http://www.whatscore.com">'+
        '<arg0>'+uName+'</arg0>'+
        '</ns2:logoutUser>'+
        '</S:Body>'+
        '</S:Envelope>;';
    logOutSoapRequest(logoutSoapReq);
}

function parseResponse(response){
    var xmlDoc = $.parseXML(response),
        $xml = $(xmlDoc),
        $response = $xml.find("return"),
        userDetails = [];
    if($xml.find("return")) {
        return true;
    }
    return false;
}
/**
 * Created by Akingbade on 27/04/2017.
 */
function logOut(){
    $.ajax({
        url: "/whatscore2/app/php/userDetails.php?function=removeDetails",
        data: {},
        type: 'get',
        method:'GET',
        error: function(XMLHttpRequest, textStatus, errorThrown){
            //Error in setting status
            console.log("Error in removing details ajax")
        },
        success: function(uName){
            uName = JSON.parse(uName);
            createLogoutRequest(uName);
        }
    });
}

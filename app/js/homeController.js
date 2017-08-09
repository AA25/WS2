/**
 * Created by Akingbade on 21/04/2017.
 */
$( document ).ready(function() {
    $.ajax({
        url: "/whatscore2/app/php/userStatus.php?function=setStatus",
        data: {},
        type: 'post',
        error: function(XMLHttpRequest, textStatus, errorThrown){
            //Error in setting status
            console.log("Error in checking current status via ajax")
        },
        success: function(result){
            if(result == true){
                window.location = "/whatScore2/app/views/loginHome.html";
            }
        }
    });
});

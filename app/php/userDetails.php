<?php
/**
 * Created by PhpStorm.
 * User: Akingbade
 * Date: 26/04/2017
 * Time: 12:30
 */

session_start();

if($_GET['function']=='storeDetails'){
    if(!isset($_SESSION['details'])){
        $_SESSION['details'] = null;
    }
    $_SESSION['details'] = $_REQUEST['serverData'];
}elseif($_GET['function']=='removeDetails'){
    echo json_encode($_SESSION['details'][0]);
    $_SESSION['details'] = null;
    $_SESSION['status'] = false;
    //session_abort();
}elseif($_GET['function']=='retrieveDetails'){
    echo json_encode($_SESSION['details']);
}
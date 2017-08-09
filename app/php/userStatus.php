<?php
/**
 * Created by PhpStorm.
 * User: Akingbade
 * Date: 23/04/2017
 * Time: 23:17
 */
session_start();

if($_GET['function']=='setOnline'){
    setOnline();
}elseif ($_GET['function']=='setOffline'){
    setOffline();
}elseif ($_GET['function']=='setStatus'){
    if(isset($_SESSION['status']) && $_SESSION['status'] == true){
        setOnline();
        echo true;
    }elseif(isset($_SESSION['status']) && $_SESSION['status'] == false){
        setOffline();
        echo false;
    }else{
        $_SESSION['status'] = false;
        echo false;
    }
}elseif ($_GET['function']=='checkStatus'){
    if(isset($_SESSION['status']) && $_SESSION['status'] == true){
        echo true;
    }else{
        echo false;
    }
}

function setOnline(){
    $_SESSION['status'] = true;
}

function setOffline(){
    $_SESSION['status'] = false;
}
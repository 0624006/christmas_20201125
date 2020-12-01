<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST'){
$action = $_POST['action'];
require_once('connection.php');

function sql_function($sql, $conn, $mult){
    if($mult){
        $result=$conn->mysqli_multi_query($sql); // 多條sql用
    }else{
        $result=$conn->query($sql); // 單條sql用
    }
    if (mysqli_connect_errno($result)) {die("連線失敗: " . mysqli_connect_errno($result));};
    return $result;
}

//emp_delete：清空獎序
if ($action == 'emp_delete'){
    $result=sql_function("UPDATE emplist SET emp_lottery=0",$conn, false);
    echo "刪除成功";
}

//emp_lottery：隨機抽取一位
if ($action == 'emp_lottery'){
    $result=sql_function("SELECT * FROM emplist WHERE emp_lottery=0 ORDER BY rand()*10 LIMIT 1",$conn, false);
    $rows = $result->num_rows;
    $emp_row = array();
    for ($i = 0; $i < $rows; $i++) {
        $row = mysqli_fetch_array($result);
        array_push($emp_row, array('emp_no'=>$row['emp_no'], 'emp_name'=>$row['emp_name'], 'emp_dep'=>$row['emp_dep']));
    }
    echo json_encode($emp_row);
}

//emp_lottery_nextupdate：點選Next更新得獎者獎序
if ($action == 'emp_lottery_nextupdate'){
    $emp_no = $_POST['emp_no'];
    $l_num=$_POST['emp_lottery_num'];
    $result=sql_function("UPDATE emplist SET emp_lottery=$l_num WHERE emp_no='$emp_no'",$conn, false); 
    $result_search=sql_function("SELECT COUNT(*) AS 已報到人員總數, MAX(emp_lottery) AS 已抽獎總數 FROM emplist",$conn, false);   // 查詢已報到人員總數與以抽獎總數
    $row = mysqli_fetch_array($result_search);
    if(isset($row['已報到人員總數'])==isset($row['已抽獎總數'])){
        echo "無法繼續抽獎";
    }
}

//emp_lottery_num_row：先確認資料庫是否有報到人員，再搜尋獎序並回傳最大值
if($action =='emp_lottery_num_row'){
    $result=sql_function("SELECT * FROM emplist ",$conn, false);   // 查詢資料庫是否有報到人員 
    $row = mysqli_fetch_array($result);
    if(isset($row['emp_lottery'])){
        $result=sql_function("SELECT * FROM emplist ORDER BY emp_lottery DESC LIMIT 1",$conn, false);   // 查詢獎序 
        $row = mysqli_fetch_array($result);
        if(isset($row['emp_lottery'])){
            echo $row['emp_lottery'];
        }else{
            echo 0;        
        }
    }else{
        echo json_encode("目前無報到人員");
    }
}

//emp_lottery_previous：抽取上一位獲獎者
if ($action == 'emp_lottery_previous'){
    $l_num=$_POST['emp_lottery_num'];
    $result=sql_function("SELECT * FROM `emplist` WHERE emp_lottery = '$l_num'",$conn, false);
    $rows = $result->num_rows;
    $emp_row = array();
    for ($i = 0; $i < $rows; $i++) {
        $row = mysqli_fetch_array($result);
        array_push($emp_row, array('emp_no'=>$row['emp_no'], 'emp_name'=>$row['emp_name'], 'emp_dep'=>$row['emp_dep']));
    }
    echo json_encode($emp_row);
}

//emp_lottery_newupdate：點選NEW重抽需更新前一位獎序為0
if ($action == 'emp_lottery_newupdate'){
    $l_num=$_POST['emp_lottery_num'];
    $result=sql_function("SELECT * FROM emplist WHERE emp_lottery = '$l_num'",$conn, false);
    $rows = $result->num_rows;    
    if($rows!='0'){
        $result_N=sql_function("UPDATE `emplist` SET emp_lottery = '0' WHERE emp_lottery= '$l_num'",$conn, false);  
    }        
}

$conn -> close();

}else{
    echo "不要亂執行！";
}

?>



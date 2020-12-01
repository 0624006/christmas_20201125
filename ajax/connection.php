<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST'){
//實例化mysqli(資料庫路徑, 登入帳號, 登入密碼, 資料庫)
$conn =  mysqli_connect('localhost', 'root', '', 'emp_list');
 
if (mysqli_connect_errno($conn)) {
    die("連線失敗: " . mysqli_connect_errno($conn));
}
// echo "連線成功";
 
//設定連線編碼，防止中文字亂碼
$conn->query("SET NAMES 'utf8'");
}else{
    echo "不要亂執行！";
}

?>

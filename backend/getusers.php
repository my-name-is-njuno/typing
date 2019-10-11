<?php

$servername = "localhost";
$username = "root";
$password = "Java_2147483647";
$dbname = "typing";

// Create connection
$con = mysqli_connect($servername, $username, $password, $dbname);


if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}
$sql = "SELECT name, wpm FROM users ORDER BY wpm DESC LIMIT 10";

$result = mysqli_query($con, $sql);

$rows = array();

if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while ($row = mysqli_fetch_assoc($result)) {
        array_push($rows, $row);
    }
}


echo json_encode($rows);

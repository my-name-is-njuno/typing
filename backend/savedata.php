<?php



$name = ucwords(strtolower($_POST['name']));
$wpm = (int) $_POST['wpm'];
$cpm = (int) $_POST['cpm'];
$accuracy = (int) $_POST['accuracy'];



$servername = "localhost";
$username = "root";
$password = "";
$dbname = "typing";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO users (name, wpm, cpm, accuracy)
VALUES ('" . $name . "', '" . $wpm . "', '" . $cpm . "', '" . $accuracy . "')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}


$conn->close();

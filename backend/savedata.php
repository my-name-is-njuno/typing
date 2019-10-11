<?php



function array_orderby()
{
    $args = func_get_args();
    $data = array_shift($args);
    foreach ($args as $n => $field) {
        if (is_string($field)) {
            $tmp = array();
            foreach ($data as $key => $row)
                $tmp[$key] = $row[$field];
            $args[$n] = $tmp;
        }
    }
    $args[] = &$data;
    call_user_func_array('array_multisort', $args);
    return array_pop($args);
}








$myFile = "data/topspeed.json";
$arr_data = array(); // create empty array

try {
    //Get form data
    $formdata = array(
        'name' => ucwords(strtolower($_POST['name'])),
        'wpm' => (int) $_POST['wpm']
    );

    //Get data from existing json file
    $jsondata = file_get_contents($myFile);

    // converts json data into array
    $arr_data = json_decode($jsondata, true);

    // Push user data to array
    array_push($arr_data, $formdata);


    $sorted = array_orderby($arr_data, 'wpm', SORT_DESC, 'name', SORT_ASC);

    //Convert updated array to JSON
    $jsondata = json_encode($sorted, JSON_PRETTY_PRINT);

    //write json data into data.json file
    if (file_put_contents($myFile, $jsondata)) {
        echo 'Data successfully saved';
    } else
        echo "error";
} catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}

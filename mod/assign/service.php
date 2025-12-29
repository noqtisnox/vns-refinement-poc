<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header('Content-Type: application/json; charset=utf-8');

$info = $_GET['info'] ?? $_POST['info'] ?? '';

$response = [];

if ($info === 'mod_assign_list_participants') {
    $participants = [
        [
            'id' => 352761,
            'fullname' => "Басала Валентин",
            'recordid' => -1,
            'submitted' => true,
            'requiregrading' => true,
            'grantedextension' => false,
            'submissionstatus' => 'submitted'
        ],
        [
            'id' => 352817,
            'fullname' => "Білаш Іван",
            'recordid' => -1,
            'submitted' => true,
            'requiregrading' => true,
            'grantedextension' => false,
            'submissionstatus' => 'submitted'
        ]
    ];

    $response[] = [
        'error' => false,
        'data' => $participants
    ];
} else {
    $response[] = [
        'error' => true,
        'message' => 'unknown info'
    ];
}

// Use JSON_UNESCAPED_UNICODE to keep Cyrillic readable
echo json_encode($response, JSON_UNESCAPED_UNICODE);

?>

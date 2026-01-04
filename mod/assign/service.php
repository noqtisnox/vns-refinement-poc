<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header('Content-Type: application/json; charset=utf-8');

$info = $_GET['info'] ?? $_POST['info'] ?? '';

$response = [];

if ($info === 'mod_assign_list_participants') {
    // Return a richer set of example participants (mirrors response-example.txt)
    $participants = [
        [
            'id' => 355207,
            'username' => 'nazar.svitiashchuk.oi.2022',
            'firstname' => 'Nazar',
            'lastname' => 'Svitiashchuk',
            'fullname' => 'Svitiashchuk Nazar',
            'email' => 'nazar.svitiashchuk.oi.2022@lpnu.ua',
            'department' => '',
            'firstaccess' => 1758729386,
            'lastaccess' => 1766148244,
            'suspended' => false,
            'trackforums' => 0,
            'description' => '',
            'descriptionformat' => 1,
            'city' => 'Львів',
            'country' => 'UA',
            'profileimageurlsmall' => 'https://vns.lpnu.ua/pluginfile.php?file=%2F5710620%2Fuser%2Ficon%2Fclassic%2Ff2&rev=44401061',
            'profileimageurl' => 'https://vns.lpnu.ua/pluginfile.php?file=%2F5710620%2Fuser%2Ficon%2Fclassic%2Ff1&rev=44401061',
            'recordid' => -1,
            'groups' => [
                [
                    'id' => 63491,
                    'name' => 'Група ОІ-42',
                    'description' => ''
                ]
            ],
            'roles' => [
                [
                    'roleid' => 5,
                    'name' => '',
                    'shortname' => 'student',
                    'sortorder' => 0
                ]
            ],
            'enrolledcourses' => [
                [
                    'id' => 19617,
                    'fullname' => 'Технології інтернету речей та інтерфейси смарт-систем',
                    'shortname' => 'ТІРтаІС_АСУ'
                ]
            ],
            'submitted' => true,
            'requiregrading' => false,
            'grantedextension' => false,
            'submissionstatus' => 'submitted'
        ],

        // Additional examples
        [
            'id' => 352761,
            'username' => 'basala.v',
            'firstname' => 'Валентин',
            'lastname' => 'Басала',
            'fullname' => 'Басала Валентин',
            'email' => 'basala.v@example.com',
            'department' => 'Computer Science',
            'firstaccess' => 1750000000,
            'lastaccess' => 1766000000,
            'suspended' => false,
            'trackforums' => 1,
            'description' => '',
            'descriptionformat' => 1,
            'city' => 'Львів',
            'country' => 'UA',
            'profileimageurlsmall' => 'https://example.com/pfp_small_352761.jpg',
            'profileimageurl' => 'https://example.com/pfp_352761.jpg',
            'recordid' => -1,
            'groups' => [],
            'roles' => [
                ['roleid' => 5, 'name' => '', 'shortname' => 'student', 'sortorder' => 0]
            ],
            'enrolledcourses' => [],
            'submitted' => true,
            'requiregrading' => true,
            'grantedextension' => false,
            'submissionstatus' => 'submitted',
            'currentgrade' => '4.50',
            'comment' => 'Good work, minor fixes needed'
        ],

        [
            'id' => 352817,
            'username' => 'bilash.i',
            'firstname' => 'Іван',
            'lastname' => 'Білаш',
            'fullname' => 'Білаш Іван',
            'email' => 'bilash.i@example.com',
            'department' => 'IT',
            'firstaccess' => 1751000000,
            'lastaccess' => 1766100000,
            'suspended' => false,
            'trackforums' => 0,
            'description' => '',
            'descriptionformat' => 1,
            'city' => 'Львів',
            'country' => 'UA',
            'profileimageurlsmall' => 'https://example.com/pfp_small_352817.jpg',
            'profileimageurl' => 'https://example.com/pfp_352817.jpg',
            'recordid' => -1,
            'groups' => [],
            'roles' => [
                ['roleid' => 5, 'name' => '', 'shortname' => 'student', 'sortorder' => 0]
            ],
            'enrolledcourses' => [],
            'submitted' => false,
            'requiregrading' => false,
            'grantedextension' => false,
            'submissionstatus' => 'none',
            'currentgrade' => null,
            'comment' => null
        ]
    ];

    $response[] = [
        'error' => false,
        'data' => $participants
    ];
}

if ($info === 'mod_assign_submit_grading_form') {
    // Simulate a successful grading submission
    $response[] = [
        'error' => false,
        'data' => [
            'status' => 'success',
            'message' => 'Grade and feedback submitted successfully.'
        ]
    ];
}

// Use JSON_UNESCAPED_UNICODE to keep Cyrillic readable
echo json_encode($response, JSON_UNESCAPED_UNICODE);

?>

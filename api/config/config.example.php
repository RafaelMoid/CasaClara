<?php

return [
    'database' => [
        'host' => 'localhost',
        'name' => 'cpaneluser_casaclara',
        'user' => 'cpaneluser_casaclara_user',
        'password' => 'CHANGE_ME',
        'charset' => 'utf8mb4',
    ],
    'app' => [
        'environment' => 'production',
        'session_name' => '__Host-CasaClara',
        'session_lifetime' => 7200,
        'allowed_origins' => [
            'https://rafaelvarela.com.br',
        ],
    ],
];

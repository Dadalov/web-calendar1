<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
require_once('application/Application.php');

function router($params)
{
    $app = new Application();
    $method = $params['method'];
    switch ($method) {
        case 'test':
            return 'lol';
        case 'getEventsForDate':
            return $app->getEventsForDate($params);
        case 'addEventForDate':
            return $app->addEventForDate($params);
        case 'deleteEvent':
            return $app->deleteEvent($params);
        case 'editEvent':
            return $app->editEvent($params);
    }
}

function answer($data): array
{
    if ($data) {
        return array(
            'result' => 'ok',
            'data' => $data
        );
    }

    return array(
        'result' => 'error',
        'error' => array(
            'code' => 999,
            'text' => 'no data for request'
        )
    );
}

echo json_encode(answer(router($_GET)));
<?php
require_once('db/DB.php');
require_once('calendar/Calendar.php');

class Application
{
    private DB $db;
    private Calendar $calendar;

    function __construct()
    {
        $this->db = new DB();
        $this->calendar = new Calendar($this->db);
    }

    public function getEventsForDate($params): array
    {
        if ($params['date']) {
            return $this->calendar->getEventsForDate($params);
        }
    }

    public function addEventForDate($params): array
    {
        if ($params['date'] && $params['description']) {
            return $this->calendar->addEventForDate($params);
        }
    }

    public function deleteEvent($params): array
    {
        if ($params['id']) {
            return $this->calendar->deleteEvent($params);
        }
    }

    public function editEvent($params): array
    {
        if ($params['id'] && $params['description']) {
            return $this->calendar->editEvent($params);
        }
    }
}
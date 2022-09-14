<?php

class Calendar
{
    private DB $db;

    public function __construct(DB $db)
    {
        $this->db = $db;
    }

    public function getEventsForDate(array $params): array
    {
        return $this->db->getEventsForDate($params);
    }

    public function addEventForDate($params): array
    {
        return $this->db->addEventForDate($params);
    }

    public function deleteEvent($params): array
    {
        return $this->db->deleteEvent($params);
    }

    public function editEvent($params): array
    {
        return $this->db->editEvent($params);
    }
}
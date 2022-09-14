<?php

class DB
{
    private PDO $connection;

    public function __construct()
    {
        $dsn = 'mysql:dbname=calendar;host=mysql';
        $username = 'root';
        $password = 'test';
        $this->connection = new PDO($dsn, $username, $password);
    }

    private function fetchData($result): array
    {
        $out = [];
        foreach ($result as $key=>$item) {
            $out[$key] = $item;
        }

        return $out;
    }

    public function getEventsForDate($params): array
    {
        $date = $params['date'];
        $query = <<<EOD
select * from events where event_date = '$date';
EOD;
        try {
            $response = $this->connection->query($query, PDO::FETCH_ASSOC);
            return $this->fetchData($response);
        } catch (Exception $e) {
            return array('error' => $e->getMessage());
        }
    }

    public function addEventForDate($params): array
    {
        $date = $params['date'];
        $description = $params['description'];
        $query = <<<EOD
insert into events (event_date, description) values ('$date', '$description');
EOD;
        try {
            $response = $this->connection->query($query, PDO::FETCH_ASSOC);
            if (empty($this->fetchData($response))) {
                return array('success');
            }
        } catch (Exception $e) {
            return array('error' => $e->getMessage());
        }
    }

    public function deleteEvent($params): array
    {
        $id = $params['id'];
        $query = <<<EOD
delete from events where id = $id;
EOD;
        try {
            $response = $this->connection->query($query, PDO::FETCH_ASSOC);
            if (empty($this->fetchData($response))) {
                return array('success');
            }
        } catch (Exception $e) {
            return array('error' => $e->getMessage());
        }
    }

    public function editEvent($params): array
    {
        $id = $params['id'];
        $description = $params['description'];
        $query = <<<EOD
update events set description = '$description' where id = $id;
EOD;
        try {
            $response = $this->connection->query($query, PDO::FETCH_ASSOC);
            if (empty($this->fetchData($response))) {
                return array('success');
            }
        } catch (Exception $e) {
            return array('error' => $e->getMessage());
        }
    }
}
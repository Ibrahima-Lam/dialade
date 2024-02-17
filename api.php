<?php

$uri = $_SERVER['PATH_INFO'] ?? '';
$p = explode('/', $uri);
$path = $p[1] ?? null;

header('Content-Type:application/json');
$pdo = new PDO('sqlite:DB/oldfoot.db');
$res = ['a'];
if ($path) {
    $req = $pdo->query("select * from $path");
    $res = $req->fetchAll(PDO::FETCH_CLASS);
}
$json = json_encode($res);
echo $json;

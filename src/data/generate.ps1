$list = [System.Collections.Generic.List[PSObject]]::new()

for ($i = 100; $i -lt 800; $i++) {
    $rNo = [string]$i
    $sc = 21 + ($i % 15)
    $stops = [System.Collections.Generic.List[PSObject]]::new()
    for ($j = 1; $j -le $sc; $j++) {
        $stops.Add([PSCustomObject]@{ seq = $j; name = "Seoul_Stop_${rNo}_${j}" })
    }
    $rType = "Ganseon"
    if ($i -ge 600) { $rType = "Jiseon" }
    $list.Add([PSCustomObject]@{
        routeId = "ROUTE_S_${rNo}"
        routeNo = $rNo
        routeType = $rType
        cityCode = "25"
        cityName = "Seoul"
        startNode = "Seoul_${rNo}_Start"
        endNode = "Seoul_${rNo}_End"
        stopCount = $sc
        stops = $stops
    })
}

for ($i = 1000; $i -le 9900; $i += 7) {
    $rNo = [string]$i
    $sc = 21 + ($i % 16)
    $stops = [System.Collections.Generic.List[PSObject]]::new()
    for ($j = 1; $j -le $sc; $j++) {
        $stops.Add([PSCustomObject]@{ seq = $j; name = "Gyeonggi_Stop_${rNo}_${j}" })
    }
    $rType = "Gyeonggi"
    if ($i -ge 3000) { $rType = "Gwangyeok" }
    $list.Add([PSCustomObject]@{
        routeId = "ROUTE_G_${rNo}"
        routeNo = $rNo
        routeType = $rType
        cityCode = "31"
        cityName = "Gyeonggi"
        startNode = "Gyeonggi_${rNo}_Start"
        endNode = "Gyeonggi_${rNo}_End"
        stopCount = $sc
        stops = $stops
    })
}

$json = $list | ConvertTo-Json -Depth 5
$header = "// BusTaja - Massive 1,972 Seoul & Gyeonggi Routes DB`nexport const LOCAL_ROUTES = "
[System.IO.File]::WriteAllText("d:\Project\busstop\src\data\routes.js", ($header + $json + ";"), [System.Text.Encoding]::UTF8)
Write-Host "Done! Generated 1,972 routes!"

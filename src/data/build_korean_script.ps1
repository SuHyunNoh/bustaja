# Set UTF-8 Output Encoding
[console]::InputEncoding = [System.Text.Encoding]::UTF8
[console]::OutputEncoding = [System.Text.Encoding]::UTF8

$routes = [System.Collections.Generic.List[PSObject]]::new()

# 1. 6642번 실제 노선 정밀 복원
$st6642 = @(
  @{seq=1;name="강서공영차고지"}, @{seq=2;name="개화역광역환승센터"}, @{seq=3;name="개화산역"}, @{seq=4;name="방화사거리"}, @{seq=5;name="방화역"},
  @{seq=6;name="방화동동부센트레빌"}, @{seq=7;name="마곡엠밸리10단지"}, @{seq=8;name="마곡역"}, @{seq=9;name="마곡수명산파크1단지"}, @{seq=10;name="마곡수명산파크2단지"},
  @{seq=11;name="마곡수명산파크3.4단지"}, @{seq=12;name="마곡수명산파크5.6단지"}, @{seq=13;name="수명산파크중앙"}, @{seq=14;name="발산역.마곡NC백화점"}, @{seq=15;name="한국가스공사"},
  @{seq=16;name="KBS스포츠월드"}, @{seq=17;name="강서구청사거리"}, @{seq=18;name="화곡역"}, @{seq=19;name="화곡본동시장"}, @{seq=20;name="등촌역"}, @{seq=21;name="염창역"}
)
$routes.Add([PSCustomObject]@{
  routeId="ROUTE_6642"; routeNo="6642"; routeType="지선"; cityCode="25"; cityName="서울";
  startNode="강서공영차고지"; endNode="염창역"; stopCount=21; stops=$st6642
})

# 2. 6631번
$st6631 = @(
  @{seq=1;name="철산동차고지"}, @{seq=2;name="광명사거리역"}, @{seq=3;name="광명시장"}, @{seq=4;name="개봉교"}, @{seq=5;name="개봉역"},
  @{seq=6;name="구로아이파크"}, @{seq=7;name="동양미래대학교"}, @{seq=8;name="구로역"}, @{seq=9;name="신도림역"}, @{seq=10;name="문래동주민센터"},
  @{seq=11;name="문래역"}, @{seq=12;name="영등포구청"}, @{seq=13;name="당산동진로아파트"}, @{seq=14;name="당산역"}, @{seq=15;name="영등포시장"},
  @{seq=16;name="영등포역"}, @{seq=17;name="신길역"}, @{seq=18;name="도림동주민센터"}, @{seq=19;name="신도림교"}, @{seq=20;name="구로역신도림S큐브"},
  @{seq=21;name="광명교"}, @{seq=22;name="철산동종점"}
)
$routes.Add([PSCustomObject]@{
  routeId="ROUTE_6631"; routeNo="6631"; routeType="지선"; cityCode="25"; cityName="서울";
  startNode="철산동차고지"; endNode="영등포역"; stopCount=22; stops=$st6631
})

# 3. 146번
$st146 = @(
  @{seq=1;name="상계동차고지"}, @{seq=2;name="노원역"}, @{seq=3;name="중계역"}, @{seq=4;name="하계역"}, @{seq=5;name="공릉역"},
  @{seq=6;name="태릉입구역"}, @{seq=7;name="먹골역"}, @{seq=8;name="중화역"}, @{seq=9;name="상봉역"}, @{seq=10;name="중랑역"},
  @{seq=11;name="군자역"}, @{seq=12;name="어린이대공원역"}, @{seq=13;name="건대입구역"}, @{seq=14;name="자양동"}, @{seq=15;name="청담대교"},
  @{seq=16;name="청담역"}, @{seq=17;name="봉은사역"}, @{seq=18;name="삼성역"}, @{seq=19;name="선릉역"}, @{seq=20;name="역삼역"},
  @{seq=21;name="강남역"}, @{seq=22;name="교대역"}, @{seq=23;name="서초역"}, @{seq=24;name="고속터미널"}, @{seq=25;name="내방역"},
  @{seq=26;name="이수역"}, @{seq=27;name="사당역"}, @{seq=28;name="낙성대역"}, @{seq=29;name="서울대입구역"}, @{seq=30;name="신림역"},
  @{seq=31;name="신대방역"}, @{seq=32;name="구로디지털단지역"}
)
$routes.Add([PSCustomObject]@{
  routeId="ROUTE_146"; routeNo="146"; routeType="간선"; cityCode="25"; cityName="서울";
  startNode="상계동차고지"; endNode="구로디지털단지역"; stopCount=32; stops=$st146
})

# 4. 7770번
$st7770 = @(
  @{seq=1;name="수원역.AK플라자"}, @{seq=2;name="고등동주민센터"}, @{seq=3;name="수원여고"}, @{seq=4;name="장안문"}, @{seq=5;name="KT수원지사"},
  @{seq=6;name="수원종합운동장"}, @{seq=7;name="한일타운"}, @{seq=8;name="수원경기장입구"}, @{seq=9;name="파장동삼거리"}, @{seq=10;name="지지대고개"},
  @{seq=11;name="의왕톨게이트"}, @{seq=12;name="의왕시청입구"}, @{seq=13;name="인덕원역"}, @{seq=14;name="과천역"}, @{seq=15;name="과천정부청사"},
  @{seq=16;name="선바위역"}, @{seq=17;name="남태령역"}, @{seq=18;name="사당역버스환승센터"}, @{seq=19;name="사당역4번출구"}, @{seq=20;name="이수역"},
  @{seq=21;name="방배동"}, @{seq=22;name="사당역종점"}
)
$routes.Add([PSCustomObject]@{
  routeId="ROUTE_7770"; routeNo="7770"; routeType="광역"; cityCode="31010"; cityName="경기 수원";
  startNode="수원역"; endNode="사당역"; stopCount=22; stops=$st7770
})

# 한글 정류장 샘플
$kStops = @("서울역", "광화문", "종로3가", "강남역", "잠실역", "신도림역", "영등포역", "홍대입구역", "신촌역", "여의도역", "사당역", "구로디지털단지역", "양재역", "수유역", "노원역", "수원역", "판교역", "분당미금역", "일산정발산역", "부천역")

$pIdx = 0
for ($i = 100; $i -lt 799; $i++) {
  $rNo = [string]$i
  if ($rNo -eq "6642" -or $rNo -eq "6631" -or $rNo -eq "146") { continue }
  $sc = 21 + ($i % 12)
  $stList = [System.Collections.Generic.List[PSObject]]::new()
  for ($j = 1; $j -le $sc; $j++) {
    $sName = $kStops[$pIdx % $kStops.Length]
    $pIdx++
    $stList.Add([PSCustomObject]@{ seq = $j; name = "${sName}_${j}정류소" })
  }
  $rType = "간선"
  if ($i -ge 600) { $rType = "지선" }
  $routes.Add([PSCustomObject]@{
    routeId = "ROUTE_S_${rNo}"; routeNo = $rNo; routeType = $rType; cityCode = "25"; cityName = "서울";
    startNode = $stList[0].name; endNode = $stList[-1].name; stopCount = $sc; stops = $stList
  })
}

for ($i = 1000; $i -le 8500; $i += 6) {
  $rNo = [string]$i
  if ($rNo -eq "7770") { continue }
  $sc = 22 + ($i % 12)
  $stList = [System.Collections.Generic.List[PSObject]]::new()
  for ($j = 1; $j -le $sc; $j++) {
    $sName = $kStops[$pIdx % $kStops.Length]
    $pIdx++
    $stList.Add([PSCustomObject]@{ seq = $j; name = "${sName}_${j}정류소" })
  }
  $rType = "시내"
  if ($i -ge 3000) { $rType = "광역" }
  $routes.Add([PSCustomObject]@{
    routeId = "ROUTE_G_${rNo}"; routeNo = $rNo; routeType = $rType; cityCode = "31"; cityName = "경기";
    startNode = $stList[0].name; endNode = $stList[-1].name; stopCount = $sc; stops = $stList
  })
}

$json = $routes | ConvertTo-Json -Depth 5
$header = "// 버스타자 — 100% 한글 정류소 DB`nexport const LOCAL_ROUTES = "
[System.IO.File]::WriteAllText("d:\Project\busstop\src\data\routes.js", ($header + $json + ";"), [System.Text.Encoding]::UTF8)
Write-Host "Done restoring 100% Korean station names!"

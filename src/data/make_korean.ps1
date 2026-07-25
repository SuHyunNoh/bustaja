# Encoding UTF8
$list = [System.Collections.Generic.List[PSObject]]::new()

# 1. 6642번 (서울 지선 - 마곡수명산파크 실제 노선)
$stops6642 = @(
  "강서공영차고지", "개화역광역환승센터", "개화산역", "방화사거리", "방화역",
  "방화동동부센트레빌", "마곡엠밸리10단지", "마곡역", "마곡수명산파크1단지", "마곡수명산파크2단지",
  "마곡수명산파크3.4단지", "마곡수명산파크5.6단지", "수명산파크중앙", "발산역.마곡NC백화점", "한국가스공사",
  "KBS스포츠월드", "강서구청사거리", "화곡역", "화곡본동시장", "등촌역", "염창역"
)
$stList6642 = [System.Collections.Generic.List[PSObject]]::new()
for ($i = 0; $i -lt $stops6642.Length; $i++) {
  $stList6642.Add([PSCustomObject]@{ seq = ($i + 1); name = $stops6642[$i] })
}
$list.Add([PSCustomObject]@{
  routeId = "ROUTE_6642"; routeNo = "6642"; routeType = "지선"; cityCode = "25"; cityName = "서울";
  startNode = "강서공영차고지"; endNode = "염창역"; stopCount = 21; stops = $stList6642
})

# 2. 6631번
$stops6631 = @(
  "철산동차고지", "광명사거리역", "광명시장", "개봉교", "개봉역", "구로아이파크", "동양미래대학교", "구로역",
  "신도림역", "문래동주민센터", "문래역", "영등포구청", "당산동진로아파트", "당산역", "영등포시장", "영등포역",
  "신길역", "도림동주민센터", "신도림교", "구로역신도림S큐브", "광명교", "철산동종점"
)
$stList6631 = [System.Collections.Generic.List[PSObject]]::new()
for ($i = 0; $i -lt $stops6631.Length; $i++) {
  $stList6631.Add([PSCustomObject]@{ seq = ($i + 1); name = $stops6631[$i] })
}
$list.Add([PSCustomObject]@{
  routeId = "ROUTE_6631"; routeNo = "6631"; routeType = "지선"; cityCode = "25"; cityName = "서울";
  startNode = "철산동차고지"; endNode = "영등포역"; stopCount = 22; stops = $stList6631
})

# 3. 6632번
$stops6632 = @(
  "신정동차고지", "신정네거리역", "목동역", "목동오거리", "오목교역", "관악고등학교", "양평역", "영등포중앙시장",
  "당산동삼성아파트", "당산역", "당산동푸르지오", "영등포구청역", "문래역", "도림천역", "신정교", "목동14단지",
  "목동8단지", "양천구청", "신정동이펜하우스", "신정역", "신정차고지"
)
$stList6632 = [System.Collections.Generic.List[PSObject]]::new()
for ($i = 0; $i -lt $stops6632.Length; $i++) {
  $stList6632.Add([PSCustomObject]@{ seq = ($i + 1); name = $stops6632[$i] })
}
$list.Add([PSCustomObject]@{
  routeId = "ROUTE_6632"; routeNo = "6632"; routeType = "지선"; cityCode = "25"; cityName = "서울";
  startNode = "신정동차고지"; endNode = "당산역"; stopCount = 21; stops = $stList6632
})

# 4. 660번
$stops660 = @(
  "가양동차고지", "가양역", "발산역", "한국가스공사", "KBS스포츠월드", "강서구청", "등촌역", "염창역",
  "당산동삼익아파트", "당산역", "영등포시장역", "영등포역", "신길역", "여의도역", "국회의사당", "여의도버스환승센터",
  "샛강역", "노량진역", "대방역", "신도림역", "구로역", "가산디지털단지역", "독산역", "금천구청"
)
$stList660 = [System.Collections.Generic.List[PSObject]]::new()
for ($i = 0; $i -lt $stops660.Length; $i++) {
  $stList660.Add([PSCustomObject]@{ seq = ($i + 1); name = $stops660[$i] })
}
$list.Add([PSCustomObject]@{
  routeId = "ROUTE_660"; routeNo = "660"; routeType = "간선"; cityCode = "25"; cityName = "서울";
  startNode = "가양동차고지"; endNode = "금천구청"; stopCount = 24; stops = $stList660
})

# 5. 146번
$stops146 = @(
  "상계동차고지", "노원역", "중계역", "하계역", "공릉역", "태릉입구역", "먹골역", "중화역", "상봉역",
  "중랑역", "군자역", "어린이대공원역", "건대입구역", "자양동", "청담대교", "청담역", "봉은사역", "삼성역",
  "선릉역", "역삼역", "강남역", "교대역", "서초역", "고속터미널", "내방역", "이수역", "사당역", "낙성대역",
  "서울대입구역", "신림역", "신대방역", "구로디지털단지역"
)
$stList146 = [System.Collections.Generic.List[PSObject]]::new()
for ($i = 0; $i -lt $stops146.Length; $i++) {
  $stList146.Add([PSCustomObject]@{ seq = ($i + 1); name = $stops146[$i] })
}
$list.Add([PSCustomObject]@{
  routeId = "ROUTE_146"; routeNo = "146"; routeType = "간선"; cityCode = "25"; cityName = "서울";
  startNode = "상계동차고지"; endNode = "구로디지털단지역"; stopCount = 32; stops = $stList146
})

# 6. 150번
$stops150 = @(
  "도봉산역", "도봉한신아파트", "도봉역", "신도봉시장", "방학역", "쌍문역", "수유역", "미아역", "미아사거리역",
  "길음역", "성대입구", "혜화동로터리", "종로5가", "종로3가", "종로1가", "광화문", "서울역", "숙대입구", "삼각지역",
  "신용산역", "노량진역", "대방역", "신길역", "영등포역", "신도림역", "구로역", "가산삼거리", "독산동", "시흥사거리",
  "금천구청", "박달동입구", "시흥동종점"
)
$stList150 = [System.Collections.Generic.List[PSObject]]::new()
for ($i = 0; $i -lt $stops150.Length; $i++) {
  $stList150.Add([PSCustomObject]@{ seq = ($i + 1); name = $stops150[$i] })
}
$list.Add([PSCustomObject]@{
  routeId = "ROUTE_150"; routeNo = "150"; routeType = "간선"; cityCode = "25"; cityName = "서울";
  startNode = "도봉산역"; endNode = "시흥동종점"; stopCount = 32; stops = $stList150
})

# 7. 7770번
$stops7770 = @(
  "수원역.AK플라자", "고등동주민센터", "수원여고", "장안문", "KT수원지사", "수원종합운동장", "한일타운", "수원경기장입구",
  "파장동삼거리", "지지대고개", "의왕톨게이트", "의왕시청입구", "인덕원역", "과천역", "과천정부청사", "선바위역",
  "남태령역", "사당역버스환승센터", "사당역4번출구", "이수역", "방배동", "사당역종점"
)
$stList7770 = [System.Collections.Generic.List[PSObject]]::new()
for ($i = 0; $i -lt $stops7770.Length; $i++) {
  $stList7770.Add([PSCustomObject]@{ seq = ($i + 1); name = $stops7770[$i] })
}
$list.Add([PSCustomObject]@{
  routeId = "ROUTE_7770"; routeNo = "7770"; routeType = "광역"; cityCode = "31010"; cityName = "경기 수원";
  startNode = "수원역"; endNode = "사당역"; stopCount = 22; stops = $stList7770
})

# 대규모 한글 정류소 풀
$pool = @(
  "서울역.YTN", "광화문.세종문화회관", "종로3가.탑골공원", "강남역2번출구", "잠실역.롯데월드", 
  "신도림역.디큐브시티", "영등포역.타임스퀘어", "홍대입구역.9번출구", "신촌역.현대백화점", "여의도역.IFC몰", 
  "고속터미널.신세계백화점", "사당역.중앙차로", "구로디지털단지역", "양재역.서초구청", "청량리역환승센터", 
  "수유역.강북구청", "노원역.롯데백화점", "혜화역.마로니에공원", "합정역.메세나폴리스", "당산역.삼성아파트", 
  "수원역.AK플라자", "성남판교역.현대백화점", "분당미금역.청솔마을", "일산정발산역.마두역", "부천역.자유시장", 
  "인천부평역.역전시장", "김포공항역.국제선", "용인기흥역.AK몰", "안양인덕원역.벌말", "남양주다산.진건"
)

$pIdx = 0
for ($i = 100; $i -lt 800; $i++) {
  $rNo = [string]$i
  if ($rNo -eq "6642" -or $rNo -eq "6631" -or $rNo -eq "6632" -or $rNo -eq "660" -or $rNo -eq "146" -or $rNo -eq "150") { continue }
  $sc = 21 + ($i % 12)
  $stList = [System.Collections.Generic.List[PSObject]]::new()
  for ($j = 1; $j -le $sc; $j++) {
    $stName = $pool[$pIdx % $pool.Length]
    $pIdx++
    $stList.Add([PSCustomObject]@{ seq = $j; name = "${stName}_${j}번정류소" })
  }
  $list.Add([PSCustomObject]@{
    routeId = "ROUTE_S_${rNo}"; routeNo = $rNo;
    routeType = if ($i -lt 600) { "간선" } else { "지선" };
    cityCode = "25"; cityName = "서울";
    startNode = $stList[0].name; endNode = $stList[-1].name;
    stopCount = $sc; stops = $stList
  })
}

for ($i = 1000; $i -le 8500; $i += 6) {
  $rNo = [string]$i
  if ($rNo -eq "7770") { continue }
  $sc = 22 + ($i % 12)
  $stList = [System.Collections.Generic.List[PSObject]]::new()
  for ($j = 1; $j -le $sc; $j++) {
    $stName = $pool[$pIdx % $pool.Length]
    $pIdx++
    $stList.Add([PSCustomObject]@{ seq = $j; name = "${stName}_${j}번정류소" })
  }
  $list.Add([PSCustomObject]@{
    routeId = "ROUTE_G_${rNo}"; routeNo = $rNo;
    routeType = if ($i -ge 3000) { "광역" } else { "시내" };
    cityCode = "31"; cityName = "경기";
    startNode = $stList[0].name; endNode = $stList[-1].name;
    stopCount = $sc; stops = $stList
  })
}

$json = $list | ConvertTo-Json -Depth 5
$header = "// 버스타자 — 100% 한글 버스 정류소 DB`nexport const LOCAL_ROUTES = "
[System.IO.File]::WriteAllText("d:\Project\busstop\src\data\routes.js", ($header + $json + ";"), [System.Text.Encoding]::UTF8)
Write-Host "Done! Pure Korean bus stops created!"

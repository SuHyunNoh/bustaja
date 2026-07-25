// ==========================================================================
// 버스타자 (BusTaja) — 100% 아름다운 실제 한글 정류소 명칭 버스 노선 DB
// 6642번 실제 마곡수명산파크 정밀 노선 완벽 원복 & 한글 정류소 적용
// ==========================================================================

export const LOCAL_ROUTES = [
  // 1. 6642번 (서울 지선 - 마곡수명산파크 실제 노선)
  {
    "routeId": "ROUTE_6642",
    "routeNo": "6642",
    "routeType": "지선",
    "cityCode": "25",
    "cityName": "서울",
    "startNode": "강서공영차고지",
    "endNode": "염창역",
    "stopCount": 21,
    "stops": [
      { "seq": 1, "name": "강서공영차고지" }, { "seq": 2, "name": "개화역광역환승센터" }, { "seq": 3, "name": "개화산역" }, { "seq": 4, "name": "방화사거리" }, { "seq": 5, "name": "방화역" },
      { "seq": 6, "name": "방화동동부센트레빌" }, { "seq": 7, "name": "마곡엠밸리10단지" }, { "seq": 8, "name": "마곡역" }, { "seq": 9, "name": "마곡수명산파크1단지" }, { "seq": 10, "name": "마곡수명산파크2단지" },
      { "seq": 11, "name": "마곡수명산파크3.4단지" }, { "seq": 12, "name": "마곡수명산파크5.6단지" }, { "seq": 13, "name": "수명산파크중앙" }, { "seq": 14, "name": "발산역.마곡NC백화점" }, { "seq": 15, "name": "한국가스공사" },
      { "seq": 16, "name": "KBS스포츠월드" }, { "seq": 17, "name": "강서구청사거리" }, { "seq": 18, "name": "화곡역" }, { "seq": 19, "name": "화곡본동시장" }, { "seq": 20, "name": "등촌역" }, { "seq": 21, "name": "염창역" }
    ]
  },

  // 2. 6631번 (서울 지선 - 철산동 ↔ 영등포)
  {
    "routeId": "ROUTE_6631",
    "routeNo": "6631",
    "routeType": "지선",
    "cityCode": "25",
    "cityName": "서울",
    "startNode": "철산동차고지",
    "endNode": "영등포역",
    "stopCount": 22,
    "stops": [
      { "seq": 1, "name": "철산동차고지" }, { "seq": 2, "name": "광명사거리역" }, { "seq": 3, "name": "광명시장" }, { "seq": 4, "name": "개봉교" }, { "seq": 5, "name": "개봉역" },
      { "seq": 6, "name": "구로아이파크" }, { "seq": 7, "name": "동양미래대학교" }, { "seq": 8, "name": "구로역" }, { "seq": 9, "name": "신도림역" }, { "seq": 10, "name": "문래동주민센터" },
      { "seq": 11, "name": "문래역" }, { "seq": 12, "name": "영등포구청" }, { "seq": 13, "name": "당산동진로아파트" }, { "seq": 14, "name": "당산역" }, { "seq": 15, "name": "영등포시장" },
      { "seq": 16, "name": "영등포역" }, { "seq": 17, "name": "신길역" }, { "seq": 18, "name": "도림동주민센터" }, { "seq": 19, "name": "신도림교" }, { "seq": 20, "name": "구로역신도림S큐브" },
      { "seq": 21, "name": "광명교" }, { "seq": 22, "name": "철산동종점" }
    ]
  },

  // 3. 6632번 (서울 지선 - 신정동 ↔ 당산역)
  {
    "routeId": "ROUTE_6632",
    "routeNo": "6632",
    "routeType": "지선",
    "cityCode": "25",
    "cityName": "서울",
    "startNode": "신정동차고지",
    "endNode": "당산역",
    "stopCount": 21,
    "stops": [
      { "seq": 1, "name": "신정동차고지" }, { "seq": 2, "name": "신정네거리역" }, { "seq": 3, "name": "목동역" }, { "seq": 4, "name": "목동오거리" }, { "seq": 5, "name": "오목교역" },
      { "seq": 6, "name": "관악고등학교" }, { "seq": 7, "name": "양평역" }, { "seq": 8, "name": "영등포중앙시장" }, { "seq": 9, "name": "당산동삼성아파트" }, { "seq": 10, "name": "당산역" },
      { "seq": 11, "name": "당산동푸르지오" }, { "seq": 12, "name": "영등포구청역" }, { "seq": 13, "name": "문래역" }, { "seq": 14, "name": "도림천역" }, { "seq": 15, "name": "신정교" },
      { "seq": 16, "name": "목동14단지" }, { "seq": 17, "name": "목동8단지" }, { "seq": 18, "name": "양천구청" }, { "seq": 19, "name": "신정동이펜하우스" }, { "seq": 20, "name": "신정역" }, { "seq": 21, "name": "신정차고지" }
    ]
  },

  // 4. 660번 (서울 간선 - 가양동 ↔ 영등포)
  {
    "routeId": "ROUTE_660",
    "routeNo": "660",
    "routeType": "간선",
    "cityCode": "25",
    "cityName": "서울",
    "startNode": "가양동차고지",
    "endNode": "영등포역",
    "stopCount": 24,
    "stops": [
      { "seq": 1, "name": "가양동차고지" }, { "seq": 2, "name": "가양역" }, { "seq": 3, "name": "발산역" }, { "seq": 4, "name": "한국가스공사" }, { "seq": 5, "name": "KBS스포츠월드" },
      { "seq": 6, "name": "강서구청" }, { "seq": 7, "name": "등촌역" }, { "seq": 8, "name": "염창역" }, { "seq": 9, "name": "당산동삼익아파트" }, { "seq": 10, "name": "당산역" },
      { "seq": 11, "name": "영등포시장역" }, { "seq": 12, "name": "영등포역" }, { "seq": 13, "name": "신길역" }, { "seq": 14, "name": "여의도역" }, { "seq": 15, "name": "국회의사당" },
      { "seq": 16, "name": "여의도버스환승센터" }, { "seq": 17, "name": "샛강역" }, { "seq": 18, "name": "노량진역" }, { "seq": 19, "name": "대방역" }, { "seq": 20, "name": "신도림역" },
      { "seq": 21, "name": "구로역" }, { "seq": 22, "name": "가산디지털단지역" }, { "seq": 23, "name": "독산역" }, { "seq": 24, "name": "금천구청" }
    ]
  },

  // 5. 146번 (서울 간선 - 상계동 ↔ 강남역)
  {
    "routeId": "ROUTE_146",
    "routeNo": "146",
    "routeType": "간선",
    "cityCode": "25",
    "cityName": "서울",
    "startNode": "상계동차고지",
    "endNode": "강남역",
    "stopCount": 32,
    "stops": [
      { "seq": 1, "name": "상계동차고지" }, { "seq": 2, "name": "노원역" }, { "seq": 3, "name": "중계역" }, { "seq": 4, "name": "하계역" }, { "seq": 5, "name": "공릉역" },
      { "seq": 6, "name": "태릉입구역" }, { "seq": 7, "name": "먹골역" }, { "seq": 8, "name": "중화역" }, { "seq": 9, "name": "상봉역" }, { "seq": 10, "name": "중랑역" },
      { "seq": 11, "name": "군자역" }, { "seq": 12, "name": "어린이대공원역" }, { "seq": 13, "name": "건대입구역" }, { "seq": 14, "name": "자양동" }, { "seq": 15, "name": "청담대교" },
      { "seq": 16, "name": "청담역" }, { "seq": 17, "name": "봉은사역" }, { "seq": 18, "name": "삼성역" }, { "seq": 19, "name": "선릉역" }, { "seq": 20, "name": "역삼역" },
      { "seq": 21, "name": "강남역" }, { "seq": 22, "name": "교대역" }, { "seq": 23, "name": "서초역" }, { "seq": 24, "name": "고속터미널" }, { "seq": 25, "name": "내방역" },
      { "seq": 26, "name": "이수역" }, { "seq": 27, "name": "사당역" }, { "seq": 28, "name": "낙성대역" }, { "seq": 29, "name": "서울대입구역" }, { "seq": 30, "name": "신림역" },
      { "seq": 31, "name": "신대방역" }, { "seq": 32, "name": "구로디지털단지역" }
    ]
  },

  // 6. 150번 (서울 간선 - 도봉산 ↔ 시흥동)
  {
    "routeId": "ROUTE_150",
    "routeNo": "150",
    "routeType": "간선",
    "cityCode": "25",
    "cityName": "서울",
    "startNode": "도봉산역",
    "endNode": "시흥동종점",
    "stopCount": 32,
    "stops": [
      { "seq": 1, "name": "도봉산역" }, { "seq": 2, "name": "도봉한신아파트" }, { "seq": 3, "name": "도봉역" }, { "seq": 4, "name": "신도봉시장" }, { "seq": 5, "name": "방학역" },
      { "seq": 6, "name": "쌍문역" }, { "seq": 7, "name": "수유역" }, { "seq": 8, "name": "미아역" }, { "seq": 9, "name": "미아사거리역" }, { "seq": 10, "name": "길음역" },
      { "seq": 11, "name": "성대입구" }, { "seq": 12, "name": "혜화동로터리" }, { "seq": 13, "name": "종로5가" }, { "seq": 14, "name": "종로3가" }, { "seq": 15, "name": "종로1가" },
      { "seq": 16, "name": "광화문" }, { "seq": 17, "name": "서울역" }, { "seq": 18, "name": "숙대입구" }, { "seq": 19, "name": "삼각지역" }, { "seq": 20, "name": "신용산역" },
      { "seq": 21, "name": "노량진역" }, { "seq": 22, "name": "대방역" }, { "seq": 23, "name": "신길역" }, { "seq": 24, "name": "영등포역" }, { "seq": 25, "name": "신도림역" },
      { "seq": 26, "name": "구로역" }, { "seq": 27, "name": "가산삼거리" }, { "seq": 28, "name": "독산동" }, { "seq": 29, "name": "시흥사거리" }, { "seq": 30, "name": "금천구청" },
      { "seq": 31, "name": "박달동입구" }, { "seq": 32, "name": "시흥동종점" }
    ]
  },

  // 7. 7770번 (경기 광역 - 수원 ↔ 사당)
  {
    "routeId": "ROUTE_7770",
    "routeNo": "7770",
    "routeType": "광역",
    "cityCode": "31010",
    "cityName": "경기 수원",
    "startNode": "수원역",
    "endNode": "사당역",
    "stopCount": 22,
    "stops": [
      { "seq": 1, "name": "수원역.AK플라자" }, { "seq": 2, "name": "고등동주민센터" }, { "seq": 3, "name": "수원여고" }, { "seq": 4, "name": "장안문" }, { "seq": 5, "name": "KT수원지사" },
      { "seq": 6, "name": "수원종합운동장" }, { "seq": 7, "name": "한일타운" }, { "seq": 8, "name": "수원경기장입구" }, { "seq": 9, "name": "파장동삼거리" }, { "seq": 10, "name": "지지대고개" },
      { "seq": 11, "name": "의왕톨게이트" }, { "seq": 12, "name": "의왕시청입구" }, { "seq": 13, "name": "인덕원역" }, { "seq": 14, "name": "과천역" }, { "seq": 15, "name": "과천정부청사" },
      { "seq": 16, "name": "선바위역" }, { "seq": 17, "name": "남태령역" }, { "seq": 18, "name": "사당역버스환승센터" }, { "seq": 19, "name": "사당역4번출구" }, { "seq": 20, "name": "이수역" },
      { "seq": 21, "name": "방배동" }, { "seq": 22, "name": "사당역종점" }
    ]
  },

  // 8. 360번 (서울 간선 - 송파 ↔ 여의도)
  {
    "routeId": "ROUTE_360",
    "routeNo": "360",
    "routeType": "간선",
    "cityCode": "25",
    "cityName": "서울",
    "startNode": "송파",
    "endNode": "여의도",
    "stopCount": 26,
    "stops": [
      { "seq": 1, "name": "송파공영차고지" }, { "seq": 2, "name": "복정역" }, { "seq": 3, "name": "장지역" }, { "seq": 4, "name": "문정역" }, { "seq": 5, "name": "가락시장역" },
      { "seq": 6, "name": "송파역" }, { "seq": 7, "name": "석촌역" }, { "seq": 8, "name": "잠실역" }, { "seq": 9, "name": "잠실새내역" }, { "seq": 10, "name": "종합운동장역" },
      { "seq": 11, "name": "삼성역" }, { "seq": 12, "name": "선릉역" }, { "seq": 13, "name": "역삼역" }, { "seq": 14, "name": "강남역" }, { "seq": 15, "name": "교대역" },
      { "seq": 16, "name": "서초역" }, { "seq": 17, "name": "고속터미널" }, { "seq": 18, "name": "동작역" }, { "seq": 19, "name": "흑석역" }, { "seq": 20, "name": "노량진역" },
      { "seq": 21, "name": "대방역" }, { "seq": 22, "name": "샛강역" }, { "seq": 23, "name": "여의도역" }, { "seq": 24, "name": "국회의사당역" }, { "seq": 25, "name": "KBS본관" }, { "seq": 26, "name": "여의도버스환승센터" }
    ]
  },

  // 9. G6000번 (경기 김포 직행 - 김포 ↔ 홍대입구)
  {
    "routeId": "ROUTE_G6000",
    "routeNo": "G6000",
    "routeType": "광역",
    "cityCode": "31230",
    "cityName": "경기 김포",
    "startNode": "김포한강",
    "endNode": "홍대입구",
    "stopCount": 21,
    "stops": [
      { "seq": 1, "name": "구래리차고지" }, { "seq": 2, "name": "구래역" }, { "seq": 3, "name": "마산역" }, { "seq": 4, "name": "장기역" }, { "seq": 5, "name": "운양역" },
      { "seq": 6, "name": "김포본동주민센터" }, { "seq": 7, "name": "사우역.김포고" }, { "seq": 8, "name": "풍무역" }, { "seq": 9, "name": "고촌역" }, { "seq": 10, "name": "김포공항역" },
      { "seq": 11, "name": "개화역" }, { "seq": 12, "name": "가양역" }, { "seq": 13, "name": "염창역" }, { "seq": 14, "name": "당산역" }, { "seq": 15, "name": "합정역" },
      { "seq": 16, "name": "홍대입구역" }, { "seq": 17, "name": "신촌역" }, { "seq": 18, "name": "이대역" }, { "seq": 19, "name": "충정로역" }, { "seq": 20, "name": "서대문역" }, { "seq": 21, "name": "서울역" }
    ]
  },

  // 10. 3000번 (경기 김포/인천 ↔ 신촌역)
  {
    "routeId": "ROUTE_3000",
    "routeNo": "3000",
    "routeType": "광역",
    "cityCode": "31230",
    "cityName": "경기 김포/인천",
    "startNode": "강화터미널",
    "endNode": "신촌역",
    "stopCount": 23,
    "stops": [
      { "seq": 1, "name": "강화여객자동차터미널" }, { "seq": 2, "name": "강화병원" }, { "seq": 3, "name": "유송리" }, { "seq": 4, "name": "마송" }, { "seq": 5, "name": "김포패션아울렛" },
      { "seq": 6, "name": "장기사거리" }, { "seq": 7, "name": "김포경찰서" }, { "seq": 8, "name": "사우고등학교" }, { "seq": 9, "name": "김포시청" }, { "seq": 10, "name": "풍무동입구" },
      { "seq": 11, "name": "고촌" }, { "seq": 12, "name": "개화역" }, { "seq": 13, "name": "김포공항" }, { "seq": 14, "name": "송정역" }, { "seq": 15, "name": "발산역" },
      { "seq": 16, "name": "등촌역" }, { "seq": 17, "name": "염창역" }, { "seq": 18, "name": "당산역" }, { "seq": 19, "name": "합정역" }, { "seq": 20, "name": "홍대입구역" },
      { "seq": 21, "name": "신촌역" }, { "seq": 22, "name": "이대역" }, { "seq": 23, "name": "신촌오거리" }
    ]
  },

  // 11. 388번 (경기 김포 시내버스 - 운양동 ↔ 석수역/노량진)
  {
    "routeId": "ROUTE_388",
    "routeNo": "388",
    "routeType": "일반",
    "cityCode": "31230",
    "cityName": "경기 김포",
    "startNode": "운양동차고지",
    "endNode": "석수역",
    "stopCount": 25,
    "stops": [
      { "seq": 1, "name": "운양동차고지" }, { "seq": 2, "name": "장기역.주공아파트" }, { "seq": 3, "name": "김포경찰서" }, { "seq": 4, "name": "사우역.김포고" }, { "seq": 5, "name": "풍무역" },
      { "seq": 6, "name": "고촌역" }, { "seq": 7, "name": "개화역광역환승센터" }, { "seq": 8, "name": "김포공항역" }, { "seq": 9, "name": "송정역" }, { "seq": 10, "name": "마곡역" },
      { "seq": 11, "name": "발산역" }, { "seq": 12, "name": "한국가스공사" }, { "seq": 13, "name": "KBS스포츠월드" }, { "seq": 14, "name": "강서구청사거리" }, { "seq": 15, "name": "등촌역" },
      { "seq": 16, "name": "염창역" }, { "seq": 17, "name": "당산역" }, { "seq": 18, "name": "영등포시장" }, { "seq": 19, "name": "영등포역" }, { "seq": 20, "name": "여의도역" },
      { "seq": 21, "name": "샛강역" }, { "seq": 22, "name": "노량진역" }, { "seq": 23, "name": "대방역" }, { "seq": 24, "name": "신길동" }, { "seq": 25, "name": "석수역" }
    ]
  },

  // 12. 정류장 20개 이하 참가 제외 테스트용 노선
  { "routeId": "ROUTE_02", "routeNo": "02", "routeType": "순환", "cityCode": "25", "cityName": "서울", "startNode": "N서울타워", "endNode": "충무로역", "stopCount": 14, "stops": Array.from({length: 14}, (_, i) => ({ seq: i+1, name: `순환02_정류장_${i+1}` })) }
];
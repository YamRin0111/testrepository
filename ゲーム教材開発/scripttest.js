const locations = [
  { image: 'images/tokyo.webp', lat: 35.6895, lng: 139.6917 }, // 東京
  { image: 'images/kurobe.webp', lat: 36.5668, lng: 137.6638 }, // 黒部ダム
  { image: 'images/zuiryuji.webp', lat: 36.7355, lng: 137.0110 }, // 瑞龍寺
];

let selectedLocation = null;
let userGuess = null;
let resultMap = null;

function showRules() {
  document.getElementById('title-screen').style.display = 'none';
  document.getElementById('rules-screen').style.display = 'flex';
}

function goToTitle() {
  document.getElementById('rules-screen').style.display = 'none';
  document.getElementById('title-screen').style.display = 'flex';
}

function startGame() {
  document.getElementById('title-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'flex';

  const randomIndex = Math.floor(Math.random() * locations.length);
  selectedLocation = locations[randomIndex];
  document.getElementById('random-image').src = selectedLocation.image;
}

function goToMap() {
  document.getElementById('game-screen').style.display = 'none';
  document.getElementById('map-screen').style.display = 'flex';

  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: { lat: 35.6895, lng: 139.6917 }, // 初期位置を東京に設定
  });

  map.addListener('click', (event) => {
    userGuess = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    alert(`選択した位置: 緯度 ${userGuess.lat}, 経度 ${userGuess.lng}`);
  });
}

function submitGuess() {
  if (!userGuess) {
    alert('位置を選択してください！');
    return;
  }

  const distance = calculateDistance(
    selectedLocation.lat,
    selectedLocation.lng,
    userGuess.lat,
    userGuess.lng
  );

  document.getElementById('map-screen').style.display = 'none';
  document.getElementById('result-screen').style.display = 'flex';
  document.getElementById('result-text').innerText = 
    `あなたの選んだ位置は ${distance.toFixed(2)} km 離れています！`;

  // 結果地図を初期化
  resultMap = new google.maps.Map(document.getElementById('result-map'), {
    zoom: 15,
    center: selectedLocation, // 正解の位置を中心に
  });

  // 正解の位置にマーカーを表示
  new google.maps.Marker({
    position: selectedLocation,
    map: resultMap,
    label: '答え',
  });

  // ユーザーの解答位置にマーカーを表示
  new google.maps.Marker({
    position: userGuess,
    map: resultMap,
    label: '解答',
  });

  // 二点を線で結ぶ
  new google.maps.Polyline({
    path: [selectedLocation, userGuess],
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2,
    map: resultMap,
  });
}

function restartGame() {
  document.getElementById('result-screen').style.display = 'none';
  document.getElementById('title-screen').style.display = 'flex';
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = degToRad(lat2 - lat1);
  const dLng = degToRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}

/* --------------------------
   커피쏘기 룰렛 메인 스크립트
---------------------------*/
let rouletteItems = JSON.parse(localStorage.getItem('rouletteItems') || '[]');
const canvas   = document.getElementById('rouletteCanvas');
const ctx      = canvas.getContext('2d');
const menuList = document.getElementById('menuList');

// 각 구역 정보
let segments = [];

drawRoulette();

/* ---------- functions ---------- */
function drawRoulette() {
  const total = rouletteItems.length || 1;      // 0명 방지
  const angle = Math.PI * 2 / total;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  menuList.innerHTML = '';
  segments = [];

  const offset = -Math.PI / 2; // 12시 방향 기준

  rouletteItems.forEach((item, i) => {
    const start   = i * angle + offset;
    const end     = (i + 1) * angle + offset;
    const mid     = (start + end) / 2;
    const midDeg  = (mid * 180 / Math.PI + 360) % 360;

    segments.push({ index:i, name:item, startAngle:start, endAngle:end, midAngle:mid, midAngleDegrees:midDeg });

    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, start, end);
    ctx.fillStyle = `hsl(${i * 360 / total}, 80%, 70%)`;
    ctx.fill();

    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(mid);
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '16px sans-serif';
    ctx.fillText(item, 120, 0);
    ctx.restore();

    // 리스트 아이템
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.textContent = `[${i + 1}] ${item}`;
    div.onclick = () => {
      rouletteItems.splice(i, 1);
      localStorage.setItem('rouletteItems', JSON.stringify(rouletteItems));
      drawRoulette();
    };
    menuList.appendChild(div);
  });
}

function addMenu() {
  const input = document.getElementById('menuInput');
  if (input.value.trim()) {
    rouletteItems.push(input.value.trim());
    localStorage.setItem('rouletteItems', JSON.stringify(rouletteItems));
    input.value = '';
    drawRoulette();
  }
}

function spinRoulette() {
  const total = rouletteItems.length;
  if (!total) return alert('참가자를 먼저 추가하세요!');

  const selectedIndex = Math.floor(Math.random() * total);
  const targetSegment = segments[selectedIndex];
  const targetDeg

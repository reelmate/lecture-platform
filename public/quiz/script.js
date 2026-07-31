const CATS = [
  { id:'onsite', num:'❶', name:'고객이 좋아하는 나의 방식', sub:'현장 강점',
    items:[
      '고객이 처음 와도 어색하지 않게 분위기를 풀어준다',
      '설명을 짧게 해도 고객이 바로 이해한다',
      '고객이 원하는 걸 눈치 빠르게 캐치한다',
      '컴플레인이 생겨도 감정적으로 번지지 않게 정리한다',
      '단골이 생기는 편이다(재방문, 소개가 있다)'
    ]},
  { id:'result', num:'❷', name:'결과로 증명되는 강점', sub:'매출·성과 강점',
    items:[
      '같은 돈으로도 더 좋은 결과를 만드는 편이다(가성비, 효율)',
      '작업/시술/납품 퀄리티 편차가 적다',
      '속도가 빠른 편이다(응대, 제작, 납기)',
      '디테일을 챙겨서 "이래서 다르다" 소리를 듣는다',
      '한 번 맡기면 끝까지 책임진다는 말을 듣는다'
    ]},
  { id:'ops', num:'❸', name:'운영 능력 강점', sub:'사장님 체질',
    items:[
      '정리정돈·재고·동선 같은 운영이 깔끔한 편이다',
      '예약, 스케줄, 시간 약속을 잘 지킨다',
      '돈 흐름(원가, 마진, 지출)을 대충 넘기지 않는다',
      '바쁜 날에도 우선순위 잡고 처리한다',
      '직원/외주와 소통이 비교적 매끄럽다(혼자여도 해당)'
    ]},
  { id:'content', num:'❹', name:'콘텐츠로 바로 쓸 수 있는 강점', sub:'말·설명·표현',
    items:[
      '고객이 자주 묻는 질문에 답을 잘 한다',
      '비교 설명을 잘 한다(왜 이게 더 나은지)',
      '예시를 들어 설명하는 걸 잘 한다',
      '내 경험담을 말하면 사람들이 집중한다',
      '말을 글/영상으로 옮기는 데 거부감이 적다'
    ]},
  { id:'character', num:'❺', name:'브랜드 캐릭터 강점', sub:'사람이 남는 이유',
    items:[
      '솔직하게 말해도 기분 나쁘지 않게 전달한다',
      '친근한데 가볍지 않다',
      '차분하고 믿음직하다는 말을 듣는다',
      '에너지가 좋아서 매장이 밝아진다는 말을 듣는다',
      '센스 있다, 취향 좋다는 말을 듣는다'
    ]},
  { id:'story', num:'❻', name:'내 "스토리 자산" 강점', sub:'사람들이 응원하는 포인트',
    items:[
      '화려한 조건 없이도 버텨온 시간이 있다',
      '실패/손해/실수 경험을 숨기지 않고 말할 수 있다',
      '육아/가족/본업 병행 같은 현실을 겪고 있다',
      '업을 시작한 이유가 분명하다(사연이 있다)',
      '바닥에서 개선해온 기록이 있다(전후, 변화)'
    ]}
];

const TYPES = {
  onsite:    { code:'WARM',  title:'분위기 메이커형', desc:'고객이 마음을 열게 만드는 힘이 강점이에요. 설명보다 "느낌"으로 신뢰를 쌓는 타입입니다.', feel:'마음이 편해지고 다시 오고 싶어지는 느낌', tip:'고객 응대·케어 순간을 브이로그처럼 보여주는 릴스, 단골 손님과의 케미, 매장 분위기 소개가 잘 맞아요.' },
  result:    { code:'PROOF', title:'결과로 증명형', desc:'가성비, 퀄리티, 속도처럼 눈에 보이는 결과로 신뢰를 쌓는 타입이에요.', feel:'믿고 맡길 수 있다는 안정감', tip:'비포애프터, 작업 과정 타임랩스, 숫자로 보여주는 후기 콘텐츠가 잘 맞아요.' },
  ops:       { code:'STEADY', title:'믿음직한 살림꾼형', desc:'정리, 시간 약속, 돈 흐름처럼 보이지 않는 곳까지 야무진 타입이에요.', feel:'약속을 지키는 사람이라는 신뢰', tip:'오픈 전 준비 루틴, 재고·동선 정리 브이로그, 약속을 지키는 디테일을 보여주는 콘텐츠가 잘 맞아요.' },
  content:   { code:'CLEAR', title:'설명의 고수형', desc:'어려운 걸 쉽게 풀어주고, 비교와 예시로 이해시키는 타입이에요.', feel:'이해가 쏙 되고 불안이 줄어드는 느낌', tip:'자주 묻는 질문(FAQ) 릴스, 비교 설명 콘텐츠, "이래서 다릅니다" 시리즈가 잘 맞아요.' },
  character: { code:'CHARM', title:'사람이 남는 브랜드형', desc:'솔직함과 에너지로 사람들이 기억하게 만드는 타입이에요.', feel:'사장님이 기억에 남고 애정이 생기는 마음', tip:'사장님 텐션이 드러나는 일상 콘텐츠, 솔직 토크, 유머러스한 순간이 잘 맞아요.' },
  story:     { code:'STORY', title:'진심파 스토리텔러형', desc:'버텨온 시간과 진짜 이야기로 팬을 만드는 타입이에요.', feel:'응원하고 싶은 마음', tip:'창업 계기, 실패와 회복 스토리, 전후 변화 기록이 잘 맞아요.' }
};

let answers = {};

function buildQuiz(){
  const root = document.getElementById('sections');
  root.innerHTML = CATS.map(cat => `
    <div class="section-head">
      <span class="section-num">${cat.num}</span>
      <span class="section-name">${cat.name}</span>
    </div>
    <p class="section-desc">${cat.sub}</p>
    <div class="scale-legend"><span>0 전혀 아니다</span><span>1 가끔</span><span>2 자주</span><span>3 늘 그렇다</span></div>
    <div class="qz-card" style="padding:6px 18px;">
      ${cat.items.map((text,i) => {
        const qid = cat.id + '_' + i;
        return `
        <div class="q-row">
          <div class="q-text">${text}</div>
          <div class="q-scale">
            ${[0,1,2,3].map(v => `<div class="q-dot" data-q="${qid}" data-v="${v}" onclick="setAnswer('${qid}',${v})">${v}</div>`).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>
  `).join('');
}

function setAnswer(qid, v){
  answers[qid] = v;
  document.querySelectorAll('.q-dot[data-q="'+qid+'"]').forEach(d=>{
    d.classList.toggle('active', parseInt(d.dataset.v) === v);
  });
  updateProgress();
}

function updateProgress(){
  const total = CATS.reduce((a,c)=>a+c.items.length,0);
  const done = Object.keys(answers).length;
  document.getElementById('progressFill').style.width = (done/total*100)+'%';
  document.getElementById('progressLabel').textContent = done + ' / ' + total;
  document.getElementById('submitBtn').disabled = done < total;
}

function startQuiz(){
  buildQuiz();
  document.getElementById('view-intro').classList.add('hidden');
  document.getElementById('view-quiz').classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
}

function showResult(){
  const scores = {};
  const threes = {};
  CATS.forEach(cat=>{
    let sum=0, cnt3=0;
    cat.items.forEach((text,i)=>{
      const v = answers[cat.id+'_'+i] || 0;
      sum += v;
      if(v===3){ cnt3++; }
    });
    scores[cat.id]=sum;
    threes[cat.id]=cnt3;
  });

  let top = CATS[0].id;
  CATS.forEach(cat=>{
    if(scores[cat.id] > scores[top]) top = cat.id;
    else if(scores[cat.id] === scores[top] && threes[cat.id] > threes[top]) top = cat.id;
  });

  const t = TYPES[top];
  document.getElementById('rCode').textContent = t.code;
  document.getElementById('rTitleStamp').textContent = t.title.replace('형','');
  document.getElementById('rTitle').textContent = t.title + ' · ' + t.code;
  document.getElementById('rDesc').textContent = t.desc;
  document.getElementById('rTip').textContent = t.tip;
  document.getElementById('tFeel').textContent = t.feel;

  const c3 = threes[top];
  let confText = '';
  if(c3 >= 4) confText = '강점이 이미 뚜렷해요';
  else if(c3 >= 2) confText = '강점은 있는데 정리가 덜 됐어요';
  else confText = '고객 후기·대화에서 강점을 더 찾아보세요';
  document.getElementById('rConfidence').textContent = confText;

  const barRoot = document.getElementById('barChart');
  barRoot.innerHTML = CATS.map(cat=>{
    const s = scores[cat.id];
    const pct = Math.round(s/15*100);
    const isTop = cat.id===top;
    return `<div class="bar-row">
      <div class="bar-label">${cat.sub}</div>
      <div class="bar-track"><div class="bar-fill ${isTop?'top':''}" style="width:${pct}%"></div></div>
      <div class="bar-val">${s}</div>
    </div>`;
  }).join('');

  const cat = CATS.find(c=>c.id===top);
  const strongItems = [];
  cat.items.forEach((text,i)=>{
    if((answers[cat.id+'_'+i]||0) === 3) strongItems.push(text);
  });
  const listRoot = document.getElementById('strengthList');
  if(strongItems.length===0){
    listRoot.innerHTML = '<div class="strength-item"><span class="mark">-</span><span>이 유형에서 3점 문항이 아직 없어요. 2점 문항들을 다시 살펴보거나, 고객 후기에서 힌트를 찾아보세요.</span></div>';
  } else {
    listRoot.innerHTML = strongItems.map(text=>`<div class="strength-item"><span class="mark">✓</span><span>${text}</span></div>`).join('');
  }

  const pick = strongItems.length ? strongItems.slice(0,2) : cat.items.slice(0,1);
  document.getElementById('tItems').textContent = pick.map(s=>s.replace(/\(.*?\)/g,'').trim()).join(', ');

  document.getElementById('view-quiz').classList.add('hidden');
  document.getElementById('view-result').classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
}

function restart(){
  answers = {};
  document.getElementById('view-result').classList.add('hidden');
  document.getElementById('view-intro').classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
}

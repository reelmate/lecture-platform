import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: { absolute: '사장님 강점 유형 진단' },
};

const bodyHtml = `
<div class="wrap">

  <div class="brand">
    <div class="stamp-mini">강</div>
    <span>사장님 강점 유형 진단</span>
  </div>

  <!-- ============ INTRO ============ -->
  <div id="view-intro">
    <h1 class="title">내 강점, 이미 있는데<br>말로 못 꺼내고 있는 거 아닐까요?</h1>
    <p class="subtitle">30개 문항에 체크하면, 6가지 유형 중 사장님의 강점 유형을 알려드려요. 그리고 그 강점을 바로 콘텐츠 문장으로 정리해드립니다.</p>
    <div class="qz-card">
      <h2 class="card-title">이런 걸 알 수 있어요</h2>
      <ul class="intro-list">
        <li>내가 가진 강점이 6가지 유형 중 어디에 가까운지</li>
        <li>이미 3점으로 체크한, 바로 콘텐츠 소재가 되는 문항들</li>
        <li>강점을 한 문장으로 정리한 릴스용 카피 초안</li>
        <li>내 유형에 맞는 콘텐츠 방향 힌트</li>
      </ul>
      <button class="btn red" onclick="startQuiz()">진단 시작하기 (약 3분)</button>
    </div>
    <p style="font-size:12px;color:var(--ink-faint);text-align:center;">정답은 없어요. 솔직하게, 평소 모습 그대로 체크해주세요.</p>
  </div>

  <!-- ============ QUIZ ============ -->
  <div id="view-quiz" class="hidden">
    <div class="progress-bar">
      <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
      <div class="progress-label" id="progressLabel">0 / 30</div>
    </div>
    <div id="sections"></div>
    <div class="bottom-bar">
      <button class="btn red" id="submitBtn" onclick="showResult()" disabled>결과 보기</button>
    </div>
  </div>

  <!-- ============ RESULT ============ -->
  <div id="view-result" class="hidden">
    <div class="result-hero">
      <div class="result-eyebrow">사장님의 강점 유형은</div>
      <div class="stamp">
        <div class="stamp-inner">
          <div class="stamp-code" id="rCode"></div>
          <div class="stamp-title" id="rTitleStamp"></div>
        </div>
      </div>
      <h2 class="result-type" id="rTitle"></h2>
      <p class="result-desc" id="rDesc"></p>
      <div class="confidence" id="rConfidence"></div>
    </div>

    <div class="qz-card">
      <h2 class="card-title">유형별 점수 (15점 만점)</h2>
      <div id="barChart"></div>
    </div>

    <div class="qz-card">
      <h2 class="card-title">이미 뚜렷한 강점 문항 (3점 체크)</h2>
      <div id="strengthList"></div>
    </div>

    <div class="qz-card">
      <h2 class="card-title">강점 문장 (릴스 카피 초안)</h2>
      <div class="template-box">
        내 강점은 <b id="tItems"></b>다.<br>
        그래서 고객은 <b id="tFeel"></b>을 느낀다.<br>
        나는 이걸
        <textarea id="tAction" rows="2" placeholder="구체적인 행동 1개를 적어보세요 (예: 상담 때 체크리스트로 확인하고, 마무리 사진으로 남긴다)"></textarea>
        로 증명한다.
      </div>
      <div class="content-tip"><b>콘텐츠 방향 힌트 —</b> <span id="rTip"></span></div>
    </div>

    <div class="qz-card">
      <p class="dm-cta">강점이 없다고 느껴지는 날, 이 진단으로 먼저 체크해보세요.<br>결과 화면을 캡처해서 보내주시면, 강점 3개로 콘텐츠 주제까지 뽑아드릴게요.</p>
    </div>

    <button class="btn ghost" onclick="restart()">처음부터 다시하기</button>
  </div>

</div>
`;

export default function QuizPage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/quiz/style.css" />
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <Script src="/quiz/script.js" strategy="afterInteractive" />
    </>
  );
}

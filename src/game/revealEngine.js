// ==========================================================================
// 버스정류장 땅따먹기 — 정류장 텍스트 리빌 & 엔터 제출 타이머 엔진 (revealEngine.js)
// 첫 번째 정류장 타이핑 시작 시점부터 타이머가 흘러가도록 대기 모드 연동
// ==========================================================================

export class RevealEngine {
  constructor(stops, onUpdate, onComplete) {
    this.stops = stops; // [{seq, name}]
    this.currentIndex = 0;
    this.startTime = null;
    this.elapsedMs = 0;
    this.splits = [];
    this.timerId = null;
    this.isFinished = false;
    this.hasStarted = false; // 첫 타자 입력 시 타이머 측정 시작 플래그
    
    this.onUpdate = onUpdate || (() => {});
    this.onComplete = onComplete || (() => {});
  }

  // 게임 준비 상태 (아직 타이머는 흐르지 않음)
  ready() {
    this.currentIndex = 0;
    this.splits = [];
    this.isFinished = false;
    this.hasStarted = false;
    this.elapsedMs = 0;
    this.startTime = null;
    this.notifyUpdate();
  }

  // 첫 타자 입력 시 타이머 측정 시작
  startTimer() {
    if (this.hasStarted || this.isFinished) return;
    this.hasStarted = true;
    this.startTime = performance.now();
    this.timerId = requestAnimationFrame(this.tick.bind(this));
    this.notifyUpdate();
  }

  tick() {
    if (this.isFinished || !this.hasStarted) return;

    this.elapsedMs = Math.round(performance.now() - this.startTime);
    this.notifyUpdate();

    this.timerId = requestAnimationFrame(this.tick.bind(this));
  }

  // 엔터(Enter) 키 제출 시 정류장 이름 검증
  submitInput(inputText) {
    if (this.isFinished) return { matched: false, finished: true };

    // 혹시라도 startTimer가 안 켜졌다면 제출 시 자동 시작
    if (!this.hasStarted) {
      this.startTimer();
    }

    const currentTarget = this.stops[this.currentIndex];
    if (!currentTarget) return { matched: false, finished: false };

    const cleanInput = inputText.trim();
    const cleanTarget = currentTarget.name.trim();

    // 정확히 매칭된 경우
    if (cleanInput === cleanTarget) {
      const splitTime = this.elapsedMs;
      this.splits.push(splitTime);
      this.currentIndex++;

      const finished = this.currentIndex >= this.stops.length;
      if (finished) {
        this.finish();
      } else {
        this.notifyUpdate();
      }
      return { matched: true, finished };
    }

    // 불일치 시
    return { matched: false, finished: false };
  }

  finish() {
    this.isFinished = true;
    if (this.timerId) cancelAnimationFrame(this.timerId);
    this.notifyUpdate();
    this.onComplete({
      totalMs: this.elapsedMs,
      splits: this.splits,
      stopCount: this.stops.length
    });
  }

  stop() {
    this.isFinished = true;
    if (this.timerId) cancelAnimationFrame(this.timerId);
  }

  notifyUpdate() {
    this.onUpdate({
      currentIndex: this.currentIndex,
      currentStop: this.stops[this.currentIndex] || null,
      nextStop: this.stops[this.currentIndex + 1] || null,
      totalStops: this.stops.length,
      elapsedMs: this.elapsedMs,
      hasStarted: this.hasStarted,
      progressPercent: Math.min(100, Math.round((this.currentIndex / this.stops.length) * 100)),
      isFinished: this.isFinished
    });
  }
}

// ==========================================================================
// 버스정류장 땅따먹기 — 1위 / 내기록 고스트 재생 엔진 (F-D)
// ==========================================================================

export class GhostPlayer {
  constructor(bestSplits = [], totalStops = 1) {
    this.bestSplits = bestSplits; // [ms1, ms2, ms3...]
    this.totalStops = totalStops;
  }

  // 현재 경과 시간(elapsedMs)에 따른 고스트의 진행 정류장 인덱스 및 위치 계산
  getGhostStatus(elapsedMs) {
    if (!this.bestSplits || this.bestSplits.length === 0) {
      return {
        ghostIndex: 0,
        ghostProgressPercent: 0,
        isGhostFinished: false
      };
    }

    let ghostIndex = 0;
    for (let i = 0; i < this.bestSplits.length; i++) {
      if (elapsedMs >= this.bestSplits[i]) {
        ghostIndex = i + 1;
      } else {
        break;
      }
    }

    const isGhostFinished = ghostIndex >= this.totalStops;
    const ghostProgressPercent = Math.min(100, Math.round((ghostIndex / this.totalStops) * 100));

    return {
      ghostIndex: Math.min(ghostIndex, this.totalStops),
      ghostProgressPercent,
      isGhostFinished
    };
  }

  // 플레이어와의 실시간 차이 (Ahead / Behind delta seconds)
  getDeltaTime(playerIndex, playerElapsedMs) {
    if (!this.bestSplits || this.bestSplits.length === 0) return { deltaSec: 0, isAhead: true };

    // 플레이어가 현재 도달한 정류장에 고스트가 도달했던 시간 비교
    const targetSplitIndex = Math.max(0, playerIndex - 1);
    const ghostTimeAtStop = this.bestSplits[targetSplitIndex] || (playerElapsedMs + 5000);

    const diffMs = playerElapsedMs - ghostTimeAtStop;
    const deltaSec = (Math.abs(diffMs) / 1000).toFixed(2);
    const isAhead = diffMs <= 0; // 플레이어가 고스트보다 빠르면 isAhead = true

    return { deltaSec, isAhead, diffMs };
  }
}

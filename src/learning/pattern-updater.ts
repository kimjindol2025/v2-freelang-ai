/**
 * FreeLang v2 - Pattern Updater (Task 4.1)
 * Intent 패턴 DB 동적 업데이트
 * 피드백 기반 패턴 개선 및 새로운 패턴 학습
 */

import { FeedbackEntry } from '../feedback/feedback-types';
import {
  INTENT_PATTERNS,
  IntentPattern,
  PATTERN_IDS,
} from '../engine/intent-patterns';

export interface PatternUpdate {
  operation: string;
  newKeywords: string[];
  removedKeywords: string[];
  confidenceBoost: number;
  timestamp: number;
  feedbackCount: number;
}

export interface PatternStats {
  operation: string;
  totalFeedback: number;
  approvalRate: number;
  rejectionRate: number;
  modificationRate: number;
  avgAccuracy: number;
  lastUpdated: number;
}

export class PatternUpdater {
  private patternHistory: Map<string, PatternUpdate[]> = new Map();
  private patternStats: Map<string, PatternStats> = new Map();

  /**
   * 피드백을 기반으로 패턴 업데이트
   *
   * 알고리즘:
   * 1. Operation별 피드백 통계 계산
   * 2. 키워드 추가/제거 결정
   * 3. 신뢰도 부스트 계산
   * 4. 패턴 히스토리에 기록
   *
   * @param feedbacks 수집된 피드백 배열
   * @returns 업데이트된 패턴 목록
   */
  updatePatterns(feedbacks: FeedbackEntry[]): PatternUpdate[] {
    const updates: PatternUpdate[] = [];

    if (feedbacks.length === 0) {
      return updates;
    }

    // 1. Operation별 그룹화
    const feedbacksByOp = this._groupByOperation(feedbacks);

    // 2. 각 Operation별 분석 및 업데이트
    for (const [operation, opFeedbacks] of feedbacksByOp.entries()) {
      const stats = this._calculateStats(operation, opFeedbacks);
      this.patternStats.set(operation, stats);

      // 3. 업데이트 결정
      const update = this._decidePatternUpdate(
        operation,
        opFeedbacks,
        stats
      );

      if (update) {
        updates.push(update);
        this._recordUpdate(operation, update);
      }
    }

    return updates;
  }

  /**
   * Operation별 피드백 그룹화
   */
  private _groupByOperation(
    feedbacks: FeedbackEntry[]
  ): Map<string, FeedbackEntry[]> {
    const grouped = new Map<string, FeedbackEntry[]>();

    feedbacks.forEach((fb) => {
      const op = fb.proposal.operation;
      if (!grouped.has(op)) {
        grouped.set(op, []);
      }
      grouped.get(op)!.push(fb);
    });

    return grouped;
  }

  /**
   * Operation별 통계 계산
   */
  private _calculateStats(
    operation: string,
    feedbacks: FeedbackEntry[]
  ): PatternStats {
    let approvalCount = 0;
    let rejectionCount = 0;
    let modificationCount = 0;
    let totalAccuracy = 0;

    feedbacks.forEach((fb) => {
      switch (fb.userFeedback.action) {
        case 'approve':
          approvalCount++;
          break;
        case 'reject':
          rejectionCount++;
          break;
        case 'modify':
          modificationCount++;
          break;
      }
      totalAccuracy += fb.analysis.accuracy;
    });

    const total = feedbacks.length;

    return {
      operation,
      totalFeedback: total,
      approvalRate: approvalCount / total,
      rejectionRate: rejectionCount / total,
      modificationRate: modificationCount / total,
      avgAccuracy: totalAccuracy / total,
      lastUpdated: Date.now(),
    };
  }

  /**
   * 패턴 업데이트 결정
   */
  private _decidePatternUpdate(
    operation: string,
    feedbacks: FeedbackEntry[],
    stats: PatternStats
  ): PatternUpdate | null {
    const pattern = INTENT_PATTERNS[operation];
    if (!pattern) {
      return null;
    }

    const newKeywords: string[] = [];
    const removedKeywords: string[] = [];
    let confidenceBoost = 0;

    // 1. 거부된 피드백에서 키워드 추출 (제거 후보)
    const rejectedFeedbacks = feedbacks.filter(
      (fb) => fb.userFeedback.action === 'reject'
    );

    if (rejectedFeedbacks.length > 0) {
      // 거부율이 높으면 일부 키워드 제거 고려
      if (stats.rejectionRate > 0.3) {
        // 가장 덜 사용되는 키워드 제거
        const leastUsed = this._findLeastUsedKeywords(
          feedbacks,
          pattern.keywords,
          Math.ceil(pattern.keywords.length * 0.1)
        );
        removedKeywords.push(...leastUsed);
      }
    }

    // 2. 수정된 피드백에서 새로운 키워드 추출
    const modifiedFeedbacks = feedbacks.filter(
      (fb) => fb.userFeedback.action === 'modify'
    );

    if (modifiedFeedbacks.length > 0) {
      // 수정 메시지에서 새로운 키워드 추출
      const extractedKeywords = this._extractKeywordsFromFeedback(
        modifiedFeedbacks
      );
      newKeywords.push(
        ...extractedKeywords.filter(
          (kw) => !pattern.keywords.includes(kw) && kw.length > 1
        )
      );
    }

    // 3. 신뢰도 부스트 계산
    if (stats.approvalRate > 0.8) {
      confidenceBoost = 0.15; // 매우 좋음
    } else if (stats.approvalRate > 0.6) {
      confidenceBoost = 0.1; // 좋음
    } else if (stats.approvalRate < 0.3) {
      confidenceBoost = -0.1; // 나쁨 (페널티)
    }

    // 4. 업데이트 필요 여부 판단
    if (newKeywords.length === 0 && removedKeywords.length === 0 &&
        confidenceBoost === 0) {
      return null;
    }

    return {
      operation,
      newKeywords,
      removedKeywords,
      confidenceBoost,
      timestamp: Date.now(),
      feedbackCount: feedbacks.length,
    };
  }

  /**
   * 가장 덜 사용된 키워드 찾기
   */
  private _findLeastUsedKeywords(
    feedbacks: FeedbackEntry[],
    keywords: string[],
    count: number
  ): string[] {
    const keywordUsage = new Map<string, number>();

    keywords.forEach((kw) => {
      keywordUsage.set(kw, 0);
    });

    feedbacks.forEach((fb) => {
      keywords.forEach((kw) => {
        if (fb.metadata.tags?.includes(kw)) {
          keywordUsage.set(kw, (keywordUsage.get(kw) || 0) + 1);
        }
      });
    });

    return Array.from(keywordUsage.entries())
      .sort((a, b) => a[1] - b[1])
      .slice(0, count)
      .map(([kw]) => kw);
  }

  /**
   * 피드백 메시지에서 키워드 추출
   */
  private _extractKeywordsFromFeedback(
    feedbacks: FeedbackEntry[]
  ): string[] {
    const keywords: string[] = [];
    const seenKeywords = new Set<string>();

    feedbacks.forEach((fb) => {
      if (fb.userFeedback.message) {
        // 길이 2 이상의 연속 단어 추출
        const words = fb.userFeedback.message
          .split(/[\s,!?\.]+/)
          .filter((w) => w.length >= 2);

        words.forEach((word) => {
          if (!seenKeywords.has(word)) {
            keywords.push(word);
            seenKeywords.add(word);
          }
        });
      }
    });

    return keywords;
  }

  /**
   * 업데이트 히스토리 기록
   */
  private _recordUpdate(operation: string, update: PatternUpdate): void {
    if (!this.patternHistory.has(operation)) {
      this.patternHistory.set(operation, []);
    }
    this.patternHistory.get(operation)!.push(update);
  }

  /**
   * 패턴 통계 조회
   */
  getPatternStats(operation?: string): PatternStats[] {
    if (operation) {
      const stat = this.patternStats.get(operation);
      return stat ? [stat] : [];
    }
    return Array.from(this.patternStats.values());
  }

  /**
   * 패턴 업데이트 히스토리 조회
   */
  getUpdateHistory(operation?: string): PatternUpdate[] {
    if (operation) {
      return this.patternHistory.get(operation) || [];
    }

    const allUpdates: PatternUpdate[] = [];
    this.patternHistory.forEach((updates) => {
      allUpdates.push(...updates);
    });
    return allUpdates;
  }

  /**
   * 개선이 필요한 Operation 식별
   */
  getOperationsNeedingImprovement(
    approvalThreshold: number = 0.6
  ): string[] {
    return Array.from(this.patternStats.entries())
      .filter(([_, stats]) => stats.approvalRate < approvalThreshold)
      .map(([op, _]) => op);
  }

  /**
   * 패턴 성능 요약
   */
  generateSummary(): string {
    let summary = '\n';
    summary += '╔════════════════════════════════════════════════════╗\n';
    summary += '║         📚 Pattern Updater Summary                 ║\n';
    summary += '╚════════════════════════════════════════════════════╝\n\n';

    summary += `총 패턴: ${this.patternStats.size}\n`;
    summary += `업데이트 기록: ${this.patternHistory.size} operations\n\n`;

    summary += '🔧 패턴 상태:\n';
    for (const [op, stats] of this.patternStats.entries()) {
      const status =
        stats.approvalRate > 0.8
          ? '✅'
          : stats.approvalRate > 0.6
            ? '⚠️ '
            : '❌';

      summary += `  ${status} ${op}: ${(stats.approvalRate * 100).toFixed(1)}% 승인`;
      summary += ` (${stats.totalFeedback}개 피드백)\n`;
    }

    summary += '\n📈 개선 영역:\n';
    const needsImprovement = this.getOperationsNeedingImprovement();
    if (needsImprovement.length === 0) {
      summary += '  모든 패턴이 양호합니다 ✨\n';
    } else {
      needsImprovement.forEach((op) => {
        const stats = this.patternStats.get(op)!;
        summary += `  • ${op}: ${(stats.approvalRate * 100).toFixed(1)}% 승인\n`;
      });
    }

    return summary;
  }
}

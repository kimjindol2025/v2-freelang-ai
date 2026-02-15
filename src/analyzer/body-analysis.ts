/**
 * FreeLang v2 Phase 5 Task 4.2 - Function Body Analysis
 *
 * 함수 본체 코드를 분석하여 패턴을 감지합니다:
 * 1. 루프 감지 (for, while)
 * 2. 누적 패턴 (+=, -=, *=, /=)
 * 3. 메모리 사용 추정 (변수 선언)
 *
 * 분석 결과는 directive 결정에 사용됩니다.
 */

/**
 * 루프 분석 결과
 */
export interface LoopAnalysis {
  hasLoop: boolean;           // for/while 루프 존재
  loopCount: number;          // 루프 개수
  hasNestedLoop: boolean;     // 중첩 루프 존재
  isComplexLoop: boolean;     // O(n^2) 이상의 복잡도 추정
}

/**
 * 누적 패턴 분석 결과
 */
export interface AccumulationAnalysis {
  hasAccumulation: boolean;   // +=, -=, *= 등 누적 연산 존재
  operationTypes: string[];   // 누적 연산 타입 목록
  operationCount: number;     // 누적 연산 개수
  suggestsSpeed: boolean;     // "속도 우선" 지시어 제안 여부
}

/**
 * 메모리 사용 분석 결과
 */
export interface MemoryAnalysis {
  estimatedVariables: number; // 추정 변수 개수
  hasArrayDeclaration: boolean; // 배열 선언 존재
  hasComplexDataStructure: boolean; // 복잡한 자료구조
  suggestsMemory: boolean;    // "메모리 효율" 지시어 제안 여부
}

/**
 * 본체 분석 전체 결과
 */
export interface BodyAnalysisResult {
  loops: LoopAnalysis;
  accumulation: AccumulationAnalysis;
  memory: MemoryAnalysis;

  // 종합 판단
  suggestedDirective: 'speed' | 'memory' | 'safety';
  confidence: number;         // 분석 신뢰도 (0.0 ~ 1.0)
  details: string;            // 분석 상세 설명
}

/**
 * Body Pattern Analyzer
 *
 * 함수 본체 코드를 토큰 수준에서 분석
 */
export class BodyAnalyzer {
  private bodyTokens: string[];

  constructor(body: string) {
    // 본체를 토큰으로 분해 (공백 기준)
    this.bodyTokens = body
      .split(/\s+/)
      .filter(t => t.length > 0);
  }

  /**
   * 전체 분석 실행
   */
  public analyze(): BodyAnalysisResult {
    const loops = this.analyzeLoops();
    const accumulation = this.analyzeAccumulation();
    const memory = this.analyzeMemory();

    const suggestedDirective = this.decideDirect(loops, accumulation, memory);
    const confidence = this.calculateConfidence(loops, accumulation, memory);
    const details = this.generateDetails(loops, accumulation, memory);

    return {
      loops,
      accumulation,
      memory,
      suggestedDirective,
      confidence,
      details
    };
  }

  /**
   * Phase 5 Task 4.2a: 루프 감지
   */
  private analyzeLoops(): LoopAnalysis {
    const forCount = this.countKeyword('for');
    const whileCount = this.countKeyword('while');
    const hasLoop = forCount > 0 || whileCount > 0;
    const loopCount = forCount + whileCount;

    // 중첩 루프 감지: 같은 중괄호 깊이에 여러 루프가 있거나,
    // 루프 내에 루프가 있으면 중첩으로 판단
    const hasNestedLoop = this.detectNestedLoops();

    // 복잡도 추정: 중첩 루프 또는 여러 루프 = O(n^2)
    const isComplexLoop = hasNestedLoop || loopCount > 1;

    return {
      hasLoop,
      loopCount,
      hasNestedLoop,
      isComplexLoop
    };
  }

  /**
   * Phase 5 Task 4.2b: 누적 패턴 감지
   */
  private analyzeAccumulation(): AccumulationAnalysis {
    const operationTypes: string[] = [];
    let operationCount = 0;

    // 누적 연산 키워드
    const accumulationOps = ['+=', '-=', '*=', '/=', '%='];

    for (const op of accumulationOps) {
      const count = this.countKeyword(op);
      if (count > 0) {
        operationTypes.push(op);
        operationCount += count;
      }
    }

    const hasAccumulation = operationCount > 0;

    // 누적 연산이 있으면 "속도 우선" 제안
    // (루프 내 누적 = 성능 최적화 필요)
    const suggestsSpeed = hasAccumulation;

    return {
      hasAccumulation,
      operationTypes,
      operationCount,
      suggestsSpeed
    };
  }

  /**
   * Phase 5 Task 4.2c (파트 1): 메모리 사용 추정
   */
  private analyzeMemory(): MemoryAnalysis {
    // 변수 선언: let, const 키워드 개수
    const letCount = this.countKeyword('let');
    const constCount = this.countKeyword('const');
    const estimatedVariables = letCount + constCount;

    // 배열 선언 감지: [, push, pop 등 배열 메서드
    // - 정확한 토큰 매치: 'push', 'pop' 등
    // - 포함 감지: '[' 문자가 있는 모든 토큰 ([1, [a], arr[0] 등)
    const arrayKeywords = ['push', 'pop', 'shift', 'unshift'];
    const hasArrayDeclaration =
      arrayKeywords.some(kw => this.bodyTokens.includes(kw)) ||
      this.bodyTokens.some(t => t.includes('['));

    // 복잡한 자료구조: map, struct 등
    const complexKeywords = ['map', 'struct', 'HashMap', 'Vec', 'Array'];
    const hasComplexDataStructure = complexKeywords.some(kw =>
      this.countKeyword(kw) > 0
    );

    // 메모리 효율성 제안: 변수 많거나 복잡한 자료구조 또는 배열
    const suggestsMemory =
      estimatedVariables > 3 || hasComplexDataStructure || hasArrayDeclaration;

    return {
      estimatedVariables,
      hasArrayDeclaration,
      hasComplexDataStructure,
      suggestsMemory
    };
  }

  /**
   * 최종 Directive 결정
   */
  private decideDirect(
    loops: LoopAnalysis,
    accumulation: AccumulationAnalysis,
    memory: MemoryAnalysis
  ): 'speed' | 'memory' | 'safety' {
    // 우선순위:
    // 1. (루프 AND 누적) OR 복잡한 루프 → "speed" (루프 최적화 필요)
    // 2. 복잡한 메모리 사용 → "memory"
    // 3. 기본값 → "safety"

    // 루프와 누적 연산이 함께 있거나, 복잡한 루프 구조
    const needsSpeed =
      (loops.hasLoop && accumulation.hasAccumulation) ||
      loops.isComplexLoop;

    if (needsSpeed) {
      return 'speed';
    }

    if (memory.suggestsMemory) {
      return 'memory';
    }

    return 'safety';
  }

  /**
   * 신뢰도 계산
   */
  private calculateConfidence(
    loops: LoopAnalysis,
    accumulation: AccumulationAnalysis,
    memory: MemoryAnalysis
  ): number {
    let confidence = 0.6; // 기본 신뢰도 60%

    // 루프 감지: +20%
    if (loops.hasLoop) confidence += 0.2;

    // 누적 패턴: +10%
    if (accumulation.hasAccumulation) confidence += 0.1;

    // 메모리 사용 명확: +10%
    if (memory.suggestsMemory) confidence += 0.1;

    return Math.min(confidence, 1.0); // Max 100%
  }

  /**
   * 분석 상세 설명 생성
   */
  private generateDetails(
    loops: LoopAnalysis,
    accumulation: AccumulationAnalysis,
    memory: MemoryAnalysis
  ): string {
    const parts: string[] = [];

    if (loops.hasLoop) {
      parts.push(`${loops.loopCount}개 루프`);
      if (loops.hasNestedLoop) parts.push('(중첩)');
    }

    if (accumulation.hasAccumulation) {
      parts.push(`누적 연산: ${accumulation.operationTypes.join(', ')}`);
    }

    if (memory.estimatedVariables > 0) {
      parts.push(`~${memory.estimatedVariables}개 변수`);
    }

    if (memory.hasArrayDeclaration) {
      parts.push('배열 사용');
    }

    return parts.join(', ') || '기본 패턴';
  }

  /**
   * Helper: 키워드 개수 세기
   */
  private countKeyword(keyword: string): number {
    return this.bodyTokens.filter(t => t === keyword).length;
  }

  /**
   * Helper: 중첩 루프 감지
   *
   * 간단한 휴리스틱: for/while이 여러 개이고, 중괄호가 2개 이상 있으면
   * 중첩 루프로 판단
   */
  private detectNestedLoops(): boolean {
    const loopCount = this.countKeyword('for') + this.countKeyword('while');
    const braceCount = (this.bodyTokens.join('').match(/{/g) || []).length;

    // 루프가 2개 이상이고, 중괄호가 깊으면 중첩으로 판단
    return loopCount >= 2 && braceCount >= 2;
  }
}

/**
 * 본체 분석 래퍼 함수
 */
export function analyzeBody(body: string): BodyAnalysisResult {
  const analyzer = new BodyAnalyzer(body);
  return analyzer.analyze();
}

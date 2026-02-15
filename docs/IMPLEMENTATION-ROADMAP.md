# FreeLang v2 - 구현 로드맵 (다른 Claude용)

## 📍 현재 상태

- **설계**: ✅ 완료 (4개 문서 작성)
- **철학**: ✅ 확정 (자동 헤더 생성 + AI 피드백 루프)
- **아키텍처**: ✅ 확정 (ARCHITECTURE-V2-UPDATED.md)
- **구현**: ⏳ 대기

---

## 🎯 전체 구현 계획 (총 7주)

```
Week 1: 자동 헤더 생성 엔진 (기반)
Week 2: 헤더 검증 + 코드 생성 (통합)
Week 3: 피드백 수집 시스템 (인터페이스)
Week 4: 학습 엔진 (지능화)
Week 5: 통합 테스트 (안정화)
Week 6: 성능 최적화 + 문서화
Week 7: 프로덕션 준비 + 배포
```

**총 예상 LOC**: 4,500~5,000

---

## 📅 Week 1: 자동 헤더 생성 엔진 기반

### Goal
**입력 → 자동 헤더 생성 파이프라인 완성**

### Tasks

#### Task 1.1: 의도 패턴 DB 작성
- **파일**: `src/automatic-header-engine/patterns.db.ts`
- **내용**:
  ```typescript
  export const INTENT_PATTERNS = {
    sum: {
      keywords: ["합산", "더하기", "sum", "addition", "합"],
      input_type: "array<number>",
      output_type: "number",
      default_reason: "통계 연산 기초",
      default_directive: "메모리 효율성 우선",
      priority: 1
    },
    // avg, max, min, filter, sort 등...
  };

  export const CONFIDENCE_WEIGHTS = {
    pattern_match: 0.4,
    type_inference: 0.3,
    intent_clarity: 0.2,
    similarity: 0.1
  };
  ```
- **LOC**: ~200
- **Checklist**:
  - [ ] 6개 기본 operations 정의
  - [ ] 신뢰도 가중치 정의
  - [ ] Reason 기본값 정의
  - [ ] Directive 옵션 정의

#### Task 1.2: 텍스트 정규화 (Normalizer)
- **파일**: `src/automatic-header-engine/TextNormalizer.ts`
- **기능**:
  ```typescript
  normalize(input: string): string[] {
    // 1. 공백 정리
    // 2. 특수문자 제거
    // 3. 한글/영문 분리
    // 4. 토큰화
    // 결과: ["배열", "더하기"]
  }
  ```
- **LOC**: ~100
- **Test Cases**:
  - [ ] "  배열  더하기  " → ["배열", "더하기"]
  - [ ] "배열 더하기! @#$" → ["배열", "더하기"]
  - [ ] "sum([1,2,3])" → ["sum", "1", "2", "3"]

#### Task 1.3: 의도 매칭 (IntentMatcher)
- **파일**: `src/automatic-header-engine/IntentMatcher.ts`
- **기능**:
  ```typescript
  matchIntent(tokens: string[]): {
    operation: string,
    confidence: number,
    alternatives: string[]
  } {
    // 패턴 DB에서 매칭
    // 한 개 매칭 → operation 반환
    // 여러 개 매칭 → 가장 확률 높은 것 + alternatives
    // 미매칭 → null
  }
  ```
- **LOC**: ~150
- **Test Cases**:
  - [ ] ["배열", "더하기"] → sum (100% 신뢰도)
  - [ ] ["수열", "합"] → sum (90% 신뢰도, avg 후보)
  - [ ] ["random", "text"] → null

#### Task 1.4: 타입 추론 (TypeInference)
- **파일**: `src/automatic-header-engine/TypeInference.ts`
- **기능**:
  ```typescript
  inferTypes(operation: string): {
    input_type: string,
    output_type: string,
    confidence: number
  } {
    // 규칙:
    // - sum/avg/max/min → input: array<number>, output: number
    // - filter → input: array<number>, output: array<number>
    // - sort → input: array<number>, output: array<number>
  }
  ```
- **LOC**: ~120
- **Rules**:
  - [ ] sum/avg/max/min → array<number> → number
  - [ ] filter → array<number> → array<number>
  - [ ] sort → array<number> → array<number>

#### Task 1.5: Reason 추론 (ReasonInferencer)
- **파일**: `src/automatic-header-engine/ReasonInferencer.ts`
- **기능**:
  ```typescript
  inferReason(operation: string): string {
    // DB에서 operation별 default reason 반환
    // sum → "통계 연산 기초"
    // avg → "데이터 분석 핵심"
    // 등...
  }
  ```
- **LOC**: ~80

#### Task 1.6: Directive 결정 (DirectiveDecider)
- **파일**: `src/automatic-header-engine/DirectiveDecider.ts`
- **기능**:
  ```typescript
  decideDirective(operation: string, types: TypeInfo): string {
    // 규칙:
    // - 배열 연산 + 많은 데이터 → "속도 우선"
    // - 배열 연산 + 적은 데이터 → "메모리 효율성 우선"
    // - 기본 → "안정성 우선"
  }
  ```
- **LOC**: ~90

#### Task 1.7: 헤더 생성 (HeaderBuilder)
- **파일**: `src/automatic-header-engine/HeaderBuilder.ts`
- **기능**:
  ```typescript
  buildHeader(
    operation: string,
    input_type: string,
    output_type: string,
    reason: string,
    directive: string
  ): string {
    // 템플릿 적용
    return `fn ${operation}: ${input_type} → ${output_type}
            ~ "${reason}"
            reason: "${reason}"
            directive: "${directive}"`;
  }
  ```
- **LOC**: ~60

#### Task 1.8: 신뢰도 계산 (ConfidenceCalculator)
- **파일**: `src/automatic-header-engine/ConfidenceCalculator.ts`
- **기능**:
  ```typescript
  calculateConfidence(
    pattern_match_score: number,
    type_inference_score: number,
    intent_clarity_score: number,
    similarity_score: number
  ): number {
    // 가중합
    return (pattern_match × 0.4) +
           (type_inference × 0.3) +
           (intent_clarity × 0.2) +
           (similarity × 0.1);
  }
  ```
- **LOC**: ~50

#### Task 1.9: AutoHeaderEngine 메인 (Orchestrator)
- **파일**: `src/automatic-header-engine/AutoHeaderEngine.ts`
- **기능**:
  ```typescript
  async generateHeader(userInput: string): Promise<HeaderProposal> {
    // 1-7 단계 통합
    // 결과: { header, confidence, alternatives }
  }
  ```
- **LOC**: ~150

### Week 1 총 LOC: ~1,000

---

## 📅 Week 2: 헤더 검증 + 코드 생성 통합

### Goal
**제안된 헤더 검증 및 C 코드 생성**

### Tasks

#### Task 2.1: 헤더 파서 (HeaderParser)
- **파일**: `src/header-contract/HeaderParser.ts`
- **기능**: 헤더 문자열을 객체로 파싱
- **LOC**: ~150
- **Test**:
  - [ ] 정상 헤더 파싱
  - [ ] 누락된 필드 감지
  - [ ] 타입 오류 감지

#### Task 2.2: 헤더 검증기 (HeaderValidator)
- **파일**: `src/header-contract/HeaderValidator.ts`
- **기능**:
  - 구문 검증
  - 타입 검증
  - 의도 명확성 검증
  - 컨텍스트 검증
- **LOC**: ~200
- **Test**:
  - [ ] 유효한 헤더 통과
  - [ ] 무효한 헤더 거부 (명확한 에러)

#### Task 2.3: 코드 생성기 (CGenerator)
- **파일**: `src/codegen/CGenerator.ts`
- **기능**:
  - v1의 코드 생성 로직 이식
  - Directive에 따라 알고리즘 선택
  - 템플릿 기반 코드 생성
- **LOC**: ~400 (v1 코드 이식 + 수정)
- **Test**:
  - [ ] sum 함수 생성 테스트
  - [ ] average 함수 생성 테스트
  - [ ] filter 함수 생성 테스트

#### Task 2.4: 알고리즘 선택기 (AlgorithmSelector)
- **파일**: `src/codegen/AlgorithmSelector.ts`
- **기능**:
  ```typescript
  selectAlgorithm(
    operation: string,
    directive: string
  ): Algorithm {
    // Directive에 따라 선택
    // "메모리 효율성 우선" → single pass
    // "속도 우선" → 캐싱/병렬화
    // "안정성 우선" → 검증 강화
  }
  ```
- **LOC**: ~100

#### Task 2.5: 코드 템플릿 (CodeTemplate)
- **파일**: `src/codegen/CodeTemplate.ts`
- **기능**: 각 operation별 C 코드 템플릿
- **LOC**: ~300
- **포함 사항**:
  - sum 템플릿
  - average 템플릿
  - max/min 템플릿
  - filter 템플릿
  - sort 템플릿

#### Task 2.6: 안전성 검사 (SafetyChecker)
- **파일**: `src/codegen/SafetyChecker.ts`
- **기능**:
  - 배열 범위 검사
  - NULL 포인터 검사
  - 메모리 오버플로우 검사
- **LOC**: ~150
- **Test**:
  - [ ] 빈 배열 처리
  - [ ] 음수 인덱스 처리
  - [ ] 메모리 할당 실패 처리

### Week 2 총 LOC: ~1,300

---

## 📅 Week 3: 피드백 수집 시스템

### Goal
**AI 피드백 입력 및 저장 시스템**

### Tasks

#### Task 3.1: 피드백 수집기 (FeedbackCollector)
- **파일**: `src/feedback/FeedbackCollector.ts`
- **기능**:
  ```typescript
  async collectFeedback(proposal: HeaderProposal): Promise<FeedbackEntry> {
    // 4가지 선택지 제시:
    // [✅ 승인] [✏️ 수정] [🔄 재제안] [❌ 취소]
    // AI 응답 대기
  }
  ```
- **LOC**: ~120

#### Task 3.2: 피드백 저장소 (FeedbackStorage)
- **파일**: `src/feedback/FeedbackStorage.ts`
- **기능**:
  - SQLite/JSON 저장
  - 피드백 조회
  - 통계 계산
- **LOC**: ~150
- **Schema**:
  - [ ] sessions
  - [ ] feedback
  - [ ] patterns
  - [ ] metadata

#### Task 3.3: 피드백 분석기 (FeedbackAnalyzer)
- **파일**: `src/feedback/FeedbackAnalyzer.ts`
- **기능**:
  - 피드백 패턴 분석
  - 신뢰도 추이 분석
  - 개선 영역 식별
- **LOC**: ~100

#### Task 3.4: 대화형 CLI (InteractiveMode)
- **파일**: `src/cli/InteractiveMode.ts`
- **기능**:
  ```
  > 입력: 배열 더하기

  제안 헤더:
  fn sum: array<number> → number
  ~ "배열의 모든 수를 더하기"
  reason: "통계 연산 기초"
  directive: "메모리 효율성 우선"
  신뢰도: 95% ✅

  [1] 승인  [2] 수정  [3] 재제안  [4] 취소
  > _
  ```
- **LOC**: ~200

#### Task 3.5: 배치 모드 (BatchMode)
- **파일**: `src/cli/BatchMode.ts`
- **기능**: 여러 입력 한번에 처리
- **LOC**: ~80

### Week 3 총 LOC: ~650

---

## 📅 Week 4: 학습 엔진

### Goal
**피드백 기반 자동 학습 및 개선**

### Tasks

#### Task 4.1: 패턴 업데이터 (PatternUpdater)
- **파일**: `src/learning/PatternUpdater.ts`
- **기능**:
  ```typescript
  // Level 1: 직접 학습
  updateDirectPattern(input: string, feedback: string): void {
    // "배열 + 더하기" 신뢰도 증가
  }

  // Level 2: 간접 학습
  updateRelatedPatterns(input: string, feedback: string): void {
    // 유사한 패턴들도 영향 받음
  }

  // Level 3: 메타 학습
  updateMetaPatterns(input: string, feedback: string): void {
    // 메타 패턴 형성
  }
  ```
- **LOC**: ~200

#### Task 4.2: 신뢰도 업데이터 (ConfidenceUpdater)
- **파일**: `src/learning/ConfidenceUpdater.ts`
- **기능**:
  - 신뢰도 점진적 증가 (70% → 98%)
  - 신뢰도 감소 (틀린 제안)
  - 신뢰도 리셋 (새로운 패턴)
- **LOC**: ~120
- **Algorithm**:
  ```
  승인: confidence *= 1.02  // 2% 증가
  수정: confidence *= 0.98  // 2% 감소
  거부: confidence *= 0.95  // 5% 감소
  ```

#### Task 4.3: 메타 러너 (MetaLearner)
- **파일**: `src/learning/MetaLearner.ts`
- **기능**:
  - 패턴들 사이의 관계 분석
  - 메타 패턴 자동 형성
  - 예측 정확도 향상
- **LOC**: ~150

#### Task 4.4: 학습 엔진 메인 (LearningEngine)
- **파일**: `src/learning/LearningEngine.ts`
- **기능**:
  ```typescript
  async learnFromFeedback(entry: FeedbackEntry): Promise<void> {
    this.updateDirectPattern(...);
    this.updateRelatedPatterns(...);
    this.updateMetaPatterns(...);
    this.updateConfidence(...);
  }
  ```
- **LOC**: ~100

### Week 4 총 LOC: ~570

---

## 📅 Week 5: 통합 테스트

### Goal
**전체 파이프라인 테스트 및 안정화**

### Tasks

#### Task 5.1: 단위 테스트 (Unit Tests)
- **파일**: `test/unit/**`
- **범위**:
  - [ ] AutoHeaderEngine
  - [ ] HeaderValidator
  - [ ] CGenerator
  - [ ] FeedbackCollector
  - [ ] LearningEngine
- **LOC**: ~400

#### Task 5.2: 통합 테스트 (Integration Tests)
- **파일**: `test/integration/**`
- **시나리오**:
  - [ ] 정상 플로우: 입력 → 헤더 생성 → 승인 → 코드 생성
  - [ ] 수정 플로우: 입력 → 헤더 생성 → 수정 → 코드 생성
  - [ ] 학습 플로우: 여러 피드백 → 신뢰도 증가
- **LOC**: ~300

#### Task 5.3: E2E 테스트 (End-to-End Tests)
- **파일**: `test/e2e/**`
- **시나리오**:
  - [ ] "배열 더하기" → sum 함수 생성 → 컴파일 성공
  - [ ] "배열 평균" → average 함수 생성 → 컴파일 성공
  - [ ] "배열 필터링" → filter 함수 생성 → 컴파일 성공
- **LOC**: ~200

#### Task 5.4: 성능 테스트 (Performance Tests)
- **파일**: `test/performance/**`
- **메트릭**:
  - [ ] 헤더 생성 시간 < 100ms
  - [ ] 코드 생성 시간 < 500ms
  - [ ] 학습 시간 < 50ms
- **LOC**: ~100

#### Task 5.5: 버그 수정 & 최적화
- **기간**: Week 5 전체
- **대상**:
  - 테스트 실패 사항 수정
  - 성능 병목 최적화
  - 메모리 누수 방지

### Week 5 총 LOC: ~1,000 (테스트 코드)

---

## 📅 Week 6: 성능 최적화 + 문서화

### Tasks

#### Task 6.1: 성능 최적화
- 패턴 DB 인메모리 캐싱
- 신뢰도 계산 최적화
- 코드 생성 템플릿 사전 컴파일

#### Task 6.2: API 문서 작성
- OpenAPI/Swagger 스펙
- 각 모듈별 주석

#### Task 6.3: 사용 가이드 작성
- 사용자 가이드 (AI용)
- 개발자 가이드
- 문제 해결 가이드

#### Task 6.4: 학습 로그 분석
- 신뢰도 추이 그래프
- 피드백 통계
- 개선 방향 제시

### Week 6 총 LOC: ~200 (코드) + ~1,000 (문서)

---

## 📅 Week 7: 프로덕션 준비 + 배포

### Tasks

#### Task 7.1: 최종 검증
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료
- [ ] 성능 목표 달성
- [ ] 문서 완성

#### Task 7.2: Gogs 배포
- [ ] 코드 커밋 및 푸시
- [ ] 릴리스 노트 작성
- [ ] 태그 생성 (v2.0.0-beta)

#### Task 7.3: CI/CD 설정
- GitHub Actions (또는 Gogs Webhook)
- 자동 테스트
- 자동 배포

#### Task 7.4: 모니터링 설정
- 로그 수집
- 메트릭 수집
- 알림 설정

### Week 7 총 LOC: ~300

---

## 📊 전체 요약

```
Week 1: 자동 헤더 생성 엔진      1,000 LOC
Week 2: 헤더 검증 + 코드 생성    1,300 LOC
Week 3: 피드백 수집 시스템        650 LOC
Week 4: 학습 엔진                570 LOC
Week 5: 통합 테스트             1,000 LOC (테스트)
Week 6: 최적화 + 문서화         1,200 LOC (문서)
Week 7: 프로덕션 준비             300 LOC

총합: ~6,000 LOC
```

---

## 🔧 개발 환경

```bash
# 필수
- Node.js 18+
- TypeScript 5.x
- npm 9+

# 선택
- Docker (배포용)
- PostgreSQL/SQLite (피드백 저장소)
- Jest (테스트)

# 설정
npm install
npm run build
npm test
npm run dev
```

---

## 📋 구현 체크리스트

### Week 1
- [ ] 패턴 DB 완성
- [ ] 텍스트 정규화 완성
- [ ] 의도 매칭 완성
- [ ] 타입 추론 완성
- [ ] 헤더 생성 완성
- [ ] 신뢰도 계산 완성
- [ ] AutoHeaderEngine 테스트 통과

### Week 2
- [ ] 헤더 검증 완성
- [ ] 코드 생성 완성
- [ ] 알고리즘 선택 완성
- [ ] 안전성 검사 완성
- [ ] CGenerator 테스트 통과

### Week 3
- [ ] 피드백 수집 완성
- [ ] 저장소 설정 완성
- [ ] 대화형 CLI 완성
- [ ] 초기 피드백 수집 테스트

### Week 4
- [ ] 패턴 학습 완성
- [ ] 신뢰도 업데이트 완성
- [ ] 메타 학습 완성
- [ ] 학습 효과 검증

### Week 5
- [ ] 모든 단위 테스트 통과
- [ ] 모든 통합 테스트 통과
- [ ] 모든 E2E 테스트 통과
- [ ] 성능 목표 달성

### Week 6
- [ ] 성능 최적화 완료
- [ ] 모든 문서 작성 완료
- [ ] API 문서 완성
- [ ] 사용 가이드 완성

### Week 7
- [ ] 최종 검증 완료
- [ ] Gogs 배포 완료
- [ ] CI/CD 설정 완료
- [ ] 모니터링 설정 완료

---

## 🎯 성공 기준

```
✅ 모든 테스트 통과 (100%)
✅ 코드 커버리지 > 80%
✅ 헤더 생성 시간 < 100ms
✅ 코드 생성 시간 < 500ms
✅ 초기 신뢰도 70~80%
✅ 1주일 후 신뢰도 85~90%
✅ 1개월 후 신뢰도 95%+
✅ 모든 문서 완성
✅ Gogs 배포 완료
✅ 프로덕션 준비 완료
```

---

**Last Updated**: 2026-02-15
**Author**: Claude (Design)
**Status**: 구현 대기, 다른 Claude의 작업 시작 바람

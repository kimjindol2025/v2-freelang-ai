# FreeLang v2 - 최종 아키텍처 (자동 헤더 생성 통합)

## 🏗️ 전체 시스템 아키텍처

```
┌──────────────────────────────────────────────────────────────┐
│                    AI-First 언어 v2 (통합)                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Level 0: 자유 입력 (AI가 뭐든 입력)               │    │
│  │  - "배열 더하기"                                    │    │
│  │  - "sum([1,2,3])"                                   │    │
│  │  - "배열 합산"                                      │    │
│  │  규칙: 없음, 형식: 없음                             │    │
│  └────────────────┬──────────────────────────────────┘    │
│                   ▼                                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Layer 1: 자동 헤더 생성 엔진                       │    │
│  │  ┌────────────────────────────────────────────┐    │    │
│  │  │ 1. 텍스트 정규화 (Normalization)           │    │    │
│  │  │ 2. 의도 패턴 매칭 (Intent Matching)       │    │    │
│  │  │ 3. 타입 추론 (Type Inference)             │    │    │
│  │  │ 4. Reason 추론 (Business Priority)       │    │    │
│  │  │ 5. Directive 결정 (Optimization)         │    │    │
│  │  │ 6. 헤더 생성 (Header Generation)         │    │    │
│  │  │ 7. 신뢰도 계산 (Confidence Score)        │    │    │
│  │  └─────────────┬──────────────────────────┘    │    │
│  └────────────────┼──────────────────────────────┘    │
│                   ▼                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Level 1: 헤더 제안 + AI 피드백                    │    │
│  │  ┌────────────────────────────────────────────┐    │    │
│  │  │ 제안 헤더:                                 │    │    │
│  │  │ fn sum: array<number> → number            │    │    │
│  │  │ ~ "배열의 모든 수를 더하기"               │    │    │
│  │  │ reason: "통계 연산 기초"                  │    │    │
│  │  │ directive: "메모리 효율성 우선"           │    │    │
│  │  │ 신뢰도: 95% ✅                            │    │    │
│  │  │                                            │    │    │
│  │  │ [✅ 승인] [✏️ 수정] [🔄 재제안] [❌ 취소] │    │    │
│  │  └─────────────┬──────────────────────────┘    │    │
│  └────────────────┼──────────────────────────────┘    │
│                   │                                     │
│       ┌───────────┼───────────┐                        │
│       ▼           ▼           ▼                        │
│    ✅ 승인    ✏️ 수정    🔄 재제안                  │
│       │           │           │                        │
│       └───────────┼───────────┘                        │
│                   ▼                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Layer 2: 헤더 계약 시스템 (Header Contract)       │    │
│  │  ┌────────────────────────────────────────────┐    │    │
│  │  │ 최종 헤더 (확정됨):                        │    │    │
│  │  │ fn sum: array<number> → number            │    │    │
│  │  │ ~ "배열의 모든 수를 더하기"               │    │    │
│  │  │ reason: "통계 연산 기초"                  │    │    │
│  │  │ directive: "메모리 효율성 우선"           │    │    │
│  │  │                                            │    │    │
│  │  │ ✅ 헤더 계약 확정                          │    │    │
│  │  │ ✅ 검증 (타입, 의도)                      │    │    │
│  │  │ ✅ 코드 생성 준비                         │    │    │
│  │  └─────────────┬──────────────────────────┘    │    │
│  └────────────────┼──────────────────────────────┘    │
│                   ▼                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Layer 3: 코드 자동 생성 (CodeGen)                 │    │
│  │  ┌────────────────────────────────────────────┐    │    │
│  │  │ 1. Reason 기반 최적화 선택                 │    │    │
│  │  │ 2. Directive 기반 알고리즘 선택            │    │    │
│  │  │ 3. C 코드 템플릿 생성                      │    │    │
│  │  │    - 초기화 (Initialization)              │    │    │
│  │  │    - 반복문 (Loop)                        │    │    │
│  │  │    - 검증 (Validation)                    │    │    │
│  │  │    - 메모리 관리 (Memory)                 │    │    │
│  │  │ 4. 완벽한 C 코드 생성                      │    │    │
│  │  └─────────────┬──────────────────────────┘    │    │
│  └────────────────┼──────────────────────────────┘    │
│                   ▼                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Layer 4: 컴파일 + 검증 (Compile & Verify)        │    │
│  │  ┌────────────────────────────────────────────┐    │    │
│  │  │ 1. gcc 컴파일                              │    │    │
│  │  │ 2. 구문 검증                               │    │    │
│  │  │ 3. 타입 안전성 검증                        │    │    │
│  │  │ 4. 메모리 안전성 검증                      │    │    │
│  │  └─────────────┬──────────────────────────┘    │    │
│  └────────────────┼──────────────────────────────┘    │
│                   ▼                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Level 2: 피드백 학습 (Feedback Learning)          │    │
│  │  ┌────────────────────────────────────────────┐    │    │
│  │  │ 피드백 저장:                               │    │    │
│  │  │ - 입력-제안-피드백 조합                    │    │    │
│  │  │ - 신뢰도 개선 기록                        │    │    │
│  │  │                                            │    │    │
│  │  │ 패턴 학습:                                 │    │    │
│  │  │ - "배열 + 더하기" 신뢰도 증가              │    │    │
│  │  │ - 유사 패턴도 영향 받음 (간접 학습)       │    │    │
│  │  │ - 메타 패턴 형성 (학습의 학습)            │    │    │
│  │  └─────────────┬──────────────────────────┘    │    │
│  └────────────────┼──────────────────────────────┘    │
│                   ▼                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  출력: 완벽한 C 코드 (Production-Ready)           │    │
│  │  double sum(double* arr, int len) {               │    │
│  │    double result = 0;                             │    │
│  │    if (len == 0) return 0;                        │    │
│  │    for (int i = 0; i < len; i++) {               │    │
│  │      result += arr[i];                           │    │
│  │    }                                              │    │
│  │    return result;                                │    │
│  │  }                                                │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 컴포넌트 상세 정의

### Component 1: 자동 헤더 생성 엔진

```typescript
// src/automatic-header-engine/AutoHeaderEngine.ts
class AutoHeaderEngine {
  // Step 1-7: 입력 → 헤더 생성
  async generateHeader(userInput: string): Promise<HeaderProposal> {
    1. const normalized = this.normalize(userInput);
    2. const intent = this.matchIntent(normalized);
    3. const types = this.inferTypes(intent);
    4. const reason = this.inferReason(intent);
    5. const directive = this.decideDirective(intent, types);
    6. const header = this.generateHeader(intent, types, reason, directive);
    7. const confidence = this.calculateConfidence(...);

    return { header, confidence, alternatives };
  }

  private normalize(input: string): string[] { ... }
  private matchIntent(tokens: string[]): Intent { ... }
  private inferTypes(intent: Intent): TypeInfo { ... }
  private inferReason(intent: Intent): string { ... }
  private decideDirective(intent: Intent, types: TypeInfo): string { ... }
  private generateHeader(...): string { ... }
  private calculateConfidence(...): number { ... }
}
```

### Component 2: 헤더 계약 검증기

```typescript
// src/header-contract/HeaderValidator.ts
class HeaderValidator {
  // 확정된 헤더 검증
  async validateHeader(header: Header): Promise<ValidationResult> {
    // 1. 구문 검증
    const syntaxOk = this.validateSyntax(header);

    // 2. 타입 검증
    const typeOk = this.validateTypes(header);

    // 3. 의도 명확성 검증
    const intentOk = this.validateIntent(header);

    // 4. 컨텍스트 검증 (이전 패턴과 일치성)
    const contextOk = this.validateContext(header);

    return {
      isValid: syntaxOk && typeOk && intentOk && contextOk,
      errors: [...],
      warnings: [...]
    };
  }
}
```

### Component 3: 코드 생성기

```typescript
// src/codegen/CGenerator.ts
class CGenerator {
  async generateCode(header: Header): Promise<CCode> {
    // Directive에 따라 다른 알고리즘 선택
    const algorithm = this.selectAlgorithm(header.directive);

    // 템플릿 기반 코드 생성
    const code = this.applyTemplate(algorithm, header);

    // 메모리 안전성 추가
    const safeCode = this.addSafetyChecks(code);

    // 검증 로직 추가
    const validCode = this.addValidation(safeCode);

    return validCode;
  }
}
```

### Component 4: 피드백 수집기

```typescript
// src/feedback/FeedbackCollector.ts
class FeedbackCollector {
  async collectFeedback(proposal: HeaderProposal): Promise<FeedbackEntry> {
    // AI 피드백 대기
    const feedback = await this.waitForAIFeedback();

    // 피드백 저장
    const entry = {
      original_input: proposal.input,
      generated_header: proposal.header,
      ai_feedback: feedback.type,      // "approved" | "edited" | ...
      edited_header: feedback.header,  // 수정된 경우
      confidence_before: proposal.confidence,
      confidence_after: ?,
      timestamp: new Date()
    };

    // 저장소에 기록
    await this.database.save(entry);

    return entry;
  }
}
```

### Component 5: 학습 엔진

```typescript
// src/learning/LearningEngine.ts
class LearningEngine {
  // 피드백으로부터 학습
  async learnFromFeedback(entry: FeedbackEntry): Promise<void> {
    // Level 1: 직접 학습
    this.updateDirectPattern(entry.original_input, entry.ai_feedback);

    // Level 2: 간접 학습
    this.updateRelatedPatterns(entry.original_input, entry.ai_feedback);

    // Level 3: 메타 학습
    this.updateMetaPatterns(entry.original_input, entry.ai_feedback);

    // 신뢰도 업데이트
    this.updateConfidence(entry);
  }

  private updateDirectPattern(...): void { ... }
  private updateRelatedPatterns(...): void { ... }
  private updateMetaPatterns(...): void { ... }
  private updateConfidence(...): void { ... }
}
```

---

## 🔄 데이터 흐름 (Sequence Diagram)

```
AI Input
  │
  ├─→ AutoHeaderEngine
  │   ├─→ normalize() "배열 더하기"
  │   ├─→ matchIntent() sum
  │   ├─→ inferTypes() array<number> → number
  │   ├─→ inferReason() "통계 연산 기초"
  │   ├─→ decideDirective() "메모리 효율성 우선"
  │   ├─→ generateHeader() fn sum: array<number> → number ~ "..."
  │   └─→ calculateConfidence() 95%
  │
  ├─→ HeaderProposal (제안)
  │   ├─→ 헤더
  │   ├─→ 신뢰도 (95%)
  │   └─→ 대안 (3개)
  │
  ├─→ AI 피드백 선택
  │   ├─→ ✅ 승인
  │   ├─→ ✏️ 수정
  │   ├─→ 🔄 재제안
  │   └─→ ❌ 취소
  │
  ├─→ HeaderValidator (검증)
  │   ├─→ 구문 검증 ✓
  │   ├─→ 타입 검증 ✓
  │   ├─→ 의도 검증 ✓
  │   └─→ 최종 승인 ✓
  │
  ├─→ CGenerator (코드 생성)
  │   ├─→ 알고리즘 선택
  │   ├─→ 템플릿 적용
  │   ├─→ 안전성 검사 추가
  │   └─→ 완벽한 C 코드
  │
  ├─→ 컴파일 + 검증
  │   ├─→ gcc 통과 ✓
  │   ├─→ 구문 검증 ✓
  │   ├─→ 타입 검증 ✓
  │   └─→ 메모리 검증 ✓
  │
  ├─→ FeedbackCollector (피드백 저장)
  │   └─→ 기록됨 ✓
  │
  └─→ LearningEngine (학습)
      ├─→ 직접 학습 (confidence++)
      ├─→ 간접 학습 (related patterns++)
      └─→ 메타 학습 (meta patterns++)
```

---

## 📁 프로젝트 파일 구조

```
v2-freelang-ai/
├── src/
│   ├── automatic-header-engine/
│   │   ├── AutoHeaderEngine.ts        # 자동 헤더 생성 메인
│   │   ├── TextNormalizer.ts          # 텍스트 정규화
│   │   ├── IntentMatcher.ts           # 의도 패턴 매칭
│   │   ├── TypeInference.ts           # 타입 추론
│   │   ├── ReasonInferencer.ts        # Reason 추론
│   │   ├── DirectiveDecider.ts        # Directive 결정
│   │   └── ConfidenceCalculator.ts    # 신뢰도 계산
│   │
│   ├── header-contract/
│   │   ├── HeaderValidator.ts         # 헤더 검증
│   │   ├── HeaderParser.ts            # 헤더 파싱
│   │   └── HeaderBuilder.ts           # 헤더 생성
│   │
│   ├── feedback/
│   │   ├── FeedbackCollector.ts       # 피드백 수집
│   │   ├── FeedbackStorage.ts         # 피드백 저장
│   │   └── FeedbackAnalyzer.ts        # 피드백 분석
│   │
│   ├── learning/
│   │   ├── LearningEngine.ts          # 학습 엔진
│   │   ├── PatternUpdater.ts          # 패턴 업데이트
│   │   ├── ConfidenceUpdater.ts       # 신뢰도 업데이트
│   │   └── MetaLearner.ts             # 메타 학습
│   │
│   ├── codegen/
│   │   ├── CGenerator.ts              # C 코드 생성 (v1 기반)
│   │   ├── AlgorithmSelector.ts       # 알고리즘 선택
│   │   ├── CodeTemplate.ts            # 코드 템플릿
│   │   └── SafetyChecker.ts           # 안전성 검사
│   │
│   ├── cli/
│   │   ├── CLI.ts                     # CLI 인터페이스
│   │   ├── InteractiveMode.ts         # 대화형 모드 (AI 피드백)
│   │   └── BatchMode.ts               # 배치 모드
│   │
│   └── utils/
│       ├── Logger.ts
│       ├── Database.ts                # 피드백 저장소
│       └── Config.ts
│
├── test/
│   ├── automatic-header-engine.test.ts
│   ├── feedback-loop.test.ts
│   ├── learning-engine.test.ts
│   └── integration.test.ts
│
├── docs/
│   ├── AUTO-HEADER-ENGINE.md          # 자동 헤더 엔진
│   ├── AI-FEEDBACK-LOOP.md            # AI 피드백 루프
│   ├── SPECIFICATION.md               # v2 스펙
│   ├── HEADER-CONTRACT.md             # 헤더 계약
│   ├── ARCHITECTURE-V2-UPDATED.md     # 이 문서
│   └── IMPLEMENTATION-ROADMAP.md      # 구현 로드맵
│
├── package.json
├── tsconfig.json
├── Makefile
└── README.md
```

---

## 🎯 데이터 저장소 구조

```typescript
// Database Schema

table_intentions:
{
  id: int,
  keyword: string,              // "더하기"
  operation: string,            // "sum"
  confidence: float,            // 0.95
  frequency: int,               // 몇 번 학습했나
  last_updated: timestamp
}

table_feedback:
{
  id: int,
  session_id: string,
  original_input: string,       // "배열 더하기"
  generated_header: string,     // fn sum: ...
  feedback_type: enum,          // "approved" | "edited" | "rejected"
  edited_header: string,        // AI가 수정한 경우
  confidence_before: float,     // 제안 신뢰도
  confidence_after: float,      // 학습 후 신뢰도
  timestamp: timestamp
}

table_patterns:
{
  id: int,
  pattern: string,              // "배열 + 더하기"
  operation: string,            // "sum"
  confidence: float,            // 누적 신뢰도
  frequency: int,               // 학습 횟수
  type: enum,                   // "direct" | "related" | "meta"
}
```

---

## 🚀 E2E 플로우 예시

### 사례 1: 초기 사용자 (신뢰도 낮음)

```
입력: "배열 더하기"
  ↓
제안: fn sum: array<number> → number
신뢰도: 70% ⚠️
대안:
  1. fn add: array<number> → number
  2. fn total: array<number> → number
  ↓
AI: "첫 번째로" (✅ 승인)
  ↓
코드 생성 → 컴파일 ✓
  ↓
학습: "배열 + 더하기 = sum (70% → 75%)"
```

### 사례 2: 경험 많은 사용자 (신뢰도 높음)

```
입력: "배열 더하기"
  ↓
제안: fn sum: array<number> → number
신뢰도: 97% ✅
메시지: "99% 확실합니다. 승인하시겠습니까?"
  ↓
AI: "응 맞아"
  ↓
즉시 코드 생성 (대안 표시 안 함)
  ↓
학습: "배열 + 더하기 = sum (97% → 98%)"
```

### 사례 3: 새로운 패턴 (메타 학습)

```
누적된 학습:
1. "배열 + 더하기" = sum (98%)
2. "배열 + 평균" = average (96%)
3. "배열 + 최대" = max (95%)
4. "배열 + 최소" = min (95%)
  ↓
메타 패턴 형성:
"배열 + <연산> = <연산 함수>"
  ↓
새로운 입력: "배열 곱하기"
  ↓
제안: fn multiply: array<number> → number (92% ← 메타 패턴!)
```

---

## 💡 v1 vs v2 아키텍처 비교

| 항목 | v1 (기존) | v2 (새로운) |
|------|---------|-----------|
| **입력** | 엄격한 문법 | 자유 텍스트 |
| **헤더** | 강제 | 자동 제안 |
| **검증** | 오류 메시지 | 피드백 선택 |
| **학습** | 수동 | 자동 (피드백 기반) |
| **진화** | 정적 | 동적 (누적 학습) |
| **AI 역할** | 학생 | 설계자 |
| **완성도** | 70% 고정 | 70% → 98% (진화) |

---

## 🎯 최종 특징

```
✅ 자유로운 입력
   AI가 "뭐든" 입력해도 작동

✅ 똑똑한 제안
   v2가 자동으로 헤더 생성 + 신뢰도 표시

✅ AI의 선택
   AI가 수정/승인을 주도적으로 결정

✅ 자동 학습
   매번 피드백이 저장되고 다음 제안을 개선

✅ 점진적 진화
   시간이 지날수록 정확도 증가 (70% → 98%)

✅ 완벽한 코드
   모든 단계를 거쳐 프로덕션 준비 완료
```

---

**Last Updated**: 2026-02-15
**Status**: 최종 아키텍처 확정, 구현 준비 완료

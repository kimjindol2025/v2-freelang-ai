# FreeLang v2 - AI-First Programming Language

> **AI가 완전히 주도**, **자유로운 입력**, **자동 학습**
>
> "AI는 학생이 아니라 설계자다"

---

## 🎯 핵심 철학

**"오류 = 기회"**

```
❌ 이전: AI가 오류 메시지를 읽고 배운다 (수동)
✅ 새로운: AI가 제안을 평가하고 피드백한다 (능동)
```

FreeLang v2는 AI를 위한 언어입니다.
- AI가 뭐든 입력해도 작동
- v2가 자동으로 헤더 제안
- AI가 선택/수정/피드백
- v2가 누적 학습해서 진화

---

## 🚀 3단계 아키텍처

### Stage 1: 자유 입력
```
AI: "배열 더하기"
또는: "sum([1,2,3])"
또는: "배열 합산"

규칙: 없음, 형식: 없음
```

### Stage 2: 자동 헤더 생성
```
v2가 자동으로:
1️⃣ 텍스트 분석
2️⃣ 의도 패턴 인식 (sum, avg, max, min 등)
3️⃣ 타입 추론 (array<number> → number)
4️⃣ Reason 추론 ("통계 연산 기초")
5️⃣ Directive 결정 ("메모리 효율성 우선")
6️⃣ 헤더 생성
7️⃣ 신뢰도 계산 (95%)

결과: 헤더 제안 + 신뢰도 점수
```

### Stage 3: AI 피드백
```
AI의 선택:
[✅ 승인] [✏️ 수정] [🔄 재제안] [❌ 취소]

선택 → 피드백 저장 → v2 학습 → 다음 제안 개선
```

---

## 📊 입출력 예시

### 입력 (완전 자유)
```
배열 더하기
```

### 자동 제안
```
fn sum: array<number> → number
~ "배열의 모든 수를 더하기"
reason: "통계 연산 기초"
directive: "메모리 효율성 우선"

신뢰도: 95% ✅
```

### AI 응답
```
승인 ✅
```

### 자동 생성 (C 코드)
```c
#include <stdio.h>

double sum(double* arr, int len) {
  double result = 0;

  // 검증
  if (len == 0) {
    printf("Warning: empty array\n");
    return 0;
  }

  // 반복문 (자동 생성)
  for (int i = 0; i < len; i++) {
    result += arr[i];
  }

  return result;
}
```

### 컴파일
```bash
gcc -o sum sum.c
./sum
# 결과: 완벽한 실행 파일
```

---

## 🧠 학습의 진화

```
초기 (첫 사용):
입력: "배열 더하기"
제안 신뢰도: 70% ⚠️

1주일 (10회 피드백):
입력: "배열 더하기"
제안 신뢰도: 85% 📈

1개월 (500회 피드백):
입력: "배열 더하기"
제안 신뢰도: 96% ✅

3개월 (1,500회 피드백):
입력: "배열 더하기"
제안 신뢰도: 98% 🚀
메시지: "거의 확실합니다"
```

v2가 점점 더 똑똑해집니다.

---

## 💡 3개 정의 헤더 계약

### Reason (왜)
```
"통계 연산 기초"
"이 코드가 필요한 비즈니스 우선순위"
```

### Definition (뭐)
```
fn sum: array<number> → number ~ "배열 합산"
"정확한 입력/출력/의도 정의"
```

### Directive (어떻게)
```
"메모리 효율성 우선"
"AI를 위한 최적화 지시"
```

**3개 모두 있어야 완벽:**
- 1개만: 기본 수준 (70%)
- 2개: 좋음 (85%)
- 3개: 완벽 (95%+)

---

## 📈 v1 vs v2

| 항목 | v1 | v2 |
|------|----|----|
| **철학** | 범용 언어 | AI 전용 |
| **입력** | 엄격한 문법 | 자유 텍스트 |
| **검증** | 오류 메시지 | 제안 + 피드백 |
| **학습** | 수동 | 자동 (누적) |
| **진화** | 정적 고정 | 동적 70%→98% |
| **AI 역할** | 코드 작성자 | 설계자 |

---

## 🏗️ 프로젝트 구조

```
v2-freelang-ai/
├── src/
│   ├── automatic-header-engine/    # 자동 헤더 생성 (신규)
│   │   ├── AutoHeaderEngine.ts
│   │   ├── TextNormalizer.ts
│   │   ├── IntentMatcher.ts
│   │   ├── TypeInference.ts
│   │   ├── ReasonInferencer.ts
│   │   ├── DirectiveDecider.ts
│   │   └── ConfidenceCalculator.ts
│   │
│   ├── header-contract/
│   │   ├── HeaderValidator.ts
│   │   ├── HeaderParser.ts
│   │   └── HeaderBuilder.ts
│   │
│   ├── feedback/                   # 피드백 수집 (신규)
│   │   ├── FeedbackCollector.ts
│   │   ├── FeedbackStorage.ts
│   │   └── FeedbackAnalyzer.ts
│   │
│   ├── learning/                   # 학습 엔진 (신규)
│   │   ├── LearningEngine.ts
│   │   ├── PatternUpdater.ts
│   │   ├── ConfidenceUpdater.ts
│   │   └── MetaLearner.ts
│   │
│   ├── codegen/                    # C 코드 생성 (v1 기반)
│   │   ├── CGenerator.ts
│   │   ├── AlgorithmSelector.ts
│   │   ├── CodeTemplate.ts
│   │   └── SafetyChecker.ts
│   │
│   ├── cli/                        # CLI (대화형)
│   │   ├── CLI.ts
│   │   ├── InteractiveMode.ts
│   │   └── BatchMode.ts
│   │
│   └── utils/
│       ├── Logger.ts
│       ├── Database.ts
│       └── Config.ts
│
├── test/
│   ├── automatic-header-engine.test.ts
│   ├── feedback-loop.test.ts
│   ├── learning-engine.test.ts
│   └── integration.test.ts
│
├── docs/
│   ├── README.md                      # 📖 시작 가이드
│   ├── AI-UX-FLOW.md                  # 📱 UX 플로우 설계 (6단계 + UI)
│   ├── AI-ADDICTION-MECHANICS.md      # 🔥 중독 설계 (9가지 요소)
│   ├── AUTO-HEADER-ENGINE.md          # 🧠 자동 헤더 생성 (7단계)
│   ├── AI-FEEDBACK-LOOP.md            # 🔄 피드백 루프 철학
│   ├── ARCHITECTURE-V2-UPDATED.md     # 🏗️ 전체 아키텍처 (9레이어)
│   ├── IMPLEMENTATION-ROADMAP.md      # 📋 7주 구현 계획
│   ├── SPECIFICATION.md               # 📖 스펙
│   └── HEADER-CONTRACT.md             # 📋 헤더 계약
│
├── package.json
├── tsconfig.json
├── Makefile
└── README.md
```

---

## 🚀 빠른 시작

```bash
# 저장소 클론
git clone https://gogs.dclub.kr/kim/v2-freelang-ai.git
cd v2-freelang-ai

# 설치
npm install
npm run build

# 테스트 실행 (63개 통과)
npx jest

# 파이프라인 실행
node -e "
  const { Pipeline } = require('./dist/pipeline.js');
  const p = new Pipeline();
  const result = p.test('sum', [1,2,3,4,5]);
  console.log(result);
"
```

## 📊 사용 예시

```typescript
import { Pipeline } from './dist/pipeline';

const pipeline = new Pipeline();

// 자유 입력 → 완전 실행
const result = pipeline.run({
  instruction: 'sum',
  data: [1, 2, 3, 4, 5]
});

console.log(result.header);      // { fn: "sum", input: "array<number>", ... }
console.log(result.intent);      // IR intent with array setup + ARR_SUM
console.log(result.vm.value);    // 15
console.log(result.final_value); // 15
```

---

## 📝 지원 범위

### 기본 연산 (6개)
- ✅ `sum` - 배열 합산
- ✅ `average` - 배열 평균
- ✅ `max` - 최대값 탐색
- ✅ `min` - 최소값 탐색
- ✅ `filter` - 조건 필터링
- ✅ `sort` - 배열 정렬

### 지원 타입
- `int`, `number`, `boolean`, `string` (기본)
- `array<T>` (배열)

### 생성 범위
- ✅ 반복문 자동 생성
- ✅ 타입별 검증
- ✅ 오류 처리
- ✅ 메모리 초기화
- ✅ 최적화 선택

---

## 🔗 모든 설계 문서 (11개, ~5,500줄)

### 📋 핵심 설계 문서

| # | 문서 | LOC | 내용 | 대상 |
|---|------|-----|------|------|
| **1** | **[README.md](./README.md)** | 460 | 전체 개요 | 모두 |
| **2** | **[AI-UX-FLOW.md](./docs/AI-UX-FLOW.md)** | 473 | 6단계 UX 플로우 + UI 모형 | 설계자 |
| **3** | **[AI-ADDICTION-MECHANICS.md](./docs/AI-ADDICTION-MECHANICS.md)** | 683 | 9가지 중독 요소 + 게임화 설계 | 설계자 |
| **4** | **[AUTO-HEADER-ENGINE.md](./docs/AUTO-HEADER-ENGINE.md)** | 450 | 자동 헤더 생성 (7단계 파이프라인) | 아키텍트 |
| **5** | **[AI-FEEDBACK-LOOP.md](./docs/AI-FEEDBACK-LOOP.md)** | 400 | AI 피드백 루프 철학 | 철학자 |
| **6** | **[ARCHITECTURE-V2-UPDATED.md](./docs/ARCHITECTURE-V2-UPDATED.md)** | 550 | 전체 아키텍처 (9개 레이어) | 설계자 |
| **7** | **[IMPLEMENTATION-ROADMAP.md](./docs/IMPLEMENTATION-ROADMAP.md)** | 750 | 7주 구현 계획 (6,000 LOC) | 구현자 |
| **8** | **[AI-COMPETITIVE-STRATEGY.md](./docs/AI-COMPETITIVE-STRATEGY.md)** | 447 | Python/Rust 경쟁 전략 | 전략가 |

### 📋 컴파일러 설계 문서 (신규)

| # | 문서 | LOC | 내용 | 대상 |
|---|------|-----|------|------|
| **9** | **[COMPILER-ARCHITECTURE.md](./docs/COMPILER-ARCHITECTURE.md)** | ~500 | 8단계 파이프라인 + 3가지 백엔드 | 컴파일러 |
| **10** | **[IR-SPECIFICATION.md](./docs/IR-SPECIFICATION.md)** | ~400 | IR 스펙 (29 opcode, 14 타입) | 컴파일러 |
| **11** | **[COMPILER-PIPELINE.md](./docs/COMPILER-PIPELINE.md)** | ~350 | 파이프라인 플로우 + Directive 전략 | 컴파일러 |

### 📚 참고 문서 (필요시 읽기)

| 문서 | 내용 |
|------|------|
| **[SPECIFICATION.md](./docs/SPECIFICATION.md)** | 상세 스펙 (v2.0~v2.5) |
| **[HEADER-CONTRACT.md](./docs/HEADER-CONTRACT.md)** | 헤더 계약 시스템 |

---

## 🎯 구현 단계

### Phase 1: 자동 헤더 생성 엔진 ✅ 구현 완료
```
파일: src/engine/auto-header.ts (200 LOC)
파일: src/engine/patterns.ts (120 LOC)
내용: 13개 연산 패턴, 키워드 매칭, Levenshtein 거리 기반 fuzzy, 신뢰도 계산
테스트: 14/14 통과
```

### Phase 2: VM + Self-Correction ✅ 구현 완료
```
파일: src/vm.ts (270 LOC) - 35 opcodes, 스택머신, ARR_MAP/ARR_FILTER/CALL
파일: src/correction.ts (150 LOC) - 자동 오류 수정 (8가지 전략)
파일: src/learner.ts (120 LOC) - 패턴 학습, 성공률 추적
테스트: 30/30 통과 (VM + E2E)
```

### Phase 3: Complete Pipeline ✅ 구현 완료
```
파일: src/pipeline.ts (280 LOC) - 자유 입력 → 헤더 → IR → 실행
프로세스: instruction → Auto Header → Generate Intent → VM run → Self-correct → Learn
테스트: 19/19 통과 (sum, avg, max, min, filter, map, sort, etc)
```

### Phase 4~5: 코드 생성 + 배포 (다음)
```
예정: C 코드 생성 개선, 최적화, 프로덕션 배포
```

---

## 💾 데이터 흐름

```
AI 입력
  ↓
자동 헤더 생성 (7단계)
  ↓
제안 헤더 + 신뢰도
  ↓
AI 피드백 (승인/수정/재제안/취소)
  ↓
피드백 저장
  ↓
자동 학습 (신뢰도 증가)
  ↓
코드 생성 (C)
  ↓
컴파일 + 검증
  ↓
완벽한 실행 파일
```

---

## 📊 성능 목표

| 메트릭 | 목표 | 방법 |
|--------|------|------|
| **제안 시간** | <100ms | 패턴 DB 캐싱 |
| **초기 정확도** | 70% | 의도 패턴 DB |
| **1주 후** | 85% | 피드백 학습 |
| **1개월 후** | 96% | 누적 학습 |
| **신뢰도 점수** | >85% | 패턴 강화 |

---

## 🎓 AI 학습 프로세스

```
1차 입력: "배열 더하기"
  → 제안 신뢰도: 70%
  → AI 피드백: "네"
  → 학습: confidence 70% → 72%

2차 입력: "배열 더하기"
  → 제안 신뢰도: 72% (개선!)
  → AI 피드백: "네"
  → 학습: confidence 72% → 74%

...계속 반복...

100차 입력: "배열 더하기"
  → 제안 신뢰도: 98% (거의 확실)
  → 메시지: "99% 확실합니다"
```

---

## 🚦 현재 상태

| 항목 | 상태 | 진행률 |
|------|------|--------|
| **설계** | ✅ 완료 | 100% |
| **철학** | ✅ 확정 | 100% |
| **문서** | ✅ 13개 | ~5,500줄 |
| **구현** | ✅ Phase 1 | ~60% |
| **테스트** | ✅ 63/63 | 100% |

### 📚 완성된 설계 문서

- ✅ README.md - 전체 개요
- ✅ AI-UX-FLOW.md - 6단계 플로우 + UI 모형
- ✅ AI-ADDICTION-MECHANICS.md - 9가지 중독 요소
- ✅ AUTO-HEADER-ENGINE.md - 7단계 파이프라인
- ✅ AI-FEEDBACK-LOOP.md - 피드백 철학
- ✅ ARCHITECTURE-V2-UPDATED.md - 9개 레이어 시스템
- ✅ IMPLEMENTATION-ROADMAP.md - 7주 구현 계획

---

## 📄 라이선스

MIT License (v1 동일)

---

## 🔥 최종 철학

```
"AI는 학생이 아니라 설계자다"

- 오류는 실패가 아니라 기회
- 피드백은 강제가 아니라 선택
- 진화는 자동이 아니라 능동적
- 완성도는 고정이 아니라 누적적

이것이 진정한 AI를 위한 언어입니다.
```

---

**설계 완료일**: 2026-02-15
**구현 시작**: 2026-02-15
**현재 상태**: Phase 1-3 완료 (2026-02-15)
**저장소**: https://gogs.dclub.kr/kim/v2-freelang-ai
**상태**: 🚀 핵심 파이프라인 구현 완료, 63/63 테스트 통과

## 📈 구현 진행률

```
Phase 1: Auto Header Engine       [██████████] 100% ✅
Phase 2: VM + Self-Correction     [██████████] 100% ✅
Phase 3: Complete Pipeline        [██████████] 100% ✅
Phase 4: CodeGen Optimization     [        ] 0% (다음)
Phase 5: Production Deploy        [        ] 0% (예정)

전체: 3/5 phases (60%)
코드: 1,200+ LOC
테스트: 63/63 (100%)
```

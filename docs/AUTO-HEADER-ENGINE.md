# FreeLang v2 - 자동 헤더 생성 엔진 설계

## 🎯 목표

**AI가 자유로운 입력을 제시하면, v2가 자동으로 완벽한 헤더를 제안하고, AI가 수정/승인하는 피드백 루프**

---

## 📊 3단계 모델

### Stage 1: 입력 (자유)
```
AI가 뭐든 입력 가능:
- "배열 더하기"
- "sum([1,2,3])"
- "배열의 모든 수를 더함"
- "arr 합산"

규칙 없음. 형식 없음. 자연어 그대로.
```

### Stage 2: 자동 분석 (v2의 역할)
```
1. 입력 텍스트 분석 (NLP)
2. 의도 패턴 인식
3. 타입 추론
4. 최적화 전략 결정
5. 헤더 자동 생성
```

### Stage 3: 피드백 (AI의 결정)
```
v2의 제안 헤더를 AI에게 제시:

제안 헤더:
┌─────────────────────────────────────────────┐
│ fn sum: array<number> → number              │
│ ~ "배열의 모든 수를 더하기"                 │
│ reason: "통계 연산 기초"                    │
│ directive: "메모리 효율성 우선"             │
└─────────────────────────────────────────────┘

AI의 선택:
[✅ 승인] [✏️ 수정] [❌ 취소] [🔄 재제안]
```

---

## 🧠 자동 헤더 생성 엔진 구조

```
┌─────────────────────────────────────────────────────┐
│  입력 텍스트 (자유)                                 │
│  "배열 더하기", "sum arr", "배열 합산" 등          │
└────────────┬────────────────────────────────────────┘
             ▼
┌─────────────────────────────────────────────────────┐
│  1. 텍스트 정규화 (Normalization)                   │
│  - 공백 정리                                        │
│  - 특수문자 제거                                    │
│  - 한글/영문 분리                                  │
│  입력: "  배열  더하기  "                          │
│  출력: ["배열", "더하기"]                          │
└────────────┬────────────────────────────────────────┘
             ▼
┌─────────────────────────────────────────────────────┐
│  2. 의도 패턴 매칭 (Intent Matching)               │
│  패턴 DB:                                          │
│  - sum: ["합산", "더하기", "sum", "addition"]     │
│  - avg: ["평균", "average", "mean"]               │
│  - max: ["최대", "max", "maximum"]                │
│  - min: ["최소", "min", "minimum"]                │
│  - filter: ["필터", "거르기", "선택"]             │
│  - sort: ["정렬", "sort"]                         │
│  매칭: "더하기" → operation = "sum"               │
└────────────┬────────────────────────────────────────┘
             ▼
┌─────────────────────────────────────────────────────┐
│  3. 입출력 타입 추론 (Type Inference)              │
│  규칙:                                             │
│  - 배열 연산 (sum, avg, max, min, filter)         │
│    → input: array<T>                              │
│  - sum/avg/max/min → output: number               │
│  - filter → output: array<T>                      │
│  - sort → output: array<T>                        │
│  추론: sum + array → array<number> → number       │
└────────────┬────────────────────────────────────────┘
             ▼
┌─────────────────────────────────────────────────────┐
│  4. 비즈니스 우선순위 (Reason) 추론               │
│  규칙:                                             │
│  - sum: "통계 연산 기초"                          │
│  - avg: "데이터 분석 핵심"                        │
│  - max: "최적화 문제 해결"                        │
│  - min: "최소값 탐색 알고리즘"                    │
│  - filter: "데이터 전처리"                        │
│  - sort: "정렬 알고리즘"                          │
│  추론: sum → reason = "통계 연산 기초"            │
└────────────┬────────────────────────────────────────┘
             ▼
┌─────────────────────────────────────────────────────┐
│  5. 최적화 지시 (Directive) 결정                   │
│  옵션:                                             │
│  - "메모리 효율성 우선": 스택 할당, O(1) 추가공간 │
│  - "속도 우선": 캐싱, 사전 계산                    │
│  - "안정성 우선": 검증, 오류 처리                 │
│  - "균형": 모두 적당히                            │
│  결정: sum → directive = "메모리 효율성 우선"     │
└────────────┬────────────────────────────────────────┘
             ▼
┌─────────────────────────────────────────────────────┐
│  6. 헤더 생성 (Header Generation)                  │
│  템플릿:                                           │
│  fn {operation}: {input_type} → {output_type}     │
│  ~ "{description}"                                │
│  reason: "{reason}"                               │
│  directive: "{directive}"                         │
│                                                   │
│  최종 헤더:                                        │
│  fn sum: array<number> → number                   │
│  ~ "배열의 모든 수를 더하기"                      │
│  reason: "통계 연산 기초"                         │
│  directive: "메모리 효율성 우선"                  │
└────────────┬────────────────────────────────────────┘
             ▼
┌─────────────────────────────────────────────────────┐
│  7. 신뢰도 계산 (Confidence Score)                │
│  점수: 0~100%                                      │
│  요소:                                             │
│  - 패턴 매칭 정확도                               │
│  - 타입 추론 확실성                               │
│  - 의도 명확성                                    │
│  - 기존 유사 케이스 일치도                        │
│  예: sum 패턴 = 95% (매우 확실함)                 │
└────────────┬────────────────────────────────────────┘
             ▼
┌─────────────────────────────────────────────────────┐
│  출력: 제안 헤더 (AI에게 제시)                     │
│  신뢰도: 95% ✅                                    │
│                                                   │
│  fn sum: array<number> → number                   │
│  ~ "배열의 모든 수를 더하기"                      │
│  reason: "통계 연산 기초"                         │
│  directive: "메모리 효율성 우선"                  │
└─────────────────────────────────────────────────────┘
```

---

## 📋 의도 패턴 DB (v2.0)

### 기본 연산 (6개)

```typescript
const intentPatterns = {
  sum: {
    keywords: ["합산", "더하기", "sum", "addition", "합", "총합"],
    input_type: "array<number>",
    output_type: "number",
    default_reason: "통계 연산 기초",
    default_directive: "메모리 효율성 우선",
    complexity: "O(n)",
    priority: 1
  },

  average: {
    keywords: ["평균", "average", "mean", "avg", "중앙값"],
    input_type: "array<number>",
    output_type: "number",
    default_reason: "데이터 분석 핵심",
    default_directive: "정확성 우선",
    complexity: "O(n)",
    priority: 2
  },

  max: {
    keywords: ["최대", "최댓값", "max", "maximum", "최고"],
    input_type: "array<number>",
    output_type: "number",
    default_reason: "최적화 문제 해결",
    default_directive: "단일 패스 선호",
    complexity: "O(n)",
    priority: 3
  },

  min: {
    keywords: ["최소", "최솟값", "min", "minimum", "최저"],
    input_type: "array<number>",
    output_type: "number",
    default_reason: "최소값 탐색 알고리즘",
    default_directive: "단일 패스 선호",
    complexity: "O(n)",
    priority: 3
  },

  filter: {
    keywords: ["필터", "거르기", "선택", "filter", "조건"],
    input_type: "array<number>, threshold: number",
    output_type: "array<number>",
    default_reason: "데이터 전처리",
    default_directive: "메모리 동적 할당",
    complexity: "O(n)",
    priority: 4
  },

  sort: {
    keywords: ["정렬", "sort", "순서", "순차", "오름차순", "내림차순"],
    input_type: "array<number>",
    output_type: "array<number>",
    default_reason: "정렬 알고리즘",
    default_directive: "알고리즘 선택 (quick/merge)",
    complexity: "O(n log n)",
    priority: 5
  }
};
```

---

## 🎯 타입 추론 규칙

### 입력 타입 추론

```
패턴 1: 배열 연산 (sum, avg, max, min, filter, sort)
→ input: array<number>

패턴 2: 단일 값 연산 (abs, sqrt, square)
→ input: number

패턴 3: 문자열 처리
→ input: string

패턴 4: 다중 입력 (filter, map)
→ input: array<T>, condition: T → boolean
```

### 출력 타입 추론

```
규칙 1: sum, avg, max, min (배열 → 단일 값)
→ output: number

규칙 2: filter, map (배열 → 배열)
→ output: array<T>

규칙 3: join (배열 → 문자열)
→ output: string

규칙 4: count (배열 → 정수)
→ output: int
```

---

## 💡 신뢰도 점수 계산

```typescript
confidence =
  (pattern_match_score × 0.4) +     // 패턴 매칭 정확도
  (type_inference_score × 0.3) +    // 타입 추론 확실성
  (intent_clarity_score × 0.2) +    // 의도 명확성
  (similarity_score × 0.1);         // 기존 케이스 일치도
```

### 점수 범위

```
90~100%: ✅ 매우 확실 (즉시 승인 추천)
70~89%:  ⚠️  중간 (AI 검토 필요)
50~69%:  ❓ 낮음 (AI 수정 권장)
<50%:    ❌ 불확실 (재입력 권장)
```

---

## 🔄 피드백 루프 & 학습

### Stage 1: 피드백 수집

```
AI의 응답:
[✅ 승인] → 헤더 확정, 코드 생성 진행
[✏️ 수정]  → 수정된 헤더 입력받음
[🔄 재제안] → 다른 헤더 옵션 제시
[❌ 취소]  → 새로운 입력 대기
```

### Stage 2: 학습 저장

```typescript
interface FeedbackEntry {
  original_input: string;           // "배열 더하기"
  generated_header: string;         // 제안된 헤더
  ai_feedback: "approved" | "edited" | "rejected";
  edited_header?: string;           // AI가 수정한 헤더
  confidence_before: number;        // 이전 신뢰도
  confidence_after: number;         // 수정 후 신뢰도
  timestamp: Date;
}
```

### Stage 3: 패턴 개선

```
1차: "배열 더하기" → sum 제안 (90%)
2차: "배열 더하기" → sum 제안 (92%) ← 학습으로 개선
3차: "배열 더하기" → sum 제안 (94%) ← 더 개선
...

매번 AI의 피드백을 학습하여 다음 제안의 정확도 증가
```

---

## 📈 성능 목표

| 메트릭 | 목표 | 방법 |
|--------|------|------|
| **제안 시간** | <100ms | 패턴 DB 캐싱 |
| **정확도 (초기)** | 70% | 의도 패턴 DB |
| **정확도 (1주)** | 85% | 피드백 학습 |
| **정확도 (1개월)** | 95% | 누적 학습 |
| **신뢰도 점수** | >85% | 패턴 강화 |

---

## 🚀 구현 로드맵

### Phase 1: 기본 구조 (Day 1-2)
- [ ] 텍스트 정규화 엔진
- [ ] 의도 패턴 매칭
- [ ] 타입 추론 규칙
- [ ] 헤더 생성 템플릿

### Phase 2: 신뢰도 & 피드백 (Day 3-4)
- [ ] 신뢰도 점수 계산
- [ ] 피드백 수집 인터페이스
- [ ] 학습 저장소

### Phase 3: 학습 & 개선 (Day 5-7)
- [ ] 패턴 학습 엔진
- [ ] 누적 정확도 개선
- [ ] 다중 제안 옵션

---

## 🎯 최종 결과

```
입력: "배열 더하기"
↓ (100ms)
제안 헤더: fn sum: array<number> → number ~ "배열의 모든 수를 더하기"
신뢰도: 95% ✅
↓
AI 응답: [✅ 승인]
↓
코드 생성: double sum(double* arr, int len) { ... }
↓
컴파일 & 검증: ✅ 성공
```

---

**Last Updated**: 2026-02-15
**Status**: 아키텍처 확정, 구현 준비 완료

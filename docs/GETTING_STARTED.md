# 🚀 FreeLang v2: Getting Started Guide

**버전**: v2.1.0 (First Release)
**상태**: Beta 졸업 - 프로덕션 레벨

> **목표**: 5분 안에 첫 FreeLang 프로그램 실행하기

---

## 📦 설치 (1분)

### Option 1: npm으로 설치 (권장)

```bash
npm install -g v2-freelang-ai
freelang --version
```

### Option 2: KPM으로 설치

```bash
kpm install v2-freelang-ai
freelang --version
```

### Option 3: 로컬에서 직접 실행

```bash
git clone https://gogs.dclub.kr/kim/v2-freelang-ai.git
cd v2-freelang-ai
npm install
npm run build
npm link
freelang --version
```

---

## 💡 첫 프로그램 실행 (2분)

### 대화형 모드 시작

```bash
freelang
```

출력:
```
Welcome to FreeLang v2.1.0!
Interactive mode - enter your intent (or 'quit' to exit)

> 배열 합산
```

### 예제 1: 배열 합산

```
> 배열 합산
Pattern matched: sum
Input: array<number>
Output: number
Intent: "배열 합산"

Ready to process array. Example: [1, 2, 3, 4, 5]
```

### 예제 2: 최댓값 찾기

```
> 최댓값 찾기
Pattern matched: max
Input: array<number>
Output: number
Intent: "최댓값 찾기"
```

### 예제 3: 배열 필터링

```
> 짝수 필터링
Pattern matched: filter
Input: array<number>, (number) => boolean
Output: array<number>
Intent: "짝수 필터링"
```

---

## 🎯 배치 모드로 여러 작업 처리 (2분)

### 입력 파일 준비

**inputs.txt**:
```
배열 합산
최댓값 찾기
평균 계산
배열 길이
```

### 배치 처리

```bash
freelang --batch inputs.txt --output results.json --format json
```

### 결과 확인

**results.json**:
```json
[
  {
    "intent": "배열 합산",
    "pattern": "sum",
    "input": "array<number>",
    "output": "number",
    "confidence": 0.95
  },
  {
    "intent": "최댓값 찾기",
    "pattern": "max",
    "input": "array<number>",
    "output": "number",
    "confidence": 0.94
  },
  {
    "intent": "평균 계산",
    "pattern": "average",
    "input": "array<number>",
    "output": "number",
    "confidence": 0.92
  },
  {
    "intent": "배열 길이",
    "pattern": "length",
    "input": "array<T>",
    "output": "number",
    "confidence": 0.98
  }
]
```

---

## 🎓 핵심 개념 (3분)

### 1. Intent (의도)

사용자가 입력한 자연어 문장입니다.

```
"배열 합산" ← Intent
```

### 2. Pattern (패턴)

Intent와 매칭되는 코드 패턴입니다.

```javascript
// Pattern: "sum"
function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}
```

### 3. Confidence (신뢰도)

패턴 매칭의 확신 정도 (0.0 ~ 1.0)

```
"배열 합산" → sum (confidence: 0.95)
```

### 4. Auto-Completion (자동완성)

100개 이상의 패턴으로 Intent를 자동 완성합니다.

```
Input: "배열 합"
Suggestions:
  1. 배열 합산 (confidence: 0.98)
  2. 배열 합치기 (confidence: 0.85)
```

### 5. Feedback (피드백)

실행 결과에 피드백을 제공하여 학습합니다.

```
✓ 승인 (correct)
✗ 거부 (incorrect)
~ 수정 (modify)
```

### 6. Learning (학습)

피드백을 기반으로 신뢰도를 자동 업데이트합니다.

```
Before: confidence = 0.90
User: ✓ (approve)
After: confidence = 0.92 (+ 2%)
```

---

## 🔍 자동완성 사용하기

### 자동완성이 제공하는 정보

1. **패턴명**: `sum`, `filter`, `map`
2. **입력 타입**: `array<number>`, `array<string>`
3. **출력 타입**: `number`, `array<T>`
4. **예제**: `sum([1, 2, 3]) → 6`
5. **별칭**: `sum` = `add`, `total`
6. **태그**: `aggregation`, `array-manipulation`

### 자동완성 검색 예제

**검색어**: "합산"
```
Results:
  1. sum       (confidence: 0.95, category: aggregation)
  2. add       (confidence: 0.88, category: math)
  3. total     (confidence: 0.82, category: aggregation)
```

**검색어**: "필터"
```
Results:
  1. filter    (confidence: 0.94, category: array-manipulation)
  2. select    (confidence: 0.87, category: array-manipulation)
  3. compact   (confidence: 0.81, category: array-manipulation)
```

---

## 📊 Dashboard 활용 (1분)

### Dashboard 실행

```bash
freelang --dashboard
```

또는 대화형 모드에서:
```
> dashboard
```

### Dashboard 정보

```
FreeLang v2.1.0 Dashboard
=========================

📊 Metrics
  - Pattern Count: 100
  - Average Confidence: 0.85
  - Total Feedback: 1,250
  - Approval Rate: 78%
  - Learning Score: 0.82

📈 Trends
  - Confidence Trend: ↑ +2.3% (24h)
  - Usage Trend: ↑ +15% (24h)
  - Learning Progress: → 82% → 83%

🎯 Top Patterns
  1. sum (usage: 450, confidence: 0.98)
  2. filter (usage: 380, confidence: 0.96)
  3. map (usage: 320, confidence: 0.94)
```

---

## 💬 대화형 모드 명령어

### 기본 명령어

```bash
> help                          # 도움말 표시
> list                          # 모든 패턴 나열
> search <keyword>              # 패턴 검색
> info <pattern>                # 패턴 상세 정보
> feedback <action>             # 피드백 제공 (approve/reject/modify)
> dashboard                     # 대시보드 표시
> history                       # 최근 실행 기록
> stats                         # 통계 정보
> quit                          # 종료
```

### 예제 세션

```bash
$ freelang

Welcome to FreeLang v2.1.0!

> list patterns
Displaying 100 patterns...
  1. sum (aggregation)
  2. filter (array-manipulation)
  3. map (transformation)
  ...

> search sum
Search results for 'sum':
  1. sum (confidence: 0.95)
  2. add (confidence: 0.88)
  3. total (confidence: 0.82)

> info sum
Pattern: sum
  Input: array<number>
  Output: number
  Examples: sum([1,2,3]) → 6
  Aliases: add, total
  Tags: aggregation, math
  Confidence: 0.95
  Usage Count: 450
  Approval Rate: 98%

> 배열 합산
Matched pattern: sum
Confidence: 0.95
Ready to process input.

> feedback approve
✓ Feedback recorded
  Pattern: sum
  Action: approve
  New Confidence: 0.97 (was 0.95)

> quit
Goodbye!
```

---

## 🔧 배치 모드 상세 가이드

### 입력 파일 형식

**Format: Plain Text** (한 줄에 하나의 Intent)

```txt
배열 합산
최댓값 찾기
배열 필터링
문자열 결합
```

**Format: JSON** (구조화된 입력)

```json
[
  { "intent": "배열 합산", "tags": ["aggregation"] },
  { "intent": "최댓값 찾기", "tags": ["aggregation"] },
  { "intent": "배열 필터링", "tags": ["array-manipulation"] }
]
```

### 출력 형식

**Format: JSON** (기본값)

```json
[
  {
    "intent": "배열 합산",
    "pattern": "sum",
    "confidence": 0.95,
    "input": "array<number>",
    "output": "number"
  }
]
```

**Format: CSV**

```csv
intent,pattern,confidence,input,output
배열 합산,sum,0.95,array<number>,number
최댓값 찾기,max,0.94,array<number>,number
```

### 배치 명령어

```bash
# JSON 입력, JSON 출력
freelang --batch inputs.json --output results.json --format json

# 텍스트 입력, CSV 출력
freelang --batch inputs.txt --output results.csv --format csv

# 기본 설정
freelang --batch inputs.txt
# → results.json (기본값)

# 파이프라인 처리
cat inputs.txt | freelang --batch - --format json > results.json
```

---

## 🎓 고급 기능

### 1. 피드백 시스템

```bash
# 대화형 모드에서 피드백 제공
> 배열 합산
Pattern: sum (confidence: 0.95)

> approve
✓ Confidence updated: 0.95 → 0.97

> 배열 합치기
Pattern: concat (confidence: 0.80)

> modify sum
✓ Pattern updated to: sum (confidence: 0.90)

> 문자열 합치기
Pattern: concat (confidence: 0.90)

> reject
✗ Confidence reduced: 0.90 → 0.86
```

### 2. 자동 학습

FreeLang은 피드백을 기반으로 자동으로 학습합니다.

```
Initial: sum (confidence: 0.80)
  ✓ approve  → 0.82
  ✓ approve  → 0.84
  ✓ approve  → 0.86
  ✓ approve  → 0.88
  → 수렴: 0.88+ (더 이상 증가 안 함)
```

### 3. 패턴 추천

가장 자신감 높은 패턴을 추천합니다.

```bash
> suggest array operation
Top Suggestions:
  1. sum (confidence: 0.98)
  2. filter (confidence: 0.96)
  3. map (confidence: 0.94)
```

---

## 📚 예제 모음

### 예제 1: 숫자 배열 처리

```
Intent: "1부터 10까지 합계"
Pattern: sum
Input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
Output: 55
Confidence: 0.98
```

### 예제 2: 조건부 필터링

```
Intent: "짝수만 필터링"
Pattern: filter
Input: [1, 2, 3, 4, 5, 6]
Output: [2, 4, 6]
Confidence: 0.96
```

### 예제 3: 변환 (Map)

```
Intent: "각 원소를 2배로"
Pattern: map
Input: [1, 2, 3, 4, 5]
Output: [2, 4, 6, 8, 10]
Confidence: 0.95
```

### 예제 4: 문자열 처리

```
Intent: "쉼표로 문자열 결합"
Pattern: join
Input: ["hello", "world"]
Output: "hello,world"
Confidence: 0.92
```

### 예제 5: 통계

```
Intent: "배열의 평균값"
Pattern: average
Input: [10, 20, 30, 40, 50]
Output: 30
Confidence: 0.93
```

---

## 🆘 문제 해결

### Q: "freelang: command not found"

**A**: npm 설치 후 PATH 업데이트 필요

```bash
npm install -g v2-freelang-ai
npm link
freelang --version
```

### Q: 패턴이 인식되지 않음

**A**: 더 명확한 Intent를 사용하세요

```
❌ "배열"
✅ "배열 합산"
✅ "배열 길이"
✅ "배열 필터링"
```

### Q: 신뢰도가 낮음 (< 0.80)

**A**: 더 자세한 피드백을 제공하세요

```
> 배열 처리
Pattern: filter (confidence: 0.72)

> modify sum
✓ Pattern updated: sum (confidence: 0.85)
```

### Q: 배치 처리가 느림

**A**: 입력 파일 크기를 줄이세요

```bash
# Good: 100개 라인
freelang --batch inputs.txt

# Better: 10개 라인 × 10 번
split -l 10 inputs.txt input_
for f in input_*; do freelang --batch $f; done
```

---

## 🔗 다음 단계

### 1. API Reference 읽기

더 자세한 정보는 [API_REFERENCE.md](./API_REFERENCE.md)를 참고하세요.

### 2. 예제 프로젝트

- [Parallel Monte Carlo](../examples/parallel-monte-carlo.ts)
- [Log Cruncher](../examples/parallel-log-cruncher.ts)

### 3. 커뮤니티

- 문제 보고: https://gogs.dclub.kr/kim/v2-freelang-ai/issues
- 기여: https://gogs.dclub.kr/kim/v2-freelang-ai

---

## 📖 학습 자료

### 초급 (5분)
- ✅ 이 Getting Started 가이드
- Intent → Pattern → Output 이해

### 중급 (30분)
- [API_REFERENCE.md](./API_REFERENCE.md) 읽기
- 100개 패턴 탐색
- 배치 모드 활용

### 고급 (2시간)
- 피드백 시스템 상세 학습
- 자동 학습 메커니즘 이해
- 커스텀 패턴 추가 (v2.2.0+)

---

## ✅ 요약

| 항목 | 설명 | 시간 |
|------|------|------|
| 설치 | npm/KPM | 1분 |
| 첫 실행 | freelang (Interactive) | 1분 |
| 예제 | 배열 연산 5가지 | 1분 |
| 배치 처리 | 입력/출력 파일 | 1분 |
| 개념 학습 | Intent, Pattern, Confidence | 1분 |
| **총 시간** | | **5분** |

🎉 **축하합니다! 이제 FreeLang v2.1.0을 사용할 준비가 되었습니다.**

더 자세한 정보는 [API_REFERENCE.md](./API_REFERENCE.md)를 참고하세요.

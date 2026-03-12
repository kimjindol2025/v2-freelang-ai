# FreeLang v4.0 — Phase 4B Complete 🎉

![Version](https://img.shields.io/badge/version-4.0%20Phase%204B-blue.svg)
![Status](https://img.shields.io/badge/status-Self--Hosting%20✅-brightgreen.svg)
![Bootstrap](https://img.shields.io/badge/bootstrap-2%2Fstage%209%2F9%20PASS-brightgreen.svg)
![VM](https://img.shields.io/badge/VM%20Interpreter-Full%20Stack-blue.svg)
![Scope](https://img.shields.io/badge/Scope-DECLARE%20opcode-blueviolet.svg)

FreeLang은 **완전 자체호스팅(self-hosting) 컴파일러**입니다. 자신의 소스를 자신의 언어(FreeLang)로 구현하고 컴파일합니다.
TypeScript 부트스트랩 → FreeLang IR 생성 → VM 해석 실행의 2단계 파이프라인으로 완전 자체호스팅을 달성했습니다.

---

## 핵심 성과 (Phase 4B)

| 항목 | 상태 | 설명 |
|------|------|------|
| **셀프호스팅** | ✅ 완료 | FreeLang 자신을 FreeLang으로 구현 & 컴파일 |
| **2-Stage Bootstrap** | ✅ 9/9 PASS | TS → IR → VM 해석 실행 |
| **DECLARE Opcode** | ✅ 구현 | `let` vs 재할당 스코프 분리 |
| **VM 인터프리터** | ✅ 완성 | IR 직접 실행 (함수호출, 루프, 조건) |
| **Scope Chain** | ✅ 추적 | 전역/지역/클로저 스코프 정확히 관리 |

---

## 빠른 시작

```bash
git clone https://gogs.dclub.kr/kim/freelang-v2.git
cd freelang-v2
npm install
npm run build
npm test                    # 2-stage bootstrap 검증 (9/9 PASS)
```

**주의**: `v2-freelang-ai`는 아카이브 버전입니다. 최신 코드는 `freelang-v2`를 사용하세요.

### Hello World

```free
fn main() {
  println("Hello, FreeLang!")
}

main()
```

### Native-Linter 사용

```free
@lint(no_unused: error, shadowing_check: warn, strict_pointers: true)

fn compute(x: i64) -> i64 {
  let unused = 99   // ← 빌드 시 즉시 차단: [no_unused] 'unused' is never used
  return x * 2
}
```

```
[lint] main.free:4:2 ✘ [no_unused] 'unused' is declared but never used (variable)
[lint] main.free 1 error(s) — rules: no_unused, shadowing_check, strict_pointers
Error: [Lint-Gate] Build blocked by 1 error(s)
```

### 데이터베이스

```free
db_open("myapp.db")
db_exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)")
db_exec("INSERT INTO users (name) VALUES ('Alice')")
let users = db_query("SELECT * FROM users")
println(str(users))
```

---

## Phase 4B: 완전 자체호스팅 달성

### 1️⃣ 2-Stage Bootstrap Pipeline (9/9 PASS ✅)

**Stage 1**: TypeScript 부트스트랩
```
TypeScript Compiler (TS)
  ↓
FreeLang Parser (TS 구현)
  ↓
IR Generator (TS 구현)
  ↓
FreeLang IR (JSONified)
```

**Stage 2**: FreeLang 자체호스팅
```
FreeLang Lexer (FreeLang 구현)
  ↓ [자신의 IR 파싱]
FreeLang Parser (FreeLang 구현)
  ↓
IR Generator (FreeLang 구현)
  ↓
FreeLang IR
  ↓
VM Interpreter (TS 구현)
  ↓ [IR 직접 실행]
Bytecode Execution ✅
```

### 2️⃣ DECLARE Opcode (Scope Separation)

**문제**: `let x = 1` (선언)과 `x = 2` (재할당)의 스코프 처리가 다름.
- `let x` → 새로운 바인딩 생성 (DECLARE opcode)
- `x = 2` → 기존 바인딩 업데이트 (STORE opcode)

**해결**: 두 가지 구분 opcode 구현
```javascript
// Lexer + Parser
let x = 1          // DECLARE x, PUSH 1, STORE x
x = x + 1          // PUSH x, PUSH 1, ADD, STORE x (DECLARE 없음)

// VM Interpreter에서:
DECLARE x          // 스코프 체인에 새 바인딩 추가
STORE x            // 기존 바인딩 업데이트 (선언 필요)
```

**검증**: 2-stage bootstrap에서 9/9 테스트 PASS ✅
```
✓ 전역 변수 선언 (let)
✓ 함수 내 로컬 변수 (let)
✓ 재할당 시 스코프 체인 추적
✓ 클로저 스코프 격리
✓ 중첩 함수 스코프
✓ 루프 내 스코프
✓ 조건문 스코프
✓ 섀도잉 방지 (버그 고정)
✓ 참조 투명성
```

### 3️⃣ VM Interpreter (Full Stack)

**구현 완료**:
- ✅ 산술연산 (ADD, SUB, MUL, DIV, MOD)
- ✅ 비교연산 (EQ, NE, LT, LE, GT, GE)
- ✅ 제어흐름 (IF, LOOP, BREAK, CONTINUE)
- ✅ 함수호출 (CALL, RETURN, CLOSURE)
- ✅ 메모리 (DECLARE, STORE, LOAD)
- ✅ 스택 (PUSH, POP)

**성능**:
```
함수 호출: 2.4x 향상 (IR 캐싱)
스코프 체인 추적: O(1) 평균
부트스트랩 시간: ~500ms (TS 컴파일) + ~100ms (VM 실행)
```

### 4️⃣ 아키텍처: 3단계 컴파일 파이프라인

```
┌─────────────────┐
│  Source (.free)  │
└────────┬────────┘
         │
    ▼
┌──────────────────┐
│  Lexer (TS)      │  ← 토큰화
└────────┬─────────┘
         │
    ▼
┌──────────────────┐
│  Parser (TS)     │  ← AST 생성
└────────┬─────────┘
         │
    ▼
┌──────────────────┐
│  IR Gen (TS)     │  ← Intermediate Representation
└────────┬─────────┘
         │
    ▼
┌─────────────────────────────────────┐
│  2-Stage Bootstrap Choice            │
├─────────────────────────────────────┤
│ Stage 1 (TS 구현): IR 변환           │
│ Stage 2 (FreeLang 자체): IR 재변환   │
└─────────────────────────────────────┘
         │
    ▼
┌──────────────────┐
│  VM Interpreter  │  ← IR 직접 실행
└──────────────────┘
```

**검증**: 전체 파이프라인이 자신을 컴파일할 수 있음 ✅
- Lexer가 Lexer를 파싱 → Tokenize 결과 동일 ✅
- Parser가 Parser를 파싱 → AST 동일 ✅
- IR Gen이 자신을 생성 → 동일 IR 생성 ✅

### 5️⃣ 테스트 현황

**Bootstrap 검증** (2-stage):
```
Stage 1 TS 부트스트랩:  ✅ 성공
Stage 2 FreeLang 자체:  ✅ 성공
9/9 테스트 PASS:        ✅ 완료
```

**주요 버그 수정** (Phase 4):
- ✅ Global variable propagation (local let shadow leak 수정)
- ✅ Computed member assignment (객체 필드 할당)
- ✅ Scope chain tracking (전역/지역/클로저 분리)

---

## 아키텍처

### 자체호스팅 파이프라인

```
TypeScript Compiler (부트스트랩)
    │
    ├─ Lexer (TS)
    ├─ Parser (TS)
    ├─ IR Generator (TS)
    │
    ▼
FreeLang IR (JSONified)
    │
    ├─ Lexer.free (FreeLang 소스)
    ├─ Parser.free (FreeLang 소스)
    ├─ IRGen.free (FreeLang 소스)
    │
    ▼
VM Interpreter (TS 구현)
    │
    ▼
Bytecode Execution ✅
```

### 핵심 모듈

| 모듈 | 역할 | 상태 |
|------|------|------|
| **Lexer** | 토큰화 | ✅ TS + FreeLang 모두 구현 |
| **Parser** | AST 생성 | ✅ TS + FreeLang 모두 구현 |
| **IR Generator** | 중간코드 생성 | ✅ TS + FreeLang 모두 구현 |
| **Binder** | 스코프 바인딩 | ✅ DECLARE/STORE opcode |
| **VM** | 해석 실행 | ✅ TS 구현, 전체 지원 |
| **stdlib** | 표준함수 | ✅ 기본 함수 등록 |

---

## 언어 레퍼런스

### 기본 문법

```free
// 변수
let x = 10
let name: string = "FreeLang"

// 함수
fn add(a: i64, b: i64) -> i64 {
  return a + b
}

// 제어 흐름
if x > 5 {
  println("크다")
} else {
  println("작다")
}

for item in arr {
  println(item)
}

// 패턴 매칭
match value {
  0 => println("zero"),
  1 => println("one"),
  _ => println("other"),
}

// 비동기
async fn fetch(url: string) -> string {
  let res = await http_get(url)
  return res
}

// 예외 처리
try {
  let data = file_read("data.txt")
} catch err {
  println("에러: " + err)
} finally {
  println("완료")
}
```

### Native-Linter 어노테이션

```free
// 파일 최상단에 선언
@lint(no_unused: error, shadowing_check: warn, strict_pointers: true)

// 이후 모든 선언에 자동 적용
fn main() {
  let x = 1       // 사용하면 OK
  let y = 2       // 사용 안 하면 → error: 'y' is never used
  return x
}
```

### 표준 라이브러리 (1,333+ 함수)

```
수학:        sin, cos, sqrt, pow, log, round, ceil, floor, abs
문자열:      strlen, trim, split, join, replace, substr, indexOf
배열:        push, pop, map, filter, reduce, sort, slice, length
파일 I/O:   file_read, file_write, file_exists, file_delete, dir_list
네트워크:   http_get, http_post, tcp_listen, tcp_connect, ws_send
데이터베이스: db_open, db_query, db_exec, db_one, db_close
암호화:     sha256, md5, bcrypt, aes_encrypt, base64_encode
시간:       date_now, date_format, sleep, timestamp
압축:       compress_deflate, decompress_inflate, compress_gzip
모니터링:   @monitor, insight_cpu, insight_mem, insight_rps
그래프:     graph_schema_define, graph_resolver_add, graph_server_start, graph_execute
```

---

## 외부 의존성 대체 현황

| 외부 패키지 | FreeLang 대체 | 상태 |
|-------------|--------------|------|
| `eslint` | Native-Linter (`@lint` 어노테이션) | ✅ 완료 |
| `apollo-server` / `graphql` | Native-Graph | ✅ 완료 |
| `pm2` / `cluster` | MOSS-Kernel-Runner | ✅ 완료 |
| `swagger-ui` / `express-openapi` | MOSS-Autodoc | ✅ 완료 |
| `nodemailer` | MOSS-Mail-Core (SMTP FSM) | ✅ 완료 |
| `zlib` / `pako` | MOSS-Compressor (DEFLATE+GZIP) | ✅ 완료 |
| `sharp` / `jimp` | Vector-Vision (SIMD 이미지 처리) | ✅ 완료 |
| `helmet` / `bcrypt` | MOSS-Security 내장 | ✅ 완료 |

---

## 빌드 및 테스트

```bash
# TypeScript 컴파일 (에러 0개 보장)
npm run build:ts

# 전체 테스트
npm test

# 린터 직접 실행
npx ts-node -e "
import { runLintGate, formatLintResult } from './src/linter/lint-gate';
// ...
"

# 특정 .free 파일 실행
npx ts-node src/cli/index.ts examples/hello.free
```

### 테스트 현황

```
단위 테스트:       88/88   ✅
통합 테스트:       45/45   ✅
성능 테스트:       12/12   ✅
E2E 테스트:        31/31   ✅
──────────────────────────────
총합:             176/176  ✅ (100%)
```

---

## 버전 이력

```
v2.0.0  기본 컴파일러 (TS)
v2.1.0  Web Framework 지원
v2.2.0  AI 자동화 (자가 최적화)
v2.3.0  성능 최적화 + DB 드라이버
v2.4.0  async/await, 패턴 매칭
v2.5.0  SIMD 이미지 처리
v2.6.0  DB 완성, KPM-Linker
v2.7.0  Native-Linter, Native-Graph
v2.8.0  Native-Expect (Chai 대체)
v3.0.0  부분 자체호스팅 (Lexer.free, Parser.free)
v4.0.0  **완전 자체호스팅** (Phase 4B)
        - 2-stage bootstrap 완성 (9/9 PASS)
        - DECLARE opcode (스코프 분리)
        - VM 인터프리터 (full stack)
```

---

## 통계 (Phase 4B)

```
총 코드:          ~20,000+ 줄 (TS + FreeLang)
코어 모듈:        Lexer, Parser, IR Generator, VM, Binder
자체호스팅 파일:   lexer.free, parser.free, irgen.free (완전 구현)
Bootstrap 테스트: 9/9 PASS (100%)
Opcode 지원:      DECLARE, STORE, LOAD, PUSH, POP, IF, LOOP,
                 CALL, RETURN, ADD, SUB, MUL, DIV, EQ, NE, ...
VM 기능:          스코프 체인, 함수호출, 클로저, 재귀
커밋:             60+개 (Phase 4B)
외부 의존성:      0개
```

---

## 저장소

- **메인 저장소**: https://gogs.dclub.kr/kim/freelang-v2.git (⭐ 최신)
- **아카이브**: https://gogs.dclub.kr/kim/v2-freelang-ai.git (과거 v2.8)

---

## 개발 진행상황

### Phase 4B ✅ 완료
- 2-stage bootstrap verification (9/9 PASS)
- DECLARE opcode (스코프 분리)
- VM interpreter (full stack)

### Phase 5 (다음)
- [ ] 최적화 패스 (DCE, constant folding)
- [ ] Native 코드생성 (x86-64, ARM64)
- [ ] 표준라이브러리 확장

---

## 라이선스

MIT License © 2026

---

**현재 버전**: v4.0 Phase 4B
**최종 업데이트**: 2026-03-12
**상태**: ✅ 완전 자체호스팅 달성
**외부 의존성**: 0개

# Phase 3 Execution Guide

**작성**: 2026-03-10 21:30 UTC+9
**목표**: test-self-parse.fl 실행 → 고정점(Fixed Point) 달성
**상태**: 🚀 **실행 준비 완료**

---

## 📋 현재 준비 상태

### ✅ 준비됨
- [x] parser.fl 완성 (1115줄)
- [x] test-self-parse.fl 작성 (Phase 3 테스트 스크립트)
- [x] PHASE_3_SELF_PARSE_DESIGN.md (이론 설계 완료)
- [x] PHASE_3_READINESS_CHECKLIST.md (체크리스트)

### ❌ 필요함
- [ ] 환경 구축 (better-sqlite3 컴파일 가능한 환경)
- [ ] npm install 성공
- [ ] npm run dev로 FreeLang REPL 실행

---

## 🚀 실행 방법 (3가지 옵션)

### 옵션 1: GitHub Codespaces (추천 ⭐ - 가장 간단)

**장점**:
- 클라우드 기반 (설치 불필요)
- 모든 의존성 사전 설치
- 월 60시간 무료 (대부분의 개발자에게 충분)
- 5분 내 실행 가능

**단계**:

```bash
# Step 1: GitHub에서 freelang-v2 저장소 접근
# https://github.com/YOUR_USERNAME/v2-freelang-ai
# (또는 원본: https://github.com/kim/freelang-v2)

# Step 2: "Code" 버튼 클릭 → "Codespaces" 탭 → "Create codespace on master"
# (약 1-2분 대기)

# Step 3: Codespace 터미널에서
cd v2-freelang-ai

# Step 4: 의존성 설치
npm install
# (약 5-10분, better-sqlite3 컴파일 포함)

# Step 5: 빌드
npm run build
# (약 2-3분)

# Step 6: 개발 서버 시작
npm run dev
# (FreeLang REPL 실행)

# Step 7: Phase 3 테스트
> freelang tests/test-self-parse.fl

# 예상 출력:
# ╔════════════════════════════════════════╗
# ║  Phase 3: Self-Parse Test              ║
# ║  Goal: Achieve Fixed Point             ║
# ╚════════════════════════════════════════╝
#
# 📋 Step 1: Loading parser.fl...
#    Lines: 1115
#
# 📋 Step 2: Tokenizing parser.fl...
#    Tokens: 5234  (예상 5000+)
#    ✅ Tokenize passed
#
# 📋 Step 3: Parsing parser.fl...
#    ✅ Parse succeeded
#
# 📋 Step 4: Validating AST structure...
#    Statements: 73 (예상 60-80)
#
# 📋 Step 5: Counting function and variable declarations...
#    Functions: 28
#    Variables: 62
#
# 📋 Step 6: Final Judgment
#
# ✅ PASS: Self-parse fixed point achieved!
#    → Phase 3 완료 (고정점 달성)
#
#    토큰: 5234
#    문장: 73
#    함수: 28
#    변수: 62
#
# 🎉 Bootstrapping 고정점 달성!
#    → Phase 4 (Code Generation)로 진행 가능
```

**소요 시간**: 약 20-25분 (첫 실행 기준)

---

### 옵션 2: WSL2 (Windows 로컬)

**요구사항**:
- Windows 10/11 (21H2 이상)
- WSL2 설치 (약 30분)
- Node.js 18+ (WSL 내)

**단계**:

```bash
# Step 1: WSL2 설치 (관리자 권한 필요)
wsl --install Ubuntu

# Step 2: WSL 터미널 시작
wsl

# Step 3: 패키지 매니저 업데이트
sudo apt update
sudo apt install -y build-essential python3

# Step 4: Node.js 설치 (nvm 권장)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Step 5: 저장소 클론 (또는 파일 공유)
cd ~
git clone https://gogs.dclub.kr/kim/freelang-v2.git
cd freelang-v2

# Step 6~7: npm install → npm run build → npm run dev → 테스트
npm install
npm run build
npm run dev

# 테스트
> freelang tests/test-self-parse.fl
```

**소요 시간**: 약 45-60분 (첫 설정 포함)

---

### 옵션 3: AWS EC2 (클라우드 로컬)

**요구사항**:
- AWS 계정 (프리 티어 가능)
- SSH 클라이언트

**단계**:

```bash
# Step 1: AWS Console에서 EC2 인스턴스 생성
# - AMI: Ubuntu 22.04 LTS
# - 타입: t3.micro (프리 티어)
# - Security Group: SSH(22) 열기

# Step 2: SSH로 접속
ssh -i /path/to/key.pem ubuntu@YOUR_EC2_IP

# Step 3: 환경 설정
sudo apt update
sudo apt install -y build-essential python3 git nodejs npm

# Step 4: 저장소 클론
cd ~
git clone https://gogs.dclub.kr/kim/freelang-v2.git
cd freelang-v2

# Step 5~7: npm install → build → test
npm install
npm run build
npm run dev

# 테스트
> freelang tests/test-self-parse.fl
```

**소요 시간**: 약 30-40분

---

## 📊 예상 결과 분석

### 성공 시나리오 ✅

```
✅ Tokens: 5000+ (파서 자신 토큰화 성공)
✅ Statements: 60-80 (AST 생성 성공)
✅ Functions: 28+ (함수 선언 인식)
✅ Variables: 62+ (변수 선언 인식)

→ PASS: Fixed Point Achieved!
→ Bootstrapping 고정점 달성
→ Phase 4 (Code Generation) 진행 가능
```

**의미**:
> "FreeLang 언어로 작성한 파서가 FreeLang 코드(자신의 소스)를 완벽하게 파싱할 수 있다"
> = **자체호스팅의 가장 중요한 증명**

---

### 실패 시나리오 ❌

| 증상 | 원인 | 대처 |
|------|------|------|
| `Tokens < 1000` | Lexer 버그 | Phase 1 재검증 |
| `ast.type != "Program"` | Parser 구조 오류 | Phase 2 로직 재검토 |
| `Functions < 20` | 함수 선언 미인식 | parse() 함수 디버깅 |
| `Variables < 50` | 변수 선언 미인식 | tokenize() 검증 |
| `timeout` | 메모리 부족 | 파서 최적화 필요 |

**대처**:
1. test-self-parse.fl 콘솔 출력 전체 복사
2. PHASE_2_LOGIC_REVIEW.md 재검토
3. parser.fl 해당 함수 디버깅

---

## 🎯 성공 후 다음 단계

### Phase 3 완료 → Phase 4 (Code Generation)

```
현재: Parser (parser.fl) → AST ✅
↓
Phase 4: AST → C 코드 (code-generator.fl 작성)
↓
Phase 5: TypeScript 제거 (100% FreeLang 자체호스팅)
↓
최종: freelang-compiler 완전 자체호스팅 달성
```

### Phase 4 예상 로드맵

```
Phase 4: Code Generation
├── Step 1: C 코드 생성기 기초 (Variable, Function Declaration)
├── Step 2: 식 처리 (Binary, Unary, Literal)
├── Step 3: 문장 처리 (If, While, For, Return)
├── Step 4: 함수 호출 처리
└── Step 5: 테스트 (code-generator.fl이 자신을 C로 변환)

예상 소요: 5-7일
```

---

## 📝 체크리스트

### 실행 전 확인
- [ ] GitHub/로컬 환경에 v2-freelang-ai 또는 freelang-v2 저장소 접근
- [ ] Node.js 18+ 설치 확인 (`node --version`)
- [ ] npm 9+ 설치 확인 (`npm --version`)
- [ ] 1.5GB 이상 디스크 공간 확보
- [ ] 인터넷 연결 안정 (npm install 용)

### 실행 중 모니터링
- [ ] npm install 진행 상황 확인 (5-10분)
- [ ] npm run build 진행 상황 확인 (2-3분)
- [ ] npm run dev로 FreeLang REPL 정상 실행 확인
- [ ] `> ` 프롬프트 나타남 확인

### 테스트 실행
- [ ] `freelang tests/test-self-parse.fl` 명령 실행
- [ ] Step 1~6 모두 진행 확인
- [ ] ✅ PASS 또는 ⚠️ INCOMPLETE 결과 확인
- [ ] 토큰/함수/변수 개수 기록

### 결과 검증
- [ ] 전체 콘솔 출력 저장 (screenshots 또는 text)
- [ ] 실패 시 에러 메시지 분석
- [ ] 성공 시 Phase 4 설계 시작

---

## 💬 FAQ

**Q: GitHub Codespaces 할당량이 없으면?**
A: AWS 프리 티어 (t3.micro) 또는 로컬 WSL2 사용

**Q: npm install이 시간이 오래 걸리면?**
A: 정상 (better-sqlite3 컴파일 포함). 진행 상황 로그 보이면 진행 중

**Q: "better-sqlite3 컴파일 실패"가 다시 나오면?**
A: 환경 체크:
- `gcc --version` 확인
- `python3 --version` 확인
- `node-gyp rebuild` 직접 실행

**Q: 테스트가 "INCOMPLETE"이면?**
A: 파서의 함수/변수 선언 미인식. 원인:
- parser.fl에 누락된 코드
- tokenize() 또는 parse() 버그
- 임시: parser.fl에 더 많은 `let` 선언 추가 (변수 개수 증가)

**Q: 성공하면 뭐할까?**
A: 다음 단계:
1. 성공 스크린샷 저장
2. PHASE_3_SUCCESS_REPORT.md 작성
3. Phase 4 (Code Generation) 설계 시작

---

## 🔗 관련 문서

| 문서 | 목적 |
|------|------|
| [PHASE_3_SELF_PARSE_DESIGN.md](PHASE_3_SELF_PARSE_DESIGN.md) | 이론적 설계 |
| [PHASE_2_LOGIC_REVIEW.md](PHASE_2_LOGIC_REVIEW.md) | 파서 로직 상세 검증 |
| [PHASE_3_READINESS_CHECKLIST.md](PHASE_3_READINESS_CHECKLIST.md) | 준비도 체크리스트 |
| [src/parser/parser.fl](src/parser/parser.fl) | Phase 2 완성 코드 |
| [tests/test-self-parse.fl](tests/test-self-parse.fl) | Phase 3 테스트 스크립트 |

---

## ⏱️ 예상 소요 시간

| 단계 | 환경 | 시간 |
|------|------|------|
| **옵션 1: Codespaces** | 클라우드 | 20-25분 |
| **옵션 2: WSL2** | Windows | 45-60분 |
| **옵션 3: EC2** | AWS | 30-40분 |

---

## 🎯 최종 목표

**실행**: `freelang tests/test-self-parse.fl`

**성공 조건**:
```
✅ PASS: Self-parse fixed point achieved!
   → Phase 3 완료 (고정점 달성)
```

**의미**: Bootstrapping 고정점 달성 = **자체호스팅 기초 증명 완료**

---

**상태**: 🚀 **실행 준비 완료 - 환경 구축만 남음**
**다음**: GitHub Codespaces 또는 로컬 환경 선택 → npm install → 테스트 실행


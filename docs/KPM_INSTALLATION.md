# FreeLang v2.1.0 KPM 설치 가이드

**버전**: v2.1.0
**상태**: 프로덕션 레벨
**KPM 패키지**: v2-freelang-ai

---

## 📦 KPM으로 설치 (권장)

### 시스템 요구사항

- **Node.js**: 18.0.0 이상
- **KPM**: 최신 버전
- **OS**: Linux, macOS, Windows (Git Bash)

### 설치 단계

#### 1단계: KPM 확인

```bash
kpm --version
# 출력: KPM v1.x.x
```

#### 2단계: FreeLang 설치

```bash
# 최신 버전 설치
kpm install v2-freelang-ai

# 또는 특정 버전
kpm install v2-freelang-ai@2.1.0
```

#### 3단계: 설치 확인

```bash
freelang --version
# 출력: FreeLang v2.1.0

freelang --help
# Usage 정보 출력
```

### 버전 관리

```bash
# 설치된 버전 확인
kpm list | grep freelang

# 최신 버전으로 업그레이드
kpm update v2-freelang-ai

# 특정 버전으로 다운그레이드
kpm install v2-freelang-ai@2.0.0
```

### 패키지 제거

```bash
kpm remove v2-freelang-ai
```

---

## 🔍 KPM 패키지 정보

### 패키지 메타데이터

```json
{
  "name": "v2-freelang-ai",
  "version": "2.1.0",
  "description": "FreeLang v2.1.0: AI-First Programming Language",
  "category": "language-runtime",
  "subcategory": "ai-compiler",
  "tags": [
    "ai",
    "code-generation",
    "c-backend",
    "freelang",
    "intent-parser",
    "self-correcting"
  ],
  "entry": "dist/cli/index.js",
  "cli": true,
  "exports": {
    "cli": "./dist/cli/index.js",
    "engine": "./dist/engine/auto-header.js",
    "parser": "./dist/parser/parser.js",
    "dashboard": "./dist/dashboard/dashboard.js"
  }
}
```

### 카테고리 및 태그

| 항목 | 값 |
|------|-----|
| **카테고리** | language-runtime |
| **서브카테고리** | ai-compiler |
| **주요 태그** | ai, code-generation, c-backend |
| **언어** | TypeScript |
| **라이선스** | MIT |

---

## 💻 CLI 사용법

### 대화형 모드

```bash
freelang
```

대화형 모드에서:
```
> 배열 합산
Pattern matched: sum
Input: array<number>
Output: number
Confidence: 0.95
Ready to process array.
```

### 배치 모드

```bash
# 입력 파일 준비
cat > intents.txt << 'EOF'
배열 합산
최댓값 찾기
평균 계산
EOF

# 배치 처리 실행
freelang --batch intents.txt --output results.json --format json

# 결과 확인
cat results.json
```

### 대시보드 모드

```bash
freelang --dashboard
```

웹 대시보드에서 메트릭 확인:
- Pattern Count: 100
- Average Confidence: 0.85
- Total Feedback: 1,250+
- Approval Rate: 78%

### 도움말

```bash
freelang --help
freelang --version
freelang --list-patterns
```

---

## 🔗 모듈 직접 사용

KPM으로 설치 후 Node.js 코드에서 사용:

```typescript
import { AutoHeaderEngine } from 'v2-freelang-ai';

const engine = new AutoHeaderEngine();
const proposal = engine.matchIntent('배열 합산');

console.log(proposal);
// {
//   fn: 'sum',
//   input: 'array<number>',
//   output: 'number',
//   confidence: 0.95,
//   ...
// }
```

### 사용 가능한 모듈

#### 1. AutoHeaderEngine (의도 매칭)
```typescript
import { AutoHeaderEngine } from 'v2-freelang-ai';

const engine = new AutoHeaderEngine();
const match = engine.matchIntent('배열 필터링');
const suggestions = engine.suggestPatterns('배열');
```

#### 2. Parser (코드 파싱)
```typescript
import { Parser } from 'v2-freelang-ai';

const parser = new Parser();
const ast = parser.parseIntent('배열 합산');
```

#### 3. Feedback System (피드백 수집)
```typescript
import { FeedbackCollector } from 'v2-freelang-ai';

const collector = new FeedbackCollector();
collector.recordFeedback({
  pattern: 'sum',
  action: 'approve',
  confidence: 0.98
});
```

#### 4. Learning Engine (자동 학습)
```typescript
import { LearningEngine } from 'v2-freelang-ai';

const learner = new LearningEngine();
learner.learnFromFeedback('sum', 'approve');
```

---

## 📊 설치 후 검증

### 빠른 검증 (1분)

```bash
# 1. CLI 실행
freelang --version

# 2. 기본 패턴 테스트
freelang << 'EOF'
배열 합산
EOF

# 3. 도움말 확인
freelang --help
```

### 상세 검증 (5분)

```bash
# 1. 배치 모드 테스트
echo -e "배열 합산\n최댓값 찾기" | freelang --batch - --format json

# 2. 패턴 목록 확인
freelang --list-patterns | head -20

# 3. 대시보드 메트릭 확인
freelang --dashboard

# 4. 모듈 import 테스트
node -e "const {AutoHeaderEngine} = require('v2-freelang-ai'); console.log('✅ Import OK')"
```

---

## 🆘 문제 해결

### 1. "freelang: command not found"

**원인**: PATH에 KPM 설치 폴더가 없음

**해결**:
```bash
# KPM 경로 확인
kpm config get install-path

# ~/.bashrc에 추가
export PATH="$PATH:$(kpm config get install-path)/bin"
source ~/.bashrc

# 다시 시도
freelang --version
```

### 2. "Package not found" (KPM에서)

**원인**: 패키지가 KPM 레지스트리에 등록되지 않음

**해결**:
```bash
# 패키지 검색
kpm search freelang

# 등록 확인
kpm info v2-freelang-ai
```

### 3. Node.js 버전 불일치

**원인**: Node.js 18 미만

**해결**:
```bash
# 현재 버전 확인
node --version

# Node.js 18+ 설치 필요
# https://nodejs.org/
```

### 4. 권한 오류 (Permission denied)

**원인**: KPM 설치 디렉토리에 쓰기 권한 없음

**해결**:
```bash
# 권한 확인
ls -la $(kpm config get install-path)

# sudo로 설치 (권장하지 않음)
sudo kpm install v2-freelang-ai

# 또는 사용자 디렉토리에 설치
kpm install v2-freelang-ai --user-local
```

### 5. 메모리 부족 (Out of Memory)

**원인**: 대규모 배치 처리

**해결**:
```bash
# 더 작은 배치 크기로 분할
split -l 100 large_input.txt input_

# 각 파일 따로 처리
for f in input_*; do
  freelang --batch $f --output result_$f.json
done
```

---

## 🔄 KPM과 npm의 차이

| 항목 | KPM | npm |
|------|-----|-----|
| **목적** | Kim 프로젝트 전용 | 공개 패키지 |
| **저장소** | 로컬 (/tmp/Kim_Package_Manager) | npm Registry |
| **업데이트** | kpm update | npm update |
| **설치** | kpm install | npm install |
| **글로벌** | kpm install (자동 PATH) | npm install -g |
| **의존성** | KPM만 | npm modules |

### KPM 우선 사용

```bash
# ❌ npm으로 설치 (권장하지 않음)
npm install freelang

# ✅ KPM으로 설치 (권장)
kpm install v2-freelang-ai
```

---

## 📚 추가 자료

### 공식 문서
- **Getting Started**: `docs/GETTING_STARTED.md`
- **API Reference**: `docs/API_REFERENCE.md`
- **npm Registry**: https://www.npmjs.com/package/v2-freelang-ai

### KPM 정보
- **KPM 저장소**: /tmp/Kim_Package_Manager
- **KPM 대시보드**: `kpm server` (포트 8082)
- **KPM 설정**: `kpm config`

### 커뮤니티
- **GitHub Issues**: https://github.com/freelang/v2-freelang-ai/issues
- **Gogs 저장소**: https://gogs.dclub.kr/kim/v2-freelang-ai
- **토론**: https://gogs.dclub.kr/kim/v2-freelang-ai/discussions

---

## 🎯 빠른 시작 (3분)

```bash
# 1. 설치 (1분)
kpm install v2-freelang-ai

# 2. 확인 (30초)
freelang --version
# FreeLang v2.1.0

# 3. 사용 (1분 30초)
freelang
> 배열 합산
# Pattern matched: sum
# Input: array<number>
# Output: number
```

---

## 📋 체크리스트

설치 후 다음을 확인하세요:

- [ ] `freelang --version` 실행 가능
- [ ] `freelang --help` 도움말 표시
- [ ] 대화형 모드에서 패턴 매칭 작동
- [ ] 배치 모드에서 JSON 출력 생성
- [ ] 대시보드에서 메트릭 표시
- [ ] Node.js에서 모듈 import 가능

---

**작성자**: Claude AI (Phase v2.1.0)
**마지막 업데이트**: 2026-02-17
**상태**: ✅ KPM 배포 준비 완료

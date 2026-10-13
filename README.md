# 🚀 신나는 구구단 탐험대 (Multiplication Table Game)

> **초등학교 2학년(만 7~8세) 학생들을 위한 반응형 웹 구구단 연습 게임**  
> 쉽고 재미있게 2단부터 9단까지의 구구단을 마스터할 수 있는 학습용 웹 애플리케이션입니다.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Play%20Now-brightgreen?style=for-the-badge&logo=github)](https://wbmaker2.github.io/multiplication-table/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/WBmaker2/multiplication-table)

---

## 🌐 서비스 바로가기 (Live Demo)

- **배포 서비스 URL**: [https://wbmaker2.github.io/multiplication-table/](https://wbmaker2.github.io/multiplication-table/)
- **GitHub 저장소**: [https://github.com/WBmaker2/multiplication-table](https://github.com/WBmaker2/multiplication-table)

별도의 앱 설치 없이 PC, 태블릿, 스마트폰 브라우저에서 바로 실행할 수 있습니다.

---

## ✨ 주요 기능 (Key Features)

### 1. 2단~9단 랜덤 구구단 문제 출제
- $2 \sim 9$단 $\times 1 \sim 9$ 범위에서 랜덤으로 1문제씩 출제됩니다.
- 직전 문제와 동일한 문제가 연속 출제되지 않도록 방지 로직이 적용되어 다양한 문제를 골고루 연습할 수 있습니다.

### 2. 초등 2학년 눈높이에 맞춘 대형 UI 및 듀얼 입력 지원
- **시인성 높은 대형 숫자 카드**: 스케치북/칠판 감성의 큼직하고 알록달록한 폰트 ($3 \times 5 = ?$).
- **화면 온스크린 키패드**: 태블릿이나 모바일 기기에서도 손쉽게 탭할 수 있는 큼직한 터치 키패드 제공.
- **물리 키보드 완벽 지원**: 숫자키(`0~9`), 지우기(`Backspace`, `Delete`), 제출 및 다음 문제 넘어가기(`Enter`) 지원.
- **빈 값 제출 방지**: 숫자를 입력하지 않고 제출 시 카드가 흔들리는(Wiggle) 부드러운 유도 애니메이션 제공.

### 3. 직관적이고 따뜻한 학습 피드백
- **정답 판정 시**:
  - 화면 가득 **"🎉 정답! 참 잘했어요!"** 축하 모달 표시
  - 화려한 색종이 폭죽 효과 (Canvas Confetti)
  - 경쾌한 도-미-솔-도 아르페지오 사운드 재생
  - 연속 정답(🔥 Streak), 모은 별(⭐ Stars), 맞힌 문제 수(🏆 Score) 보상 누적
- **오답 판정 시**:
  - **"아쉬워요! 정답은 ___이에요. 다시 힘내봐요! 💪"** 따뜻한 격려 문구 표시
  - 부드러운 하향 효과음 및 연속 정답 카운트 리셋 (전체 점수와 별은 보존)
- **원터치 다음 문제 진행**:
  - 피드백 확인 후 `Enter` 키 또는 "다음 문제" 버튼 클릭으로 즉시 새 문제로 진행.

### 4. 무설치·무지연 Web Audio API 효과음
- 외부 MP3 파일 다운로드 없이 브라우저 내장 Web Audio API를 활용한 순수 신디사이저 사운드.
- 네트워크 지연 없이 즉각 반응하며, 상단 볼륨 아이콘을 통해 원클릭 음소거 가능.

---

## 🛠 기술 스택 (Tech Stack)

| 구분 | 기술 / 라이브러리 |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite 6 |
| **Styling** | Tailwind CSS (반응형 모바일·태블릿 최적화, 커스텀 키프레임 애니메이션) |
| **Icons** | Lucide React |
| **Effects** | Canvas-Confetti, Web Audio API (합성 멜로디 생성) |
| **Testing** | Vitest, @testing-library/react, @testing-library/jest-dom (31개 테스트 100% 통과) |
| **Deployment** | GitHub Pages (gh-pages 브랜치 배포) |

---

## 📁 프로젝트 구조 (Project Structure)

```
multiplication-table/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # 타이틀, 점수판(별/연속/점수), 음소거 버튼
│   │   ├── QuizCard.tsx         # 구구단 수식 카드, 정답 입력창, 확인 버튼
│   │   ├── Keypad.tsx           # 화면 터치용 0~9, 지우기, 확인 키패드
│   │   └── FeedbackOverlay.tsx  # 정답/오답 팝업 및 다음 문제 버튼
│   ├── utils/
│   │   ├── gameLogic.ts         # 2~9단 랜덤 출제 및 채점 로직
│   │   └── soundEffects.ts      # Web Audio API 사운드 신디사이저
│   ├── App.tsx                  # 메인 게임 상태 및 입력 이벤트 제어
│   ├── main.tsx                 # 애플리케이션 진입점
│   └── index.css                # Tailwind CSS 지시문 및 터치 스타일
├── tests/                       # 단위 및 통합 테스트 스위트 (31개 테스트)
├── docs/                        # SDD 설계서 및 구현 계획서
├── index.html                   # HTML 템플릿
├── vite.config.ts               # Vite & GitHub Pages base 경로 설정
└── package.json
```

---

## 💻 로컬 개발 및 실행 (Getting Started)

### 1. 저장소 클론
```bash
git clone https://github.com/WBmaker2/multiplication-table.git
cd multiplication-table
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173/multiplication-table/`로 접속합니다.

### 4. 테스트 실행
```bash
npm test
```

### 5. 프로덕션 빌드
```bash
npm run build
```

---

## 📜 라이선스 (License)

This project is licensed under the MIT License.

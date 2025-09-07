# 📝 Todo List - Vanilla JavaScript

> 순수 JavaScript로 만든 할일 관리 앱

## 주요 기능

- 할 일 추가, 삭제, 완료 처리
- 전체/미완료/완료 필터링
- localStorage를 통한 데이터 영속성

## 진행 현황

### 필터링
- [ ] 필터링 기능 구현
- [ ] 필터 버튼 UI 상태 업데이트
- [ ] 전체/미완료/완료 필터링 로직
- [ ] 필터 상태 저장

### 데이터 영속성
- [x] localStorage 데이터 저장
- [ ] localStorage 데이터 복원
- [ ] 초기 구동 시 데이터 로드
- [x] 저장 타이밍 결정

#### 성공 기준
- [ ] 새로고침 시 목록 유지
- [ ] 새로고침 시 필터 상태 유지

## 리팩토링 및 구조화
1. `mutations` 객체로 상태 변경 함수 분리 (storeKey, filter 적용)
2. `selectors` 객체로 상태 조회 함수 분리
3. 코드 중복 제거 (localStorage 관련)
4. 함수 책임 명확화

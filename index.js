// 상태 & DOM 캐시 (가이드만 제공)
let state = [];              // [{id, text, done, createdAt}]
let filter = 'all';

const $form   = document.querySelector('#todo-form');
const $input  = document.querySelector('#todo-input');
const $list   = document.querySelector('#todo-list');
const $filter = document.querySelector('.filters');

// 유틸만 제공 (학생이 사용할 수 있게)
const uid = () => Math.random().toString(36).slice(2, 9);

function render() {
  // TODO: filter에 맞게 state를 걸러서 <li> 목록을 그리기
  // TODO: 필터 버튼 is-active 토글
}

function addTodo(text) {
  // TODO: state 맨 앞에 {id,text,done:false,createdAt:Date.now()} 추가
  // TODO: render 호출
}

// 이벤트 배선(비어있는 콜백만 제공)
$form.addEventListener('submit', (e) => {
  e.preventDefault();
  // TODO: 입력값 검증 후 addTodo 호출, 입력창 비우기
});

$filter.addEventListener('click', (e) => {
  // TODO: data-filter 읽어 filter 변경 → render
});

// 초기 호출
render();

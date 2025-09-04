
import { getItem, setItem } from './storage.js';
import {FILTER,STORE_KEY} from "./mutation.js"

// 상태 & DOM 캐시 (가이드만 제공)
let state = [];              // [{id, text, done, createdAt}]
let filter = FILTER.ALL; //



const $form   = document.querySelector('#todo-form');
const $input  = document.querySelector('#todo-input');
const $list   = document.querySelector('#todo-list');
const $filter = document.querySelector('.filters');

// 유틸만 제공 (학생이 사용할 수 있게)
const uid = () => Math.random().toString(36).slice(2, 9);


$list.addEventListener('click', (e) => {
  

  const li = e.target.closest('li')
  const id = li.dataset.id;
  const todo = state.find(item => item.id === id);
  if (!todo) return;
  

  // 체크박스
  if (e.target.matches('input[type="checkbox"]')) { 
    todo.done = e.target.closest('input').checked;
    render();
  }
  // 삭제
  if (e.target.matches('.remove')) {
    state = state.filter(item => item.id !== id);
    render();
  }

 })





function render() {
  let filtered = state;
  if (filter === FILTER.ACTIVE) {
    filtered = state.filter(item => !item.done);
    
  } else if (filter === FILTER.DONE) {
    filtered = state.filter(item => item.done);
  }

  $list.innerHTML = filtered.map(item => `
    <li data-id="${item.id}" class="${item.done ? 'done' : ''}">
      <input type="checkbox" ${item.done ? 'checked' : ''}>
      <span>${item.text}</span>
      <button class="remove">삭제</button>
    </li>
  `).join('');

  // 필터 버튼 is-active 토글
  $filter.querySelectorAll('button').forEach($btn => {
    $btn.classList.toggle('is-active', $btn.dataset.filter === filter);
  });

  saveLocalStorage()

}

function addTodo(text) {
  state.push({ id: uid(), text, done: false, createdAt: Date.now() });
  render();
}

// 이벤트 배선(비어있는 콜백만 제공)
$form.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = $input.value.trim();
  if (!text) {
    alert("내용을 입력해주세요");
    $input.focus();
    return;
  }
    addTodo(text);
  $input.value = '';
  
});

$filter.addEventListener('click', (e) => {


  filter = e.target.dataset.filter;

  [...$filter.children].forEach($btn => {
    $btn.classList.toggle('is-active', $btn.dataset.filter === filter);
  });

  setItem(STORE_KEY.FILTERS, filter);
  render()

});

function saveLocalStorage() {
  setItem(STORE_KEY.TODOS, state);
}

function loadLocalStorage() {
  const todos = getItem(STORE_KEY.TODOS);
  const filters = getItem(STORE_KEY.FILTERS) || FILTER.ALL;

  filter = filters;
  if (Array.isArray(todos)) {
    state = todos;
  }
}

// 초기 호출
loadLocalStorage()
render();




import { STORAGE_KEY } from "./constants/enums.js";
import { mutations, selectors, state, storage } from "./utils/store.js"


let filter = 'all';

const $form   = document.querySelector('#todo-form');
const $input = document.querySelector('#todo-input');
const $list   = document.querySelector('#todo-list');
const $filter = document.querySelector('.filters');


// 상태 변경 + 렌더링 + 로컬스토리지 저장
function commit(mutFn) {
  mutFn();
  storage.set(STORAGE_KEY.todos, state);
  render()
}


function render() {
  const filterSelectors = selectors.visible(state, filter)
  $list.innerHTML = `
    ${filterSelectors.map(todo => `
      <li data-id="${todo.id}" class="${todo.done ? 'done' : ''}">
      <input type="checkbox" class="checkbox" ${todo.done ? 'checked' : ''}>
        <span>${todo.text}</span>
        <button class="delete-btn">삭제</button>
      </li>
    `).join('')}
  `  
}

// 삭제
$list.addEventListener("click", () => {
  const li = e.target.closest('li')
  
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.classList.contains('delete-btn')) {
    commit(() => mutations.delete(id))
  }
})
// 체크박스
$list.addEventListener('change', (e) => {
  const li = e.target.closest('li')
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.classList.contains('checkbox')) {
    commit(() => mutations.toggle(id, filter))
  }
})
// 추가
$form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const text = $input.value.trim()
  if (!text) {
    return alert('할 일을 입력해주세요!')
  }
  commit(() => mutations.add(text))
  $input.value = '';
});

// 필터링
$filter.addEventListener('click', (e) => {
  filter = e.target.dataset.filter;
  [...$filter.children].forEach(($btn) => {
    $btn.classList.toggle('is-active',$btn.dataset.filter === filter)
  })
  render()
});
  
// 초기화
  mutations.init(STORAGE_KEY.todos);
  render();

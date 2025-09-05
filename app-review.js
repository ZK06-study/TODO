// 상태 & DOM 캐시 (가이드만 제공)
let state = [];              // [{id, text, done, createdAt}]
let filter = 'all';

const $form   = document.querySelector('#todo-form');
const $input = document.querySelector('#todo-input');

const $list   = document.querySelector('#todo-list');
const $filter = document.querySelector('.filters');

const uid = () => Math.random().toString(36).slice(2, 9);



function render() {
  // 필터 버튼 is-active 토글
  let filterState = state
  if (filter === 'active') {
    filterState = state.filter(item => !item.done)
  } else if (filter === 'done') {
    filterState = state.filter(item => item.done)
  }
  
// filter에 맞게 state를 걸러서 <li> 목록을 그리기
  $list.innerHTML = `
    ${filterState.map(todo => `
      <li data-id="${todo.id}" class="${todo.done ? 'done' : ''}">
      <input type="checkbox" class="checkbox" ${todo.done ? 'checked' : ''}>
        <span>${todo.text}</span>
        <button class="delete-btn">삭제</button>
      </li>
    `).join('')}
  `
}

$list.addEventListener('click', (e) => {
  const li = e.target.closest('li')
  const id = li.dataset.id;

  // 1. 삭제 버튼 클릭 시 리스트 삭제
  if (e.target.classList.contains('delete-btn')) {
    state = state.filter(todo => todo.id !== id);
    render();
  }

  // 2. 체크박스 클릭 시 상태 변경
  if (e.target.classList.contains('checkbox')) {
    const todo = state.find(todo => todo.id === id);
    todo.done = !todo.done;
    render();
  }
})


function addTodo(text) {
  state.unshift({ id: uid(), text, done: false, createdAt: Date.now() });

  $list.innerHTML = `
    ${state.map(todo => `
      <li data-id="${todo.id}" class="${todo.done ? 'done' : ''}">
      <input type="checkbox" class="checkbox" ${todo.done ? 'checked' : ''}>
        <span>${todo.text}</span>
        <button class="delete-btn">삭제</button>
      </li>
    `).join('')}
  `
}

// 이벤트 배선(비어있는 콜백만 제공)
$form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const text = $input.value.trim()
  if (!text) {
    return 
  }
  addTodo(text)

  $input.value = '';

});


$filter.addEventListener('click', (e) => {
  filter = e.target.dataset.filter;
  [...$filter.children].forEach(($btn) => {
    $btn.classList.toggle('is-active',$btn.dataset.filter === filter)
  })
  render()
});

// 초기 호출
render();

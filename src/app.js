import { STORAGE_KEY } from "./constants/enums.js";
import { mutations, selectors, state, storage } from "./utils/store.js";

let filter = "all";
let editingId = null; // 현재 수정 중인 할 일의 ID

// 필터 상태 관리 함수들
function saveFilter(filterValue) {
  localStorage.setItem("todo-filter", filterValue);
}

function loadFilter() {
  return localStorage.getItem("todo-filter") || "all";
}

function updateFilterUI(selectedFilter) {
  [...$filter.children].forEach(($btn) => {
    $btn.classList.toggle("is-active", $btn.dataset.filter === selectedFilter);
  });
}

const $form = document.querySelector("#todo-form");
const $input = document.querySelector("#todo-input");
const $list = document.querySelector("#todo-list");
const $filter = document.querySelector(".filters");
const $clearCompleted = document.querySelector("#clear-completed");

// 상태 변경 + 렌더링 + 로컬스토리지 저장
function commit(mutFn) {
  mutFn();
  storage.set(STORAGE_KEY.todos, state);
  render();
}

function render() {
  const filterSelectors = selectors.visible(state, filter);
  $list.innerHTML = `
    ${filterSelectors
      .map(
        (todo) => `
      <li data-id="${todo.id}" class="${todo.done ? "done" : ""}">
      <input type="checkbox" class="checkbox" ${todo.done ? "checked" : ""}>
        ${
          editingId === todo.id
            ? `<input type="text" class="edit-input" value="${todo.text}" data-id="${todo.id}">`
            : `<span class="todo-text">${todo.text}</span>`
        }
        <button class="delete-btn">삭제</button>
      </li>
    `
      )
      .join("")}
  `;

  $clearCompleted.style.display = selectors.hasCompleted(state)
    ? "block"
    : "none";
}

// 삭제
$list.addEventListener("click", (e) => {
  const li = e.target.closest("li");

  if (!li) return;
  const id = li.dataset.id;

  if (e.target.classList.contains("delete-btn")) {
    commit(() => mutations.delete(id));
  }
});

// 더블클릭으로 수정 모드 진입
$list.addEventListener("dblclick", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  const id = li.dataset.id;
  const todoText = e.target.closest(".todo-text");

  if (todoText) {
    editingId = id;
    render();
    // 수정 입력 필드에 포커스
    const editInput = document.querySelector(`.edit-input[data-id="${id}"]`);
    if (editInput) {
      editInput.focus();
      editInput.select();
    }
  }
});
// 체크박스
$list.addEventListener("change", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.classList.contains("checkbox")) {
    commit(() => mutations.toggle(id));
  }
});

// 수정 완료/취소 이벤트 핸들러
$list.addEventListener("keydown", (e) => {
  if (e.target.classList.contains("edit-input")) {
    const id = e.target.dataset.id;

    if (e.key === "Enter") {
      // 엔터키: 수정 완료
      const newText = e.target.value.trim();
      if (newText) {
        commit(() => mutations.edit(id, newText));
      }
      editingId = null;
      render();
    } else if (e.key === "Escape") {
      // ESC키: 수정 취소
      editingId = null;
      render();
    }
  }
});

// 수정 입력 필드 외부 클릭 시 수정 완료
$list.addEventListener(
  "blur",
  (e) => {
    if (e.target.classList.contains("edit-input")) {
      const id = e.target.dataset.id;
      const newText = e.target.value.trim();

      if (newText) {
        commit(() => mutations.edit(id, newText));
      }
      editingId = null;
      render();
    }
  },
  true
);

// 추가
$form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = $input.value.trim();
  if (!text) {
    return alert("할 일을 입력해주세요!");
  }
  commit(() => mutations.add(text));
  $input.value = "";
});

// 필터링
$filter.addEventListener("click", (e) => {
  filter = e.target.dataset.filter;
  saveFilter(filter); // 필터 상태를 localStorage에 저장
  updateFilterUI(filter); // 필터 UI 업데이트
  render();
});

// 완료된 할 일 모두 삭제
$clearCompleted.addEventListener("click", () => {
  if (confirm("완료된 할 일을 모두 삭제하시겠습니까?")) {
    commit(() => mutations.clearCompleted());
  }
});

// 초기화
mutations.init(STORAGE_KEY.todos);
filter = loadFilter(); // 저장된 필터 상태 복원
updateFilterUI(filter); // 필터 UI 업데이트
render();

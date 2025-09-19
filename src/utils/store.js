const getUid = () => Math.random().toString(36).slice(2, 9);

let state = [];

// 💡 mutations(상태 변경)
const mutations = {
  // 초기화: storage에서 복원
  init(key) {
    const saved = storage.get(key);
    state = Array.isArray(saved) ? saved : [];
  },
  // 할 일 추가
  add(text) {
    const t = (text ?? "").toString().trim();
    if (!t) return; // 빈 문자열 방지

    const newTodo = {
      id: getUid(),
      text: t,
      done: false,
      createdAt: Date.now(),
    };
    state = [newTodo, ...state];
  },

  // 완료 여부 토글
  toggle(id) {
    state = state.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );
  },

  // 할 일 수정
  edit(id, newText) {
    const text = (newText ?? "").toString().trim();
    if (!text) return; // 빈 문자열 방지

    state = state.map((todo) => (todo.id === id ? { ...todo, text } : todo));
  },

  // 할 일 삭제
  delete(id) {
    state = state.filter((todo) => todo.id !== id);
  },

  // 완료된 할 일 모두 삭제
  clearCompleted() {
    state = state.filter((todo) => !todo.done);
  },
};

// 💡 selectors(상태 조회)
// DOM에 보여줄 값을 반환
const selectors = {
  all: (s) => s,
  visible: (s, filter) => {
    if (filter === "active") return s.filter((t) => !t.done);
    if (filter === "done") return s.filter((t) => t.done);
    return s;
  },
  hasCompleted: (s) => s.some((todo) => todo.done),
};

const storage = {
  set(key, state) {
    localStorage.setItem(key, JSON.stringify(state));
  },
  get(key) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  },
};

export { state, mutations, storage, selectors };

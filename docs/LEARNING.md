### 2. **docs/LEARNING.md** (학습 내용 정리)

## 💡 핵심 학습 내용

### 1. 이벤트 위임과 closest()

#### `closest()`

- closest(selector)는 현재 요소에서 시작해서 부모 방향으로 거슬러 올라가며, 주어진 선택자와 일치하는 첫번째 요소를 반환하는 메서드이다.
- 만약 일치하는 요소가 없다면 Null을 반환한다.

#### 문법

```js
element.closet(selector);
```

#### 왜 사용해야 할까?

##### 문제 상황

할 일 목록을 클릭할 때, `<li>`단위 (=하나의 todo 항목)을 기준으로 동작을 처리해야 한다.
하지만 이벤트를 위임하면 실제 클릭된 요소(e.target)는 다양할 수 있다.

```js
<ul id="todo-list" class="todo-list">
	<li data-id="abc123">
	  <input type="checkbox">     ← 여기 클릭
	  <span>할일 내용</span>        ← 또는 여기 클릭
	  <button class="remove">삭제</button>  ← 또는 여기 클릭
	</li>
</ul>
```

```js
const $list = document.querySelector("#todo-list");

$list.addEventListener("click", (e) => {
  console.log("🐶", e.target);
});
// 삭제 버튼 클릭 시: <button class="delete-btn">삭제</button>
// 클릭 위치에 따라 e.target은 checkbox, span, button이 될 수 있다.
```

👉 하지만 진짜로 조작해야하는 것은 항상 `<li>` 전체 (todo 항목)이다.

#### 해결방법: `closest('li')`

```js
$list.addEventListener("click", (e) => {
  const li = e.target.closest("li"); // 가장 가까운 li 요소 찾기
  if (!li) return; // li가 없으면 무시
  const id = li.dataset.id; // data-id 속성 값 가져오기
  console.log(id);
});
```

e.target : 실제 클릭한 요소
closest('li'): 클릭된 요소에서 상위로 올라가며 `<li>`태그를 찾는다.
li.dataset.id : data에 저장되어 있는 id를 선택

---

#### 이벤트 위임 + closest()의 장점

1. 코드 단순화: 버튼/체크박스/span 등 여러 요소에 각각 리스너를 붙이지 않아도 됨.
   → 부모 `<ul>`에 한 번만 이벤트 등록하면 끝.

2. 동적 요소 처리: 새로 추가된 `<li>`에도 자동으로 이벤트가 적용됨.
   → 새로고침 없이도 바로 동작.

3. 유지보수 편리: 클릭한 요소가 어디든, 항상 `<li>` 기준으로 데이터를 가져올 수 있음.

---

### 2. 클로저를 활용해 상태 변경 함수 분리하기

state 배열을 직접 수정하는 방식으로 사용하였는데 이렇게 사용하니까, 상태의 변경이 있을 때마다 추적이 어려워 유지 보수가 어려워졌다. 이럴때 React에서 useState를 사용하는 것과 같이 클로저를 사용해서 mutation 객체로 리팩토링을 진행하였다.

#### 클로저

- 클로저는 함수가 선언될 당시의 스코프에 있는 변수에 계속 접근할 수 있는 성질을 말합니다.

```js
function makeCounter() {
  let count = 0; // 외부 스코프 변수
  return function () {
    // 내부 함수
    return ++count; // 외부 변수를 참조
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

➡️ counter는 count를 기억하는 클로저.

#### 클로저로 mutations 구현하기

todo 앱의 상태도 같은 방식으로 관리할 수 있다.
외부 스코프에 state를 정의하고, 이를 다루는 함수들을 mutations 객체 안에 모아두는 방식이다.

```js
let state = []; // 외부 스코프의 상태

const mutations = {
  add(text) {
    state.unshift({ id: Date.now(), text, done: false });
  },
  toggle(id) {
    const todo = state.find((t) => t.id === id);
    if (todo) todo.done = !todo.done;
  },
  delete(id) {
    state = state.filter((t) => t.id !== id);
  },
};
```

- state는 mutations 객체 바깥에 정의되어 있지만,
- add, toggle, delete 함수 내부에서 접근할 수 있습니다.
- 즉, 이 함수들은 모두 state를 기억하는 클로저입니다.

👉 이렇게 클로저를 활용하니 단순히 코드를 “깔끔하게” 정리하는 수준을 넘어, 상태 관리의 안정성과 일관성까지 얻을 수 있게 된다.

### 3. selectors 객체로 상태 조회 함수 분리

mutations로 상태 변경을 분리한 것처럼,상태 조회 로직도 따로 모아두면 더 깔끔해진다.
UI나 DOM은 state를 직접 들여다보지 않고, selectors가 반환해주는 값만 쓰게 하는 방식이다.

#### selectors 구현하기

```js
const selectors = {
  all: (s) => s,
  visible: (s, filter) => {
    if (filter === "active") return s.filter((t) => !t.done);
    if (filter === "done") return s.filter((t) => t.done);
    return s;
  },
};
```

- all은 전체 state를 반환한다.
- visible은 필터 값에 따라 완료/미완료 항목만 걸러낸다.
- 중요한 건 **selectors는 state를 읽기만 한다는 것.**
- 절대 상태를 바꾸지 않는다.

#### 왜 selectors로 분리할까?

1. 책임 분리: 조회는 selectors, 변경은 mutations → 역할이 명확하다.
2. 가독성: UI 쪽 코드가 단순해진다.

```js
const todos = selectors.visible(state, filter);
render(todos);
```

3. 안정성: 어디서 상태를 읽고 바꾸는지 한눈에 보인다.

👉 mutations가 쓰기 전용이라면, selectors는 읽기 전용이다.
읽기/쓰기를 분리하니까 코드 구조가 훨씬 명확해지고 유지보수가 쉬워졌다.
이제 렌더 함수는 selectors를 통해 걸러진 데이터를 받고,
실제 변경은 mutations로만 하니까 상태 관리 흐름이 깔끔해졌다.

## 📌 Lessons Learned

1. `closest()`를 이용하면 이벤트 위임 시 클릭된 요소가 다양해도 항상 원하는 기준 요소(`<li>`)를 안정적으로 찾을 수 있다.
2. 클로저를 활용하면 상태 변경 함수를 한 곳으로 모아두고, 추적 가능성과 유지보수성을 크게 높일 수 있다.
3. selectors를 도입해 조회 로직을 분리하면 읽기/쓰기 경로가 명확해지고, UI 코드가 단순해진다.

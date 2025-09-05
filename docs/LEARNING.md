### 2. **docs/LEARNING.md** (학습 내용 정리)
# 📚 Todo List 만들며 배운 것들

## 💡 핵심 학습 내용

### 1. 이벤트 위임과 closest()
closest(): 현재 요소에서 시작해서 부모 방향으로 올라가며 조건에 맞는 첫번째 요소를 찾는 메서드 

#### 문법
```js
element.closet(selector)
```

#### 왜 사용해야 할까? 
##### 문제 상황
삭제 button이 아닌 할일 목록이 적혀있는 li자체가 삭제되어야 함
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
const $list = document.querySelector('#todo-list');

$list.addEventListener('click', (e) => {
  console.log('🐶',e.target)
})
// 삭제 버튼 클릭 시: <button class="delete-btn">삭제</button>
```
```js
const li = e.target.closest('li')
const id = li.dataset.id;
```

e.target : 실제 클릭한 요소
closest('li'): 클릭된 요소에서 상위로 올라가며 <li>태그를 찾는다.
li.dataset.id : data에 저장되어 있는 id를 선택




### 2. 상태 관리 패턴


### 3. ES6 모듈 시스템


### 4. 리팩토링
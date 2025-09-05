
const uid = () => Math.random().toString(36).slice(2, 9);
let state = [];              // [{id, text, done, createdAt}]

const mutations = {
    
    add(text){
        state.unshift({ id: uid(), text, done: false, createdAt: Date.now() });
    },

    toggle(id) {
        const todo = state.find(todo => todo.id === id);
        if (todo) {
            todo.done = !todo.done;
        }
    },

    delete(id) {
        state = state.filter(todo => todo.id !== id);
    }

}

export { state, mutations };  // ✅ 둘 다 export

var _a, _b;
var tabItem = (document.querySelectorAll('.tab-item'));
var tabContent = (document.querySelectorAll('.tab-content'));
var form = document.querySelector('.form-container');
var formInput = document.querySelector('.form-input');
var formLabel = document.querySelector('.form-label');
var todoList = document.querySelector('.todo-list');
var completedList = document.querySelector('.completed-list');
var deletedList = document.querySelector('.deleted-list');
var completeDeletedBtn = (document.querySelector('.completed-delete-button'));
var toDoList = JSON.parse((_a = localStorage.getItem('TODO')) !== null && _a !== void 0 ? _a : '[]');
var deletedToDoList = JSON.parse((_b = localStorage.getItem('DELETE_TODO')) !== null && _b !== void 0 ? _b : '[]');
// 탭 클릭시 실행되는 함수
var handleTabClick = function (event) {
    var _a;
    var tabTarget = event.target;
    var target = tabTarget.dataset.tab;
    tabItem.forEach(function (item) {
        item.classList.remove('active');
    });
    tabContent.forEach(function (content) {
        content.classList.remove('target');
    });
    (_a = document.querySelector("#".concat(target))) === null || _a === void 0 ? void 0 : _a.classList.add('target');
    tabTarget.classList.add('active');
};
// Date를 YYYY-MM-dd HH:mm:ss 으로 변환하는 함수
var dateFormat = function (date) {
    var prependZero = function (num) {
        // 숫자가 한자릿수인 경우, 앞자리에 0을 붙이는 함수
        if (num < 10) {
            return "0".concat(num);
        }
        return num;
    };
    var _a = [
        // 연도, 월, 일
        date.getFullYear(),
        prependZero(date.getMonth() + 1),
        prependZero(date.getDay()),
    ], year = _a[0], month = _a[1], day = _a[2];
    var _b = [
        // 시, 분, 초
        prependZero(date.getHours()),
        prependZero(date.getMinutes()),
        prependZero(date.getSeconds()),
    ], hour = _b[0], minutes = _b[1], seconds = _b[2];
    return "".concat(year, "-").concat(month, "-").concat(day, " ").concat(hour, ":").concat(minutes, ":").concat(seconds);
};
// 체크박스 클릭시 실행되는 함수
var handleCheckChange = function (id) {
    toDoList.filter(function (todo) {
        if (todo.id === Number(id)) {
            return (todo.completed = !todo.completed);
        }
    });
    saveTodo();
    addTodoList();
};
// 로컬스토리지에 할 일을 저장하는 함수
var saveTodo = function () {
    localStorage.setItem('TODO', JSON.stringify(toDoList));
};
// 로컬스토리지에 삭제된 할 일을 저장하는 함수
var saveDeletedTodo = function () {
    localStorage.setItem('DELETE_TODO', JSON.stringify(deletedToDoList));
};
// 할 일 단일 삭제 함수
var deleteTodo = function (id) {
    toDoList = toDoList.filter(function (todo) {
        if (todo.id === Number(id)) {
            deletedToDoList.push(todo);
            return saveDeletedTodo();
        }
        return todo.id !== Number(id);
    });
    saveTodo();
    addTodoList();
};
var createTodo = function (newTodo) {
    var todo = document.createElement('div');
    var content = "\n    <input class='checkbox' type='checkbox' ".concat(newTodo.completed ? 'checked' : '', " />\n    <span class='text' style='background-color:").concat(newTodo.label, ";'>").concat(newTodo.text, "</span>\n    <span>(\uB4F1\uB85D) ").concat(newTodo.createAt, "</span>\n    ").concat(newTodo.update ? "<span>(\uC218\uC815) ".concat(newTodo.updateAt, "</span>") : '', "\n    <button class='update-button'>\uC218\uC815</button>\n    <button class='delete-button'>\uC0AD\uC81C</button>\n  ");
    todo.className = 'content';
    todo.innerHTML = content;
    todo.id = newTodo.id.toString();
    todo.querySelectorAll('input').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () { return handleCheckChange(todo.id); });
    });
    todo.querySelectorAll('button').forEach(function (button) {
        if (button.className === 'delete-button') {
            return button.addEventListener('click', function () { return deleteTodo(todo.id); });
        }
    });
    return todo;
};
var deletedTodo = function (item) {
    var todo = document.createElement('div');
    var content = "\n  <span class='text' style='background-color:".concat(item.label, ";'>").concat(item.text, "</span>\n  <span>").concat(item.createAt, "</span>\n  ");
    todo.className = 'content';
    todo.innerHTML = content;
    return todo;
};
var addTodoList = function () {
    var incomplete = toDoList.filter(function (item) { return !item.completed; });
    var completed = toDoList.filter(function (item) { return item.completed; });
    todoList.innerHTML = '';
    incomplete.forEach(function (item) {
        var todo = createTodo(item);
        todoList.appendChild(todo);
    });
    completedList.innerHTML = '';
    completed.forEach(function (item) {
        var todo = createTodo(item);
        completedList.appendChild(todo);
    });
    deletedList.innerHTML = '';
    deletedToDoList.forEach(function (item) {
        var todo = deletedTodo(item);
        deletedList.appendChild(todo);
    });
};
// 추가 버튼 클릭시 실행되는 함수
var handleSubmit = function (event) {
    event.preventDefault();
    if (formInput.value.length < 1 || formInput.value.length > 20) {
        return alert('글자수를 확인해주세요.');
    }
    var newTodo = {
        id: toDoList.length + 1,
        text: formInput.value,
        label: formLabel.value,
        createAt: dateFormat(new Date()),
        completed: false,
        update: false,
    };
    toDoList.push(newTodo);
    saveTodo();
    addTodoList();
    formInput.value = '';
    formLabel.value = '#000000';
};
tabItem.forEach(function (tab) {
    tab.addEventListener('click', handleTabClick);
});
form.addEventListener('submit', handleSubmit);
window.addEventListener('DOMContentLoaded', addTodoList);

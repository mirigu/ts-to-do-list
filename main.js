var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a, _b;
var tabItem = (document.querySelectorAll('.tab-item'));
var tabContent = (document.querySelectorAll('.tab-content'));
var form = document.querySelector('.form-container');
var formInput = document.querySelector('.form-input');
var formLabel = document.querySelector('.form-label');
var todoList = document.querySelector('.todo-list');
var completedList = document.querySelector('.completed-list');
var deletedList = document.querySelector('.deleted-list');
var buttonBox = document.querySelector('.delete-button-box');
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
    renderTodoList();
};
// 로컬스토리지에 할 일을 저장하는 함수
var saveTodo = function () {
    localStorage.setItem('TODO', JSON.stringify(toDoList));
};
// 로컬스토리지에 삭제된 할 일을 저장하는 함수
var saveDeletedTodo = function () {
    localStorage.setItem('DELETE_TODO', JSON.stringify(deletedToDoList));
};
// 할 일 수정 후 저장시 실행되는 함수
var handleEditSubmit = function (e, id) {
    e.preventDefault();
    var editInput = document.querySelector('.edit-input');
    var editLabel = document.querySelector('.edit-label');
    var updatedTodoList = toDoList.map(function (item) {
        return item.id === Number(id)
            ? __assign(__assign({}, item), { text: editInput.value, label: editLabel.value, update: true, updateAt: dateFormat(new Date()) }) : item;
    });
    toDoList = updatedTodoList;
    saveTodo();
    renderTodoList();
};
// 할 일을 수정하지 않고 취소 버튼을 클릭할 경우 실행되는 함수
var handleEditCancel = function (e) {
    e.preventDefault();
    renderTodoList();
};
// 할 일 수정하는 함수
var updateTodo = function (e, todo, id) {
    var editToDo = toDoList.find(function (item) { return item.id === Number(id); });
    if (!editToDo)
        return;
    todo.innerHTML = "<form class='edit-form'>\n    <input type='checkbox' ".concat(editToDo.completed ? 'checked' : '', " />\n    <input class='edit-input' value=").concat(editToDo.text, " />\n    <input class='edit-label' type='color' value=").concat(editToDo.label, " /> \n    <button class='edit-button' type='submit'>\uC800\uC7A5</button>\n    <button class='cancel-button'>\uCDE8\uC18C</button>\n    </form>\n    ");
    var editForm = document.querySelector('.edit-form');
    var cancelButton = (editForm.querySelector('.cancel-button'));
    editForm.addEventListener('submit', function (e) {
        return handleEditSubmit(e, id);
    });
    cancelButton.addEventListener('click', function (e) {
        return handleEditCancel(e);
    });
};
// 할 일 단일 삭제 함수
var deleteTodo = function (id) {
    if (confirm('할 일이 삭제됩니다. 정말 삭제하시겠습니까?')) {
        var newTodoList = toDoList.filter(function (todo) {
            if (todo.id === Number(id)) {
                deletedToDoList.push(todo);
            }
            return todo.id !== Number(id);
        });
        toDoList = newTodoList;
        saveTodo();
        saveDeletedTodo();
        renderTodoList();
        return;
    }
    return;
};
// 새로운 할 일 요소 생성하는 함수
var createTodoElement = function (_a) {
    var id = _a.id, text = _a.text, label = _a.label, createAt = _a.createAt, completed = _a.completed, update = _a.update, updateAt = _a.updateAt;
    var todo = document.createElement('div');
    var isCompleted = completed ? 'checked' : '';
    todo.innerHTML = "\n    <input class='checkbox' type='checkbox' ".concat(isCompleted, " />\n    <span class='text' style='background-color:").concat(label, ";'>").concat(text, "</span>\n    <span>(\uB4F1\uB85D) ").concat(createAt, "</span>\n    ").concat(update ? "<span>(\uC218\uC815) ".concat(updateAt, "</span>") : '', "\n    <button class='update-button'>\uC218\uC815</button>\n    <button class='delete-button'>\uC0AD\uC81C</button>\n  ");
    todo.className = 'content';
    todo.id = id.toString();
    todo.querySelectorAll('input').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () { return handleCheckChange(todo.id); });
    });
    todo.querySelectorAll('button').forEach(function (button) {
        if (button.className === 'delete-button') {
            return button.addEventListener('click', function () { return deleteTodo(todo.id); });
        }
        if (button.className === 'update-button') {
            return button.addEventListener('click', function (e) {
                updateTodo(e, todo, todo.id);
            });
        }
    });
    return todo;
};
// 새로운 삭제된 할 일 요소 생성하는 함수
var deletedTodoElement = function (item) {
    var todo = document.createElement('div');
    todo.innerHTML = "\n  <span class='text' style='background-color:".concat(item.label, ";'>").concat(item.text, "</span>\n  <span>").concat(item.createAt, "</span>\n  ");
    todo.className = 'content';
    return todo;
};
// 할 일 목록을 갱신하는 함수
var renderTodoList = function () {
    var incomplete = toDoList.filter(function (item) { return !item.completed; });
    var completed = toDoList.filter(function (item) { return item.completed; });
    todoList.innerHTML = '';
    incomplete.forEach(function (item) {
        var todo = createTodoElement(item);
        todoList.appendChild(todo);
    });
    completedList.innerHTML = '';
    completed.forEach(function (item) {
        var todo = createTodoElement(item);
        completedList.appendChild(todo);
    });
    deletedList.innerHTML = '';
    deletedToDoList.forEach(function (item) {
        var todo = deletedTodoElement(item);
        deletedList.appendChild(todo);
    });
};
// 중복되지 않는 id 값을 생성하기 위한 함수
var getId = function () {
    var _a;
    var id = Number((_a = localStorage.getItem('id')) !== null && _a !== void 0 ? _a : 0);
    id++;
    localStorage.setItem('id', id.toString());
    return id;
};
// 추가 버튼 클릭시 실행되는 함수
var handleSubmit = function (e) {
    e.preventDefault();
    if (formInput.value.length < 1 || formInput.value.length > 20) {
        return alert('글자수를 확인해주세요.');
    }
    var newTodo = {
        id: getId(),
        text: formInput.value,
        label: formLabel.value,
        createAt: dateFormat(new Date()),
        completed: false,
        update: false,
    };
    toDoList.push(newTodo);
    alert('등록이 완료되었습니다.');
    saveTodo();
    renderTodoList();
    formInput.value = '';
    formLabel.value = '#000000';
};
// 할일 목록을 전체 삭제하는 함수
var deleteAllTodoList = function () {
    if (toDoList.length < 1)
        return alert('삭제할 할 일이 없습니다.');
    if (confirm('할 일 목록이 전체 삭제됩니다. 정말 삭제하시겠습니까?')) {
        toDoList.forEach(function (todo) { return deletedToDoList.push(todo); });
        toDoList = [];
        saveTodo();
        saveDeletedTodo();
        renderTodoList();
        return;
    }
    return;
};
tabItem.forEach(function (tab) {
    tab.addEventListener('click', handleTabClick);
});
form.addEventListener('submit', handleSubmit);
buttonBox
    .querySelectorAll('button')
    .forEach(function (button) {
    if (button.className === 'all-delete-button') {
        return button.addEventListener('click', deleteAllTodoList);
    }
});
window.addEventListener('DOMContentLoaded', renderTodoList);

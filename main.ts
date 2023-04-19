const tabItem = <NodeListOf<HTMLLIElement>>(
  document.querySelectorAll('.tab-item')
);
const tabContent = <NodeListOf<HTMLLIElement>>(
  document.querySelectorAll('.tab-content')
);

const form = <HTMLFormElement>document.querySelector('.form-container');
const formInput = <HTMLInputElement>document.querySelector('.form-input');
const formLabel = <HTMLInputElement>document.querySelector('.form-label');

const todoList = <HTMLDivElement>document.querySelector('.todo-list');
const completedList = <HTMLDivElement>document.querySelector('.completed-list');
const deletedList = <HTMLDivElement>document.querySelector('.deleted-list');

const completeDeletedBtn = <HTMLDivElement>(
  document.querySelector('.completed-delete-button')
);

interface Todo {
  id: number;
  text: string;
  label: string;
  createAt: string;
  completed: boolean;
  update: boolean;
  updateAt?: string;
}

let toDoList: Todo[] = JSON.parse(localStorage.getItem('TODO') ?? '[]');

let deletedToDoList: Todo[] = JSON.parse(
  localStorage.getItem('DELETE_TODO') ?? '[]'
);

// 탭 클릭시 실행되는 함수
const handleTabClick = (event: MouseEvent): void => {
  const tabTarget = <HTMLLIElement>event.target;
  const target = tabTarget.dataset.tab;

  tabItem.forEach((item: HTMLLIElement): void => {
    item.classList.remove('active');
  });

  tabContent.forEach((content: HTMLElement): void => {
    content.classList.remove('target');
  });

  document.querySelector(`#${target}`)?.classList.add('target');

  tabTarget.classList.add('active');
};

// Date를 YYYY-MM-dd HH:mm:ss 으로 변환하는 함수
const dateFormat = (date: Date): string => {
  const prependZero = (num: number): number | string => {
    // 숫자가 한자릿수인 경우, 앞자리에 0을 붙이는 함수
    if (num < 10) {
      return `0${num}`;
    }

    return num;
  };

  const [year, month, day] = [
    // 연도, 월, 일
    date.getFullYear(),
    prependZero(date.getMonth() + 1),
    prependZero(date.getDay()),
  ];

  const [hour, minutes, seconds] = [
    // 시, 분, 초
    prependZero(date.getHours()),
    prependZero(date.getMinutes()),
    prependZero(date.getSeconds()),
  ];

  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};

// 체크박스 클릭시 실행되는 함수
const handleCheckChange = (id: string): void => {
  toDoList.filter((todo: Todo) => {
    if (todo.id === Number(id)) {
      return (todo.completed = !todo.completed);
    }
  });

  saveTodo();
  renderTodoList();
};

// 로컬스토리지에 할 일을 저장하는 함수
const saveTodo = () => {
  localStorage.setItem('TODO', JSON.stringify(toDoList));
};

// 로컬스토리지에 삭제된 할 일을 저장하는 함수
const saveDeletedTodo = () => {
  localStorage.setItem('DELETE_TODO', JSON.stringify(deletedToDoList));
};

// 할 일 단일 삭제 함수
const deleteTodo = (id: string) => {
  toDoList = toDoList.filter((todo: Todo) => {
    if (todo.id === Number(id)) {
      deletedToDoList.push(todo);
      return saveDeletedTodo();
    }
    return todo.id !== Number(id);
  });

  saveTodo();
  renderTodoList();
};

// 새로운 할 일 요소 생성하는 함수
const createTodoElement = (newTodo: Todo): HTMLDivElement => {
  let todo = <HTMLDivElement>document.createElement('div');

  const content: string = `
    <input class='checkbox' type='checkbox' ${
      newTodo.completed ? 'checked' : ''
    } />
    <span class='text' style='background-color:${newTodo.label};'>${
    newTodo.text
  }</span>
    <span>(등록) ${newTodo.createAt}</span>
    ${newTodo.update ? `<span>(수정) ${newTodo.updateAt}</span>` : ''}
    <button class='update-button'>수정</button>
    <button class='delete-button'>삭제</button>
  `;

  todo.className = 'content';
  todo.innerHTML = content;
  todo.id = newTodo.id.toString();

  todo.querySelectorAll('input').forEach((checkbox: HTMLInputElement): void => {
    checkbox.addEventListener('change', () => handleCheckChange(todo.id));
  });

  todo.querySelectorAll('button').forEach((button: HTMLButtonElement): void => {
    if (button.className === 'delete-button') {
      return button.addEventListener('click', () => deleteTodo(todo.id));
    }
  });

  return todo;
};

// 새로운 삭제된 할 일 요소 생성하는 함수
const deletedTodoElement = (item: Todo) => {
  let todo: HTMLDivElement = document.createElement('div');

  const content = `
  <span class='text' style='background-color:${item.label};'>${item.text}</span>
  <span>${item.createAt}</span>
  `;

  todo.className = 'content';
  todo.innerHTML = content;

  return todo;
};

// 할 일 목록을 갱신하는 함수
const renderTodoList = () => {
  const incomplete = toDoList.filter((item) => !item.completed);
  const completed = toDoList.filter((item) => item.completed);

  todoList.innerHTML = '';
  incomplete.forEach((item) => {
    const todo = createTodoElement(item);
    todoList.appendChild(todo);
  });

  completedList.innerHTML = '';
  completed.forEach((item) => {
    const todo = createTodoElement(item);
    completedList.appendChild(todo);
  });

  deletedList.innerHTML = '';
  deletedToDoList.forEach((item) => {
    const todo = deletedTodoElement(item);
    deletedList.appendChild(todo);
  });
};

// 추가 버튼 클릭시 실행되는 함수
const handleSubmit = (event: SubmitEvent): void => {
  event.preventDefault();

  if (formInput.value.length < 1 || formInput.value.length > 20) {
    return alert('글자수를 확인해주세요.');
  }

  const newTodo: Todo = {
    id: toDoList.length + 1,
    text: formInput.value,
    label: formLabel.value,
    createAt: dateFormat(new Date()),
    completed: false,
    update: false,
  };

  toDoList.push(newTodo);

  saveTodo();
  renderTodoList();

  formInput.value = '';
  formLabel.value = '#000000';
};

tabItem.forEach((tab: HTMLLIElement): void => {
  tab.addEventListener('click', handleTabClick);
});

form.addEventListener('submit', handleSubmit);

window.addEventListener('DOMContentLoaded', renderTodoList);

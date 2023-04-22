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

const buttonBox = <HTMLDivElement>document.querySelector('.delete-button-box');

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
  const target = tabTarget.dataset.tab as string;

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
const saveTodo = (): void => {
  localStorage.setItem('TODO', JSON.stringify(toDoList));
};

// 로컬스토리지에 삭제된 할 일을 저장하는 함수
const saveDeletedTodo = (): void => {
  localStorage.setItem('DELETE_TODO', JSON.stringify(deletedToDoList));
};

// 할 일 수정 후 저장시 실행되는 함수
const handleEditSubmit = (e: SubmitEvent, id: string): void => {
  e.preventDefault();

  const editInput = <HTMLInputElement>document.querySelector('.edit-input');
  const editLabel = <HTMLInputElement>document.querySelector('.edit-label');

  toDoList = toDoList.map((item: Todo) => {
    return item.id === Number(id)
      ? {
          ...item,
          text: editInput.value,
          label: editLabel.value,
          update: true,
          updateAt: dateFormat(new Date()),
        }
      : item;
  });

  saveTodo();
  renderTodoList();
};

// 할 일을 수정하지 않고 취소 버튼을 클릭할 경우 실행되는 함수
const handleEditCancel = (e: MouseEvent): void => {
  e.preventDefault();

  renderTodoList();
};

// 할 일 수정하는 함수
const updateTodo = (e: Event, todo: HTMLDivElement, id: string): void => {
  const editToDo = toDoList.find(
    (item: Todo) => item.id === Number(id)
  ) as Todo;

  if (!editToDo) return;

  todo.innerHTML = `<form class='edit-form'>
    <input type='checkbox' ${editToDo.completed ? 'checked' : ''} />
    <input class='edit-input' value=${editToDo.text} />
    <input class='edit-label' type='color' value=${editToDo.label} /> 
    <button class='edit-button' type='submit'>저장</button>
    <button class='cancel-button'>취소</button>
    </form>
    `;

  const editForm = <HTMLFormElement>document.querySelector('.edit-form');

  const cancelButton = <HTMLButtonElement>(
    editForm.querySelector('.cancel-button')
  );

  editForm.addEventListener('submit', (e: SubmitEvent): void =>
    handleEditSubmit(e, id)
  );

  cancelButton.addEventListener('click', (e: MouseEvent): void =>
    handleEditCancel(e)
  );
};

// 할 일 단일 삭제 함수
const deleteTodo = (id: string) => {
  const newTodoList: Todo[] = toDoList.filter((todo: Todo) => {
    if (todo.id === Number(id)) {
      deletedToDoList.push(todo);
    }
    return todo.id !== Number(id);
  });

  toDoList = newTodoList;

  saveTodo();
  saveDeletedTodo();
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
    checkbox.addEventListener('change', (): void => handleCheckChange(todo.id));
  });

  todo.querySelectorAll('button').forEach((button: HTMLButtonElement): void => {
    if (button.className === 'delete-button') {
      return button.addEventListener('click', (): void => deleteTodo(todo.id));
    }
    if (button.className === 'update-button') {
      return button.addEventListener('click', (e: MouseEvent): void => {
        updateTodo(e, todo, todo.id);
      });
    }
  });

  return todo;
};

// 새로운 삭제된 할 일 요소 생성하는 함수
const deletedTodoElement = (item: Todo): HTMLDivElement => {
  let todo = <HTMLDivElement>document.createElement('div');

  const content: string = `
  <span class='text' style='background-color:${item.label};'>${item.text}</span>
  <span>${item.createAt}</span>
  `;

  todo.className = 'content';
  todo.innerHTML = content;

  return todo;
};

// 할 일 목록을 갱신하는 함수
const renderTodoList = (): void => {
  const incomplete: Todo[] = toDoList.filter((item: Todo) => !item.completed);
  const completed: Todo[] = toDoList.filter((item: Todo) => item.completed);

  todoList.innerHTML = '';
  incomplete.forEach((item: Todo): void => {
    const todo: HTMLDivElement = createTodoElement(item);
    todoList.appendChild(todo);
  });

  completedList.innerHTML = '';
  completed.forEach((item: Todo): void => {
    const todo: HTMLDivElement = createTodoElement(item);
    completedList.appendChild(todo);
  });

  deletedList.innerHTML = '';
  deletedToDoList.forEach((item: Todo): void => {
    const todo: HTMLDivElement = deletedTodoElement(item);
    deletedList.appendChild(todo);
  });
};

// 중복되지 않는 id 값을 생성하기 위한 함수
const getId = (): number => {
  let id: number = Number(localStorage.getItem('id') ?? 0);
  id++;

  localStorage.setItem('id', id.toString());

  return id;
};

// 추가 버튼 클릭시 실행되는 함수
const handleSubmit = (e: SubmitEvent): void => {
  e.preventDefault();

  if (formInput.value.length < 1 || formInput.value.length > 20) {
    return alert('글자수를 확인해주세요.');
  }

  const newTodo: Todo = {
    id: getId(),
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

// 할일 목록을 전체 삭제하는 함수
const deleteAllTodoList = (): void => {
  if (toDoList.length < 1) return alert('삭제할 할 일이 없습니다.');

  if (confirm('할 일 목록이 전체 삭제됩니다. 정말 삭제하시겠습니까?')) {
    toDoList.forEach((todo: Todo) => deletedToDoList.push(todo));

    toDoList = [];

    saveTodo();
    saveDeletedTodo();
    renderTodoList();

    return;
  }

  return;
};

tabItem.forEach((tab: HTMLLIElement): void => {
  tab.addEventListener('click', handleTabClick);
});

form.addEventListener('submit', handleSubmit);

buttonBox
  .querySelectorAll('button')
  .forEach((button: HTMLButtonElement): void => {
    if (button.className === 'all-delete-button') {
      return button.addEventListener('click', deleteAllTodoList);
    }
  });

window.addEventListener('DOMContentLoaded', renderTodoList);

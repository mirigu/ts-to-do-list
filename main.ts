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

tabItem.forEach((tab: HTMLLIElement): void => {
  tab.addEventListener('click', handleTabClick);
});

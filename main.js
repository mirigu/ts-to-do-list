var tabItem = (document.querySelectorAll('.tab-item'));
var tabContent = (document.querySelectorAll('.tab-content'));
var form = document.querySelector('.form-container');
var formInput = document.querySelector('.form-input');
var formLabel = document.querySelector('.form-label');
var todoList = document.querySelector('.todo-list');
var completedList = document.querySelector('.completed-list');
var deletedList = document.querySelector('.deleted-list');
var completeDeletedBtn = (document.querySelector('.completed-delete-button'));
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
tabItem.forEach(function (tab) {
    tab.addEventListener('click', handleTabClick);
});

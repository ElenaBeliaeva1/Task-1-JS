
let searchLink = document.querySelector('#search');
let menu = document.querySelector('.menu');
let specialMenu = document.querySelector('.list');
//Функция которая ищет репозитории и очищает всплыфвающее меню, если оно было
function fucnInput (e) {
    let searchValue = this.value;
    clearMenu();
    if (searchValue !== ''){
        //Должны вызвать запрос
        fetch(`https://api.github.com/search/repositories?q=${searchValue}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if(data === 0){
                    alert('С сожалению, по вашему запросу ничего не найдено')
                };
                for (let i = 0; i < 5; i++){
                    let element = data.items[i];
                    let card = createCard(element);
                    postCard(card, menu);
                };
            })
            .catch(() => alert('С сожалению, по вашему запросу ничего не найдено'));
    };
};

//Функция очищающая всплывающее меню
let clearMenu = function() {
    new Promise((resolve, reject) => {
        while(menu.firstChild){
        menu.removeChild(menu.firstChild);
    };
    });
    return true;
};
//Функция debounce
const debounce = (fn, debounceTime) => {
    let timeOut;
    return function(){
      const fnCall = () => {fn.apply(this, arguments)};
      clearTimeout(timeOut);
      timeOut = setTimeout(fnCall, debounceTime);
    };
};
//Функция для добавления карточки репозитория
const addingToSpecialList = (e) => {
    console.log(e.currentTarget);
    let card = createSpecialCard(e.currentTarget);
    postCard(card, specialMenu);
    searchLink.value = '';
    clearMenu();
};

fucnInput = debounce(fucnInput, 400);
searchLink.addEventListener('input', fucnInput);
//Функция для создания элемента в выпадающем меню
let createCard = function (info) {
    let text = info.name;
    let li = document.createElement('li');
    li.classList.add('popupli');
    li.textContent = text;
    li.addEventListener('click', addingToSpecialList);
    return li;
}
//Функция для удаления карточки репозитория
let removingSpecialCard = function (e) {
    let specialButton = e.currentTarget;
    let specialCard = specialButton.parentNode;
    console.log(specialCard);
    specialMenu.removeChild(specialCard);
    return true;
}
//Функция для создания карточки репозитория, добавленного в список
let createSpecialCard = function(element) {
    let specialCard = document.createElement('div');
    let name = document.createElement('p');
    let owner = document.createElement('p');
    let stars = document.createElement('p');

    let list = document.createElement('div');
    list.classList.add('characteristics');

    let cross = document.createElement('button');
    cross.classList.add('cross');
    cross.addEventListener('click', removingSpecialCard);

    specialCard.classList.add('specialCard');
    fetch(`https://api.github.com/search/repositories?q=${element.textContent}`)
        .then((response)=> response.json())
        .then((response)=> {
            name.textContent = `Name: ${response.items[0].name}`;
            owner.textContent = `Owner: ${response.items[0].owner.login}`;
            stars.textContent = `Stars: ${response.items[0]['stargazers_count']}`;
            console.log(response);
            console.log(name, owner, stars);
        });
    
    postCard(name, list); 
    postCard(owner, list); 
    postCard(stars, list); 
    postCard(list, specialCard);
    postCard(cross, specialCard);
    return specialCard;
};
//Функция для добавления элемента 
let postCard = function (element, parent) {
    parent.appendChild(element);
    return true;
};
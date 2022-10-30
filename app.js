let add = document.querySelector("form button");
let section = document.querySelector("section");
add.addEventListener("click", e => {
    e.preventDefault();

    // 得到input的內容
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate = form.children[2].value;

    if (todoText === "") {
        alert("請勿空白");
        return
    } else if (todoMonth > 12) {
        alert("最多12個月")
        return
    } else if (todoDate > 31) {
        alert("最多31日");
        return
    }

    // 創造代辦清單
    let todo = document.createElement("div");
    todo.classList.add("toDoList");
    let text = document.createElement("p");
    text.innerText = todoText;
    let Month = document.createElement("p");
    Month.innerText = todoMonth + "月";
    let Date = document.createElement("p");
    Date.innerText = todoDate + "日";
    todo.appendChild(text);
    todo.appendChild(Month);
    todo.appendChild(Date);


    // 創造確定、刪除按鈕
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = ('<i class="fa-solid fa-check"></i>');
    // 確定按鈕動畫
    completeButton.addEventListener("click", e => {
        e.target.parentElement.classList.toggle("done");
    });

    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = ('<i class="fa-solid fa-trash"></i>');

    // 刪除按鈕功能
    trashButton.addEventListener("click", e => {
        let todoIetm = e.target.parentElement;
        todoIetm.addEventListener("animationend", e => {
            // 刪除localStorageDate
            let text = todoIetm.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item, index) => {
                if (item.todoText == text) {
                    myListArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArray));
                }
            })
            // 刪除Div
            todoIetm.remove();
        })
        todoIetm.style.animation = "scaleDown 0.3s forwards"
    });

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    todo.style.animation = "scaleUp 0.3s forwards"
    // 創造一個Object
    let myTodo = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate: todoDate
    };
    // 儲存物件資料到陣列
    let myList = localStorage.getItem("list");
    if (myList == null) {
        localStorage.setItem("list", JSON.stringify([myTodo]));
    } else {
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(myListArray));
    }

    console.log(JSON.parse(localStorage.getItem("list")));
    // 清空輸入欄
    form.children[0].value = "";
    section.appendChild(todo);


});

loadData()
// 載入localStorage資料
function loadData() {
    let myList = localStorage.getItem("list");
    if (myList !== null) {
        let myListArray = JSON.parse(myList);
        myListArray.forEach(item => {
            let todo = document.createElement("div");
            todo.classList.add("toDoList");
            let text = document.createElement("p");
            text.innerText = item.todoText;
            let Month = document.createElement("p");
            Month.innerText = item.todoMonth + "月";
            let Date = document.createElement("p");
            Date.innerText = item.todoDate + "日";
            todo.appendChild(text);
            todo.appendChild(Month);
            todo.appendChild(Date);
            // 創造確定、刪除按鈕
            let completeButton = document.createElement("button");
            completeButton.classList.add("complete");
            completeButton.innerHTML = ('<i class="fa-solid fa-check"></i>');
            // 確定按鈕動畫
            completeButton.addEventListener("click", e => {
                e.target.parentElement.classList.toggle("done");
            });

            let trashButton = document.createElement("button");
            trashButton.classList.add("trash");
            trashButton.innerHTML = ('<i class="fa-solid fa-trash"></i>');

            // 刪除按鈕功能
            trashButton.addEventListener("click", e => {
                let todoIetm = e.target.parentElement;
                todoIetm.addEventListener("animationend", e => {
                    // 刪除localStorageDate
                    let text = todoIetm.children[0].innerText;
                    let myListArray = JSON.parse(localStorage.getItem("list"));
                    myListArray.forEach((item, index) => {
                        if (item.todoText == text) {
                            myListArray.splice(index, 1);
                            localStorage.setItem("list", JSON.stringify(myListArray));
                        }
                    })
                    // 刪除Div
                    todoIetm.remove();
                })
                todoIetm.style.animation = "scaleDown 0.3s forwards"
            });

            todo.appendChild(completeButton);
            todo.appendChild(trashButton);

            todo.style.animation = "scaleUp 0.3s forwards"
            section.appendChild(todo);

        })
    }
}



// 排序演算法
function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < arr1.length && j < arr2.length) {
        if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
            result.push(arr2[j]);
            j++;
        } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
            result.push(arr1[i]);
            i++;
        } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
            if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
                result.push(arr2[j]);
                j++;
            } else {
                result.push(arr1[i]);
                i++;
            }
        }
    }

    while (i < arr1.length) {
        result.push(arr1[i]);
        i++;
    }
    while (j < arr2.length) {
        result.push(arr2[j]);
        j++;
    }

    return result;
}

function mergeSort(arr) {
    if (arr.length === 1) {
        return arr;
    } else {
        let middle = Math.floor(arr.length / 2);
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
    }
}

// 排序按鈕
let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
    // sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));

    // remove data
    let len = section.children.length;
    for (let i = 0; i < len; i++) {
        section.children[0].remove();
    }

    // load data
    loadData();
})
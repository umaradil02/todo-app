window.addEventListener('load', function () {
    var islogdin = localStorage.getItem("islogdin");
    if (islogdin !== "true") {
        location.href = "register.html";
        return;
    }
    
    var userId = localStorage.getItem("loggedInUserId");
    var todos = JSON.parse(localStorage.getItem(`todos_${userId}`)) || [];
    var newTodoForm = document.querySelector('#new-todo-form');
    var logoutButton = document.getElementById('logout-button');
    var toastContainer = document.getElementById("liveToast");
    var toastBody = toastContainer.querySelector(".toast-header").innerHTML;
    var users = JSON.parse(localStorage.getItem("users")) || [];
    var user = users.find(user => user.id === userId);

    if (user) {
        var userName = document.querySelector(".user-text");
        userName.innerText = `${user.firstName}!`
    } 

    function showToast(header, msg, textcolr, boycolor) {
        const toast = new bootstrap.Toast(toastContainer);
        toastContainer.querySelector(".toast-header").innerHTML = header + toastBody;
        toastContainer.querySelector(".toast-body").innerText = msg;
        toastContainer.querySelector(".toast-header").style.color = textcolr;
        toastContainer.querySelector(".toast-body").style.color = textcolr;
        toastContainer.querySelector(".toast-body").style.background = boycolor;
        toastContainer.querySelector(".toast-header").style.background = boycolor;
        toast.show();
    }

    newTodoForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var todoContent = e.target.elements.content.value.trim();
        var todoCategry = e.target.elements.category.value;

        if (todoContent === "") {
            showToast("Error", "content cannot be empty", "red", "white");
            return;
         } else if (todoCategry === "") {
            showToast("Error", "select a category", "red", "white");
            return;
        }

        var todo = {
            content: todoContent,
            category: todoCategry,
            done: false,
            createdAt: new Date().getTime()
        };

        todos.push(todo);
        localStorage.setItem(`todos_${userId}`, JSON.stringify(todos));

        e.target.reset();
        DisplayTodos();
    });

    logoutButton.addEventListener('click', function () {
        localStorage.removeItem("islogdin");
        localStorage.removeItem("loggedInUserId");
        location.href = "register.html";
    });

    DisplayTodos();

    function DisplayTodos() {
        var todoList = document.querySelector('#todo-list');
        todoList.innerHTML = "";
        var completeTodos = todos.filter(todo => todo.done);
        var remainingTodos = todos.filter(todo => !todo.done);
        var completeCount = completeTodos.length;
        var remainingCount = remainingTodos.length;

        var completeElement = document.createElement("div");
        completeElement.classList.add("todo-count");
        completeElement.innerText = `Completed Todos: ${completeCount}`;

        var remainingElement = document.createElement("div");
        remainingElement.classList.add("todo-count");
        remainingElement.innerText = `Remaining Todos: ${remainingCount}`;

        todoList.appendChild(completeElement);
        todoList.appendChild(remainingElement);
        var alltodo = [...completeTodos, ...remainingTodos]



        alltodo.forEach(todo => {
            var todoItem = document.createElement('div');
            todoItem.classList.add('todo-item');

            var label = document.createElement('label');
            var input = document.createElement('input');
            var span = document.createElement('span');
            var content = document.createElement('div');
            var actions = document.createElement('div');
            var edit = document.createElement('button');
            var deleteButton = document.createElement('button');

            input.type = 'checkbox';
            input.checked = todo.done;
            span.classList.add('bubble');
            if (todo.category == 'personal') {
                span.classList.add('personal');
            } else {
                span.classList.add('business');
            }
            content.classList.add('todo-content');
            actions.classList.add('actions');
            edit.classList.add('edit');
            deleteButton.classList.add('delete');

            content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
            edit.innerHTML = 'Edit';
            deleteButton.innerHTML = 'Delete';

            label.appendChild(input);
            label.appendChild(span);
            actions.appendChild(edit);
            actions.appendChild(deleteButton);
            todoItem.appendChild(label);
            todoItem.appendChild(content);
            todoItem.appendChild(actions);

            todoList.appendChild(todoItem);

            if (todo.done) {
                todoItem.classList.add('done');
            }

            input.addEventListener('change', function (e) {
                e.preventDefault();
                todo.done = e.target.checked;
                localStorage.setItem(`todos_${userId}`, JSON.stringify(todos));

                if (todo.done) {
                    todoItem.classList.add('done');
                } else {
                    todoItem.classList.remove('done');
                }

                DisplayTodos();
            });

            edit.addEventListener('click', function (e) {
                var input = content.querySelector('input');
                input.value = "";
                input.removeAttribute('readonly');
                input.focus();
                input.addEventListener('blur', function (e) {
                    input.setAttribute('readonly', true);
                    todo.content = e.target.value;
                    localStorage.setItem(`todos_${userId}`, JSON.stringify(todos));
                    DisplayTodos();
                });
            });

            deleteButton.addEventListener('click', function (e) {
                todos = todos.filter(t => t != todo);
                localStorage.setItem(`todos_${userId}`, JSON.stringify(todos));
                DisplayTodos();
            });
        });
    }
});

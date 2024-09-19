let todoInput = document.getElementById("todoInput")
let todoBtn = document.getElementById("todoBtn")
let todo = document.getElementById("todo")
let finished = document.getElementById("finished")
let inputText = document.getElementById("inputText")
let host = 'http://localhost/todo-list-api/'
let path = 'todo.php'

const todoInsert = async()=>{
    if (todoInput.value === '' || todoInput.value == null){
        return 0
    }
    let payload = {
        action: "insert",
        detail: todoInput.value
    }

    const { data } = await axios.post(host+path,payload,
        {headers: {"Content-Type": "application/x-www-form-urlencoded",}}
    )
    console.log(data);
    
    if(data.data){
        todoInput.value = ''
    }
    await selectTodolist()
}

const updateTodo = async(id)=>{
    let payload = {
        action: "updateTodo",
        id:id,
        detail: todoInput.value
    }

    const { data } = await axios.post(host+path,payload,
        {headers: {"Content-Type": "application/x-www-form-urlencoded",}}
    )
    console.log(data);
    
    if(data.data){
        console.log("Done!");
    }else{
        console.log("Something wrong");
    }
    await setEditTodo()
    await selectTodolist()
}

const updateTodoStatus = async(id,status)=>{
    let payload = {
        action: "updateTodoStatus",
        id:id,
        status: status,
    }

    const { data } = await axios.post(
        host+path,payload,
        {headers: {"Content-Type": "application/x-www-form-urlencoded",}}
    )
    await selectTodolist()
}

const todoDelete = async(id)=>{
    const { data } = await axios.get(host+path + "?action=delete&id="+id, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    await selectTodolist()
    
}

const selectTodolist = async()=>{
    let todoText =``
    let finishedText =``

    const { data } = await axios.get(host+path + "?action=selectAll", {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    console.log(data);
    data.map((val,i)=>{
        if(val.status == 0){
            todoText += `
            <li class="list-group-item border-0 d-flex align-items-center ps-0">
            <input class="form-check-input me-3" type="checkbox" value="" aria-label="..." onclick="updateTodoStatus('${val.id}','${val.status}')"/>
            ${val.detail} <span type="button" class="badge rounded-pill bg-warning ms-3" onclick="setEditTodo('edit','${val.detail}','${val.id}')">EDIT</span>
            </li>
            `
        }else{
            finishedText += `
            <li class="list-group-item border-0 d-flex align-items-center ps-0">
            <input class="form-check-input me-3" type="checkbox" value="" aria-label="..." checked onclick="updateTodoStatus('${val.id}','${val.status}')"/>
            <s>${val.detail}</s><span type="button" class="badge rounded-pill bg-danger ms-3" onclick="todoDelete('${val.id}')">DELETE</span>
            </li>
            `
        }
    })
    if(todoText == ``){
        todo.innerHTML = "we have not thing to do, well done!!"
    }else{
        todo.innerHTML = `<ul class="list-group rounded-0">` + todoText + "</ul>"
    }

    if(finishedText == ``){
        finished.innerHTML = "ZZz"
    }else{
        finished.innerHTML = `<ul class="list-group rounded-0">` + finishedText + "</ul>"
    }

    
}

const setEditTodo = (key = 0,val = 0,id = 0)=>{
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    if(key == "edit"){
        checkboxes.forEach(function(checkbox) {
            checkbox.disabled = true;
        });
        inputText.innerHTML  = "Change Something ? 🤔"
        todoInput.value = val
        todoBtn.className = "btn btn-warning";
        todoBtn.setAttribute("onclick", "updateTodo('"+id+"')")
        todoBtn.innerHTML = "Edit"
        
        
    }else{
        checkboxes.forEach(function(checkbox) {
            checkbox.disabled = false;
        });
        inputText.innerHTML = "wanna do something ?"
        todoInput.value = ''
        todoBtn.className = "btn btn-success";
        todoBtn.setAttribute("onclick", "todoInsert()")
        todoBtn.innerHTML = "Do it!!"
        
    }
}

selectTodolist()
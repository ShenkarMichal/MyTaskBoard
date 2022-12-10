let taskArray=[]

//Display tasks on load
getTasksFromStorage()

function createTask(){
    //Get values from DOM
    const taskBox=document.getElementById("myTask")
    const dateBox=document.getElementById("date")
    const timeBox=document.getElementById("time")

    //Create an object from single task
    let singleTask={
        task:taskBox.value,
        date:dateBox.value,
        time:timeBox.value,        
    }
    
    //Add the single task to the task array
    taskArray.push(singleTask)
      
    //Add the tasks to the entire board
    displayTasks()
        
    //Save the tasks to the local-storage
    saveTaskIntoStorage()

    //Empty the form after creating the task
    taskBox.value=""
    dateBox.value=""
    timeBox.value=""        
}

function saveTaskIntoStorage(){
    let jsonTasks=JSON.stringify(taskArray)
    localStorage.setItem("tasks", jsonTasks)
}

function getTasksFromStorage(){
    //Get the tasks from the storage only when the storage is not empty
    let jsonTasks=localStorage.getItem("tasks")
    if(jsonTasks){
        taskArray=JSON.parse(jsonTasks) 
        displayTasks()  
    }
}

function displayTasks(){
    const board=document.getElementById("entireBoard")

    //Get random row type
    let rowType=["justify-content-start", "justify-content-center", "justify-content-end"]
    let numOfRowType=Math.floor(Math.random()*3)
    let innerHtml=`<div class="row ${rowType[numOfRowType]}">`
    //Get random task type
    let tasksType=["bulletinTask", "chalkTask"]
    let imgType=["Pictures/Bulletinboard.jpg", "Pictures/Chalkboard.jpg"]

    let index=0 
    
    //Create div task from each single task               
    for(let item of taskArray){ 
        item.index=index       
        let numOfType=Math.floor(Math.random()*2)
        numOfRowType=Math.floor(Math.random()*3)  
                                                
        innerHtml+=`<div class="${tasksType[numOfType]} col-2 entire-task">
                        <div class="taskContent card-img-overlay">
                            <span class="content">${item.task}</span>
                            <br>
                        </div>
                        <div class="date-and-time">
                            <span class="date">${item.date}</span>
                            <br>
                            <span class="time">${item.time}</span>
                        </div> 
                        <div class="deleteIcon">
                            <span class="glyphicon glyphicon-trash" onclick="deleteTask(id)" id="${item.index}"></span>                                      
                        </div>
                        <img src="${imgType[numOfType]}" class="imgTask">                                                      
                    </div>`
        index++              
        if(index%5===0){
            innerHtml+=`</div> <div class="row ${rowType[numOfRowType]}">`
        }
    }
    //Print the tasks on the entire board
    innerHtml+=`</div>`
    board.innerHTML=innerHtml

    //Add animation to the last-task by add class-name when the array-length is grow
    let lastTaskArr=JSON.parse(localStorage.getItem("tasks"))    
    if(lastTaskArr.length<taskArray.length){
        let lastTask=document.querySelector(".row:last-child .entire-task:last-child")
        lastTask.classList.add("lastTask")
    }  
}

function remuveAllTasks(){
    taskArray=[]
    saveTaskIntoStorage()
    displayTasks()    
}

function deleteTask(id){
    taskArray.splice(id,1)   
    saveTaskIntoStorage()
    displayTasks() 
}

// Delet task on deadline
setInterval(()=>{    
    const date=new Date()
    //Get the current date              
    const fullDate=[date.getFullYear(),date.getMonth()+1,date.getDate()]
    
    //Get the current time
    const fullTime=[date.getHours(),date.getMinutes()] 

    //Get the tasks from the local-storage
    taskArray=JSON.parse(localStorage.getItem("tasks"))

    let currentDate=true//This var needs to know if we need to check the time

    //Check the deadline and delete tasks
    for(let item of taskArray){
        //Get the date of the task
        const taskDate=item.date.split("-")
        const taskTime=item.time.split(":")
        
        //Check if the year/month/day are passed
        for(i=0; i<3; i++){                          
            if(taskDate[i]<fullDate[i]){
                taskArray.splice(taskArray[item],1)
                currentDate=false                
                break
            }
            //Check if the year/month/day are not the current
            else if(taskDate[i]>fullDate[i]){
                currentDate=false 
                break
            }            
        } 
        
        //Check if the hour/minutes are passed.              
        for(i=0; i<2; i++){
            //break from loop if the date is not the same of current date
            if(!currentDate){
                break
            }            
            if(taskTime[i]<fullTime[i]){
                taskArray.splice(taskArray[item],1)
                break
            }
        }
    }
    //Save to storage and display tasks only when the taskArray is changed
    let jsonTasks=JSON.parse(localStorage.getItem("tasks"))
    if(jsonTasks.length!==taskArray.length){
        saveTaskIntoStorage() 
        displayTasks()
    }
}
, 60000)



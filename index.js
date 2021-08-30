//to get the element and put it in a card next to the other card

const taskContainer = document.querySelector(".task__container");

//Global Store -> so that a new card can be saved in the global storage ; for that we need to provide a global array

let globalStore = [];

// Destructuring object : if we need a specific id from a no. of. objects then we do the destructuring object
//syntax : const { imagwUrl } = taskData;

const newCard = ({
  id,
  imageUrl, 
  taskTitle,
  taskDescription,
  taskType
  }) => `<div class="col-md-6 col-lg-4" id=${id}>
    <div class="card ">
      <div class="card-header d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-outline-success" onclick="editCard .apply(this, arguments)" >
          <i class="fas fa-pencil-alt" id=${id}></i>
        </button>
        <button type="button" id=${id} class="btn btn-outline-danger" onclick="deleteCard.apply(this, arguments)" >
          <i class="fas fa-trash-alt" id=${id} onclick="deleteCard.apply(this, arguments)" ></i>
        </button>
      </div>
      <img
         src=${imageUrl}
         class="card-img-top"
         alt=""
      />
      <div class="card-body">
        <h5 class="card-title">${taskTitle}</h5>
        <p class="card-text">
            ${taskDescription}
        </p>
        <span class="badge bg-primary">${taskType}</span>
      </div>
      <div class="card-footer text-muted">
        <button type="button" id=${id} class="btn btn-outline-primary float-end">
          Open Task
        </button>
      </div>
    </div>
    </div>`; 

const loadInitialTaskCards = () => {
  //access localstorage
  const getInitialData = localStorage.tasky;
  if(!getInitialData) return;

  //convert stringified object to object
  const { cards } = JSON.parse(getInitialData);

  //map around the array to generate HTML card and inject it to DOM
  cards.map((cardObject) => {
    const createNewCard =  newCard(cardObject);
    taskContainer.insertAdjacentHTML("beforeend", createNewCard);
    globalStore.push(cardObject);
  });
};
  
//saving the changes in a object in a fuction

const updateLocalStorage = () =>
localStorage.setItem("tasky", JSON.stringify({ cards: globalStore}));

const saveChanges = () => {
    const taskData = {
        id: `${Date.now()}`, // unique number for card id 
        imageUrl: document.getElementById("imageurl").value,
        taskTitle: document.getElementById("tasktitle").value,
        taskType : document.getElementById("tasktype").value,
        taskDescription : document.getElementById("taskdescription").value,
    };
    
    //HTML code
    const createNewCard = newCard(taskData);

    taskContainer.insertAdjacentHTML("beforeend", createNewCard); // creating a new card
    globalStore.push(taskData); // storing the task data in a global array
    
    //To save the changes in local storage we have to call an API
    
    // add to local storage
    updateLocalStorage ();
    // {card: [{...}]}
    // localstorage -> interface -> programming
};

// parent object browser -> window
// parent object html .> DOM -> documdeleteCardent

const deleteCard =(event) => {
  //id

  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;  //button
  //search the globalStore, remove the object which matches with the id
  //filter -> new array

  globalStore = globalStore.filter((cardObject) => cardObject.id !== targetID );
  
  updateLocalStorage ();
  // access DOm to remove them

  if(tagname === "BUTTON") {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode   //col-lg-4
    );
  }

  return taskContainer.removeChild(
    event.target.parentNode.parentNode.parentNode.parentNode //col-lg-4
  );
  
};

// content edit table

const editCard = (event) => {
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;  
 
  let parentElement;

  if(tagname === "BUTTON"){
    parentElement = event.target.parentNode.parentNode;
  } else{
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let taskTitle = parentElement.childNodes[5].childNodes[1];
  let taskDescription = parentElement.childNodes[5].childNodes[3];
  let taskType = parentElement.childNodes[5].childNodes[5];
  let submitButton = parentElement.childNodes[7].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  submitButton.setAttribute(
    "onclick",
    "saveEditchanges.apply(this, arguments)"
  );
  submitButton.innerHTML = "Save Changes";
};

const saveEditchanges = (event) => {
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;  
 
  let parentElement;

  if(tagname === "BUTTON"){
    parentElement = event.target.parentNode.parentNode;
  } else{
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let taskTitle = parentElement.childNodes[5].childNodes[1];
  let taskDescription = parentElement.childNodes[5].childNodes[3];
  let taskType = parentElement.childNodes[5].childNodes[5];
  let submitButton = parentElement.childNodes[7].childNodes[1];


  const updatedData = {
     taskTitle : taskTitle.innerHTML,
     taskType : taskType.innerHTML,
     taskDescription : taskDescription.innerHTML,
  };

  globalStore = globalStore.map((task) => {
    if(task,id === targetID) {
      return {
        id: task.id,
        imageUrl: task.imageUrl,
        taskTitle: updatedData.taskTitle,
        taskType : updatedData.taskType,
        taskDescription : updatedData.taskDescription,
      };
    }
    return task; //IMPORTANT
  });
  
  updateLocalStorage();
  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  submitButton.removeAttribute("onclick");
  submitButton.innerHTML = "Open Task";
  
};


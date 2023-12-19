const itemForm=document.getElementById('item-form');
const itemInput=document.getElementById('item-input');
const itemList=document.getElementById('item-list');
const clearBtn=document.getElementById('clear');
const itemFilter=document.getElementById('filter');
const formBtn=itemForm.querySelector('button');
let isEditMode=false;

function displayItems(){
    const itemsFromStorage=getItemFromStorage();

    itemsFromStorage.forEach((items)=>addItemtoDOM(items));
    checkUI();
}


function onAddItemSubmit(e){
    e.preventDefault();
    const newItem=itemInput.value;

    //validate Input
    if(newItem===''){
        alert('Please add an item');
        return;
    }

    //Check for edit mode
    if(isEditMode){
        const itemToEdit=itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode=false
    }else{
        if(checkIfItemExists(newItem)){
            alert('Item already exists');
            return;       
        }
    }

    //create item DOM element
    addItemtoDOM(newItem);

    //add item to local storage
    addItemToStorage(newItem);
    
    
    checkUI();

    itemInput.value='';
}

function addItemtoDOM(item){
//create list item
const li=document.createElement('li');   
li.appendChild(document.createTextNode(item));
// console.log(li);

const button=createButton('remove-item btn-link text-red');
li.appendChild(button);

//add li to the dom
itemList.appendChild(li);
}

function addItemToStorage(item){
    let itemsFromStorage=getItemFromStorage();
    
    //add new item to array
    itemsFromStorage.push(item);

    //convert to json string and set to local storage
    localStorage.setItem('item',JSON.stringify(itemsFromStorage));
}

function getItemFromStorage(){
    let itemsFromStorage;
    if(localStorage.getItem('item')===null){
        itemsFromStorage=[];
    }else{
        itemsFromStorage=JSON.parse(localStorage.getItem('item'));
    }

    return itemsFromStorage;
    
}

function createButton(classes){
    const button=document.createElement('button');
    button.className=classes;
    const icon=createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(clasess){
    const icon=document.createElement('i');
    icon.className=clasess;
    return icon;
}

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement);
    }else{
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item){
    const itemsFromStorage=getItemFromStorage();

    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode=true;

    itemList.querySelectorAll('li').forEach((i)=>i.classList.remove('edit-mode'));
    // item.style.color='#ccc';
    // console.log(item);
    item.classList.add('edit-mode');

    formBtn.innerHTML='<i class="fa-solid fa-pen"></i> Update Item';

    itemInput.value=item.textContent;

    formBtn.style.backgroundColor='#228822';

}

function removeItem(item){

    if(confirm('Are you sure?')){
        //Remove Item from DOM
        item.remove();

        //Remove item from storage
        removeItemFromStorage(item.textContent);
        checkUI();
    }

    // if(e.target.parentElement.classList.contains('remove-item')){
    // //    console.log('click');
    // if(confirm('Are you sure?')){
    //     e.target.parentElement.parentElement.remove();
    //     checkUI();
    // }
    // }
    //e.target.remove(); -- will remove the icon not the list 

}

function removeItemFromStorage(item){
    let itemsFromStorage=getItemFromStorage();
    
    //Filter out item to be removed
    itemsFromStorage=itemsFromStorage.filter((i)=>i!==item);

    //Re-set to localStorage
    localStorage.setItem('item',JSON.stringify(itemsFromStorage));
}

function clearItem(){
// console.log('Works');
while(itemList.firstChild){
    itemList.removeChild(itemList.firstChild);
}

//clear form localstorage
localStorage.removeItem('item')
checkUI();
}

function filterItems(e){
    const items=itemList.querySelectorAll('li');
    const text=e.target.value.toLowerCase();
    // console.log(text);
    

    items.forEach((item)=>{
        const itemName=item.firstChild.textContent.toLowerCase();

        // console.log(itemName);

        if(itemName.indexOf(text)!=-1){
            // console.log(true);
            item.style.display='flex';
        }else{
            // console.log(false);
            item.style.display='none';
        }
    });
}

function checkUI(){
    const items=itemList.querySelectorAll('li');
    // console.log(items);
    if(items.length===0){
        clearBtn.style.display='none';
        itemFilter.style.display='none';
    }else{
        clearBtn.style.display='block';
        itemFilter.style.display='block';
    }

    formBtn.innerHTML='<i class="fa-soli fa-plus"></i> Add Item';
    formBtn.style.backgroundColor='#333';
    isEditMode=false;
}


//Initialize app

function init(){
//event listeners
itemForm.addEventListener('submit',onAddItemSubmit);
// itemList.addEventListener('click',removeItem);
itemList.addEventListener('click',onClickItem);
clearBtn.addEventListener('click',clearItem);
itemFilter.addEventListener('input',filterItems);
document.addEventListener('DOMContentLoaded',displayItems);

checkUI();

}

init();


// localStorage.setItem('name','venkat');

// console.log(localStorage.getItem('name'));
// console.log(localStorage.removeItem('name'));
// localStorage.clear();



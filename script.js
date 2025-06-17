const STORAGE_KEY = "bookshelf";
let books = [];
const UNCOMPLETED_LIST_ID = "books";
const COMPLETED_LIST_ID = "completed-books"; 
const ITEMID = "itemId";

document.addEventListener("DOMContentLoaded", function () {
 
    const submitForm = document.getElementById("form");
 
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addbook();
    });

if(isStorageExist()){
       loadDataFromStorage();
   }
});
 
document.addEventListener("ondatasaved", () => {
   console.log("Data berhasil disimpan.");
});
document.addEventListener("ondataloaded", () => {
   refreshDataFrombooks();
});

function createButton(buttonTypeClass , eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}
function createTrashButton() {
    return createButton("trash-button", function(event){
        removeBookFromCompleted(event.target.parentElement);
    });
}
function createUndoButton() {
    return createButton("undo-button", function(event){
        undoBookFromCompleted(event.target.parentElement);
    });
}

function createCheckButton() {
    return createButton("check-button", function(event){
         addBookToCompleted(event.target.parentElement);
    });
}


function isStorageExist() /* boolean */ {
   if(typeof(Storage) === undefined){
       alert("Browser kamu tidak mendukung local storage");
       return false
   }
   return true;
}
 
function saveData() {
   const parsed = JSON.stringify(books);
   localStorage.setItem(STORAGE_KEY, parsed);
   document.dispatchEvent(new Event("ondatasaved"));
}
 
function loadDataFromStorage() {
   const serializedData = localStorage.getItem(STORAGE_KEY);
   
   let data = JSON.parse(serializedData);
   
   if(data !== null)
       books = data;
 
   document.dispatchEvent(new Event("ondataloaded"));
}
 
function updateDataToStorage() {
   if(isStorageExist())
       saveData();
}
 
function bookObject(title, timestamp, writter, isCompleted) {
	return {
       id: +new Date(),
       title,
       timestamp,
	   writter,
       isCompleted
	};
}
 
function findbook(bookId) {
   for(book of books){
       if(book.id === bookId)
           return book;
   }
   return null;
}
 
 
function findbookIndex(bookId) {
   let index = 0
   for (book of books) {
       if(book.id === bookId)
           return index;
 
       index++;
   }
 
   return -1;
}


function refreshDataFrombooks() {
   const listUncompleted = document.getElementById(UNCOMPLETED_LIST_ID);
   let listCompleted = document.getElementById(COMPLETED_LIST_ID);
 
   for(book of books){
       const newBook = makebook(book.title, book.timestamp, book.writter, book.isCompleted);
       newBook[ITEMID] = book.id;
 
       if(book.isCompleted){
           listCompleted.append(newBook);
       } else {
           listUncompleted.append(newBook);
       }
   }
}

function addbook() {
    const uncompletedbookList = document.getElementById(UNCOMPLETED_LIST_ID );
	const listCompleted = document.getElementById(COMPLETED_LIST_ID);
    const title = document.getElementById("title").value;
    const timestamp = document.getElementById("date").value;
	const writter = document.getElementById("writter").value;
	const dibaca = document.getElementById("dibaca");
	
	if(dibaca.checked){
		const book = makebook(title, timestamp, writter, true);
		const bookObjct = bookObject(title, timestamp, writter, true);
  
		book[ITEMID] = bookObjct.id;
		books.push(bookObjct);
        listCompleted.append(book);
    } else{
		const book = makebook(title, timestamp, writter, false);
		const bookObjct = bookObject(title, timestamp, writter, false);
  
		book[ITEMID] = bookObjct.id;
		books.push(bookObjct);
        uncompletedbookList.append(book);
    }   
	updateDataToStorage();
	
}
function makebook(title, timestamp, writter, isCompleted) {
	const TB = document.createElement("h4");
    TB.innerText = "Judul Buku : ";
	
    const textTitle = document.createElement("P");
	textTitle.classList.add("texttitle")
    textTitle.innerText = title;
 
	const WB = document.createElement("h4");
    WB.innerText = "Penulis Buku : ";
 
	const textWritter = document.createElement("P");
	textWritter.classList.add("textwritter")
    textWritter.innerText = writter;
	
	const YB = document.createElement("h4");
    YB.innerText = "Tahun Buku : ";
 
    const textTimestamp = document.createElement("p");
	textTimestamp.classList.add("texttimestamp")
    textTimestamp.innerText = timestamp;
 
    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(TB, textTitle, WB, textWritter, YB, textTimestamp);
 
    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);
	if(isCompleted){
        container.append(createUndoButton(), createTrashButton());
    } else {
        container.append(createCheckButton(), createTrashButton());
    }
    return container;
}
function addBookToCompleted(bookElement) {
    const listCompleted = document.getElementById(COMPLETED_LIST_ID);
    const textTitle = bookElement.querySelector(".texttitle").innerText;
    const textTimestamp = bookElement.querySelector(".texttimestamp").innerText;
	const textWritter = bookElement.querySelector(".textwritter").innerText;
 
    const newBook = makebook(textTitle, textTimestamp, textWritter, true);
	const book = findbook(bookElement[ITEMID]);
    book.isCompleted = true;
    newBook[ITEMID] = book.id;
    listCompleted.append(newBook);
    bookElement.remove();
	updateDataToStorage();
}

function undoBookFromCompleted(bookElement){
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_ID);
    const textTitle = bookElement.querySelector(".texttitle").innerText;
    const textTimestamp = bookElement.querySelector(".texttimestamp").innerText;
	const textWritter = bookElement.querySelector(".textwritter").innerText;
 
    const newBook = makebook(textTitle, textTimestamp, textWritter, false);
 
	const book = findbook(bookElement[ITEMID]);
	book.isCompleted = false;
	newBook[ITEMID] = book.id;
 
    listUncompleted.append(newBook);
    bookElement.remove();
	
	updateDataToStorage();
}
function removeBookFromCompleted(bookElement) {
	const bookPosition = findbookIndex(bookElement[ITEMID]);
    books.splice(bookPosition, 1);
    bookElement.remove();
	updateDataToStorage();
}

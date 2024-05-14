

let library = [];
let id = 0;

class Book {
    #isbn;
    #title;
    #author;
    #pages;
    #read;
    #coverImage;
    
    constructor(_isbn, _title, _author, _pages, _read = false, _coverImage = '') {
        this.#isbn = _isbn;
        this.#title = _title;
        this.#author = _author;
        this.#pages = _pages;
        this.#read = _read;
        this.#coverImage = _coverImage;
    }

    // Override toJSON() method
    // This method is used internally by JSON.stringify() method
    // This is necessary to save objects properly in localStorage
    toJSON() {
        return {
            isbn: this.#isbn,
            title: this.#title,
            author: this.#author,
            pages: this.#pages,
            read: this.#read,
            coverImage: this.#coverImage,
        };
    }

    // This does the opposite of the above one
    // It is used to retrieve the book as an instance of Book class
    static fromJSON(serializedJSON) {
        return new Book(...Object.values(serializedJSON));
    }

    get isbn() {
        return this.#isbn;
    }
    get title() {
        return this.#title;
    }
    get author() {
        return this.#author;
    }
    get pages() {
        return this.#pages;
    }
    get read() {
        return this.#read;
    }
    get coverImage() {
        return this.#coverImage;
    }

    set isbn(_isbn) {
        this.#isbn = _isbn;
    }
    set title(_title) {
        this.#title = _title;
    }
    set author(_author) {
        this.#author = _author;
    }
    set pages(_pages) {
        this.#pages = _pages;
    }
    set read(_read) {
        this.#read = _read;
    }
    set coverImage(_coverImage) {
        this.#coverImage = _coverImage;
    }
};

function addBookToLibrary(title, author, pages, read = false, coverImage = '') {
    library.push(new Book(++id, title, author, pages, read, 
        coverImage === '' ? './images/default-cover-image.jpg' : coverImage));
}

function displayAllBooks() {
    for (let book of library) {
        displayBook(book)
    }
}

function displayBook(book) {
    const availableBooks = document.querySelector('#available-books');

    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.dataset.index = library.indexOf(book);

    const coverImage = document.createElement('img');
    coverImage.src = book.coverImage;
    coverImage.alt = 'book-image';
    coverImage.className = 'cover-image';

    const bookInfo = document.createElement('div');
    bookInfo.className = 'book-info';

    for (let property of ['ISBN', 'Title', 'Author', 'Pages']) {
        const bookInfoWrapper = document.createElement('div');
        bookInfoWrapper.className = 'book-info-wrapper';
        
        const bookInfoLabel = document.createElement('p');
        bookInfoLabel.className = 'book-info-label';
        bookInfoLabel.textContent = property + ': ';
        
        const bookInfoData = document.createElement('p');
        bookInfoData.className = 'book-info-data';
        bookInfoData.textContent = book[property.toLowerCase()];

        bookInfoWrapper.append(bookInfoLabel, bookInfoData);
        bookInfo.appendChild(bookInfoWrapper);
    }

    const readStatus = document.createElement('p');
    readStatus.className = 'read-status';
    readStatus.textContent = book.read ? 'Already read' : 'Not read yet';

    const actionBtns = document.createElement('div');
    actionBtns.className = 'action-btns';

    const removeBookBtn = document.createElement('button');
    removeBookBtn.className = 'remove-book-btn';
    removeBookBtn.textContent = 'Remove book';
    
    const toggleReadStatusBtn = document.createElement('button');
    toggleReadStatusBtn.className = 'toggle-read-btn';
    toggleReadStatusBtn.textContent = book.read ? 'Mark not read' : 'Mark read';

    removeBookBtn.addEventListener('click', () => {
        library.splice(bookCard.dataset.index, 1);

        localStorage.setItem('library', JSON.stringify(library));

        availableBooks.textContent = '';
        displayAllBooks();
    });

    toggleReadStatusBtn.addEventListener('click', () => {
        book.read = !book.read;

        localStorage.setItem('library', JSON.stringify(library));

        availableBooks.textContent = '';
        displayAllBooks();
    });

    actionBtns.append(removeBookBtn, toggleReadStatusBtn);
    bookCard.append(coverImage, bookInfo, readStatus, actionBtns);
    availableBooks.appendChild(bookCard);
}

const body = document.querySelector('body');
const addBookDialog = document.querySelector('dialog');
const addBookForm = document.querySelector('form');
const addBookBtn = document.querySelector('.add-book-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const confirmBtn = document.querySelector('.confirm-btn');

addBookBtn.addEventListener('click', () => {
    addBookDialog.showModal();
    body.classList.add('modal-open');
});

cancelBtn.addEventListener('click', (event) => {
    event.preventDefault();
    addBookDialog.close();
    body.classList.remove('modal-open');
});

addBookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBookDialog.close();
    body.classList.remove('modal-open');

    const data = new FormData(event.target);

    addBookToLibrary(
        data.get('title'),
        data.get('author'),
        data.get('pages'),
        data.get('read'),
        (data.get('cover-image').name != '') ? URL.createObjectURL(data.get('cover-image')) : ''
    );

    localStorage.setItem('library', JSON.stringify(library));

    document.querySelector('#available-books').textContent = '';
    displayAllBooks();
});

addBookDialog.addEventListener('close', () => {
    const inputs = Array.from(addBookForm.querySelectorAll('input'));

    for (let input of inputs) {
        input.value = ''
    }
});

addEventListener('load', () => {
    if (localStorage.getItem('library')) {
        library = JSON.parse(localStorage.getItem('library'));

        for (let i = 0; i < library.length; i++) {
            library[i] = Book.fromJSON(library[i]);
        }
    }
    else {
        addBookToLibrary('Sahih Al-Bukhari', 'Imam. Mohammad Bin Ismail Al-Bukhari', 3416, false, './images/sahih-al-bukhari-cover-image.png');
        addBookToLibrary('Sahih Muslim', 'Imam. Muslim Bin Al-Hajjaj An-Naisaburi', 2933, false, './images/sahih-muslim-cover-image.png');
        addBookToLibrary('Riyad Al-Saleheen', 'Imam. Yahia Ibn Sharaf An-Nawawi', 680);
        
        localStorage.setItem('library', JSON.stringify(library));
    }
    
    displayAllBooks();
});




const library = [];
let id = 0;

function Book(isbn, title, author, pages, read = false, coverImage = '') {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.coverImage = coverImage;
}

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
    bookCard.id = 'b' + book.isbn;

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

    bookCard.append(coverImage, bookInfo, readStatus);
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

    displayBook(library[library.length - 1]);
});

addBookDialog.addEventListener('close', () => {
    const inputs = Array.from(addBookForm.querySelectorAll('input'));

    for (let input of inputs) {
        input.value = ''
    }
});

addBookToLibrary('Sahih Al-Bukhari', 'Imam. Mohammad Bin Ismail Al-Bukhari', 3416, false, './images/sahih-al-bukhari-cover-image.png');
addBookToLibrary('Sahih Muslim', 'Imam. Muslim Bin Al-Hajjaj An-Naisaburi', 2933, false, './images/sahih-muslim-cover-image.png');
addBookToLibrary('Riyad Al-Saleheen', 'Imam. Yahia Ibn Sharaf An-Nawawi', 680);

displayAllBooks();
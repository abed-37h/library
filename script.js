

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
    library.push(new Book(++id, title, author, pages, read, coverImage));
}


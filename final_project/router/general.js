const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const userExists = users.some((user) => user.username === username);
    if (!userExists) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User registered successfully."})
  } else return res.status(400).json({message: "Username already exists"}); 
} else return res.status(400).json({message: "Username and/or password not provided."});


});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });

  const booksList = await getBooks;
  return res.status(200).json(booksList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    const getBook = new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {reject("Book not found.")}
    });

    try {
        const bookDetails = await getBook;
        return res.status(200).json(bookDetails);
    } catch (error) {
        return res.status(404).json({message: error});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let author = req.params.author;
  const keys = Object.keys(books);
  const matchingBooks = [];
  const getBooksByAuthor = new Promise((resolve, reject) => {
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (books[key].author === author) {
            matchingBooks.push(books[key]);
        };
    };

    if (matchingBooks.length > 0) {
        resolve(matchingBooks);
    } else {reject("No books found.")}
  })
  try {
    const booksFound = await getBooksByAuthor;
    return res.status(200).json(booksFound);
  } catch (error) {
    return res.status(404).json({message: error});
  };

  });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  const matchingBooks = [];
  
  const getBooksByTitle = new Promise((resolve, reject) => {
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (books[key].title === title) {
            matchingBooks.push(books[key]);
        };
    }
    if (matchingBooks.length > 0) {
        resolve(matchingBooks)
    } else {
        reject("No books found.")
    };
  })

  try {
    const booksFound = await getBooksByTitle;
    return res.status(200).json(booksFound)
  } catch (error) {
    return res.status(404).json({message: error})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  let reviews = book.reviews;

  if (Object.keys(reviews).length > 0) {
    return res.status(200).json(reviews);
  } else {return res.status(404).json({message: "No reviews for this book"})}
});

module.exports.general = public_users;

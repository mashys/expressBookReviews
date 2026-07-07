const express = require('express');
const axios = require('axios');
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
        return res.status(200).json({message: "User registered successfully."});
  } else return res.status(400).json({message: "Username already exists"}); 
} else return res.status(400).json({message: "Username and/or password not provided."});
});

// Task 10: Get the book list available in the shop using async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/mock-api/books');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(200).json(books);
  }
});

// Task 11: Get book details based on ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/mock-api/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({message: "Book not found."});
    }
  }
});
  
// Task 12: Get book details based on author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/mock-api/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    const author = req.params.author;
    const keys = Object.keys(books);
    const matchingBooks = [];
    for (let i = 0; i < keys.length; i++) {
      if (books[keys[i]].author === author) {
        matchingBooks.push(books[keys[i]]);
      }
    }
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({message: "No books found for this author."});
    }
  }
});

// Task 13: Get all books based on title using async/await with Axios
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/mock-api/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    const title = req.params.title;
    const keys = Object.keys(books);
    const matchingBooks = [];
    for (let i = 0; i < keys.length; i++) {
      if (books[keys[i]].title === title) {
        matchingBooks.push(books[keys[i]]);
      }
    }
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({message: "No books found with this title."});
    }
  }
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  let reviews = book.reviews;

  if (Object.keys(reviews).length > 0) {
    return res.status(200).json(reviews);
  } else {
    return res.status(404).json({message: "No reviews for this book"});
  }
});

module.exports.general = public_users;

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const JWT_SECRET = 'your_super_secure_random_secret_key';

// Check if username already exists (used during registration in general.js)
const isValid = (username)=>{ 
  const userExists = users.some((user) => user.username === username);
  return userExists; // Returns true if username is taken, false if available
}

// Check if username and password match records (used during login)
const authenticatedUser = (username,password)=>{ 
  const validUser = users.some((user) => user.username === username && user.password === password);
  return validUser; // Returns true if credentials match
}

// Only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    // FIX: Using the authenticatedUser helper function instead of inline logic
    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({data: username}, 'access', { expiresIn: '15m' });
        req.session.authorization = {
            accessToken,
            username
        };
        return res.status(200).json({message: "User successfully logged in"});
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  } else {
    return res.status(400).json({message: "Username and password are required"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found."});
  }

  if (!review) {
    return res.status(400).json({message: "Review must have text"});
  }

  // FIX: Changed '= username' to '= review' so it saves the actual comment
  books[isbn].reviews[username] = review;

  return res.status(200).json({message: "Successfully added/updated review."});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found."})
    };

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({message: "Review successfully deleted."})
    } else {return res.status(404).json({message: "You have not posted a book review yet."})}
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
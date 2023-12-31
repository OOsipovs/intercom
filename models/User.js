const bcrypt = require("bcryptjs");
const usersCollection = require("../db").collection("users");
const validator = require("validator");

let User = function (data) {
  console.log(data);
  this.data = data;
  this.errors = [];
}

User.prototype.cleanUp = function () {
  if (typeof this.data.username != "string") {
    this.data.username = "";
  }
  if (typeof this.data.email != "string") {
    this.data.email = "";
  }
  if (typeof this.data.password != "string") {
    this.data.password = "";
  }

  // get rid of any bogus properties
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password
  }
}

User.prototype.validate = function () {
  if (this.data.username == "") {
    this.errors.push("You must provide a username.");
  }
  if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
    this.errors.push("Username can only contain letters and numbers.");
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("You must provide a valid email address.");
  }
  if (this.data.password == "") {
    this.errors.push("You must provide a password.");
  }
  if (this.data.password.length > 0 && this.data.password.length < 12) {
    this.errors.push("Password must be at least 12 characters.");
  }
  if (this.data.password.length > 50) {
    this.errors.push("Password cannot exceed 100 characters.");
  }
  if (this.data.username.length > 0 && this.data.username.length < 3) {
    this.errors.push("Username must be at least 3 characters.");
  }
  if (this.data.username.length > 30) {
    this.errors.push("Username cannot exceed 30 characters.");
  }
}

User.prototype.login = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp()
    const attemptedUser = await usersCollection.findOne({ username: this.data.username })
    if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
      resolve("Congrats!");
    } else {
      reject("Invalid username / password.");
    }
  })
}

User.prototype.register = function () {
  this.cleanUp();
  this.validate();

  if (!this.errors.length) {
    let salt = bcrypt.genSaltSync(10)
    this.data.password = bcrypt.hashSync(this.data.password, salt);
    usersCollection.insertOne(this.data);
  }
}

module.exports = User

const validator = require('validator');

let User = (data) => {
    this.data = data;
    this.errors = [];
}

User.prototype.validate = () => {
    if(this.data.username == ""){
        this.errors.push("You must provide a username");
    }
    if(this.data.username != "" && !validator.isAlphanumeric(this.data.username)){
        this.errors.push("Please, provide a valid username");
    }
    if(!validator.isEmail(this.data.email)){
        this.errors.push("You must provide a valid email");
    }
    if(this.data.password == ""){
        this.errors.push("You must provide a password");
    }
    if(this.data.password.length > 0 && this.data.password.length < 12){
        this.errors.push("Password must be at least 12 chars");
    }
    if(this.data.username.length > 0 && this.data.username.length < 3){
        this.errors.push("Username must be at least 3 chars");
    }
    if(this.data.username.length > 30){
        this.errors.push("Username should not be longer then 30 chars");
    }
}

User.prototype.register = () => {
    //validate user data
    
}
module.exports = User;
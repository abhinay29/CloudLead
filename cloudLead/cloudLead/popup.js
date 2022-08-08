let element = document.getElementById("loginBtn");
element.addEventListener('click',loginOnclick);




function loginOnclick(){
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    if(username == 'admin' && password == 'admin'){
        window.location = "Home.html"
        localStorage.setItem("username",username);
        localStorage.setItem("password",password);
     
    }else{
        document.getElementById("demo").innerHTML = "Invalid Credentials";
    }
}


const login = (e) => {
  e.preventDefault();

  fetch("/user/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
        email: document.querySelector(".email").value,
        password: document.querySelector(".pass").value
    }),
  })
    .then((res) => res.json())
    .then((data) => {
        console.log("data", data)
        if(data.token){
            alert("login succesful!")
            window.location.href = "./user.html"
        }else{
            alert(data.message)
        }
    })
    .catch((err) => console.log("error loggin in", err));
};

document.querySelector(".loginBtn").addEventListener("click", login);

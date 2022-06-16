const login = (e) => {
  e.preventDefault();

  fetch("https://backendfiles.netlify.app/user/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: document.querySelector(".email").value,
      password: document.querySelector(".pass").value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem('role', data.role);

        const role=localStorage.getItem('role');
        console.log("this is role",role)
        if(role==="user"){
        alert("login succesful!");
        window.location.href = "./order.html"
        }else{ window.location.href = "./admin.html"
      }
      } else {
        alert(data.message);
      }
    })
    .catch((err) => console.log("error loggin in", err));
};

document.querySelector(".loginBtn").addEventListener("click", login);

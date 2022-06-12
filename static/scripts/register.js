const register = (e) => {
    e.preventDefault();
  
    fetch("/user/signup", {
      method: "POST",
      headers: {
        "content-type": "application/json",
     
       
      },
      body: JSON.stringify({
          name:document.querySelector(".name").value,
          email: document.querySelector(".email").value,
          password: document.querySelector(".pass").value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
          if(data.token){
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('role', data.role);

            const role=localStorage.getItem('role');
            if(role==="user"){
              alert("login succesful!");
              window.location.href = "./order.html"

              }else{ window.location.href = "./admin.html"};
          }else{
              alert(data.message)
          }
      })
      .catch((err) => console.log("error loggin in", err));
  };
  
  document.querySelector(".signUp").addEventListener("click", register);
  
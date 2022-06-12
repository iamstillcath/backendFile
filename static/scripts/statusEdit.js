const firstname = localStorage.getItem("firstname");
const userId = localStorage.getItem("userId");
const token = localStorage.getItem('token');

//preventing unauthorised users from accessing the page
if(!token){
  window.location.href = './login.html';
}

document.querySelector("#nameBar").innerHTML = firstname.toUpperCase();

//handling request to change a specific parcel destination
const changeDestination = e => {
  e.preventDefault();
  const userId = localStorage.getItem("userId");
  fetch(`/${userId}/destination`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({
      parcelId: document.getElementById("orderId").value,
      status: document.getElementById("status").value,
      user_id: userId
    })
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      if (res.details) {
        alert("Status changed successfully!");
        window.location.href = "./user.html";
      } else if (res.msg) {
        toastr.error(res.msg);
      }
    })
    .catch(err => console.log("error occured", err));
};

document
  .getElementById("edit-form")
  .addEventListener("submit", changeDestination);


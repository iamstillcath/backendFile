const token = localStorage.getItem('token');


if(!token){
  window.location.href = './login.html';
}


const changeDestination = e => {
  e.preventDefault();

  fetch("https://backendfiles.netlify.app/parcels/destination", {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({
      ordersId: document.getElementById("ordersId").value,
      destination: document.getElementById("destination").value,
    
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data) {
        alert("Destination changed successfully!");
        window.location.href = "./admin.html";
      } else if (res.msg) {
        toastr.error(res.msg);
      }
    })
    .catch(err => console.log("error occured", err));
};

document
  .getElementById("edit-form")
  .addEventListener("submit", changeDestination);


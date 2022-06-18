const token = localStorage.getItem('token');


if(!token){
  window.location.href = './login.html';
}


const changeStatus = e => {
  e.preventDefault();
  fetch("parcels/status", {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({
      statusId: document.getElementById("orderId").value,
      status: document.getElementById("status").value,
     
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status===1) {
        alert("Status changed successfully!");
        window.location.href = "./admin.html";
      } else  {
        alert(data.message)
      }
    })
    .catch();
};

document
  .getElementById("status-form")
  .addEventListener("submit", changeStatus);


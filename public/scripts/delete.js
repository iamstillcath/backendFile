const token = localStorage.getItem('token');


if(!token){
  window.location.href = './login.html';
}


const changeDestination = e => {
  e.preventDefault();

  fetch("parcels/delete", {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({
      orderId: document.getElementById("ordersId").value,
    
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data) {
        alert("Order successfully Deleted!");
      window.location.href = "./user.html";
    } else {
      alert(data.message)}
    
    })
    .catch();
};

document
  .getElementById("edit-form")
  .addEventListener("submit", changeDestination);


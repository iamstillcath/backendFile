const userId = localStorage.getItem("userId");
const firstname = localStorage.getItem("firstname");
const token = localStorage.getItem("token");


//preventing unauthorised users from accessing the pag
if (!token) {
  window.location.href = "./login.html";
}

document.querySelector("#nameBar").innerHTML = firstname.toUpperCase();

const theOrder = (e) => {
  console.log(token)
  e.preventDefault();
  fetch("/parcels" , {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:  token
    },
    body: JSON.stringify({
      user_Id: localStorage.getItem("userId"),
      product: document.getElementById("product").value,
      price: document.getElementById("price").value,
      quantity: document.getElementById("quantity").value,
      currentLocation: document.getElementById("currentLocation").value,
      destination: document.getElementById("destination").value,
      recipientName: document.getElementById("reciName").value,
      recipientNumber: document.getElementById("reciPhoneNo").value,
    }),
  })
    .then((res) =>res.json())
    .then((data) => {
      if (data.token) {
        alert("parcel created successfully!");
        window.location.href = "./user.html";
      } else {
        alert(data.message)
        };

    })
    .catch((err) => console.log("error occured", err));
};

document
  .getElementById("registration-form")
  .addEventListener("submit", theOrder);

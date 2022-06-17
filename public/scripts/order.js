const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");


if (!token) {
  window.location.href = "./login.html";
}


const theOrder = (e) => {
  e.preventDefault();
  fetch("/parcels" , {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({
      user_Id: localStorage.getItem("userId"),
      product: document.getElementById("product").value,
      price: document.getElementById("price").value,
      pickupLocation: document.getElementById("pickupLocation").value,
      currentLocation: document.getElementById("currentLocation").value,
      destination: document.getElementById("destination").value,
      recipientName: document.getElementById("recipientName").value,
      recipientNumber: document.getElementById("recipientNumber").value,
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
    .catch((error) => console.log("error occured", error));
};

document
  .getElementById("registration-form")
  .addEventListener("submit", theOrder);

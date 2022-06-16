const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "./login.html";
}

const logout = document.getElementById("logout");

logout.addEventListener("click", function () {
  localStorage.clear();
  window.location.href = "./login.html";
});

const userId = localStorage.getItem("userId");
fetch("https://backendfiles.netlify.app/parcels", {
  method: "GET",
  headers: {
    Authorization: 'Bearer ' + token
  },
})
  .then((res) => res.json())
  .then((data) => {
    const ordersTable = document.querySelector(".parcelDetails");
    if (!data.length) {
      document.querySelector("#error-msg").innerHTML =
        "You do not have any Parcel Delivery Order yet";
    } else {
      data.sort((a, b) => a.id - b.id);
      renderTableData(data, ordersTable);

    }
  });

const renderTableData = (data, ordersTable) => {
  data.forEach((output) => {
    let outputRow = document.createElement("tr");
    outputRow.innerHTML = `<th scope="row">${output._id}</th>
                        <td>${output.product}</td>
                        <td>${"₦" + output.price + ":00"}</td>
                        <td>${output.pickupLocation}</td>
                        <td class="remove-second">${output.destination}</td>
                        <td>${output.currentLocation}</td>
                        <td>${output.recipientName}</td>
                        <td>${output.recipientNumber}</td>
                        <td>${output.status}</td>
                           `;
    ordersTable.append(outputRow);


  });
};

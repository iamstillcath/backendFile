console.log("this is admin page")
const token = localStorage.getItem('token');

if(!token){
  window.location.href = './login.html';
}


const logout = document.getElementById('logout');

logout.addEventListener('click', function () {
  localStorage.clear();
  window.location.href = './login.html';
});



//fetch request to render all user parcels into the table
const userId = localStorage.getItem("userId");
fetch("/parcels", {
  method: "GET",
  headers: {
    Authorization: token
  }
})
  .then(res => res.json())
  .then(data => {
    const ordersTable = document.querySelector(".parcelDetails");
    if (!data.length) {
      document.querySelector("#error-msg").innerHTML =
        "You do not have any Parcel Delivery Order yet";
    } else {
      data.sort((a, b) => a.id - b.id);
      renderTableData(data, ordersTable);

      document.getElementById("ordersLength").innerHTML = `${
        data.length
      }`;
    }
  });

const renderTableData = (data, ordersTable) => {
  data.forEach(parcel => {
    let parcelRow = document.createElement("tr");
    parcelRow.innerHTML = `<th scope="row">${parcel.id}</th>
                          <td>${parcel.pickup_location}</td>
                          <td class="remove-second">${parcel.destination}</td>
                          <td>${parcel.recipient_name}</td>
                          <td>${parcel.recipient_phone_no}</td>
                          <td>${parcel.status}</td>
                           `;
    ordersTable.append(parcelRow);
  });
};

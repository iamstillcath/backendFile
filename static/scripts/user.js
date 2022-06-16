const token = localStorage.getItem('token');


if(!token){
  window.location.href = './login.html';
}




const userId = localStorage.getItem("userId");
fetch("https://backendfiles.netlify.app/parcels/user", {
  method: "GET",
  headers: {
    Authorization: 'Bearer ' + token
  }
})
  .then(res => res.json())
  .then(data => {
    console.log("this is data!!",data)
    const orderTable = document.querySelector(".allParcels");
    if (!data.length) {

      document.querySelector("#error-msg").innerHTML =
        "You do not have any Order yet";
    } else {
      data.sort((adm, us) => adm._id - us._id);
      renderTableData(data, orderTable);

      document.getElementById("orders").innerHTML = `${
        data.length
      }`;

      const craetedOrders = data.filter(stat => stat.status === "Created")
        .length;
      document.getElementById(
        "created"
      ).innerHTML = `${craetedOrders}`;
      

      const Intransit = data.filter(stat => stat.status === "In-transit").length;
      document.getElementById(
        "In-transit"
      ).innerHTML = `${Intransit}`;
    
      s
      const Delivered = data.filter(stat => stat.status === "Delivered").length;
      document.getElementById(
        "Delivered"
      ).innerHTML = `${Delivered}`;

  
    }
  });

const logoutBtn = document.getElementById('logout');

logoutBtn.addEventListener('click', function () {
  localStorage.clear();
  window.location.href = './login.html';
});

const renderTableData = (data, orderTable) => {
  data.forEach(output => {
    let parcelRow = document.createElement("tr");
    parcelRow.innerHTML = `<th scope="row">${output._id}</th>
                          <td>${output.product}</td>
                          <td>${ "₦"+ output.price+":00"}</td>
                          <td>${output.pickupLocation}</td>
                          <td class="remove-second">${output.destination}</td>
                          <td>${output.currentLocation}</td>
                          <td>${output.recipientName}</td>
                          <td>${output.recipientNumber}</td>
                          <td>${output.status}</td>
                           `;
    orderTable.append(parcelRow);
  });
};



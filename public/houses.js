let allHouses = [];

async function loadHouses() {
  const res = await fetch("/houses");
  allHouses = await res.json();
  displayHouses(allHouses);
}

function displayHouses(houses) {
  const container = document.getElementById("housesContainer");
  container.innerHTML = "";

  houses.forEach(house => {
    
 console.log(house);
    const card = document.createElement("div");
    card.className = "card";

   card.innerHTML = `
  <div class="like">❤️</div>

  <img src="${house.image}" alt="${house.title}">

  <div class="card-content">
      <h3>${house.title}</h3>

      <span class="location">📍 ${house.location}</span>

      <p class="rent">₹${house.rent}</p>
<a href="property-details.html?id=${house._id}">
    <button style="
        width:100%;
        margin-top:10px;
        padding:10px;
        background:#2563eb;
        color:white;
        border:none;
        border-radius:6px;
        cursor:pointer;
    ">
        View Details
    </button>
</a>

      <button class="delete-btn" onclick="deleteHouse('${house._id}')">
          Delete
      </button>

  </div>
`;

    container.appendChild(card);
  });
}

// ================= DELETE FUNCTION =================

async function deleteHouse(id) {
  const confirmDelete = confirm("Are you sure you want to delete this property?");

  if (!confirmDelete) return;

  try {
    const res = await fetch(`/delete/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();

    alert(data.message);

    loadHouses(); // refresh list after delete

  } catch (error) {
    alert("Error deleting house");
    console.log(error);
  }
}

// ================= SEARCH FILTER =================

document.getElementById("search").addEventListener("input", function (e) {
  const value = e.target.value.toLowerCase();

  const filtered = allHouses.filter(h =>
    h.location.toLowerCase().includes(value)
  );

  displayHouses(filtered);
});

// ================= INITIAL LOAD =================

loadHouses();
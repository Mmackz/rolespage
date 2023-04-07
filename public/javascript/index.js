const downloadButton = document.querySelector("#download");
const updateButton = document.querySelector("#update");
const timestamp = document.querySelector(".timestamp");
const addressTable = document.getElementById("address-table");

const slider = document.querySelector("#threshold");
const thresholdValue = document.querySelector("#threshold-value");

const emptyTable = document.createElement("div");
emptyTable.className = "empty";

// initialize addresses table
let addresses = null;
addressTable.appendChild(emptyTable);

const generateButton = document.createElement("button");
generateButton.textContent = "Generate Allowlist";

generateButton.addEventListener("click", () => {
   // Fetch data from the server
   fetch("/download")
      .then((response) => response.json())
      .then((data) => {
         addresses = data;
         // Generate the HTML list and append it to the container
         populateAddressTable(addresses, slider.value);
      });
});
emptyTable.appendChild(generateButton);

timestamp.textContent = `Last Update: ${new Date(
   +timestamp.getAttribute("data-timestamp")
).toLocaleString()}`;

slider.addEventListener("input", (event) => {
   thresholdValue.textContent = event.target.value;

   if (addresses !== null) {
      populateAddressTable(addresses, slider.value);
   }
});

downloadButton.addEventListener("click", async () => {
   try {
      const response = await fetch(`/download?threshold=${slider.value}`);
      const data = await response.json();
      console.log(data);
   } catch (err) {
      console.error("Failed to copy CSV data: ", err);
   }
});

updateButton.addEventListener("click", async () => {
   console.log("starting update");
   try {
      const response = await fetch("/update", { method: "POST" });
      const data = await response.json();

      if (response.status === 200) {
         timestamp.textContent = `Last Update: ${new Date(+data).toLocaleString()}`;
         console.log(response.status);
      } else if (response.status === 429) console.log("Too many requests");
   } catch (e) {
      console.log(e);
   }
});

function populateAddressTable(data, threshold) {
   addressTable.innerHTML = "";

   // Add new rows to the table
   data.forEach(([address, number]) => {
      if (number >= threshold) {
         const row = document.createElement("div");
         const addressCell = document.createElement("div");
         const numberCell = document.createElement("div");
         row.className = "row";
         addressCell.className = "cell";
         numberCell.className = "cell";
         addressCell.textContent = address;
         numberCell.textContent = number;
         row.appendChild(addressCell);
         row.appendChild(numberCell);
         addressTable.appendChild(row);
      }
   });
}

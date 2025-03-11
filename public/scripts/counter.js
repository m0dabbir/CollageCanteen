// Clock Functionality
setInterval(() => {
  document.getElementById("clock").innerHTML = new Date().toLocaleString();
}, 1000);

// Visitor Counter Functionality
function visitorCount() {
  fetch("https://api.countapi.xyz/update/canteenJMI.com/counter?amount=1")
    .then((res) => res.json())
    .then((res) => {
      document.getElementById("count").innerHTML = `Visitors: ${res.value}`;
    });
}

// Call visitorCount on page load
visitorCount();

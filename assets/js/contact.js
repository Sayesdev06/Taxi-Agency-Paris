const submit = document.getElementById("submitForm");

submit.addEventListener("submit", async function (e) {
 e.preventDefault();
 let payload = {};

 payload["nomPrenom"] = document.getElementById("nomPrenom").value;
 payload["phone"] = document.getElementById("phone").value;
 payload["email"] = document.getElementById("email").value;
 payload["message"] = document.getElementById("message").value;

 let response = await fetch("https://taxi-dlc7.onrender.com/api/v1/contacts/add-contact", {
  method: "POST",
  headers: {
   Accept: "application/json",
   "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
 });
 let data = await response.json();
 console.log(data);
});

const selectTrip = document.getElementById("trip-type");
const sectionRetour = document.getElementById("dateRetour");

const goToReservationPage = document.getElementById("goToReservationPage");

const btnGoToStep2 = document.getElementById("go-to-step-2");
const btnGoToStep4 = document.getElementById("go-to-step-4");
const btnPrint = document.getElementById("print");

const sectionStep1 = document.getElementById("step-1");
const sectionStep2 = document.getElementById("step-2");
const sectionStep3 = document.getElementById("step-3");
const sectionStep4 = document.getElementById("step-4");

const counterStep1 = document.getElementById("counter-step-1");
const counterStep2 = document.getElementById("counter-step-2");
const counterStep3 = document.getElementById("counter-step-3");
const counterStep4 = document.getElementById("counter-step-4");

/***************************************************************** */

var props = {
 carInfo: {
  price: 35,
 },
 userInfo: {},
};

var carSelected;
var distance;

if (window.history.state) {
 sectionStep1.classList.add("d-none");
 sectionStep2.classList.remove("d-none");
 counterStep2.classList.add("active");

 getDistance();
}

async function getDistance() {
 let from = "1";
 let to = "1";
 if (window.history.state) {
  const { state } = window.history.state;
  from = state.fromLongLat || "";
  to = state.toLongLat || "";
 } else {
  from = fromLongLat;
  to = toLongLat;
 }
 //console.log("heret", from, to);
 if (to) {
  let response = await fetch(
   `https://api.mapbox.com/directions/v5/mapbox/driving/${from};${to}?access_token=pk.eyJ1Ijoic2VydmljZXRheGlzdGUiLCJhIjoiY2xjOTA1OHp1MGFkMzN3bjJxdjJzdG56ZCJ9.MJHJ1aWIm4ExongiM5FUsg`,
   {
    method: "get",
    body: null,
   }
  );
  let data = await response.json();
  //console.log("here", data.routes[0].distance / 1000);

  distance = data.routes[0].distance / 1000;
 } else {
  distance = 1;
 }

 if (window.history.state && window.history.state.state.tripType == "Aller / Retour") distance = distance * 2;

 if (document.getElementById("trip-type").value == "Aller / Retour") distance = distance * 2;

 document.getElementById("standard-price").innerHTML = distance * 2.5 > 39 ? (distance * 2.5).toFixed(2) + " €" : "39.00 €";
 document.getElementById("berline-price").innerHTML = distance * 2.7 > 39 ? (distance * 2.7).toFixed(2) + " €" : "49.00 €";
 document.getElementById("van-price").innerHTML = distance * 3.5 > 39 ? (distance * 3.5).toFixed(2) + " €" : "59.00 €";

 //min 39
}

function goToNextStep(carType) {
 carSelected = carType;

 if (carType == "Standard") {
  props["carInfo"]["price"] = parseFloat(distance * 2.5).toFixed(2) > 39 ? parseFloat((distance * 2.5).toFixed(2)) : 39;
 } else if (carType == "Berline") {
  props["carInfo"]["price"] = parseFloat(distance * 2.7).toFixed(2) > 39 ? parseFloat((distance * 2.7).toFixed(2)) : 49;
 } else {
  props["carInfo"]["price"] = parseFloat(distance * 3.5).toFixed(2) > 39 ? parseFloat((distance * 3.5).toFixed(2)) : 59;
 }

 sectionStep2.classList.add("d-none");
 sectionStep3.classList.remove("d-none");
 counterStep3.classList.add("active");
}

async function setProps() {
 props["tripType"] = document.getElementById("trip-type").value;
 props["carInfo"]["type"] = document.getElementById("car-type").value;
 props["from"] = document.getElementById("from").value;
 props["to"] = document.getElementById("to").value;
 props["startDate"] = document.getElementById("start-date").value;
 props["timeStart"] = document.getElementById("time-start").value;
 props["returnDate"] = document.getElementById("return-date").value;
 props["timeReturn"] = document.getElementById("time-return").value;
 //here
 props["fromLongLat"] = fromLongLat;
 props["toLongLat"] = toLongLat;
}

async function addReservation() {
 let payload = {
  carInfo: {},
 };

 await getObjectReservation();
 for (i = 0; i < btnRadio.length; i++) {
  if (btnRadio[i].checked) props["userInfo"]["paymentType"] = btnRadio[i].value;
 }

 payload = { ...props };

 document.getElementById("tab-from").innerHTML = payload.from || "";
 document.getElementById("tab-to").innerHTML = payload.to || "";
 document.getElementById("tab-tripType").innerHTML = payload.tripType || "";
 document.getElementById("tab-startDate").innerHTML = payload.startDate + " - " + payload.timeStart || "";
 document.getElementById("tab-returnDate").innerHTML = payload.returnDate + " - " + payload.timeReturn || "";
 document.getElementById("tab-car-type").innerHTML = payload.carInfo.type || "";
 document.getElementById("tab-price").innerHTML = payload.carInfo.price || "";
 document.getElementById("tab-name").innerHTML = payload.userInfo.prenom || "";
 document.getElementById("tab-last-name").innerHTML = payload.userInfo.nom || "";
 document.getElementById("tab-phone").innerHTML = payload.userInfo.phone || "";
 document.getElementById("tab-email").innerHTML = payload.userInfo.email || "";
 document.getElementById("tab-msg").innerHTML = payload.userInfo.message || "";
 document.getElementById("tab-payment-type").innerHTML = payload.userInfo.paymentType || "";

 if (!payload.to) document.getElementById("row-to").classList.add("d-none");

 if (!payload.returnDate) document.getElementById("row-returnDate").classList.add("d-none");

 if (!payload.userInfo.nom) document.getElementById("row-last-name").classList.add("d-none");

 if (!payload.userInfo.email) document.getElementById("row-email").classList.add("d-none");

 if (!payload.userInfo.message) document.getElementById("row-msg").classList.add("d-none");

 delete payload.fromLongLat;

 delete payload.toLongLat;
 let submitButton = document.getElementById("submit");
 let textButton = document.getElementById("text");
 let loading = document.getElementById("loading");

 submitButton.setAttribute("disabled", true);
 textButton.classList.add("d-none");
 loading.classList.remove("d-none");
 let response = await fetch("https://taxi-dlc7.onrender.com/api/v1/reservations/add-reservation", {
  method: "POST",
  headers: {
   Accept: "application/json",
   "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
 });

 let data = await response.json();
 //console.log(response.status);
 if (response.status == 200) {
  sectionStep3.classList.add("d-none");
  sectionStep4.classList.remove("d-none");
  counterStep4.classList.add("active");
 } else {
  const toast = document.getElementById("toast");
  toast.classList.remove("d-none");
  bootstrap.Toast.Default.delay = 5000;
  var myAlert = document.getElementById("errToast"); //select id of toast
  var bsAlert = new bootstrap.Toast(myAlert); //inizialize it
  bsAlert.show(); //show it

  setTimeout(() => {
   toast.classList.add("d-none");
  }, 5000);
 }
 submitButton.setAttribute("disabled", false);
 textButton.classList.remove("d-none");
 loading.classList.add("d-none");
}

async function getObjectReservation() {
 if (window.history.state) {
  const { state } = window.history.state;

  props["tripType"] = state.tripType || "";
  props["carInfo"]["type"] = carSelected || "";
  props["from"] = state.from || "";
  props["to"] = state.to || "";
  props["startDate"] = state.startDate || "";
  props["timeStart"] = state.timeStart || "";
  props["returnDate"] = state.returnDate || "";
  props["timeReturn"] = state.timeReturn || "";
 } else {
  await setProps();
 }

 props["userInfo"]["prenom"] = document.getElementById("info-first-name").value;
 props["userInfo"]["nom"] = document.getElementById("info-last-name").value;
 props["userInfo"]["phone"] = document.getElementById("info-phone").value;
 props["userInfo"]["email"] = document.getElementById("info-email").value;
 btnRadio = document.getElementsByName("info-payment-type");
 props["userInfo"]["message"] = document.getElementById("info-message").value;
}

if (goToReservationPage) {
 goToReservationPage.addEventListener("submit", async function (e) {
  e.preventDefault();
  if (!placeSelectedTo) {
   document.getElementById("to").value = "";
   document.getElementById("error-message-to").textContent = "Veuillez sélectionner un lieu dans la liste.";
  }
  if (!placeSelectedForm) {
   document.getElementById("from").value = "";
   document.getElementById("error-message-from").textContent = "Veuillez sélectionner un lieu dans la liste.";
  }
  if (!placeSelectedForm || !placeSelectedTo) {
   return;
  }
  await setProps();
  window.history.pushState({ state: props }, "", "/reservation/index.html");
  window.location.href = "/reservation/index.html";
 });
}

if (selectTrip) {
 selectTrip.addEventListener("change", function handleChange(event) {
  if (event.target.value == "Aller / Retour") {
   sectionRetour.classList.remove("d-none");
   document.getElementById("return-date").required = true;
   document.getElementById("time-return").required = true;
  } else {
   sectionRetour.classList.add("d-none");
  }
 });
}

if (btnGoToStep2) {
 btnGoToStep2.addEventListener("submit", function goToStep2(e) {
  e.preventDefault();
  if (!placeSelectedTo) {
   document.getElementById("to").value = "";
   document.getElementById("error-message-to").textContent = "Veuillez sélectionner un lieu dans la liste.";
  }
  if (!placeSelectedForm) {
   document.getElementById("from").value = "";
   document.getElementById("error-message-from").textContent = "Veuillez sélectionner un lieu dans la liste.";
  }
  if (!placeSelectedForm || !placeSelectedTo) {
   return;
  }
  sectionStep1.classList.add("d-none");
  sectionStep2.classList.remove("d-none");
  counterStep2.classList.add("active");

  getDistance();
 });
}

if (btnGoToStep4) {
 btnGoToStep4.addEventListener("submit", function goToStep4(e) {
  e.preventDefault();

  addReservation();
 });
}

if (btnPrint) {
 btnPrint.addEventListener("click", function handlePrint(e) {
  window.print();
 });
}

var fromLongLat = "";
var toLongLat = "";

var placeSelectedForm = false;
var placeSelectedTo = false;
window.onload = (e) => {
 function initService() {
  const displaySuggestions = function (predictions, status) {
   if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
    alert(status);
    return;
   }
  };
 }
 initService();

 const center = { lat: 50.064192, lng: -130.605469 };
 // Create a bounding box with sides ~10km away from the center point
 const defaultBounds = {
  north: center.lat + 0.1,
  south: center.lat - 0.1,
  east: center.lng + 0.1,
  west: center.lng - 0.1,
 };
 const input = document.getElementById("from");
 const inputto = document.getElementById("to");
 const options = {
  bounds: defaultBounds,
  componentRestrictions: { country: "fr" },
  fields: ["address_components", "geometry", "icon", "name"],
  strictBounds: false,
  types: ["establishment"],
 };
 const autocomplete = new google.maps.places.Autocomplete(input, options);

 autocomplete.addListener("place_changed", () => {
  const place = autocomplete.getPlace();
  latitude = place.geometry.location.lat();
  let longitude = place.geometry.location.lng();
  fromLongLat = longitude + "," + latitude;
  placeSelectedForm = true;
  //console.log("ici", latitude, longitude);
 });

 const inputTo = document.getElementById("to");
 const optionsTo = {
  bounds: defaultBounds,
  componentRestrictions: { country: "fr" },
  fields: ["address_components", "geometry", "icon", "name"],
  strictBounds: false,
  types: ["establishment"],
 };

 const autocompleteTo = new google.maps.places.Autocomplete(inputTo, optionsTo);

 autocompleteTo.addListener("place_changed", () => {
  const place = autocompleteTo.getPlace();
  let latitude = place.geometry.location.lat();
  let longitude = place.geometry.location.lng();
  toLongLat = longitude + "," + latitude;

  placeSelectedTo = true;
  //console.log("ici2", latitude, longitude);
 });
};
/* 
const inputFrom = document.getElementById("from");
const inputTo = document.getElementById("to");

function debounce(func, delay) {
 let timeout;

 return function () {
  clearTimeout(timeout);
  timeout = setTimeout(func, delay);
 };
}

const debouncedFunctionFrom = debounce(function () {
 if (inputFrom.value.length > 2) {
  getplacesFrom();
 }
}, 1000);

const debouncedFunctionTo = debounce(function () {
 if (inputTo.value.length > 2) {
  getplacesTo();
 }
}, 1000);

inputFrom.addEventListener("input", debouncedFunctionFrom);
inputTo.addEventListener("input", debouncedFunctionTo);

const suggestionsFrom = document.getElementById("mySuggestionsFrom");
const suggestionsTo = document.getElementById("mySuggestionsTo");

async function getplacesFrom() {
 let response = await fetch(`https://nominatim.openstreetmap.org/search?q=${inputFrom.value}&countrycodes=fr&format=json`, {
  method: "get",
 });
 let data = await response.json();

 let optionsHTML = "";
 suggestionsFrom.style.display = "block";
 data.forEach((suggestion, index) => {
  if (index < 5) {
   optionsHTML += `<li value="${suggestion.display_name}"><i class="fa fa-map-marker mr-2" aria-hidden="true"></i><span data-value="${suggestion.lon},${suggestion.lat}">${suggestion.display_name}</span></li>`;
  }
 });

 suggestionsFrom.innerHTML = optionsHTML;
}


if (suggestionsFrom) {
 suggestionsFrom.addEventListener("click", (event) => {
  //console.log(event.target);
  suggestionsFrom.style.display = "none";
  inputFrom.value = event.target.innerText;
  //console.log("rer", event.target.getAttribute("data-value"));
  fromLongLat = event.target.getAttribute("data-value");
 });
}

async function getplacesTo() {
 let response = await fetch(`https://nominatim.openstreetmap.org/search?q=${inputTo.value}&countrycodes=fr&format=json`, {
  method: "get",
 });
 let data = await response.json();

 let optionsHTML = "";
 suggestionsTo.style.display = "block";
 data.forEach((suggestion, index) => {
  if (index < 5) {
   optionsHTML += `<li value="${suggestion.display_name}"><i class="fa fa-map-marker mr-2" aria-hidden="true"></i><span data-value="${suggestion.lon},${suggestion.lat}">${suggestion.display_name}</span></li>`;
  }
 });

 suggestionsTo.innerHTML = optionsHTML;
}


if (suggestionsTo) {
 suggestionsTo.addEventListener("click", (event) => {
  suggestionsTo.style.display = "none";
  inputTo.value = event.target.innerText;
  toLongLat = event.target.getAttribute("data-value");
 });
} */

// const datalist = document.getElementById('browsers');
// const options = optFrom;

// const changeForm =(e) => debounce((e)=>getValueFrom(e))

//  if(inputFrom){
// inputFrom.addEventListener('input', () => {
//   let valid = false;

//   for (let i = 0; i < options.length; i++) {
//     //console.log("here",inputFrom.value , options[i])
//     if (inputFrom.value === options[i]) {
//       valid = true;
//       break;
//     }
//   }

//   if (!valid) {
//     inputFrom.setCustomValidity('Veuillez sélectionner une option valide dans la liste.');
//   } else {
//     inputFrom.setCustomValidity('');
//   }
// });
// }

// const datalist2 = document.getElementById('browsers2');
// const options2 = optTo;
// if(inputTo){
//   inputTo.addEventListener('input', () => {
//   let valid = false;

//   for (let i = 0; i < options2.length; i++) {
//     if (inputTo.value === options2[i]) {
//       valid = true;
//       break;
//     }
//   }

//   if (!valid) {
//     inputTo.setCustomValidity('Veuillez sélectionner une option valide dans la liste.');
//   } else {
//     inputTo.setCustomValidity('');
//   }
// });
// }

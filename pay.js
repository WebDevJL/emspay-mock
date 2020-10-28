const baseAppUrl = document.location.href;
console.log(baseAppUrl);

const emsApiUrl = "https://api.online.emspay.eu/v1/orders/";
const amount = document.querySelector("#amount");
const currency = document.querySelector("#currency");
const merchandOrderId = document.querySelector("#merchandOrderId");
const language = document.querySelector("#language");
const consoleOnly = document.querySelector("#consoleOnly");
let payBtn = document.querySelector(".pay");

/**
 * Build a random string of a given length
 *
 * @param {int} length the length of the string to build
 * @returns {string}
 */
//Source: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid(length) {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
/**
 * Get a guid made of 5 parts
 * - part 1: 8 characters
 * - part 2: 4 characters
 * - part 3: 4 characters
 * - part 4: 4 characters
 * - part 5: 10 characters
 */
function getGuid() {
  const part1_8 = makeid(8);
  const part2_4 = makeid(4);
  const part3_4 = makeid(4);
  const part4_4 = makeid(4);
  const part5_10 = makeid(10);

  let guid = `${part1_8}-${part2_4}-${part3_4}-${part4_4}-${part5_10}`;
  console.log(`Guid is ${guid}`);
  return guid.toLowerCase();
}

/**
 * Check the response data (not undefined or null) and redirect user to EMS pay page
 *
 * @param {Object} responseData JSON data sent back by EMS Pay
 */
function processResponse(responseData) {
  if (responseData == undefined || responseData === null) {
    console.error("data is absent");
  }

  console.log(`Redirection to ${responseData.order_url}`);
  document.location.href = responseData.order_url;
}
/**
 * Build the ajax data and request, send it and listen for the response.
 *
 * @param {Object} requestData The object containing the data to send.
 */
function processRequest(requestData) {
  let customHeaders = new Headers();
  customHeaders.append("Content-Type", "application/json");
  customHeaders.append(
    "Authorization",
    "Basic NWExNzhmZGUyNDUwNGE5MDk3YTY1NTJhZGExMWEwY2Y6"
  );
  var params = {
    method: "POST",
    headers: customHeaders,
    body: JSON.stringify(requestData),
    redirect: "follow",
  };
  const request = new Request(emsApiUrl, params);
  fetch(request, params)
    .then((response) => {
      console.log("Fetch response", response);
      if (response.redirected) {
        alert("what is the redirection?");
        window.location = response.url;
      }
      if (response.ok) {
        const jsonData = response.json();
        console.log(jsonData);
        return jsonData;
      }
      console.log("Fetch failed response", response);
    })
    .then((data) => {
      console.log(data);
      processResponse(data);
    })
    .catch((err) => {
      alert("Check console");
      console.error("Error", err);
    });
}

/**
 * Listener on click of the pay button
 */
payBtn.addEventListener("click", function (event) {
  var data = {
    currency: currency.value,
    amount: amount.value * 100,
    description: "Example description",
    merchant_order_id: getGuid(),
    return_url: baseAppUrl,
    customer: {
      locale: language.value,
    },
  };
  if (consoleOnly.checked) {
    console.log("Data is", data);
    return;
  }

  console.log("Send request!", data);
  processRequest(data);
});

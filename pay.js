const selfUrl = document.location.href;
console.log(selfUrl);

const url = "https://api.online.emspay.eu/v1/orders/";
const amount = document.querySelector("#amount");
const currency = document.querySelector("#currency");
const merchandOrderId = document.querySelector("#merchandOrderId");
const language = document.querySelector("#language");
const consoleOnly = document.querySelector("#consoleOnly");
let payBtn = document.querySelector(".pay");

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
//Source: https://gist.github.com/gordonbrander/2230317
function getGuid() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  const part1_8 = makeid(8);
  const part2_4 = makeid(4);
  const part3_4 = makeid(4);
  const part4_4 = makeid(4);
  const part5_10 = makeid(10);

  let guid = `${part1_8}-${part2_4}-${part3_4}-${part4_4}-${part5_10}`;
  console.log(`Guid is ${guid}`);
  return guid.toLowerCase();
}

function processResponse(responseData) {
  if (responseData == undefined || responseData === null) {
    console.error("data is absent");
  }

  console.log(`Redirection to ${responseData.order_url}`);
  document.location.href = responseData.order_url;
}
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
  const request = new Request(url, params);
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

payBtn.addEventListener("click", function (event) {
  var data = {
    currency: currency.value,
    amount: amount.value * 100,
    description: "Example description",
    merchant_order_id: getGuid(),
    return_url: selfUrl,
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

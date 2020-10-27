const url = "https://api.online.emspay.eu/v1/orders/";
const amount = document.querySelector("#amount");
const currency = document.querySelector("#currency");
const merchandOrderId = document.querySelector("#merchandOrderId");
const language = document.querySelector("#language");

let payBtn = document.querySelector(".pay");

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
    merchant_order_id: "fcdba424-a5a1-47c1-8c23-211a29e20d0b",
    return_url: "https://www.example.com/",
    customer: {
      locale: language.value,
    },
  };
  processRequest(data);
});

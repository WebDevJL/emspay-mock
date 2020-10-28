const baseAppUrl = `${document.location.protocol}//${document.location.host}`;
console.log(baseAppUrl);

const emsApiUrl = "https://api.online.emspay.eu/v1/orders/";

/**
 * Read the order data from query string.
 * @returns {Object} the order containing the order id and project id
 */
function getOrder() {
  let queryStrValues = document.location.href
    .substring(
      document.location.href.indexOf("?") + 1,
      document.location.href.length
    )
    .split("&");

  let order = {};
  queryStrValues.forEach((parameter) => {
    var paramterArray = parameter.split("=");
    Object.defineProperty(order, paramterArray[0], {
      value: paramterArray[1],
    });
  });

  return order;
}

/**
 * Fill the HTML element with the data
 * @param {Object} data JSON data returned by API
 */
function fillHtml(data) {}
/**
 * Build the ajax data and request, send it and listen for the response.
 *
 * @param {Object} requestData The object containing the data to send.
 */
function getDataFromApi(requestData) {
  const order = getOrder();
  const getUrl = `${emsApiUrl}${order.order_id}`;
  let customHeaders = new Headers();
  customHeaders.append(
    "Authorization",
    "Basic NWExNzhmZGUyNDUwNGE5MDk3YTY1NTJhZGExMWEwY2Y6"
  );
  var params = {
    method: "GET",
    headers: customHeaders,
  };
  const request = new Request(getUrl, params);
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
      let paymentDataElem = document.querySelector(".payment-data");
      paymentDataElem.innerHTML = JSON.stringify(data);
    })
    .catch((err) => {
      alert("Check console");
      console.error("Error", err);
    });
}

window.onload = function () {
  getDataFromApi();
};

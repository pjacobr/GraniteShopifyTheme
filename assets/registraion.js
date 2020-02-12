const FirstName = document.getElementById("create_customer-FirstName")
  .innerText;
const LastName = document.getElementById("create_customer-LastName").innerText;
const CompanyName = document.getElementById("create_customer-CompanyName")
  .innerText;
const street = document.getElementById("create_customer-street").innerText;
const state = document.getElementById("create_customer-state").innerText;
const zip = document.getElementById("create_customer-zip").innerText;
const phone = document.getElementById("create_customer-phone").innerText;
const email = document.getElementById("create_customer-email").innerText;
const password = document.getElementById("create_customer-password").innerText;

const xhrBody = {
  FirstName,
  LastName,
  CompanyName,
  street,
  state,
  zip,
  phone,
  email,
  password
};

var xhr = new XMLHttpRequest();
xhr.open("POST", "/register_customer", true);

//Send the proper header information along with the request
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

xhr.onreadystatechange = function() {
  // Call a function when the state changes.
  if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
    console.log("request is pending now");
    alert(
      "Thanks for your registration. Your register request is pending now and We are currently review your subscription"
    );

    location.href = "/";
  } else {
    console.log("some kind of error is occured");
  }
};
xhr.send(xhrBody);
// xhr.send(new Int8Array());
// xhr.send(document);

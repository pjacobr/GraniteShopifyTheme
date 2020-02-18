function phoneMask() {
  var num = $(this)
    .val()
    .replace(/\D/g, "");
  $(this).val(
    num.substring(0, 1) +
      "(" +
      num.substring(1, 4) +
      ")" +
      num.substring(4, 7) +
      "-" +
      num.substring(7, 11)
  );
}

function validateCityOrPostalCode(value) {
  return /^([0-9]{5}|[a-zA-Z][a-zA-Z ]{0,49})$/.test(value);
}

function checkRequiredFields(customer_data) {
  return Object.keys(customer_data).reduce((str, key, index) => {
    const value = customer_data[key];
    console.log("key", key, "value", value);
    if (key === "zip") {
      if (!validateCityOrPostalCode(value)) {
        $("span.required")
          .eq(index)
          .show();
      }
    } else {
      if (value == "") {
        $("span.required")
          .eq(index)
          .show();
      }
    }
  }, "");
}

function validateCustomerRegistration() {
  const info = "Validating...";

  const key_ary = [
    "first_name",
    "last_name",
    "company_name",
    "street",
    "state",
    "city",
    "zip",
    "phone",
    "email",
    "password"
  ];

  const customer_data = {};

  key_ary.forEach(key => {
    const dom_id = `#create_customer-${key}`;
    customer_data[key] = $(dom_id).val();
  });

  const err = checkRequiredFields(customer_data);
  if (err) {
    $("#customer-error-info").html(`Invalid fields (${err})`);
  } else {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;

    customer_data["town_flag"] = true;
    customer_data["created_at"] = dateTime;

    $("#customer-registration-info").html(info);

    requestCustomerRegistration(customer_data);
  }
}

function clearInfo() {
  $("#customer-error-info").html("");
  $("#customer-registration-info").html("");
}

function requestCustomerRegistration(customer_data) {
  const info = `Thank you. Your request is now under review. 
                  we will redirect you to Home page after a while...`;
  const {
    first_name,
    last_name,
    company_name,
    street,
    state,
    city,
    zip,
    phone,
    email,
    password,
    town_flag,
    created_at
  } = customer_data;

  var mutation = `mutation { 
    setCustomer(
      first_name: "${first_name}", 
      last_name: "${last_name}", 
      company_name: "${company_name}",
      street: "${street}",
      state: "${state}",
      city: "${city}",
      zip: "${zip}",
      phone: "${phone}",
      email: "${email}",
      password: "${password}",
      town_flag: ${town_flag},
      created_at: "${created_at}"
    ) {
      id
    }
  }`;

  fetch("https://mygranite.app:443/graphql-mdb", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      query: mutation
      // variables: customer_data
    })
  })
    .then(r => r.json())
    .then(data => {
      $("#customer-registration-info").html(info);
      send_notification_mail({ first_name, last_name });

      window.setTimeout(function() {
        location.href = "https://georgiagranitegroup.com/";
      }, 1000);
    });
}

$("#create_customer-phone").keyup(phoneMask);

$("input").change(function() {
  $(this)
    .next(".required")
    .hide();

  clearInfo();
});

console.log("loading customer registration validation function");

function validateCustomerRegistration() {
  console.log("capture form data");
  var key_ary = [
    "first_name",
    "last_name",
    "company_name",
    "street",
    "state",
    "zip",
    "phone",
    "email",
    "password"
  ];

  var customer_ary = {};

  key_ary.forEach(key => {
    const key_ex = `#create_customer-${key}`;
    customer_ary[key] = $(key_ex).val();
  });

  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;

  customer_ary["town_flag"] = true;
  customer_ary["created_at"] = dateTime;

  $("#customer-registration-info").html("Validating....");
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
  } = customer_ary;

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

  console.log("mutation", mutation);
  fetch("https://mygranite.app:443/graphql-mdb", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      query: mutation
      // variables: customer_ary
    })
  })
    .then(r => r.json())
    .then(data => {
      console.log("data returned:", data);
      $("#customer-registration-info").html(
        "Thank you. Your request is now under review. we will redirect you to Home page after a while..."
      );
      send_notification_mail({ first_name, last_name });

      window.setTimeout(function() {
        location.href = "https://georgiagranitegroup.com/";
      }, 1000);
      // $.ajax({
      //   method: "POST",
      //   url: "https://mygranite.app/send-mail"
      // }).done(function(msg) {
      //   console.log("Customer account create request has sent");
      // });
    });
}

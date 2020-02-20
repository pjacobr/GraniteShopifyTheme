const gqlShopifyStoreFrontUrl =
  "https://cors-anywhere.herokuapp.com/https://georgiagranitegroup.myshopify.com/admin/api/2020-01/graphql.json";

const GET_CUSTOMER = (email, phone) => `
  query	{
    customers(first: 2, query: "phone:${phone} OR email:${email}") {
      edges {
        node {
          id
          firstName
          email
          phone
        }
      }
    }
  }
  `;

const gqlShopifyStoreFrontOpts = body => {
  let username = "c61e8eeb63289c54152c47567f06dfe7";
  let password = "b0ced664c925a40eebd5b7ae9e96346b";
  // let base64 = require("base-64");
  let headers = {
    "Content-Type": "application/json",
    Origin: "mygranite.app"
  };

  headers.Authorization = "Basic " + btoa(username + ":" + password);

  return {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      query: body
    })
  };
};

const getCustomer = customer_data => {
  const { email, phone } = customer_data;
  const updatedPhone = convertPhoneNumber(phone);

  return fetch(
    gqlShopifyStoreFrontUrl,
    gqlShopifyStoreFrontOpts(GET_CUSTOMER(email, updatedPhone))
  );
};

const convertPhoneNumber = phone => {
  return phone.split("").reduce((total, ch) => {
    if (["(", ")", "-"].find(e => ch == e) === undefined) {
      return total + ch;
    } else {
      return total;
    }
  }, "");
};

function phoneMask() {
  var num = $(this)
    .val()
    .replace(/\D/g, "");
  $(this).val(
    "(" +
      num.substring(0, 3) +
      ")" +
      num.substring(3, 6) +
      "-" +
      num.substring(6, 10)
  );
}

function validateCityOrPostalCode(value) {
  return /^([0-9]{5}|[a-zA-Z][a-zA-Z ]{0,49})$/.test(value);
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

// function checkDuplicateInfo(customer_data) {}

function checkRequiredFields(customer_data) {
  return Object.keys(customer_data).reduce((eror_str, key, index) => {
    var flag = false;
    const value = customer_data[key];
    // console.log("key", key, "value", value);
    if (key === "zip") {
      if (!validateCityOrPostalCode(value)) {
        $("span.required")
          .eq(index)
          .show();

        flag = true;
      }
    } else if (key === "password") {
      if (value.length < 5) {
        $("span.required")
          .eq(index)
          .show();
        flag = true;
      }
    } else if (key === "email") {
      if (!validateEmail(value)) {
        $("span.required")
          .eq(index)
          .show();
        flag = true;
      }
    } else if (key === "phone") {
      if (value == "" || value == "+1") {
        $("span.required")
          .eq(index)
          .show();
        flag = true;
      }
    } else {
      console.log("other field", key, value);
      if (value == "") {
        $("span.required")
          .eq(index)
          .show();

        flag = true;
      }
    }

    return flag ? eror_str + " " + key : eror_str;
  }, "");
}

function validateCustomerRegistration() {
  clearInfo();
  const info = " We are validating...";
  $("#customer-registration-info").html(info);
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
    if (key === "phone") {
      customer_data[key] = "+1" + $(dom_id).val();
    } else {
      customer_data[key] = $(dom_id).val();
    }
  });

  // primary validation
  const err = checkRequiredFields(customer_data);

  console.log("error", err);

  if (err != "") {
    $("#customer-error-info").html(`Invalid fields (${err})`);
  } else {
    // Dupllicate validation
    getCustomer(customer_data)
      .then(res => res.json())

      .then(res => {
        const { customers } = res.data;
        const duplicate_flag = customers.edges.length;
        console.log("duplicate_flag", duplicate_flag);
        if (duplicate_flag) {
          var duplicate_err_msg = "";
          if (duplicate_flag == 1) {
            duplicate_err_msg = "email or phone is duplicated";
          } else {
            duplicate_err_msg = "email and phone are duplicated";
          }
          $("#customer-error-info").html(duplicate_err_msg);
        } else {
          var today = new Date();
          var date =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate();
          var time =
            today.getHours() +
            ":" +
            today.getMinutes() +
            ":" +
            today.getSeconds();
          var dateTime = date + " " + time;

          customer_data["town_flag"] = true;
          customer_data["created_at"] = dateTime;

          requestCustomerRegistration(customer_data);
        }
      })
      .catch(err => {
        console.log(
          "there is an error in fetching customer from shopify store",
          err
        );
        $("#customer-error-info").html(
          "There is an error in admin graphql api"
        );
        return true;
      });
  }
}

function clearInfo() {
  $("#customer-error-info").text("");
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

      // window.setTimeout(function() {
      //   location.href = "https://georgiagranitegroup.com/";
      // }, 1000);
    });
}

$("#create_customer-phone").keyup(phoneMask);

$("input").change(function() {
  $(this)
    .next(".required")
    .hide();

  clearInfo();
});

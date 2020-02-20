$(document).ready(function() {
  const GET_COLOR_PRICE_SET = `
    query {
    colorPriceSets{
        silver_cloud_regular
        silver_cloud_intown
        jet_black_regular
        jet_black_intown
    }
    }
    `;

  const colors = ["Jet Black", "Silver Cloud"];
  const color_keys = ["jet_black", "silver_cloud"];

  const lastUrl = getLastSegment();
  switch (lastUrl) {
    case "all":
      init();
      break;
    case "cart":
      initCart();
      break;
  }

  $(".product_color").change(function() {
    const selected_color = $(this).val();
    const index = colors.indexOf(selected_color);

    const tr = $(this)
      .parent()
      .parent();

    const td_result = tr.find(".selected_product");
    const td_prices = tr.find(".product_price span");
    const td_product_ids = tr
      .find(".product_ids")
      .text()
      .split(",");

    console.log("td_product_ids", td_product_ids);

    console.log(selected_color, index);

    changePrice(selected_color, td_prices);
    changeProductId(index, td_product_ids, td_result);
  });

  $(".cart__qty-input").change(function() {
    initCart();
  });

  function getLastSegment() {
    var pageURL = window.location.href;
    var lastURLSegment = pageURL.substr(pageURL.lastIndexOf("/") + 1);
    return lastURLSegment;
  }
  function changePrice(color, td_prices) {
    td_prices.each((i, e) => {
      $(e).hide();

      if ($(e).attr("color") == color) {
        $(e).show();
      }
    });
  }

  function applyDiscount(td_prices) {
    td_prices.each((i, e) => {
      const original_price = convertMoney($(e).text(), false);
      const color_index = colors.indexOf($(e).attr("color"));
      const discount = localStorage.getItem(color_keys[color_index]);
      console.log(
        "get cookie discounts",
        discount,
        original_price,
        $(e).text()
      );
      const discount_price = original_price * discount;
      console.log("discount_price", discount_price, original_price, discount);
      $(e).text(convertMoney(discount_price, true));
    });
  }

  function changeProductId(index, td_product_ids, td_result) {
    td_result.val(td_product_ids[index]);
  }

  function convertMoney(money, flag) {
    if (flag) {
      const formattedMoney = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(money);
      return formattedMoney;
    } else {
      var nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
      var digits = money.split("").map(e => {
        return nums.includes(e) ? e : "";
      });
      var amount = parseFloat(digits.join(""));
      return amount;
    }
  }

  async function getDiscounts() {
    // const discounts = await getColorPriceSet();
    const discounts = {
      silver_cloud_regular: 1,
      silver_cloud_intown: 0.8,
      jet_black_regular: 1,
      jet_black_intown: 0.9
    };
    const town_flag = $(".customer_tag").text();

    const color_discounts = Object.keys(discounts).reduce((res, key) => {
      console.log(key, town_flag);
      if (key.includes(town_flag)) {
        const color_name = color_keys.find(color =>
          key.includes(color.toLocaleLowerCase())
        );
        console.log("color_name", color_name);
        if (color_name) {
          res[color_name] = discounts[key];
        }
      }

      return res;
    }, {});
    console.log("color_discounts", color_discounts);
    return color_discounts;
  }

  async function Fetch_GraphQL(fields) {
    const response = await fetch(gqlServerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: fields
    });
    const responseJson = await response.json();
    return responseJson;
  }

  async function getColorPriceSet() {
    const fields = JSON.stringify({
      query: GET_COLOR_PRICE_SET
    });
    const response = await Fetch_GraphQL(fields);
    console.log("get colorpriceset", response);
    return response.data.colorPriceSets[0];
  }

  async function initAll() {
    const temp = await getDiscounts();

    Object.keys(temp).forEach(key => {
      localStorage.setItem(key, temp[key]);
    });

    const trs = $(".product_color")
      .parent()
      .parent();

    trs.each((i, e) => {
      const selected_color = $(e)
        .find(".product_color")
        .val();
      const index = colors.indexOf(selected_color);
      const td_result = $(e).find(".selected_product");
      const td_prices = $(e).find(".product_price span");
      const td_product_ids = $(e)
        .find(".product_ids")
        .text()
        .split(",");

      if (
        $(e)
          .find(".product_tag")
          .text() == "discount"
      ) {
        applyDiscount(td_prices);
      }
      const init_color = "Jet Black";

      changePrice(selected_color, td_prices);
      changeProductId(index, td_product_ids, td_result);

      $(".product_color").val(init_color);
    });
  }

  async function initCart() {
    const temp = await getDiscounts();

    Object.keys(temp).forEach(key => {
      localStorage.setItem(key, temp[key]);
    });

    const trs = $(".product_color")
      .parent()
      .parent();

    trs.each((i, e) => {
      const selected_color = $(e)
        .find(".product_color")
        .text();

      const td_prices = $(e).find(".product_price");
      const td_total_prices = $(e).find(".data-cart-item-regular-price");

      if (
        $(e)
          .find(".product_tag")
          .text() == "discount"
      ) {
        applyDiscount(td_prices);
      }
      const init_color = "Jet Black";

      changePrice(selected_color, td_prices);
      changePrice(selected_color, td_total_prices);
    });
  }
});

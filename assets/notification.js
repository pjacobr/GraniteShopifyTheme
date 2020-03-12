function send_notification_mail({ first_name, last_name }) {
  emailjs.init("user_oojeeupPy9z7d45g2AGiI");
  emailjs.send("gmail", "customer_account_create_notification", {
    lastName: last_name,
    firstName: first_name
  });
}

function send_notification_mail({ first_name, last_name }) {
  emailjs.init("user_z8GCgnkMbskRmS0E8duCA");
  emailjs.send("gmail", "customer_account_create_notification", {
    lastName: last_name,
    firstName: first_name
  });
}

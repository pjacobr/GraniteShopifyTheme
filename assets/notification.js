function send_notification_mail({ first_name, last_name }) {
  emailjs.init("user_Cb4HVKUDkk3CHjNvTKrAf");
  emailjs.send("gmail", "customer_account_create_notification", {
    lastName: last_name,
    firstName: first_name
  });
}

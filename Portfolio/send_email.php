<?php
echo('one');
$email_to = "jastan313@gmail.com";
$email_subject = "Portfolio Contact";
$full_name = $_POST['full_name'];
$email_from = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];

function clean_string($string) {
  $bad = array("content-type","bcc:","to:","cc:","href");
  return str_replace($bad,"",$string);
}    

$email_message = "Form details below.\n\n"; 
$email_message .= "Name: ".clean_string($full_name)."\n";
$email_message .= "Email: ".clean_string($email_from)."\n";
$email_message .= "Subject: ".clean_string($subject)."\n";
$email_message .= "Message: ".clean_string($message)."\n";

// create email headers
$headers = 'From: '.$email_from."\r\n".
'Reply-To: '.$email_from."\r\n" .
'X-Mailer: PHP/' . phpversion();

mail($email_to, $email_subject, $email_message, $headers);
?>
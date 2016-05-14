"use strict";
function fadeIn() {
    document.getElementsByClassName("container")[0].id = "fade_in";
    document.getElementById("main-menu").style.opacity = 1;
}

function jsShow(id) {
    document.getElementById(id).style.display = 'block';
}

function jsHide(id) {
    document.getElementById(id).style.display = 'none';
}


function producePrompt(message, promptLocation, color) {
    document.getElementById(promptLocation).innerHTML = message;
    document.getElementById(promptLocation).style.color = color;
}

var emailDisabled = false;
function disableEmail() {
    var full_name_el = document.getElementById('contact-name');
    var email_el = document.getElementById('contact-email');
    var subject_el = document.getElementById('contact-subject');
    var message_el = document.getElementById('contact-message');
    producePrompt('Feature currently unavailable. Sorry!', 'submit-message', 'red');
    jsShow('submit-message');
    full_name_el.readOnly = true;
    full_name_el.style.backgroundColor = "#B0B0B0";
    email_el.readOnly = true;
    email_el.style.backgroundColor = "#B0B0B0";
    subject_el.readOnly = true;
    subject_el.style.backgroundColor = "#B0B0B0";
    message_el.readOnly = true;
    message_el.style.backgroundColor = "#B0B0B0";
    document.getElementById('contact-submit').disabled = true;
    emailDisabled = true;
}

fadeIn();
var scroll_container = document.getElementById('scroll-container');
var background = document.getElementById('background');
var parallax = document.getElementById('parallax');
scroll_container.onscroll = function() {
    var yOffset = scroll_container.scrollTop;
    // Vertical Scrolling Parallax
    background.style.backgroundPosition = "0px " + (yOffset / -20) + "px";
    parallax.style.backgroundPosition = "0px " + (yOffset / -5) + "px";
    
    // Transformation Parallaxi
    var wavy_index = yOffset%1000;
    if (wavy_index < 200) {
        background.className = "parallax_none";
        parallax.className = "parallax_none";
    } else if (wavy_index < 400) {
        background.className = "bg_parallax_1";
        parallax.className = "forebg_parallax_1";
    } else if (wavy_index < 600) {
        background.className = "bg_parallax_2";
        parallax.className = "forebg_parallax_2";
    } else if (wavy_index < 800) {
        background.className = "bg_parallax_3";
        parallax.className = "forebg_parallax_3";
    } else {
        background.className = "bg_parallax_4";
        parallax.className = "forebg_parallax_4";
    }    
}

function validateName() {
    if(emailDisabled) return false;
    jsHide('submit-message');
    var name = document.getElementById('contact-name').value;

    if(name.length === 0) {
        producePrompt('Name is required.', 'name-error', 'red');
        return false;
    }

    if (!name.match(/^[A-Za-z]*\s[A-Za-z]+$/)) {
        producePrompt('Please enter your first and last name.', 'name-error', 'red');
        return false;
    }

    producePrompt('Valid', 'name-error', 'green');
    return true;
}

function validateEmail() {
    if(emailDisabled) return false;
    jsHide('submit-message');
    var email = document.getElementById('contact-email').value;

    if(email.length === 0) {
        producePrompt('Email is required.', 'email-error', 'red');
        return false;
    }

    if(!email.match(/^[A-Za-z\._\-0-9]+[@][A-Za-z]+[\.][a-z]{2,4}$/)) {
        producePrompt('Please enter a valid email.', 'email-error', 'red');
        return false;
    }

    producePrompt('Valid', 'email-error', 'green');
    return true;

}


function validateSubject() {
    if(emailDisabled) return false;
    jsHide('submit-message');
    var message = document.getElementById('contact-subject').value;
    var required = 10;
    var left = required - message.length;

    if (left > 0) {
        producePrompt(left + ' more characters required.', 'subject-error', 'red');
        return false;
    }

    producePrompt('Valid', 'subject-error', 'green');
    return true;

}

function validateMessage() {
    if(emailDisabled) return false;
    jsHide('submit-message');
    var message = document.getElementById('contact-message').value;
    var required = 30;
    var left = required - message.length;

    if (left > 0) {
        producePrompt(left + ' more characters required.', 'message-error', 'red');
        return false;
    }

    producePrompt('Valid', 'message-error', 'green');
    return true;

}

function validateForm() {
    if(emailDisabled) return false;
    jsHide('submit-message');
    if (!validateName() || !validateEmail() || !validateSubject() || !validateMessage()) {
        jsShow('submit-message');
        producePrompt('At least one field is invalid. Please fill out the rest of your information.', 'submit-message', 'red');
        return false;
    } else {
        var full_name_el = document.getElementById('contact-name');
        var email_el = document.getElementById('contact-email');
        var subject_el = document.getElementById('contact-subject');
        var message_el = document.getElementById('contact-message');
        var full_name = full_name_el.value;
        var email = email_el.value;
        var subject = subject_el.value;
        var message = message_el.value;
        var xhr = new XMLHttpRequest();
        var data = "full_name=" + full_name + "&email=" + email + "&subject=" + subject + "&message=" + message;
        xhr.open('POST', 'send_email.php', true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && xhr.status === 200) {
                producePrompt('Your email has been sent! Thank you ' + full_name + ' for contacting me. I will be in touch with you soon.', 'submit-message', 'green');
                jsShow('submit-message');
                full_name_el.readOnly = true;
                full_name_el.style.backgroundColor = "#B0B0B0";
                email_el.readOnly = true;
                email_el.style.backgroundColor = "#B0B0B0";
                subject_el.readOnly = true;
                subject_el.style.backgroundColor = "#B0B0B0";
                message_el.readOnly = true;
                message_el.style.backgroundColor = "#B0B0B0";
                document.getElementById('contact-submit').disabled = true;
            }
        };
        xhr.send(data);
        producePrompt('Attempting to send email... Please wait.', 'submit-message', '#D6A100');
        jsShow('submit-message');
        return false;
    }
}

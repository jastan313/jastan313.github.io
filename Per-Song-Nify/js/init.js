/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// Check if there is jQuery
if (typeof jQuery === 'undefined') {
    throw new Error('Bootstrap\'s JavaScript requires jQuery')
}


// Validation functions for user input
function validateName(name) {
    return name.match(/^[A-Za-z]*\s[A-Za-za]+$/);
}
function validateEmail(email) {
    return email.match(/^[A-Za-z\._\-0-9]+[@][A-Za-z]+[\.][a-z]{2,4}$/);
}
;
function validatePassword(password) {
    return password.length >= 6;
}

$(function () {
    // Navigation UI setup
    $('#signup-btn').click(function () {
        $('#login-container').hide();
        $('#signup-container').show();
    });
    $('#back-btn').click(function () {
        $('#login-container').show();
        $('#signup-container').hide();
    });

    // User login
    $('#login-form').submit(function () {

        // Hide previous errors
        $('#alert-login-email-invalid').hide();
        $('#alert-login-email-mismatch').hide();
        $('#alert-login-password-invalid').hide();
        $('#alert-login-password-mismatch').hide();

        var email = $('#login-email').val();
        var password = $('#login-password').val();

        // Validate user inputs and show error if not valid
        var err_flag = false;
        if (!validateEmail(email)) {
            $('#alert-login-email-invalid').show();
            err_flag = true;
        }
        if (!validatePassword(password)) {
            $('#alert-login-password-invalid').show();
            err_flag = true;
        }

        // If validation successful, attempt GET user account
        if (!err_flag) {
            console.log('Validation Login Success: Email: ' + email + ", Password: " + password);
            var user = {"email": email, "password": password};
            var data = JSON.stringify(user);
            $.ajax({
                type: 'GET',
                url: 'get_demo',
                data: data,
                success: function (request) {
                    console.log('GET Success Response: ' + request.result);
                    console.log('GET Email Not Exist Result: ' + request.email_red);
                    console.log('GET Password Incorrect Result: ' + request.password_red);
                    console.log('GET Success Result: ' + request.green);
                },
                error: function (request, status, error) {
                    console.log('GET Error Response: ' + request.responseText);
                    console.log('GET Status: ' + status);
                    console.log('GET Error: ' + error);
                },
                contentType: "application/json",
                dataType: 'json'
            });
        }
        return false;
    });
});


// Checks Facebook login status. Signs up user if logged in. Facebook login if otherwise.
function fbStatusChangeCallback(response) {
    // User is Facebook logged in
    if (response.status == 'connected') {

        // Hide previous errors
        $('#alert-signup-name-invalid').hide();
        $('#alert-signup-email-invalid').hide();
        $('#alert-signup-email-taken').hide();
        $('#alert-signup-password-invalid').hide();
        $('#alert-signup-connect-invalid').hide();

        var name = $('#signup-name').val();
        var email = $('#signup-email').val();
        var password = $('#signup-password').val();

        // Validate user inputs and show error if not valid
        var err_flag = false;
        if (!validateName(name)) {
            $('#alert-signup-name-invalid').show();
            err_flag = true;
        }
        if (!validateEmail(email)) {
            $('#alert-signup-email-invalid').show();
            err_flag = true;
        }
        if (!validatePassword(password)) {
            $('#alert-signup-password-invalid').show();
            err_flag = true;
        }

        // If validation successful, POST new user account.
        if (!err_flag) {
            console.log('Validation Signup Success: Name: ' + name + ', Email: ' + email + ", Password: " + password);
            var user = {"name": name, "email": email, "password": password};
            var data = JSON.stringify(user);
            $.ajax({
                type: 'POST',
                url: 'post_demo',
                data: data,
                success: function (request) {
                    console.log('POST Success Response: ' + request.result);
                    console.log('POST Email Taken Result: ' + request.email_red);
                    console.log('POST Success Result: ' + request.green);
                },
                error: function (request, status, error) {
                    console.log('POST Error Response: ' + request.responseText);
                    console.log('POST Status: ' + status);
                    console.log('POST Error: ' + error);
                },
                contentType: "application/json",
                dataType: 'json'
            });
        }
    } 
    // User is not Facebook logged in
    else {
        FB.login(function (response) {
            fbStatusChangeCallback(response);
        });
    }
}
;

// User signup
function signupSubmit() {
    FB.getLoginStatus(function (response) {
        fbStatusChangeCallback(response);
    });
    return false;
}
;
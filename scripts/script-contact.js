
const SEND = 0;
const COMMENT_EMPTY = 1;
const EMAIL_NOT_VALID = 2;

/**
 * Checks that if an email is entered, it is valid, and makes a comment required to send the form
 * data.
 * 
 * @returns 0 if the form is valid to be sent, 1 if a comment is empty, and 2 if an email is invalid.
 */
const validateInputs = () => {
    let email = document.getElementById("email-input").value;
    let comments = document.getElementById("comments-input").value;
    if (email.trim() == "") {
        if (comments.trim() == "") {
            alert("Please enter a comment to send")
            return COMMENT_EMPTY;
        } else {
            return SEND;
        }
    } else {
        if (validateEmail(email)) {
            if (comments.trim() == "") {
                alert("Please enter a comment to send");
                return COMMENT_EMPTY;
            } else {
                return SEND;
            }
        } else {
            alert("Please enter a valid email address");
            return EMAIL_NOT_VALID;
        }
    }
}

/**
 * Checks if an string is a valid email by using a regular expression.
 * 
 * @param {String} email A String containing an email 
 * @returns True if the email is valid, false otherwise.
 */
const validateEmail = email => {
    const emailRegularExpression =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegularExpression.test(String(email).toLowerCase());
}

/**
 * Check if the form is filled with the required data. If it is, send an email with the data in the 
 * form as the body, if not, send the focus to the incorrect form fields. The email is sent using
 * SMTPjs library located at www.SMTPjs.com
 */
const sendEmail = () => {
    let inputsValidation = validateInputs();

    if (inputsValidation === SEND) {
        let sendButton = document.getElementById("send-button");
        disableButton(true, sendButton);

        Email.send({
            SecureToken: "af5403e3-e0b4-47a6-a666-d8e511f5b547",
            To: 'hectorjoseorozco@gmail.com',
            From: "kiju6754@outlook.com",
            Subject: "Earthquakes website comments",
            Body: setEmailBody()
        }).then(message => {
            if (message == "OK") {
                disableButton(false, sendButton);
                alert("Your comments were sent. Thank you!");
            } else {
                alert("Comments were not sent. Please try again later");
            }
        });
    }
    else {
        inputsValidation === COMMENT_EMPTY ?
            document.getElementById("comments-input").focus() :
            document.getElementById("email-input").focus();
    }
};

const setEmailBody = () => {
    let name = document.getElementById("name-input").value;
    let email = document.getElementById("email-input").value;
    let comments = document.getElementById("comments-input").value;
    return `<b>Name:</b><br>${name}<br><br><b>Email:</b><br>${email}<br><br>` +
        `<b>Comments:</b><br>${comments}`
}

// When the page loads
document.getElementById("send-button").addEventListener("click", sendEmail);

// SmtpJS.com - v3.0.0 used to send an email//
var Email = {
    send: function (a) {
        return new Promise(function (n, e) {
            a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send";
            var t = JSON.stringify(a);
            Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) })
        })
    },
    ajaxPost: function (e, n, t) {
        var a = Email.createCORSRequest("POST", e);
        a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload =
            function () { var e = a.responseText; null != t && t(e) }, a.send(n)
    },
    createCORSRequest: function (e, n) {
        var t = new XMLHttpRequest;
        return "withCredentials" in t ?
            t.open(e, n, !0) :
            "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t
    }
};
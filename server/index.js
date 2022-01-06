/* eslint-env node */
const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();
class Mailer {
    constructor(name, surname, text, emailFrom, passwordFrom, emailTo) {
        this.emailFrom = emailFrom;
        this.passwordFrom = passwordFrom;
        this.emailTo = emailTo;
        this.text = text;
        this.username = name;
        this.surname = surname;
    }

    send() {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: this.emailFrom,
                pass: this.passwordFrom,
            },
        });

        const mailOptions = {
            from: this.emailFrom,
            to: this.emailTo,
            subject: `A message to you from ${this.emailFrom}`,
            text: `This email is sent from ${this.username} ${this.surname} 
				to you.\n Here is msg:\n${this.text}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error.toString());
                throw Error(error);
            } else {
                //logs
                console.log("Email sent" + info.response.toString());
            }
        });
    }
}

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

const emailFrom = process.env.EMAIL_FROM;
const passwordFrom = process.env.PASSWORD_FROM;
const emailTo = process.env.EMAIL_TO; //by default

const IPAddressesAndTimers = new Map();

let requiredInfo = {
    name: "",
    surname: "",
    text: "",
    emailTo: "",
};

const timer = 30000;
app.post("/send_info", (request, response) => {
    const pt = request.socket.remoteAddress || null;
    const ip = request.headers["x-forwarded-for"] || pt;
    console.log("<<<<<<<< ip address: " + ip); //this is an ip address of user
    if (!IPAddressesAndTimers.get(ip)) {
        //this user did not send any mail
        IPAddressesAndTimers.set(ip, 0);
    }

    //calculating permission and sending mail
    if (Date.now() - IPAddressesAndTimers.get(ip) > timer) {
        //timer
        requiredInfo = request.body;
        const mailer = new Mailer(
            requiredInfo.name,
            requiredInfo.surname,
            requiredInfo.text,
            emailFrom,
            passwordFrom,
            emailTo
        );
        console.log(requiredInfo);
        try {
            mailer.send();
        } catch {
            response.status(500).send({ permission: "no, sir!", sent: false });
        }
        IPAddressesAndTimers.set(ip, Date.now());
        response.status(200).send({ permission: "yes, sir!", sent: true });
    } else {
        response.status(429).send({ permission: "no, sir!", sent: false });
    }
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server started working ${PORT}`);
});

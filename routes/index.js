const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Aid-tech | Send Mail' });
});

router.post('/', (req, res) => {
    // Recuperation de donnees
    const messageHTML = `
    <p>Bonjour Monsieur, vous venez d'envoyer un message à <strong>${req.body.name}</strong> dont ses contacts sont : </p>
    <p>téléphone : <strong>${req.body.phone}</strong> et l'adresse électronique : <strong>${req.body.mail}</strong></p>
    <br><hr>
    Son message est ci-dessous
    <p>${req.body.message}<p>
  `;

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'adamibrahima65@gmail.com',
            pass: 'csavgulryjcpfgtn'
        }
    });

    let mailOptions = {
        from: '[Aid-Tech] <adamibrahima65@gmail.com>', // sender address
        to: `${req.body.mail}`, // list of receivers
        subject: req.body.subject, // Subject line
        html: messageHTML // html body
    };
    transporter.sendMail(mailOptions,  (err, info) => {
        if (err) {
            res.send({
                typeOfResponse: 'error',
                confirm: false,
                messageOfResponse: `L'envoi de mail a echoué, veuillez contacter Aid-Tech`
            });
            return console.log('error : ' + err);;
        }
        console.log('Mail sent successfully');
        res.send({
            typeOfResponse: 'success', 
            confirm: true,
            messageOfResponse: `L'envoi de mail reussi, nous vous recemercions pour votre message!`
        });
        return;
    });
});

module.exports = router;

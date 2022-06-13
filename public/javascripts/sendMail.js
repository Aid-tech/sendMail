import { Toast } from "./Toast/toast.js";
Toast.init();


document.querySelector('.send-form').addEventListener('submit', sendMail);

async function sendMail(e) {
    e.preventDefault();
    if (document.querySelector('.mail').value != '' && document.querySelector('.message').value != '') {
        formAction(document.querySelector('.send-form'), true);
        const check = await emailVeriify(document.querySelector('.mail').value);
        if(check.mx_found) {
            const mailSend = await fetch('/', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  method: "POST",
                  body: JSON.stringify({
                    'name': document.querySelector('.name').value || 'User Name',
                    'mail': document.querySelector('.mail').value,
                    'phone': document.querySelector('.phone').value || '227 98 64 67 00',
                    'subject': document.querySelector('.subject').value || 'Send mail using nodeJs with nodemailer function',
                    'message': document.querySelector('.message').value
                  })
            });
            const response = await mailSend.json();

            if(response.confirm != undefined){
                Toast.show(`${response.messageOfResponse}`, `${response.typeOfResponse}`, "top-right", 5);
            }
        } else {
            Toast.show(`Votre mail ${document.querySelector('.mail').value} est introuvable`, "error", "top-right", 5);
        }
        formAction(document.querySelector('.send-form'), false);
    } else {
        Toast.show('Veuillez saisir votre mail et votre message', "error", "top-right", 5);
    }
}



async function emailVeriify(mail) {
    let myHeaders = new Headers();
    myHeaders.append("apikey", "zSstWOCNrbNsVcmxnegk5HXz8NU4ueTB");

    let requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };

    const response = await fetch(`https://api.apilayer.com/email_verification/check?email=${mail}`, requestOptions);
    if (!response.ok) {
        throw Error(response.statusText);
    }
    const jsonFile = await response.json();
    return jsonFile;
}

function formAction(idObject, action) {
    let id = idObject.getAttribute('id');
    let f = document.forms[id].getElementsByTagName('input');
    for (let i = 0; i < f.length; i++){
        f[i].disabled = action;
    }  
    let f1 = document.forms[id].getElementsByTagName('textarea');
    for (let j = 0; j < f1.length; j++){
        f1[j].disabled = action;
    }

    if(!action){
        document.querySelector('.name').value = document.querySelector('.mail').value = document.querySelector('.phone').value = document.querySelector('.subject').value = document.querySelector('.message').value = ''
    }
}

document.querySelector('.mail').addEventListener('change', ()=> {
    const arrobase = document.querySelector('.mail').value.split('@');
    if(arrobase.length <= 1 || arrobase.length > 2 || (arrobase.length == 2 && arrobase[0].length <= 3)){
        Toast.show('Veuillez saisir une addresse mail correct', "error", "top-right", 5);
        document.querySelector('.mail').value = '';
    } else {
        const domaine = arrobase[1].split('.');
        if(domaine.length <= 1 || domaine.length > 2 || (domaine.length >= 2 && (domaine[0].length < 3 || domaine[1].length < 2))){
            Toast.show('Veuillez saisir un nom de domaine correct', "error", "top-right", 5);
            document.querySelector('.mail').value = '';
        }
    }
});
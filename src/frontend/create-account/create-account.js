const pswInput = document.querySelector('#password');
const pswStrengthBar = document.querySelector('#password-strength-bar')
const cfPswInput = document.querySelector('#cf-password')
const pswMatchSymbol = document.querySelector('#password-match')
import { passwordScoring } from '../pswcheck.js'

pswInput.addEventListener(
    'input',
    () => {
        /*
            password strength:
            - at least 8 characters
            - contains number(s)
            - contains special character(s)
            - contains uppercase letter(s)
            - contains lowercase letter(s)

            the password earns 1 score for each constraint met:
            - score = 0 1 2     weak
            - score = 3 4       average
            - score = 5         strong
        */
        
        let str = pswInput.value


        if (str.length === 0) {
            pswStrengthBar.style.visibility = 'hidden'
            return
        } else pswStrengthBar.style.visibility = 'visible'
        // remove password matched notation
        checkPswMatch()

        // check password strength
        let score = passwordScoring(str)
        if (score <= 2) { // weak password
            pswStrengthBar.style.width = 'var(--password-strength-weak-width)'
            pswStrengthBar.style.backgroundColor = 'var(--password-strength-weak-color)'
        } else if (score <= 4) { // average password
            pswStrengthBar.style.width = 'var(--password-strength-average-width)'
            pswStrengthBar.style.backgroundColor = 'var(--password-strength-average-color)'
        } else { // strong password
            pswStrengthBar.style.width = 'var(--password-strength-strong-width)'
            pswStrengthBar.style.backgroundColor = 'var(--password-strength-strong-color)'
        }
    }
)

function checkPswMatch() {
    if (cfPswInput.value !== pswInput.value) pswMatchSymbol.style.visibility = 'hidden'
    else pswMatchSymbol.style.visibility = 'visible'
}

cfPswInput.addEventListener(
    'input',
    () => checkPswMatch()
)

document.querySelector('#show-password').addEventListener('change', (e) => {
    console.log(pswInput.type)
    if (pswInput && cfPswInput && pswInput.type == "password") {
        pswInput.type = cfPswInput.type = "text"
    } else {
        pswInput.type = cfPswInput.type = "password"
    }
})
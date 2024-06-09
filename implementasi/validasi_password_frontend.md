# VALIDASI PASWORD FRONTEND 
### DENGAN VALIDASI KARAKTER KHUSUS DAN PASSWORD STRENGTH

LINK CDN zxcvbn
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js"></script>
```

```js
$('#password').on('input', function() {
    validatePassword();
});

function validatePassword() {
    var passwordInput = $('#password');
    var passwordError = $('#passwordError');
    var passwordStrength = $('#passwordStrength');
    var passwordValue = passwordInput.val();

    // Reset error messages
    passwordError.html('');
    passwordStrength.html('');

    var result = zxcvbn(passwordValue);
    var score = result.score; // Nilai skor antara 0 (lemah) dan 4 (kuat)

    if (passwordValue) {
        switch (score) {
            case 0:
                passwordStrength.html('Password sangat lemah')
                    .removeClass().addClass('text-danger');
                break;
            case 1:
                passwordStrength.html('Password lemah')
                    .removeClass().addClass('text-danger');
                break;
            case 2:
                passwordStrength.html('Password cukup kuat')
                    .removeClass().addClass('text-info');
                break;
            case 3:
                passwordStrength.html('Password kuat')
                    .removeClass().addClass('text-success');
                break;
            case 4:
                passwordStrength.html('Password sangat kuat')
                    .removeClass().addClass('text-success');
                break;
        }
    }

    // Check minimum length
    if (passwordValue.length < 8) {
        passwordError.html('Password harus minimal 8 karakter');
        return false;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(passwordValue)) {
        passwordError.html('Password harus mengandung setidaknya 1 huruf besar');
        return false;
    }

    // Check for alphanumeric (at least one letter and one number)
    if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(passwordValue)) {
        passwordError.html('Password harus mengandung huruf dan angka');
        return false;
    }

    // Check for at least one symbol
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)) {
        passwordError.html('Password harus mengandung setidaknya 1 simbol');
        return false;
    }

    return true;
}
```


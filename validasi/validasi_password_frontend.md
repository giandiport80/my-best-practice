# VALIDASI PASWORD FRONTEND 
### DENGAN VALIDASI KARAKTER KHUSUS DAN PASSWORD STRENGTH

LINK CDN zxcvbn
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.2/zxcvbn.js"></script>
```

pada form html

```html
<div class="form-group">
    <label for="password">Password</label>
    <small id="passwordStrength" class="text-success"></small>
    <div class="input-group mb-3">
        <input type="password" name="password" id="password" class="form-control" required>
        <div class="input-group-append">
            <button class="btn btn-info btn-password" type="button">
                <i class="fa-sharp fa-solid fa-eye"></i>
            </button>
        </div>
    </div>
    <small id="passwordError" class="text-danger"></small>
</div>
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

$("#form").on("submit", function(e) {
    e.preventDefault();

    if (!validatePassword()) {
        Swal.fire({
            title: 'Error',
            text: 'Password belum memenuhi syarat',
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ya',
            timer: 3000,
        });
        return;
    }
});
```


# Implementasi Validasi Frontend

Harus implementasi
- Jquery
- Bootstrap 4
- select2

Script Custom validation `custom-validation.js`

```js title="custom-validation.js"
function validation(element, pesan) {
  $(element).next().remove();
  $(element)
    .after(
      /* html */ `
		<div class="error mt-1" style="font-weight:normal;color:red;font-size:12px;">
			<em>${pesan}</em>
		</div>`
    )
    .closest('.form-control, .custom-select')
    .removeClass('has-success')
    .addClass('has-error is-invalid');
}

function validationSelect(element, pesan) {
  $(element).next('span').next().remove();
  $(element).next('span').after(/* html */ `
		<div class="error mt-1" style="font-weight:normal;color:red;font-size:12px;">
			<em>${pesan}</em>
		</div>`);
  $(element).addClass('has-error is-invalid');
}

function validationServer(element, error_string, data) {
  if (data.error_string[error_string])
    validation(element, data.error_string[error_string]);
}

function validationServerSelect(element, error_string, data) {
  if (data.error_string[error_string])
    validationSelect(element, data.error_string[error_string]);
}

function validationRemove(element) {
  $(element).next().remove();
  $(element)
    .closest('.form-control, .custom-select')
    .removeClass('has-error is-invalid');
}

function validationSelectRemove(element) {
  $(element).next('span').next().remove();
  $(element).removeClass('has-error is-invalid');
}

function resetValidation() {
  $('.validate').keyup(function () {
    if ($(this).val() !== '') {
      validationRemove(this);
    }
  });

  $('.validate').change(function () {
    if ($(this).val() !== '') {
      validationRemove(this);
    }
  });

  $('.validate-select').change(function () {
    if ($(this).val() !== '') {
      validationSelectRemove(this);
    }
  });

  $('.select2').change(function () {
    if ($(this).val() !== '') {
      validationSelectRemove(this);
    }
  });
}

function cekValidationRequired() {
  if ($('.validate').val() == '' || $('.validate-select').val() == '') {
    validation('.validate', 'Kolom ini harus diisi');
    validationSelect('.validate-select', 'Kolom ini harus diisi');

    return false;
  }

  return true;
}

/**
 *
 * @param {*} err
 * @param {*} callback
 * @param {*} callbackValidation
 * @param {*} callbackError
 */
function handleServerError(
  err,
  callback = () => {},
  callbackValidation = () => {},
  callbackError = () => {}
) {
  callback();

  if (err.responseJSON?.errors) {
    const data = err.responseJSON;
    for (var i = 0; i < data.error_class.length; i++) {
      validation('[name="' + data.error_class[i] + '"]', data.error_string[i]);
    }

    Swal.fire({
      title: 'Validasi',
      html: err.responseJSON?.message,
      type: 'info',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Ya',
      timer: 3000,
    });

    callbackValidation();
  } else {
    let title = 'Error';
    let type = 'error';

    if (err.status == 404 || err.status == 400) {
      type = 'info';
      title = 'Info';
    }

    Swal.fire({
      title: title,
      text: err.responseJSON?.message ?? 'Terjadi kesalahan',
      type: type,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Ya',
      timer: 3000,
    });

    callbackError();
  }
}
```

Pada halaman tambah data (contohnya di PHP) `tambah.php`

```php title="tambah.php"
<script>
  $(document).ready(function () {
    resetValidation();

    $("#formTambah").on("submit", function (e) {
      e.preventDefault();

      if (!cekValidationRequired()) {
        Swal.fire({
          title: 'Info',
          text: 'Periksa kembali inputan anda',
          type: 'info',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ya',
          timer: 3000,
        });
        return false;
      }

      const form = $(this)[0];

      Swal.fire({
        title: 'Konfirmasi',
        text: "Apakah Anda yakin dengan data yang disimpan?",
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ya',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Tidak',
      }).then((result) => {
        if (result.value) {
          showLoading();
          $.ajax({
            type: form.method,
            url: form.action,
            data: new FormData(form),
            processData: false,
            contentType: false,
            success: function (response) {
              hideLoading();
              Swal.fire({
                title: 'Berhasil!',
                text: response.message,
                type: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Ya',
                timer: 3000,
              }).then(() => {
                //
              });
            },
            error: function (err, text) {
              hideLoading();

              handleServerError(err);
            }
          });
        }
      });
    });
  });
</script>
```


/**
 * menampilkan string error message
 * @param {string} pesan
 * @returns
 */
function getErrorMessage(pesan) {
  return /* html */ `
    <div class="error mt-1" style="font-weight:normal;color:red;font-size:12px;">
      <em>${pesan}</em>
    </div>`;
}

// VALIDATION SET ================================================================================

/**
 * Menampilkan pesan error di bawah elemen input.
 * @param {HTMLElement} element - Elemen yang divalidasi.
 * @param {string} pesan - Pesan error yang akan ditampilkan.
 */
function validation(element, pesan) {
  $(element).next('.error').remove();
  $(element).after(getErrorMessage(pesan));
  $(element).addClass('is-invalid');
}

/**
 * Menampilkan pesan error untuk elemen select dan select2.
 * @param {HTMLElement} element - Elemen yang divalidasi.
 * @param {string} pesan - Pesan error yang akan ditampilkan.
 */
function validationSelect(element, pesan) {
  if ($(element).hasClass('select2-hidden-accessible')) {
    $(element).next('.select2-container').next('.error').remove();
    $(element).next('.select2-container').after(getErrorMessage(pesan));
  } else {
    $(element).next('.error').remove();
    $(element).after(getErrorMessage(pesan));
  }
  $(element).closest('.form-control').addClass('is-invalid');
}

/**
 * Menampilkan pesan error untuk elemen radio.
 * @param {HTMLElement} element - Elemen radio yang divalidasi.
 * @param {string} pesan - Pesan error yang akan ditampilkan.
 */
function validationRadio(element, pesan) {
  $(element).closest('.radio-group').find('.error').remove();
  $(element).closest('.radio-group').append(getErrorMessage(pesan));
  $(element).closest('.radio-group').addClass('is-invalid');
}

/**
 * Menampilkan pesan error untuk elemen input file.
 * @param {HTMLElement} element - Elemen input file yang divalidasi.
 * @param {string} pesan - Pesan error yang akan ditampilkan.
 */
function validationFile(element, pesan) {
  $(element).next('.error').remove();
  $(element).after(getErrorMessage(pesan));
  $(element).addClass('is-invalid');
}

/**
 * Menghapus pesan error dari elemen input.
 * @param {HTMLElement} element - Elemen yang divalidasi.
 */
function validationRemove(element) {
  $(element).next('.error').remove();
  $(element).removeClass('is-invalid');
}

/**
 * Menghapus pesan error dari elemen select dan select2.
 * @param {HTMLElement} element - Elemen yang divalidasi.
 */
function validationSelectRemove(element) {
  if ($(element).hasClass('select2-hidden-accessible')) {
    $(element).next('.select2-container').next('.error').remove();
  } else {
    $(element).next('.error').remove();
  }
  $(element).closest('.form-control').removeClass('is-invalid');
}

// VALIDATION REMOVE ================================================================================

/**
 * Menghapus pesan error dari elemen radio.
 * @param {HTMLElement} element - Elemen radio yang divalidasi.
 */
function validationRadioRemove(element) {
  $(element).closest('.radio-group').find('.error').remove();
  $(element).closest('.radio-group').removeClass('is-invalid');
}

/**
 * Menghapus pesan error dari elemen input file.
 * @param {HTMLElement} element - Elemen input file yang divalidasi.
 */
function validationFileRemove(element) {
  $(element).next('.error').remove();
  $(element).removeClass('is-invalid');
}

/**
 * Memeriksa apakah string adalah alamat email yang valid.
 * @param {string} email - Alamat email yang akan divalidasi.
 * @returns {boolean} - Mengembalikan true jika valid, false jika tidak.
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// VALIDATION ON CHANGE ================================================================================

/**
 * Melakukan validasi pada input teks saat terjadi perubahan.
 * @param {HTMLElement} element - Elemen input yang divalidasi.
 * @returns {boolean} - Mengembalikan true jika valid, false jika tidak.
 */
function validateOnInput(element) {
  const value = $(element).val();
  const required = $(element).data('required');
  const minLength = $(element).data('minlength');
  const maxLength = $(element).data('maxlength');
  const isNumber = $(element).data('isnumber');
  const minValue = $(element).data('minvalue');
  const maxValue = $(element).data('maxvalue');
  const isEmail = $(element).data('email');

  validationRemove(element);

  if (required && value.trim() === '') {
    validation(element, 'Kolom ini harus diisi');
    return false;
  }

  if (minLength && value.length < minLength) {
    validation(element, `Minimal ${minLength} karakter`);
    return false;
  }

  if (maxLength && value.length > maxLength) {
    validation(element, `Maksimal ${maxLength} karakter`);
    return false;
  }

  if (isNumber && isNaN(value)) {
    validation(element, 'Nilai harus berupa angka');
    return false;
  }

  if (minValue && parseFloat(value) < minValue) {
    validation(element, `Nilai harus lebih besar atau sama dengan ${minValue}`);
    return false;
  }

  if (maxValue && parseFloat(value) > maxValue) {
    validation(element, `Nilai harus lebih kecil atau sama dengan ${maxValue}`);
    return false;
  }

  if (isEmail && !validateEmail(value)) {
    validation(element, 'Format email tidak valid');
    return false;
  }

  return true;
}

/**
 * Melakukan validasi pada elemen select dan select2.
 * @param {HTMLElement} element - Elemen select yang divalidasi.
 * @returns {boolean} - Mengembalikan true jika valid, false jika tidak.
 */
function validateOnSelect(element) {
  const value = $(element).val();
  const required = $(element).data('required');

  validationSelectRemove(element);

  if (required && (value === null || value === '')) {
    validationSelect(element, 'Kolom ini harus diisi');
    return false;
  }

  return true;
}

/**
 * Melakukan validasi pada elemen radio.
 * @param {string} name - Nama grup radio yang divalidasi.
 * @returns {boolean} - Mengembalikan true jika valid, false jika tidak.
 */
function validateOnRadio(name) {
  const isChecked = $(`input[name="${name}"]:checked`).length > 0;
  const required = $(`input[name="${name}"]`).data('required');

  validationRadioRemove($(`input[name="${name}"]`));

  if (required && !isChecked) {
    validationRadio($(`input[name="${name}"]`), 'Kolom ini harus diisi');
    return false;
  }

  return true;
}

/**
 * Melakukan validasi pada elemen input file.
 * @param {HTMLElement} element - Elemen input file yang divalidasi.
 * @returns {boolean} - Mengembalikan true jika valid, false jika tidak.
 */
function validateOnFile(element) {
  const required = $(element).data('required');
  const allowedExtensions = $(element).data('extfile');
  const typeSize = $(element).data('typesize');
  const sizeLimit = parseFloat($(element).data('size'));

  validationRemove(element);

  const file = $(element)[0].files[0];

  if (required && !file) {
    validation(element, 'Kolom ini harus diisi');
    return false;
  }

  if (file) {
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();

    if (
      allowedExtensions &&
      !allowedExtensions.split(',').includes(fileExtension)
    ) {
      validation(element, `Ekstensi file harus ${allowedExtensions}`);
      return false;
    }

    const fileSizeInMB = file.size / (1024 * 1024); // Ukuran dalam MB
    const fileSizeInKB = file.size / 1024; // Ukuran dalam KB

    // Validasi ukuran file sesuai unit yang dipilih
    if (typeSize === 'mb' && fileSizeInMB > sizeLimit) {
      validation(element, `Ukuran file tidak boleh lebih dari ${sizeLimit} MB`);
      return false;
    }

    if (typeSize === 'kb' && fileSizeInKB > sizeLimit) {
      validation(element, `Ukuran file tidak boleh lebih dari ${sizeLimit} KB`);
      return false;
    }
  }

  return true;
}

/**
 * Menginisialisasi validasi input oninput untuk elemen dengan kelas 'validate'.
 * implementasi di script (bagian atas)
 */
function initValidationOnInput() {
  $('.validate').on('input', function () {
    validateOnInput(this);
  });

  $('.validate-select').on('change', function () {
    validateOnSelect(this);
  });

  $('.select2').on('change', function () {
    validateOnSelect(this);
  });

  $('.validate-radio').on('change', function () {
    validateOnRadio($(this).attr('name'));
  });

  $('.validate-file').on('change', function () {
    validateOnFile(this);
  });
}

/**
 * Memeriksa validitas form sebelum disubmit.
 * implementasi di script
 * @returns {boolean} - Mengembalikan true jika form valid, false jika tidak.
 */
function isValidForm() {
  let isValid = true;

  $('.validate').each(function () {
    if (!validateOnInput(this)) {
      isValid = false;
    }
  });

  $('.validate-select').each(function () {
    if (!validateOnSelect(this)) {
      isValid = false;
    }
  });

  $('.validate-radio').each(function () {
    if (!validateOnRadio($(this).attr('name'))) {
      isValid = false;
    }
  });

  $('.validate-file').each(function () {
    if ($(this).data('required') && !validateOnFile(this)) {
      isValid = false;
    }
  });

  return isValid;
}

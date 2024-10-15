# Dokumentasi Validasi Form

Dokumentasi ini menjelaskan cara menggunakan skrip validasi form yang telah dikembangkan menggunakan jQuery. Skrip ini menyediakan validasi untuk berbagai elemen form, termasuk input teks, textarea, select, radio, dan file.

## Fitur Validasi

- **Validasi Input Teks**: Memeriksa panjang, tipe, dan karakter khusus.
- **Validasi Elemen Select**: Memastikan pilihan dipilih dengan benar.
- **Validasi Radio**: Memastikan setidaknya satu pilihan dipilih.
- **Validasi Input File**: Memeriksa tipe dan ukuran file yang diunggah.

## Atribut `data-` untuk Validasi Form

Berikut adalah penjelasan tentang atribut data yang digunakan dalam validasi form:

- **`data-required`**: 
  Menandakan bahwa kolom tersebut harus diisi.
  
- **`data-alphabetic`**: 
  Memastikan bahwa kolom hanya berisi huruf (A-Z, a-z).
  
- **`data-specialchar`**: 
  Menentukan karakter khusus yang tidak diperbolehkan.
  
- **`data-minlength`**: 
  Menetapkan panjang minimum karakter.
  
- **`data-maxlength`**: 
  Menetapkan panjang maksimum karakter.
  
- **`data-email`**: 
  Memastikan format email yang valid.
  
- **`data-isnumber`**: 
  Memastikan bahwa input merupakan angka.
  
- **`data-minvalue`**: 
  Menentukan nilai minimum yang diperbolehkan.
  
- **`data-maxvalue`**: 
  Menentukan nilai maksimum yang diperbolehkan.
  
- **`data-extfile`**: 
  Menentukan jenis file yang diperbolehkan untuk input file (misal: `jpg,png,pdf`).
  
- **`data-size`**: 
  Menentukan ukuran maksimum file yang diperbolehkan (dalam MB).

## Penggunaan `vl_{name}`

`vl_{name}` adalah konvensi penamaan untuk fungsi validasi yang digunakan dalam skrip JavaScript untuk memvalidasi input berdasarkan atribut data yang telah ditentukan. fungsi ini bisa menggantikan seleksi dengan `name` agar tangkapan input dari server bisa lebih akurat.

## Cara Menggunakan

### 1. Menyiapkan HTML

Buat elemen form dalam HTML dengan atribut yang sesuai untuk validasi. Berikut adalah contoh struktur form:

```html
<form id="myForm">
  <div class="form-group">
    <label for="nama">Nama</label>
    <input type="text" name="name" class="form-control validate vl_name" data-required="true" data-alphabetic="true" />
    <div class="invalid-feedback"></div>
  </div>

  <div class="form-group">
    <label for="email">Email</label>
    <input type="text" name="email" class="form-control validate vl_email" data-required="true" data-email="true" />
    <div class="invalid-feedback"></div>
  </div>

  <div class="form-group">
    <label for="kategori">Kategori</label>
    <select name="kategori" class="form-control validate-select vl_kategori" data-required="true">
      <option value="">Pilih Kategori</option>
      <option value="1">Kategori 1</option>
      <option value="2">Kategori 2</option>
    </select>
    <div class="invalid-feedback"></div>
  </div>

  <div class="form-group radio-group">
    <label>Pilih Jenis Kelamin:</label><br>
    <input type="radio" name="gender" class="validate-radio vl_gender" data-required="true" value="Laki-laki"> Laki-laki<br>
    <input type="radio" name="gender" class="validate-radio vl_gender" data-required="true" value="Perempuan"> Perempuan<br>
    <div class="invalid-feedback"></div>
  </div>

  <div class="form-group">
    <label for="file">File</label>
    <input type="file" name="file" class="form-control validate-file vl_file" data-extfile="jpg,png,pdf" data-size="2" />
    <div class="invalid-feedback"></div>
  </div>

  <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

### 2. Menambahkan Script Javascript

Fungsi yang bisa digunakan untuk pengecekan form submit

- **`initValidationOnInput()`**: Inisialisasi Validasi.
- **`isValidForm()`**: cek apakah form nya valid, jika valid maka true, jika tidak valid maka false.


```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="path/to/your/validation-custom2.js"></script>
<script>
  $(document).ready(function () {
    // inisialisasi input
    initValidationOnInput();

    $('#myForm').on('submit', function (e) {
      e.preventDefault();

      if (!isValidForm()) {
        // alert('Form tidak valid. Mohon periksa input Anda.');
        return;
      }
    });
  });
</script>
```

### Handling Error


Fungsi yang bisa digunakan

- **`handleCodeIgniterError`**: Handle Error Codeigniter 3 dengan selecttion name
- **`handleLaravelError`**: Handle Error Laravel dengan selection class
- **`handleCodeIgniterErrorClass`**: Handle Error Codeigniter  dengan selecttion name
- **`handleLaravelErrorClass`**: Handle Error Laravel dengan selection class

```js
// contoh data dari error ajax
const data = jqXHR.responseJSON;

// Menangani error dari CodeIgniter
if (data.error_class && data.error_string) {
    handleCodeIgniterError(data);
}
// Menangani error dari Laravel
else if (data.errors) {
    handleLaravelError(data);
}

// Menangani error jika menggunakan class
else if (data.error_class && data.error_string) {
    handleCodeIgniterErrorClass(data);
}

// Menangani error jika menggunakan class pada Laravel
else if (data.errors) {
    handleLaravelErrorClass(data);
} else {
    // Pesan error umum
    alert('Terjadi kesalahan. Silakan coba lagi.');
}
```
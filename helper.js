/**
 * function untuk membuat format angka
 *
 * @param {number|string} number (angka)
 * @param {string} decimals (jumlah desimal)
 * @param {string} dec_point (simbol pemisah desimal)
 * @param {string} thousands_sep (simbol pemisah ribuan)
 * @returns {string}
 */
function numberFormat(
  number,
  decimals = 0,
  dec_point = ',',
  thousands_sep = '.'
) {
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
    dec = typeof dec_point === 'undefined' ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

// example:
// console.log(numberFormat('950000.78', 2));

/**
 * function untuk membuat format tanggal indonesia
 *
 * @param {string|number} date
 * @returns {string} date
 */
function formatTanggal(date) {
  return new Date(date).toLocaleString('id-ID', {
    // weekday: 'long', // long, short, narrow
    day: 'numeric', // numeric, 2-digit
    year: 'numeric', // numeric, 2-digit
    month: 'long', // numeric, 2-digit, long, short, narrow
    // hour: 'numeric', // numeric, 2-digit
    // minute: 'numeric', // numeric, 2-digit
    // second: 'numeric', // numeric, 2-digit
  });
}

// example:
// console.log(formatTanggal('2022-07-14'));

/**
 *
 * @param {number|string} number
 * @param {Object} settings
 * @returns {string}
 */
function angkaTerbilang(number = 0, settings = { decimal: '.' }) {
  const units = [
    '',
    'ribu',
    'juta',
    'milyar',
    'triliun',
    'quadriliun',
    'quintiliun',
    'sextiliun',
    'septiliun',
    'oktiliun',
    'noniliun',
    'desiliun',
    'undesiliun',
    'duodesiliun',
    'tredesiliun',
    'quattuordesiliun',
    'quindesiliun',
    'sexdesiliun',
    'septendesiliun',
    'oktodesiliun',
    'novemdesiliun',
    'vigintiliun',
  ];
  const maxIndex = units.length - 1;
  function digitToUnit(digit) {
    const curIndex = digit / 3;
    return curIndex <= maxIndex ? units[curIndex] : units[maxIndex];
  }

  const numbers = [
    '',
    'satu',
    'dua',
    'tiga',
    'empat',
    'lima',
    'enam',
    'tujuh',
    'delapan',
    'sembilan',
  ];

  function numberToText(index) {
    return numbers[index] || '';
  }

  const terbilang = angka => {
    const angkaLength = angka.length;
    const angkaMaxIndex = angkaLength - 1;

    // Angka Nol
    if (angkaMaxIndex === 0 && Number(angka[0]) === 0) {
      return 'nol';
    }

    let space = '';
    let result = '';

    let i = 0;
    while (i !== angkaLength) {
      const digitCount = angkaMaxIndex - i;
      const modGroup = digitCount % 3; // [2,1,0]
      const curAngka = Number(angka[i]);

      if (
        digitCount === 3 &&
        curAngka === 1 &&
        (i === 0 || (Number(angka[i - 2]) === 0 && Number(angka[i - 1]) === 0))
      ) {
        /* Angka Seribu */
        result += `${space}seribu`;
      } else {
        if (curAngka !== 0) {
          if (modGroup === 0) {
            /* Angka Satuan Bukan Nol */
            result += `${space}${numberToText(curAngka)}${
              i === angkaMaxIndex ? '' : ' '
            }${digitToUnit(digitCount)}`;
          } else if (modGroup === 2) {
            /* Angka Ratusan */
            if (curAngka === 1) {
              result += `${space}seratus`;
            } else {
              result += `${space}${numberToText(curAngka)} ratus`;
            }
          } else {
            /* Angka Sepuluh dan Belasan */
            if (curAngka === 1) {
              i++; // Skip Next Angka
              const nextAngka = Number(angka[i]);
              if (nextAngka === 0) {
                result += `${space}sepuluh`;
                /* Proses Next Angka Sekarang */
                if (
                  digitCount !== 1 &&
                  (Number(angka[i - 2]) !== 0 || Number(angka[i - 1]) !== 0)
                ) {
                  result += ` ${digitToUnit(digitCount - 1)}`;
                }
              } else {
                if (nextAngka === 1) {
                  result += `${space}sebelas`;
                } else {
                  result += `${space}${numberToText(nextAngka)} belas`;
                }
                /* Proses Next Angka Sekarang */
                if (digitCount !== 1) {
                  result += ` ${digitToUnit(digitCount - 1)}`;
                }
              }
            } else {
              /* Angka Puluhan */
              result += `${space}${numberToText(curAngka)} puluh`;
            }
          }
        } else {
          /* Angka Satuan Nol */
          if (
            modGroup === 0 &&
            (Number(angka[i - 2]) !== 0 || Number(angka[i - 1]) !== 0) &&
            digitCount !== 0
          ) {
            result += ` ${digitToUnit(digitCount)}`;
          }
        }
      }

      if (i <= 1) {
        space = ' ';
      }
      i++;
    }

    return result;
  };

  const terbilangSatuSatu = angka => {
    return angka
      .split('')
      .map(angka => (angka == 0 ? 'nol' : numberToText(angka)))
      .join(' ');
  };

  if (typeof number !== 'string') number = String(number);
  if (number.indexOf(settings.decimal) > -1) {
    /* Dengan Desimal */
    number = number.split(settings.decimal);
    return `${terbilang(number[0])} koma ${terbilangSatuSatu(number[1])}`
      .toLowerCase()
      .replace(/(?<= )[^\s]|^./g, a => a.toUpperCase());
  } else {
    /* Tanpa Desimal */
    return `${terbilang(number)}`
      .toLowerCase()
      .replace(/(?<= )[^\s]|^./g, a => a.toUpperCase());
  }
}

// example
// console.log(angkaTerbilang(2150880));

/**
 *
 * @param {Date} dateVal
 * @param {string} formatVal
 * @returns {string}
 */
function dateFormat(dateVal, formatVal) {
  // Defining locale
  Date.shortMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];
  Date.longMonths = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  Date.shortDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  Date.longDays = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];
  // Defining patterns
  var replaceChars = {
    // Day
    d: function () {
      var d = this.getDate();
      return (d < 10 ? '0' : '') + d;
    },
    D: function () {
      return Date.shortDays[this.getDay()];
    },
    j: function () {
      return this.getDate();
    },
    l: function () {
      return Date.longDays[this.getDay()];
    },
    N: function () {
      var N = this.getDay();
      return N === 0 ? 7 : N;
    },
    S: function () {
      var S = this.getDate();
      return S % 10 === 1 && S !== 11
        ? 'st'
        : S % 10 === 2 && S !== 12
        ? 'nd'
        : S % 10 === 3 && S !== 13
        ? 'rd'
        : 'th';
    },
    w: function () {
      return this.getDay();
    },
    z: function () {
      var d = new Date(this.getFullYear(), 0, 1);
      return Math.ceil((this - d) / 86400000);
    },
    // Week
    W: function () {
      var target = new Date(this.valueOf());
      var dayNr = (this.getDay() + 6) % 7;
      target.setDate(target.getDate() - dayNr + 3);
      var firstThursday = target.valueOf();
      target.setMonth(0, 1);
      if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
      }
      var retVal = 1 + Math.ceil((firstThursday - target) / 604800000);
      return retVal < 10 ? '0' + retVal : retVal;
    },
    // Month
    F: function () {
      return Date.longMonths[this.getMonth()];
    },
    m: function () {
      var m = this.getMonth();
      return (m < 9 ? '0' : '') + (m + 1);
    },
    M: function () {
      return Date.shortMonths[this.getMonth()];
    },
    n: function () {
      return this.getMonth() + 1;
    },
    t: function () {
      var year = this.getFullYear();
      var nextMonth = this.getMonth() + 1;
      if (nextMonth === 12) {
        year = year++;
        nextMonth = 0;
      }
      return new Date(year, nextMonth, 0).getDate();
    },
    // Year
    L: function () {
      var L = this.getFullYear();
      return L % 400 === 0 || (L % 100 !== 0 && L % 4 === 0);
    },
    o: function () {
      var d = new Date(this.valueOf());
      d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3);
      return d.getFullYear();
    },
    Y: function () {
      return this.getFullYear();
    },
    y: function () {
      return ('' + this.getFullYear()).substr(2);
    },
    // Time
    a: function () {
      return this.getHours() < 12 ? 'am' : 'pm';
    },
    A: function () {
      return this.getHours() < 12 ? 'AM' : 'PM';
    },
    B: function () {
      return Math.floor(
        ((((this.getUTCHours() + 1) % 24) +
          this.getUTCMinutes() / 60 +
          this.getUTCSeconds() / 3600) *
          1000) /
          24
      );
    },
    g: function () {
      return this.getHours() % 12 || 12;
    },
    G: function () {
      return this.getHours();
    },
    h: function () {
      var h = this.getHours();
      return ((h % 12 || 12) < 10 ? '0' : '') + (h % 12 || 12);
    },
    H: function () {
      var H = this.getHours();
      return (H < 10 ? '0' : '') + H;
    },
    i: function () {
      var i = this.getMinutes();
      return (i < 10 ? '0' : '') + i;
    },
    s: function () {
      var s = this.getSeconds();
      return (s < 10 ? '0' : '') + s;
    },
    v: function () {
      var v = this.getMilliseconds();
      return (v < 10 ? '00' : v < 100 ? '0' : '') + v;
    },
    // Timezone
    e: function () {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    },
    I: function () {
      var DST = null;
      for (var i = 0; i < 12; ++i) {
        var d = new Date(this.getFullYear(), i, 1);
        var offset = d.getTimezoneOffset();
        if (DST === null) DST = offset;
        else if (offset < DST) {
          DST = offset;
          break;
        } else if (offset > DST) break;
      }
      return (this.getTimezoneOffset() === DST) | 0;
    },
    O: function () {
      var O = this.getTimezoneOffset();
      return (
        (-O < 0 ? '-' : '+') +
        (Math.abs(O / 60) < 10 ? '0' : '') +
        Math.floor(Math.abs(O / 60)) +
        (Math.abs(O % 60) === 0
          ? '00'
          : (Math.abs(O % 60) < 10 ? '0' : '') + Math.abs(O % 60))
      );
    },
    P: function () {
      var P = this.getTimezoneOffset();
      return (
        (-P < 0 ? '-' : '+') +
        (Math.abs(P / 60) < 10 ? '0' : '') +
        Math.floor(Math.abs(P / 60)) +
        ':' +
        (Math.abs(P % 60) === 0
          ? '00'
          : (Math.abs(P % 60) < 10 ? '0' : '') + Math.abs(P % 60))
      );
    },
    T: function () {
      var tz = this.toLocaleTimeString(navigator.language, {
        timeZoneName: 'short',
      }).split(' ');
      return tz[tz.length - 1];
    },
    Z: function () {
      return -this.getTimezoneOffset() * 60;
    },
    // Full Date/Time
    c: function () {
      return this.format('Y-m-d\\TH:i:sP');
    },
    r: function () {
      return this.toString();
    },
    U: function () {
      return Math.floor(this.getTime() / 1000);
    },
  };
  // Simulates PHP's date function
  var date = new Date(dateVal);
  return formatVal.replace(/(\\?)(.)/g, function (_, esc, chr) {
    return esc === '' && replaceChars[chr] ? replaceChars[chr].call(date) : chr;
  });
}

// example:
// console.log(dateFormat(new Date('2022-05-07'), 'd F Y'));

/**
 *
 * @param {string} length
 * @returns {string}
 */
function uniqueId(length = 10) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

// example
// console.log(uniqueId(6));

/**
 *
 * @param {number} length jumlah karakter invoice terakhir
 * @param {string} prefix awalan invoice
 * @returns {string}
 */
function generateInvoice(length = 10, prefix = 'INV') {
  let characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let charactersLength = characters.length;
  let randomString = '';

  for (let i = 0; i < length; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }

  let date = new Date().toLocaleDateString().replace(/[/]/g, '');
  let invoiceNumber = prefix + date + randomString;

  return invoiceNumber;
}

// example
// console.log(generateInvoice(5, 'RSV'));

/**
 *
 * @param {Date} datetime
 * @param {boolean} full
 * @returns
 */
function timeAgo(datetime, full = false) {
  const now = new Date();
  const then = new Date(datetime);
  const diffInMs = now - then;
  const diffInSeconds = Math.floor(diffInMs / 1000);

  const intervals = {
    tahun: 31536000,
    bulan: 2592000,
    minggu: 604800,
    hari: 86400,
    jam: 3600,
    menit: 60,
    detik: 1,
  };

  const diff = {};
  let remainingSeconds = diffInSeconds;

  for (const [intervalName, seconds] of Object.entries(intervals)) {
    if (remainingSeconds >= seconds) {
      diff[intervalName] = Math.floor(remainingSeconds / seconds);
      remainingSeconds %= seconds;
    }
  }

  const string = [];
  for (const [intervalName, value] of Object.entries(diff)) {
    string.push(`${value} ${intervalName}`);
  }

  if (!full) {
    string.splice(1);
  }

  return string.length ? `${string.join(', ')} yang lalu` : 'baru saja';
}

// example
// console.log(timeAgo(new Date('2023-04-23')));

/**
 * fungsi untuk membuat slug
 *
 * @param {string} text
 * @returns {string}
 */
function slugify(text) {
  return text
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// example
// console.log(slugify('Halo selamat Datang Gian '));

/**
 *
 * @param {string} format
 * @param {*} time
 * @returns
 */
function dateIndo(format, time) {
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const daysFull = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];
  const months = [
    '',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];
  const monthsFull = [
    '',
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  if (!time) {
    time = new Date();
  }

  if (typeof time === 'string') {
    try {
      time = new Date(time);
    } catch (e) {
      time = new Date();
    }
  }

  let ret = '';
  for (let i = 0; i < format.length; i++) {
    if (format[i] === '\\') {
      ret += format[++i] || '';
    } else {
      switch (format[i]) {
        case 'D':
          ret += days[time.getUTCDay()];
          break;
        case 'l':
          ret += daysFull[time.getUTCDay()];
          break;
        case 'M':
          ret += months[time.getUTCMonth()];
          break;
        case 'F':
          ret += monthsFull[time.getUTCMonth()];
          break;
        case 'd':
          ret += ('0' + time.getUTCDate()).slice(-2);
          break;
        case 'm':
          ret += ('0' + (time.getUTCMonth() + 1)).slice(-2);
          break;
        case 'Y':
          ret += time.getUTCFullYear();
          break;
        case 'H':
          ret += ('0' + time.getUTCHours()).slice(-2);
          break;
        case 'i':
          ret += ('0' + time.getUTCMinutes()).slice(-2);
          break;
        case 's':
          ret += ('0' + time.getUTCSeconds()).slice(-2);
          break;
        case '\\':
          ret += format[i + 1] || '';
          i++;
          break;
        default:
          ret += format[i];
          break;
      }
    }
  }

  return ret;
}

const date = new Date(); // Tanggal dan waktu saat ini
const formattedDate = dateIndo('d-M-Y H:i:s', date);
console.log(formattedDate); // Contoh output: "Senin, 26 September 2023"

/**
 * Toastr by code seven
 *
 * css: https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css
 *
 * js: https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js
 *
 * @param string type [success, info, warning, message]
 * @param string title
 * @param string message
 *
 */
function toast(type, title, message) {
  let options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
    onclick: null,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '5000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
  };

  toastr[type](message, title, options);
}

/**
 *
 * @param length
 * @returns string random_password
 */
function generatePassword(length = 8) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const lengthRandom = length - 2;

  const uppercaseLetter = characters.charAt(Math.floor(Math.random() * 26));

  let otherCharacters = '';
  for (let i = 0; i < lengthRandom; i++) {
    otherCharacters += characters.charAt(Math.floor(Math.random() * 62));
  }

  const numericCharacter = characters.charAt(
    Math.floor(Math.random() * 10) + 52
  );

  let password = uppercaseLetter + otherCharacters + numericCharacter;

  password = password
    .split('')
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join('');

  return password;
}

/**
 * generate UUID V4
 * @returns {string} uuid v4
 */
function generateUUIDV4() {
  const randomHex = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );

  return randomHex;
}

/**
 * fungsi untuk mendeteksi apakah web dibuka di perangkat mobile
 */
function detectDevice() {
  var userAgent = navigator.userAgent;

  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    )
  ) {
    console.log('Halaman dibuka di perangkat mobile.');
  } else {
    console.log('Halaman dibuka di desktop.');
  }
}

/**
 * fungsi untuk generate objectId
 */
function generateMongoObjectId() {
  // Helper function to pad a number with leading zeros to get a 2-character hex string
  function padTo2Digits(num) {
    return num.toString(16).padStart(2, '0');
  }

  // 4-byte timestamp
  const timestamp = Math.floor(Date.now() / 1000); // current time in seconds
  const timestampHex = timestamp.toString(16).padStart(8, '0'); // Convert to hex and pad to 8 characters

  // 3-byte machine identifier
  const machineId = Array.from(crypto.getRandomValues(new Uint8Array(3)))
    .map(byte => padTo2Digits(byte))
    .join('');

  // 2-byte process identifier
  const processId = padTo2Digits(process.pid % 0xffff); // Use the process ID, modulo 2-byte range, convert to hex

  // 3-byte counter
  if (typeof generateMongoObjectId.counter === 'undefined') {
    generateMongoObjectId.counter = Math.floor(Math.random() * 0xffffff); // Initialize with random value
  } else {
    generateMongoObjectId.counter =
      (generateMongoObjectId.counter + 1) & 0xffffff; // Increment and ensure it's 3 bytes
  }
  const counterHex = generateMongoObjectId.counter
    .toString(16)
    .padStart(6, '0'); // Convert to hex and pad to 6 characters

  // Combine all parts to form the ObjectId
  return timestampHex + machineId + processId + counterHex;
}

function isValidObjectId(id) {
  const objectIdPattern = /^[a-fA-F0-9]{24}$/;
  return objectIdPattern.test(id);
}

console.log(isValidObjectId(generateMongoObjectId()));
console.log(isValidObjectId(generateMongoObjectId()));

/**
 * Menghitung jarak antara dua titik koordinat (latitude & longitude) dalam meter.
 *
 * Menggunakan rumus Haversine untuk mendapatkan jarak akurat di permukaan bumi.
 *
 * @param {number} lat1 - Latitude titik pertama
 * @param {number} lon1 - Longitude titik pertama
 * @param {number} lat2 - Latitude titik kedua
 * @param {number} lon2 - Longitude titik kedua
 * @returns {number} Jarak dalam meter
 */
function hitungJarakRadius(lat1, lon1, lat2, lon2) {
  const radiusBumi = 6371000; // Radius bumi dalam meter

  // Konversi derajat ke radian
  const radLat1 = lat1 * (Math.PI / 180);
  const radLon1 = lon1 * (Math.PI / 180);
  const radLat2 = lat2 * (Math.PI / 180);
  const radLon2 = lon2 * (Math.PI / 180);

  // Menghitung perbedaan koordinat
  const dLat = radLat2 - radLat1;
  const dLon = radLon2 - radLon1;

  // Menggunakan rumus Haversine
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) *
      Math.cos(radLat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Menghitung jarak dalam meter
  const jarak = radiusBumi * c;

  return jarak; // Return dalam meter
}

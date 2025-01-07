<?php

/**
 * fungsi untuk membatasi limit karakter
 *
 * @param string $content
 * @param int $length panjang kata
 * @param string $more pemisah
 * @return string
 */
function forceExcerpt($content, $length = 40, $more = '...')
{
    $excerpt = strip_tags(trim($content));
    $words   = str_word_count($excerpt, 2);
    if (count($words) > $length) {
        $words = array_slice($words, 0, $length, true);
        end($words);
        $position = key($words) + strlen(current($words));
        $excerpt  = substr($excerpt, 0, $position) . $more;
    }
    return $excerpt;
}

/**
 * fungsi untuk membuat random string
 *
 * @param	string	type of random string.  basic, alpha, alnum, numeric, nozero, unique, md5, encrypt and sha1
 * @param	int	number of characters
 * @return	string
 */
function randomString($type = 'alnum', $len = 8)
{
    switch ($type) {
        case 'basic':
            return mt_rand();
        case 'alnum':
        case 'numeric':
        case 'nozero':
        case 'alpha':
            switch ($type) {
                case 'alpha':
                    $pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    break;
                case 'alnum':
                    $pool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    break;
                case 'numeric':
                    $pool = '0123456789';
                    break;
                case 'nozero':
                    $pool = '123456789';
                    break;
            }
            return substr(str_shuffle(str_repeat($pool, ceil($len / strlen($pool)))), 0, $len);
        case 'md5':
            return md5(uniqid(mt_rand()));
        case 'sha1':
            return sha1(uniqid(mt_rand(), TRUE));
    }
}

/**
 * fungsi untuk generate waktu saat ini
 * contoh: 2022-03-28 08: 54: 00
 *
 * @return DateTime
 */
function timestamp()
{
    return date("Y-m-d H:i:s");
}

/**
 * fungsi untuk mengembalikan response json
 *
 * @param array $response
 * @param int $status_code
 * @param string $content_type
 * @return string JSON-encoded
 */
function response_json($response = [], $status_code = 200)
{
    http_response_code($status_code);
    header("Content-Type: application/json");
    echo json_encode($response);
}

/**
 * fungsi untuk format angka
 *
 * @param int $angka
 * @return int
 */
function formatAngka(int $angka = 0)
{
    return number_format($angka, 0, ',', '.');
}

/**
 * fungsi untuk format waktu readable / mudah dibaca
 * contoh: 1 hari yang lalu, baru saja, 1 tahun yang lalu
 *
 * @param string|DateTime $time
 * @return string
 */
function timeAgo($datetime, $full = false)
{
    $now  = new DateTime;
    $then = new DateTime($datetime);
    $diff = (array) $now->diff($then);

    $diff['w']  = floor($diff['d'] / 7);
    $diff['d'] -= $diff['w'] * 7;

    $string = array(
        'y' => 'tahun',
        'm' => 'bulan',
        'w' => 'minggu',
        'd' => 'hari',
        'h' => 'jam',
        'i' => 'menit',
        's' => 'detik',
    );

    foreach ($string as $k => &$v) {
        if ($diff[$k]) {
            $v = $diff[$k] . ' ' . $v . ($diff[$k] > 1 ? '' : '');
        } else {
            unset($string[$k]);
        }
    }

    if (!$full) {
        $string = array_slice($string, 0, 1);
    }

    return $string ? implode(', ', $string) . ' yang lalu' : 'baru saja';
}

/**
 * fungsi untuk konversi romawi menjadi angka
 * contoh: V = 5
 *
 * @param string $romawi
 * @return int
 */
function romawiToNumber(string $romawi): int
{
    $table  = ['M' => 1000, 'CM' => 900, 'D' => 500, 'CD' => 400, 'C' => 100, 'XC' => 90, 'L' => 50, 'XL' => 40, 'X' => 10, 'IX' => 9, 'V' => 5, 'IV' => 4, 'I' => 1];
    $result = 0;
    foreach ($table as $key => $value) {
        while (strpos($romawi, $key) === 0) {
            $result += $value;
            $romawi  = substr($romawi, strlen($key));
        }
    }
    return $result;
}

/**
 * fungis untuk konversi angka menjadi romawi
 * contoh: 5 = V
 *
 * @param int $int
 * @return string
 */
function numberToRomawi(int $int): string
{
    $table  = ['M' => 1000, 'CM' => 900, 'D' => 500, 'CD' => 400, 'C' => 100, 'XC' => 90, 'L' => 50, 'XL' => 40, 'X' => 10, 'IX' => 9, 'V' => 5, 'IV' => 4, 'I' => 1];
    $return = '';
    while ($int > 0) {
        foreach ($table as $rom => $arb) {
            if ($int >= $arb) {
                $int -= $arb;
                $return  .= $rom;
                break;
            }
        }
    }

    return $return;
}

/**
 * fungsi date bahasa indonesia
 *
 * @param string|DateTime  $format
 * @param boolean $time
 * @return string
 */
function dateIndo($format, $time = false)
{
    $day    = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    $days   = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    $month  = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    $months = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    if (!is_a($time, 'DateTime')) {
        if (is_int($time)) {
            $time = new DateTime(date('Y-m-d H:i:s.u', $time));
        } elseif (is_string($time)) {
            try {
                $time = new DateTime($time);
            } catch (Exception $e) {
                $time = new DateTime();
            }
        } else {
            $time = new DateTime();
        }
    }

    $ret = '';
    for ($i = 0; $i < strlen($format); $i++) {
        switch ($format[$i]) {
            case 'D':
                $ret .= $day[$time->format('w')];
                break;
            case 'l':
                $ret .= $days[$time->format('w')];
                break;
            case 'M':
                $ret .= $month[$time->format('n')];
                break;
            case 'F':
                $ret .= $months[$time->format('n')];
                break;
            case '\\':
                $ret .= $format[$i + 1];
                $i++;
                break;
            default:
                $ret .= $time->format($format[$i]);
                break;
        }
    }

    return $ret;
}

/**
 * helper function curl php
 *
 * @param string $url
 * @param string $method GET, POST, PUT, PATCH, DELETE
 * @param array $data
 * @param array $headers
 * @return array data
 */
function fetchCURL($url, $method = 'GET', $data = null, $headers = array())
{
    $curl = curl_init();

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0');
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

    switch (strtoupper($method)) {
        case 'POST':
            curl_setopt($curl, CURLOPT_POST, true);
            break;
        case 'PUT':
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'PUT');
            break;
        case 'DELETE':
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'DELETE');
            break;
        default:
            curl_setopt($curl, CURLOPT_HTTPGET, true);
    }

    if ($data) {
        curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
    }

    if ($headers) {
        $header_strings = array_map(function ($key, $value) {
            return "{$key}: {$value}";
        }, array_keys($headers), $headers);

        curl_setopt($curl, CURLOPT_HTTPHEADER, $header_strings);
    }

    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($curl);

    if ($response === false) {
        $error = curl_error($curl);
        curl_close($curl);
        return $error;
    }

    curl_close($curl);

    return json_decode($response, true);
}

/**
 * helper untuk format angka showrt
 *
 * @param int $n
 * @param int $precision
 * @return string
 */
function numberFormatShort($n, $precision = 1)
{
    if ($n < 900) {
        // 0 - 900
        $n_format = number_format($n, $precision);
        $suffix = '';
    } else if ($n < 900000) {
        // 0.9k-850k
        $n_format = number_format($n / 1000, $precision);
        $suffix = 'K';
    } else if ($n < 900000000) {
        // 0.9m-850m
        $n_format = number_format($n / 1000000, $precision);
        $suffix = 'M';
    } else if ($n < 900000000000) {
        // 0.9b-850b
        $n_format = number_format($n / 1000000000, $precision);
        $suffix = 'B';
    } else {
        // 0.9t+
        $n_format = number_format($n / 1000000000000, $precision);
        $suffix = 'T';
    }

    if ($precision > 0) {
        $dotzero = '.' . str_repeat('0', $precision);
        $n_format = str_replace($dotzero, '', $n_format);
    }

    return $n_format . $suffix;
}

/**
 * fungsi untuk mendapatkan range date
 * start: 01-02-2023 sampai: 04-02-2023
 * 01-02-2023, 02-02-2023, 03-02-2023, 04-02-2023
 *
 * @param string|DateTime $start_date
 * @param string|DateTime $end_date
 * @return array
 */
function getRangeDate($start_date, $end_date)
{
    $list_range_date = [];

    $date_from = mktime(1, 0, 0, substr($start_date, 5, 2), substr($start_date, 8, 2), substr($start_date, 0, 4));
    $date_to = mktime(1, 0, 0, substr($end_date, 5, 2), substr($end_date, 8, 2), substr($end_date, 0, 4));

    if ($date_to >= $date_from) {
        array_push($list_range_date, date('Y-m-d', $date_from)); // first entry
        while ($date_from < $date_to) {
            $date_from += 86400; // add 24 hours
            array_push($list_range_date, date('Y-m-d', $date_from));
        }
    }
    return $list_range_date;
}

/**
 * fungsi untuk generate invoice sederhana
 *
 * @param int $length panjang karater acak terakhir
 * @param string $prefix awalan invoice
 * @return string
 */
function generateInvoice($length = 5, $prefix = 'INV')
{
    $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $characters_length = strlen($characters);
    $random_string = '';

    for ($i = 0; $i < $length; $i++) {
        $random_string .= $characters[rand(0, $characters_length - 1)];
    }

    $date = date('dmY');
    return $prefix . $date . $random_string;
}

/**
 * fungsi untuk membuat slug
 *
 * @param string $text
 * @return string
 */
function slugify($text): string
{
    $string = preg_replace('/[^a-zA-Z0-9\s]/', '', $text);
    $string = str_replace(' ', '-', $string);
    $string = strtolower($string);
    $string = preg_replace('/-+/', '-', $string);
    $string = trim($string, '-');

    return $string;
}

/**
 * set response status code untuk php 5.3
 *
 * @param [type] $statusCode
 * @return void
 */
function setHttpResponseStatusCode($statusCode)
{
    $statusCodes = array(
        200 => 'OK',
        201 => 'Created',
        400 => 'Bad Request',
        401 => 'Unauthorized',
        403 => 'Forbidden',
        404 => 'Not Found',
        500 => 'Internal Server Error'
    );

    if (array_key_exists($statusCode, $statusCodes)) {
        header("HTTP/1.1 $statusCode " . $statusCodes[$statusCode]);
    } else {
        // Jika status code tidak valid, gunakan status code 500
        header("HTTP/1.1 500 Internal Server Error");
    }
}

/**
 * return 1 data filtered array data
 *
 * @param array $listData
 * @param array $where ['key' => 'value']
 * @return void
 */
function filterArray(array $listData, array $where)
{
    $key = array_key_first($where);
    $value = reset($where);

    $dataFiltered = array_filter($listData, function ($data) use ($key, $value) {
        return $data[$key] == $value;
    });

    if (count($dataFiltered) > 0) {
        return reset($dataFiltered);
    }

    return [];
}

/**
 * generate random password
 *
 * @param integer $length
 * @return string
 */
function generatePassword($length = 8)
{
    $length_random = $length - 2;
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    $uppercaseLetter = $characters[rand(0, 25)];
    $otherCharacters = '';
    for ($i = 0; $i < $length_random; $i++) {
        $otherCharacters .= $characters[rand(0, 61)];
    }

    $numericCharacter = $characters[rand(52, 61)];
    $password = $uppercaseLetter . $otherCharacters . $numericCharacter;
    $password = str_shuffle($password);

    return $password;
}

/**
 * generate UUID V4
 *
 * @return string uuidv4
 */
function generateUUIDV4()
{
    if (function_exists('random_bytes')) {
        $data = random_bytes(16);
    } elseif (function_exists('openssl_random_pseudo_bytes')) {
        $data = openssl_random_pseudo_bytes(16);
    } else {
        trigger_error('Random number generator not available', E_USER_ERROR);
    }

    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}


/**
 * generate objectId
 *
 * @return string
 */
function generateMongoObjectId()
{
    // Helper to pad a number with leading zeros to get a 2-character hex string
    $padTo2Digits = function ($num) {
        return str_pad(dechex($num), 2, '0', STR_PAD_LEFT);
    };

    // 4-byte timestamp (seconds since epoch)
    $timestamp = dechex(time());
    $timestamp = str_pad($timestamp, 8, '0', STR_PAD_LEFT); // Pad to 8 characters

    // 3-byte machine identifier (using random values for simulation)
    $machineId = '';
    for ($i = 0; $i < 3; $i++) {
        $machineId .= $padTo2Digits(random_int(0, 255));
    }

    // 2-byte process identifier (random value for simulation)
    $processId = $padTo2Digits(random_int(0, 0xFFFF));

    // 3-byte counter based on current time for uniqueness
    $counter = dechex((int)(microtime(true) * 1000) % 0xFFFFFF); // Multiplier adjusted for millisecond precision
    $counter = str_pad($counter, 6, '0', STR_PAD_LEFT); // Pad to 6 characters

    // Combine all parts to form the ObjectId
    return $timestamp . $machineId . $processId . $counter;
}

function getTimestampFromObjectId($id)
{
    if (strlen($id) !== 24 || !preg_match('/^[a-fA-F0-9]{24}$/', $id)) {
        return false; // ID tidak valid
    }

    $timestampHex = substr($id, 0, 8);
    $timestamp = hexdec($timestampHex);

    return date('Y-m-d H:i:s', $timestamp);
}

/**
 * Retrieve a value from the $_POST superglobal.
 *
 * @param string|null $key The key to retrieve. If null, all $_POST data is returned.
 * @param bool $xss Whether to sanitize the value using strip_tags. Default is true.
 * @return mixed|null The requested value, sanitized or raw, or null if the key does not exist.
 */
function request_post($key = null, $xss = true)
{
    if ($key !== null) {
        if (isset($_POST[$key])) {
            return $xss ? strip_tags($_POST[$key]) : $_POST[$key];
        } else {
            return null;
        }
    } else {
        $postData = $_POST;
        if ($xss) {
            $postData = array_map('strip_tags', $postData);
        }
        return $postData;
    }
}

/**
 * Retrieve a value from the $_GET superglobal.
 *
 * @param string|null $key The key to retrieve. If null, all $_GET data is returned.
 * @param bool $xss Whether to sanitize the value using strip_tags. Default is true.
 * @return mixed|null The requested value, sanitized or raw, or null if the key does not exist.
 */
function request_get($key = null, $xss = true)
{
    if ($key !== null) {
        if (isset($_GET[$key])) {
            return $xss ? strip_tags($_GET[$key]) : $_GET[$key];
        } else {
            return null;
        }
    } else {
        $getData = $_GET;
        if ($xss) {
            $getData = array_map('strip_tags', $getData);
        }
        return $getData;
    }
}

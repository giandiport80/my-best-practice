# IMPLEMENTASI CSRF TOKEN WEB FRONTEND

buat tag meta untuk menyimpan token nya

```html
<meta name="csrf_token" content="YOUR_TOKEN">
```

## IMPLEMENTASI TOKEN BIASA

setup ajax jquery, agar selalu mengirimkan token
```js
var token = $('meta[name="csrf_token"]').attr("content");

$.ajaxSetup({
	data: {
		csrf_token: token,
	},
});
```

## IMPLEMENTASI ONE TIME TOKEN

jika ingin one time token di codeigniter 3, setup config.php sebagai berikut
```php
$config['csrf_protection'] = TRUE;
$config['csrf_token_name'] = 'csrf_token';
$config['csrf_cookie_name'] = 'csrf_cookie';
$config['csrf_expire'] = 7200;
$config['csrf_regenerate'] = TRUE;
$config['csrf_exclude_uris'] = array();
```

1. JQUERY

setup ajax jquery, untuk handle mengirim dan menerima token
```js
$.ajaxSetup({
	beforeSend: function (jqXHR, settings) {
		var csrfToken = $('meta[name="csrf_token"]').attr("content");

		if (settings.data instanceof FormData) {
			settings.data.append("csrf_token", csrfToken);
		} else if (typeof settings.data === "string") {
			const params = new URLSearchParams(settings.data);
			params.append("csrf_token", csrfToken);
			settings.data = params.toString();
		} else {
			settings.data = $.extend({}, settings.data, { csrf_token });
		}
	},
	complete: function (xhr, status) {
		const csrf_token = xhr.responseJSON?.csrf_token;
		$('meta[name="csrf_token"]').attr("content", csrf_token);
	},
});
```

2. Javascript

```js
function fetchWithCsrf(url, options = {}) {
    const csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute("content");

    if (options.body instanceof FormData) {
        options.body.append("csrf_token", csrfToken);
    } else if (typeof options.body === "object") {
        options.body = { ...options.body, csrf_token: csrfToken };
    } else if (typeof options.body === "string") {
        const params = new URLSearchParams(options.body);
        params.append("csrf_token", csrfToken);
        options.body = params.toString();
    }

    options.method = options.method || "GET";

    options.headers = {
        ...options.headers,
        "Content-Type": options.body instanceof FormData ? "multipart/form-data" : "application/x-www-form-urlencoded",
    };

    return fetch(url, options)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((json) => {
            const newCsrfToken = json.csrf_token;
            if (newCsrfToken) {
                document.querySelector('meta[name="csrf_token"]').setAttribute("content", newCsrfToken);
            }
            return json;
        })
        .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
        });
}
```

contoh penggunaan: 

```js
const formData = new FormData();
formData.append("name", "John Doe");
formData.append("email", "john@example.com");

fetchWithCsrf('/your/api/endpoint', {
    method: 'POST',
    body: formData,
})
.then(response => {
    console.log("Response:", response);
});
```

3. AXIOS

```js
axios.interceptors.request.use(function (config) {
    const csrfToken = document.querySelector('meta[name="csrf_token"]').getAttribute("content");

    if (config.data instanceof FormData) {
        config.data.append("csrf_token", csrfToken);
    } else if (typeof config.data === "object") {
        config.data = { ...config.data, csrf_token: csrfToken };
    } else if (typeof config.data === "string") {
        const params = new URLSearchParams(config.data);
        params.append("csrf_token", csrfToken);
        config.data = params.toString();
    }

    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    const newCsrfToken = response.data.csrf_token;
    if (newCsrfToken) {
        document.querySelector('meta[name="csrf_token"]').setAttribute("content", newCsrfToken);
    }
    return response;
}, function (error) {
    return Promise.reject(error);
});
```
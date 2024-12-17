## ANIMASI LOADING CSS

1. Masukkan Style dibawah ini:

```css
#cover-spin {
  cursor: not-allowed;
  position: fixed;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
  display: none;
}

@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

#loading {
  display: none;
  width: 20px;
  height: 20px;
  margin-bottom: 10px;
  border-style: solid;
  border-color: black;
  border-top-color: transparent;
  border-width: 3px;
  border-radius: 50%;
  -webkit-animation: spin 0.8s linear infinite;
  animation: spin 0.8s linear infinite;
}

#cover-spin::after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-style: solid;
  border-color: black;
  border-top-color: transparent;
  margin: auto;
  border-width: 5px;
  border-radius: 50%;
  -webkit-animation: spin 0.8s linear infinite;
  animation: spin 0.8s linear infinite;
}
```

2. Tambahkan element html

```html
  <div id="loading" style="display: block;"></div>
  <div id="cover-spin" style="display: block;"></div>
```

3. Show/Hide dengan JQuery Javascript

```javascript
function showLoading() {
    $("#cover-spin").show();
}

function hideLoading() {
    $("#cover-spin").hide();
}

showLoading();
hideLoading();
```
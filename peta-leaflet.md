# Sample membuat peta degan Leaflet JS

```html
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>

  <!-- di dalam modal -->
  <div class="row">
    <div class="col-md-12">
        <div class="wrapper-lokasi">
            <div id="maps_area" class="mb-2" style="height: 360px;"></div>
        </div>

        <div class="form-group">
            <label for="latlng">Latitude/longitude</label>
            <input type="text" class="form-control mb-2 validate_input" id="latlng"
                placeholder="Latitude/Longitude" disabled>
        </div>

        <div class="my-3">
            <button class="btn btn-danger btn-sm btn-select-asal-lokasi"
                style="display: none">
                <i class="fas fa-map-marker-alt"></i>
                Pilih titik lokasi
            </button>
            <button class="btn btn-danger btn-sm btn-select-tujuan-lokasi"
                style="display: none">
                <i class="fas fa-map-marker-alt"></i>
                Pilih titik lokasi
            </button>
        </div>
    </div>
  </div>
```

Fungsi Javascript

```js
var mymap;

function initMap(selector, lat, lng) {
    if (mymap) {
        mymap.remove();
    }

    mymap = L.map(selector).setView([lat, lng], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    }).addTo(mymap);

    // Tambahkan fitur geocoder (pencarian)
    var geocoder = L.Control.geocoder({
        defaultMarkGeocode: false
    }).on('markgeocode', function(e) {
        var latlng = e.geocode.center;
        updateMarker(latlng);
        mymap.setView(latlng, mymap.getZoom());
    }).addTo(mymap);

    var marker;

    function updateMarker(latlng) {
        if (marker) {
            mymap.removeLayer(marker);
        }
        marker = L.marker(latlng).addTo(mymap);
        marker.bindPopup(latlng.toString()).openPopup();

        // update value
        document.getElementById('latlng').value = latlng.lat + ", " + latlng.lng;
        document.getElementById("latitude").value = latlng.lat;
        document.getElementById("longitude").value = latlng.lng;
    }

    function onMapClick(e) {
        updateMarker(e.latlng);
    }

    mymap.on('click', onMapClick);

    // Fungsi untuk mendapatkan lokasi saat ini
    function locateUser() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var latlng = L.latLng(position.coords.latitude, position.coords.longitude);
                updateMarker(latlng);
                mymap.setView(latlng, 13);
            }, function(error) {
                alert("Geolocation tidak tersedia atau ditolak.");
            });
        } else {
            alert("Browser Anda tidak mendukung Geolocation.");
        }
    }

    // Panggil fungsi untuk mendapatkan lokasi saat ini saat halaman dimuat
    locateUser();
}

$('#modal_maps').on('shown.bs.modal', function() {
    initMap('maps_area', -6.175247, 106.827049);
});
```
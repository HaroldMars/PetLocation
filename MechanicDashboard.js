<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin</title>
    <link rel="stylesheet" href="~/css/homesyle.css">
    <link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet'></link>
    <script src="https://kit.fontawesome.com/55a8472328.js" crossorigin="anonymous"></script>

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
          crossorigin="" />
    <!-- Make sure you put this AFTER Leaflet's CSS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
            crossorigin=""></script>
    <script src="https://kit.fontawesome.com/55a8472328.js" crossorigin="anonymous"></script>

const updateAvailableMechanicTable = () => {

    const tableElement = document.querySelector('#available-mechanics-data');
    tableElement.innerHTML = '';

    const filter_name = document.querySelector(`#available-mechanic-search`).value;

    availableMechanics.forEach(mechanic => {

        let USER_DATA = account_data.filter(s => s.personalInformation.UUID === mechanic.personalInformation.UUID)[0];
        const row = document.createElement('tr');
        row.addEventListener('click', (e) => {
            // This moves the map to a single LatLng
            var pos = mechanicMap.get(USER_DATA.personalInformation.UUID).getLatLng();
            leafletMap.setView([pos.lat, pos.lng]);
        } )

        const user = document.createElement('td');
        user.innerHTML = `${USER_DATA.personalInformation.Firstname} ${USER_DATA.personalInformation.Lastname}`;


        const rating = document.createElement('td');
        let stars = '';
        let rate = USER_DATA.accountStatus.Rating;
        for (let i = 1; i <= 5; i++) {
            stars += (rate >= i ? `<i class="fa-solid fa-star">` : `<i class="fa-regular fa-star">`);
        }
        rating.innerHTML = stars;

        const onlineStatus = document.createElement('td');
        onlineStatus.innerHTML = USER_DATA.accountStatus.IsOnline ? `<i class="fa-solid fa-check"></i>` : `<i class="fa-solid fa-xmark"></i>`;

        const restricted = document.createElement('td');
        restricted.innerHTML = USER_DATA.accountStatus.IsLocked ? 'YES' : 'NO';

        row.appendChild(user);
        row.appendChild(rating);
        row.appendChild(onlineStatus);
        row.appendChild(restricted);

        if (!USER_DATA.personalInformation.Lastname.toLowerCase().includes(filter_name) &&
            !USER_DATA.personalInformation.Firstname.toLowerCase().includes(filter_name) &&
            filter_name !== '') { }
        else {
            tableElement.appendChild(row);
        }
        
    })
}
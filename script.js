const fetchInfoVelib = () => {
    const url ='https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&q=&lang=en&rows=100&facet=name&facet=is_installed&facet=is_renting&facet=is_returning&facet=nom_arrondissement_communes&refine.nom_arrondissement_communes=Paris'
      fetch(url).then((response) =>
        response.json().then((data) => {
          selector.innerHTML = ""
          velibInfo(data);
        }))
        .catch((error) => console.error('error:', error));
  }
  
  const velibInfo = (data) => {
    const dataArray = data.records;
    dataArray.forEach( (item) => {
      const name = item.fields.name;
      const numberElectricVelibs = item.fields.ebike;
      const numberClassicalVelibs = item.fields.mechanical;
      const numberOfAvailableSpots = item.fields.numdocksavailable;
      const lattitude = item.fields.coordonnees_geo[0];
      const longitude = item.fields.coordonnees_geo[1];
  
      showVelibStation(selector, name, numberClassicalVelibs, numberElectricVelibs, numberOfAvailableSpots, lattitude, longitude);
    });
  };
  
  const showVelibStation = (selector, name, numberClassicalVelibs, numberElectricVelibs, numberOfAvailableSpots, lattitude, longitude) => {
    var marker = L.marker([lattitude, longitude]).addTo(myMap);
    marker.bindPopup(`<b>Station :</b> ${name}<br>
                      <b> Classical Velibs :</b> ${numberClassicalVelibs}<br>
                      <b> Electric Velibs :</b> ${numberElectricVelibs}<br>
                      <b> Slots Available :</b> ${numberOfAvailableSpots}<br>
                      `);
  }
  
  const fecthInfoMeteo = () => {
    const urlMeteo = 'https://api.weatherbit.io/v2.0/current?postal_code=75000&country=Fr&key=""Place your API KEY here""'
    fetch(urlMeteo).then((response) =>
      response.json().then((data) => {
        selection.innerHTML = ""
        meteoInfo(data);
      }))
      .catch((error) => console.error('error: ', error));
  }
  
  const meteoInfo = (data) => {
      const description = data.data[0].weather.description;
      showMeteo(selection, description);
  };
  
  const showMeteo = (selection, meteoDescription) => {
    selection.innerHTML += `
                      <div class="card border mb-3 mx-3" style="width: 99%; text-align: center">
                        <h3 class="pt-2 px-2"><b>Weather is :</b> ${meteoDescription}</h3>
                      </div>
                      `
  }
  const selector = document.getElementById('selector')
  const selection = document.getElementById('meteo')
  
  fetchInfoVelib();
  setInterval(fetchInfoVelib, 60000);
  fecthInfoMeteo();
  setInterval(fecthInfoMeteo, 600000);
  
  var myMap = L.map('mapid').setView([48.866667, 2.333333], 12);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'Place your API KEY here' 
  }).addTo(myMap);

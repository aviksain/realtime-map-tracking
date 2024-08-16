const map = L.map("map");

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "@aviksain",
}).addTo(map);

const customIcon = L.icon({
  iconUrl: "./car-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

let sourceMarker, destinationMarker, movingMarker, routingControl;
let userRoute = [];

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const userLocation = [latitude, longitude];

      userRoute.push(userLocation);

      if (!sourceMarker) {
        sourceMarker = L.marker(userLocation).addTo(map);
        map.setView(userLocation, 18);

        movingMarker = L.marker(userLocation, { icon: customIcon }).addTo(map);
      } else {
        movingMarker.setLatLng(userLocation);
      }

      if (userRoute.length > 1) {
        L.polyline(userRoute, {
          color: "red",
          weight: 4,
          opacity: 0.7,
        }).addTo(map);
      }
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 0,
    }
  );
}

map.on("click", function (e) {
  if (!destinationMarker) {
    destinationMarker = L.marker(e.latlng).addTo(map);

    routingControl = L.Routing.control({
      waypoints: [sourceMarker.getLatLng(), destinationMarker.getLatLng()],
      routeWhileDragging: false,
      createMarker: () => null,
      lineOptions: {
        styles: [{ color: "blue", opacity: 0.7, weight: 4 }],
      },
    }).addTo(map);

    routingControl.on("routesfound", function (e) {
      const route = e.routes[0].coordinates;
    });
  }
});

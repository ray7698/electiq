// ---- GOOGLE MAPS ----
window.initMap = function () {
  const mapEl = document.getElementById('google-map');
  document.getElementById('map-fallback').style.display = 'none';

  const map = new google.maps.Map(mapEl, {
    center: { lat: 20.5937, lng: 78.9629 },
    zoom: 5,
    styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }],
  });

  // Mock polling stations
  const stations = [
    {
      name: 'Polling Station 1 — Delhi Central',
      lat: 28.6139,
      lng: 77.209,
      address: 'Town Hall, Chandni Chowk, Delhi',
      hours: '7am – 6pm',
    },
    {
      name: 'Polling Station 2 — Mumbai South',
      lat: 18.9388,
      lng: 72.8354,
      address: 'Municipal School, Colaba, Mumbai',
      hours: '7am – 6pm',
    },
    {
      name: 'Polling Station 3 — Bangalore',
      lat: 12.9716,
      lng: 77.5946,
      address: 'Community Centre, Indiranagar, Bangalore',
      hours: '7am – 6pm',
    },
    {
      name: 'Polling Station 4 — Chennai',
      lat: 13.0827,
      lng: 80.2707,
      address: 'Government School, Anna Nagar, Chennai',
      hours: '7am – 6pm',
    },
    {
      name: 'Polling Station 5 — Kolkata',
      lat: 22.5726,
      lng: 88.3639,
      address: 'Panchayat Office, Salt Lake, Kolkata',
      hours: '7am – 6pm',
    },
  ];

  stations.forEach((station) => {
    const marker = new google.maps.Marker({
      position: { lat: station.lat, lng: station.lng },
      map,
      title: station.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#1A237E',
        fillOpacity: 1,
        strokeColor: '#FFC107',
        strokeWeight: 2,
      },
    });
    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="font-family:DM Sans,sans-serif;padding:4px">
        <strong style="color:#1A237E">${station.name}</strong><br/>
        <span style="font-size:13px;color:#555">${station.address}</span><br/>
        <span style="font-size:12px;color:#888">🕐 ${station.hours}</span>
      </div>`,
    });
    marker.addListener('click', () => infoWindow.open(map, marker));
  });

  // Map search using Backend Proxy
  document.getElementById('map-search-btn').addEventListener('click', async () => {
    const query = document.getElementById('map-search').value.trim();
    if (!query) return;

    try {
      const res = await fetch(`/api/geocode?address=${encodeURIComponent(query + ', India')}`);
      const data = await res.json();
      if (data.status === 'OK' && data.results && data.results[0]) {
        map.setCenter(data.results[0].geometry.location);
        map.setZoom(12);
      } else {
        alert('Location not found. Please try again.');
      }
    } catch (err) {
      console.error('Geocoding search failed:', err);
      alert('Error searching for location.');
    }
  });

  document.getElementById('map-search').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('map-search-btn').click();
  });
};

// Load Google Maps lazily when map section is visible
document.addEventListener('DOMContentLoaded', () => {
  const mapSection = document.getElementById('map');
  if (!mapSection) return;

  const mapObserver = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting) {
      mapObserver.disconnect();
      try {
        const res = await fetch('/api/maps-config');
        const data = await res.json();
        if (data.mapsApiKey) {
          const s = document.createElement('script');
          s.src = `https://maps.googleapis.com/maps/api/js?key=${data.mapsApiKey}&callback=initMap`;
          s.async = true;
          document.head.appendChild(s);
        } else {
          document.getElementById('map-fallback').removeAttribute('aria-hidden');
        }
      } catch (e) {
        document.getElementById('map-fallback').removeAttribute('aria-hidden');
      }
    }
  });
  mapObserver.observe(mapSection);
});

import { useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const addressList = [
  {
    address: "141-1 Dongbaek-ro, Haeundae-gu, Busan",
    lat: 35.158698,
    lng: 129.160384,
  },
  {
    address: "52 Jagalchihaean-ro, Jung-gu, Busan",
    lat: 35.097961,
    lng: 129.030487,
  },
  {
    address: "203 Gamcheonhang-ro, Saha-gu, Busan",
    lat: 35.088393,
    lng: 129.010897,
  },
  {
    address: "45 Gwangbok-ro, Jung-gu, Busan",
    lat: 35.100756,
    lng: 129.032614,
  },
  {
    address: "295 Daedong-ro, Sasang-gu, Busan",
    lat: 35.163301,
    lng: 128.984512,
  },
];

function Locations() {
  const avgLat =
    addressList.reduce((sum, loc) => sum + loc.lat, 0) / addressList.length;
  const avgLng =
    addressList.reduce((sum, loc) => sum + loc.lng, 0) / addressList.length;

  const imageSrcColor = "/images/for_map.png";
  const imageSrcGray = "/images/for_map_gray.png";

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  return (
    <div className="">
      <div className="mb-6 flex flex-col items-center gap-2">
        <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">
          locations
        </h2>
        <span className="h-1 w-16 rounded-full bg-pink-600" />
      </div>
      <div className="mt-10 md:grid md:grid-cols-2">
        <div>
          <ul>
            {addressList.map((location, index) => (
              <li
                key={index}
                className="text-md mb-8 ml-6 mr-6 flex cursor-pointer flex-col border-b-[1px] border-stone-200"
                onClick={() => setSelectedAddressIndex(index)}
              >
                <span
                  className={`${selectedAddressIndex === index ? "text-pink-600" : "text-stone-800"} font-bold hover:text-pink-600`}
                >
                  TINT #{index + 1}
                </span>
                {location.address}
              </li>
            ))}
          </ul>
        </div>
        <div className="mr-8 hidden md:block">
          <Map
            center={{ lat: avgLat, lng: avgLng }}
            style={{ width: "100%", height: "400px" }}
            level={7}
          >
            {addressList.map((location, index) => (
              <MapMarker
                position={{ lat: location.lat, lng: location.lng }}
                onClick={() => setSelectedAddressIndex(index)}
                key={index}
                image={{
                  src:
                    selectedAddressIndex === index
                      ? imageSrcColor
                      : imageSrcGray,
                  size: { width: 60, height: 100 },
                }}
              ></MapMarker>
            ))}
          </Map>
        </div>
      </div>
    </div>
  );
}

export default Locations;

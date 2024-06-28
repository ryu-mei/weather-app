'use client';
import React, { useEffect, useState } from "react";

const InputSelectBox = () => {
  const [regions, setRegions] = useState([]);
  const [prefs, setPrefs] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPrefs, setSelectedPrefs] = useState('');

  useEffect(() => {
    (async () => {
      const res1 = await fetch(`https://www.jma.go.jp/bosai/common/const/area.json`);
      const areaJson = await res1.json();
      setRegions(areaJson.centers);
      setPrefs(areaJson.offices);
      setSelectedRegion(Object.keys(areaJson.centers)[0]);
      setSelectedPrefs(Object.keys(areaJson.offices)[0]);
    })();
  }, []);

  // selectedPrefsの初期値
  useEffect(() => {
    if (selectedRegion) {
      const region = regions[selectedRegion];
      if (region) {
        const prefCode = region.children;
        setSelectedPrefs(prefCode[0]);
      }
    }
  }, [selectedRegion, regions]);

  console.log(`selectedPrefs`, selectedPrefs);
  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };
  const handlePrefChange = (e) => {
    setSelectedPrefs(e.target.value);
  };

  console.log(prefs);
  return (
    <>
      <h2>地域選択</h2>
      <select value={selectedRegion} onChange={handleRegionChange}>
        {Object.keys(regions).map((regionCode) => {
          return (<option key={regionCode} value={regionCode}>
            {regions[regionCode].name}
          </option>)
        })}
      </select>
      <select value={selectedPrefs} onChange={handlePrefChange}>
        {selectedRegion && regions[selectedRegion] && regions[selectedRegion].children.map((prefCode) => {
          return (<option key={prefCode} value={prefCode}>
            {prefs[prefCode].name}
          </option>)
        })}
      </select>
    </>
  );
};

const Home = () => {
  return <InputSelectBox />;
};

export default Home;
'use client';
import React, { useEffect, useState } from "react";

const InputSelectBox = () => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('')

  useEffect(() => {
    const fetchRegions = async () => {
      const res1 = await fetch(`https://www.jma.go.jp/bosai/common/const/area.json`);
      const areaJson = await res1.json();
      setRegions(areaJson.centers);
      setSelectedRegion(Object.keys(areaJson.centers)[0]);
    };
    fetchRegions();
  }, []);


  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  }
  console.log(selectedRegion);
  console.log(regions);

  return (
    <>
      <h2>地域選択</h2>
      <select value={selectedRegion} onChange={handleRegionChange}>
        {Object.keys(regions).map((regionCode) => {
          <option key={regionCode} value={regionCode}>
            {regionCode}
          </option>
        })}
      </select>
    </>
  )
}

const Home = () => {
  return (<InputSelectBox />)
}

export default Home;
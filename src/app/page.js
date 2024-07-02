'use client';
import React, { useEffect, useState } from "react";

const InputSelectBox = () => {
  const [regions, setRegions] = useState([]);
  const [prefs, setPrefs] = useState([]);
  const [class10s, setClass10s] = useState([]);
  const [class20s, setClass20s] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(``);
  const [selectedPrefs, setSelectedPrefs] = useState(``);
  const [selectedClass10s, setSelectedClass10s] = useState(``);
  const [selectedClass20s, setSelectedClass20s] = useState(``);

  useEffect(() => {
    (async () => {
      const res1 = await fetch(`https://www.jma.go.jp/bosai/common/const/area.json`);
      const areaJson = await res1.json();
      setRegions(areaJson.centers);
      setPrefs(areaJson.offices);
      setClass10s(areaJson.class10s);
      setClass20s(areaJson.class20s);
      setSelectedRegion(Object.keys(areaJson.centers)[0]);
      setSelectedPrefs(Object.keys(areaJson.offices)[0]);
      setSelectedClass10s(Object.keys(areaJson.class10s)[0]);
      setSelectedClass20s(Object.keys(areaJson.class20s)[0]);
    })();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      const region = regions[selectedRegion];
      if (region) {
        const prefCode = region.children;
        setSelectedPrefs(prefCode[0]);
      }
    }
  }, [selectedRegion, regions]);

  useEffect(() => {
    if (selectedPrefs) {
      const pref = prefs[selectedPrefs];
      if (pref) {
        const class10Code = pref.children;
        setSelectedClass10s(class10Code[0]);
      }
    }
  }, [selectedPrefs, prefs]);


  useEffect(() => {
    if (selectedClass10s) {
      const class10 = class10s[selectedClass10s];
      if (class10) {
        const class20Code = class10.children;
        setSelectedClass20s(class20Code[0]);
      }
    }
  }, [selectedClass10s, class10s]);

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };
  const handlePrefChange = (e) => {
    setSelectedPrefs(e.target.value);
  };
  const handleClass10Change = (e) => {
    setSelectedClass10s(e.target.value);
  };
  const handleClass20Change = (e) => {
    setSelectedClass20s(e.target.value);
  };

  console.log(`page.js 73`, class10s, class20s);

  return (
    <>
      <h2>地域選択</h2>
      {
        regions.length === 0 ? null
          : selectedRegion === `` ? null
            : <select value={selectedRegion} onChange={handleRegionChange}>
              {Object.keys(regions).map((regionCode) => {
                return (
                  <option key={regionCode} value={regionCode}>
                    {regions[regionCode].name}
                  </option>
                );
              })}
            </select>
      }

      {regions.length === 0 ? null
        : selectedRegion === `` ? null
          : regions[selectedRegion].children.length === 0 ? null
            : <select value={selectedPrefs} onChange={handlePrefChange}>
              {regions[selectedRegion].children.map((prefCode) => {
                return (
                  <option key={prefCode} value={prefCode}>
                    {prefs[prefCode].name}
                  </option>
                );
              })}
            </select>
      }

      {regions.length === 0 ? null
        : selectedRegion === `` ? null
          : regions[selectedRegion].children.length === 0 ? null
            : prefs[selectedPrefs].children.length === 0 ? null
              : <select value={selectedClass10s} onChange={handleClass10Change}>
                {prefs[selectedPrefs].children.map((class10Code) => {
                  return (
                    <option key={class10Code} value={class10Code}>
                      {class10s[class10Code].name}
                    </option>
                  );
                })}
              </select>
      }

      {regions.length === 0 ? null
        : selectedRegion === `` ? null
          : regions[selectedRegion].children.length === 0 ? null
            : prefs[selectedPrefs].children.length === 0 ? null
              : class10s[selectedClass10s].children.length === 0 ? null
                : <select value={selectedClass20s} onChange={handleClass20Change}>
                  {class10s[selectedClass10s].children.map((class20Code) => {
                    console.log(`page.js 128`, class20Code);
                    return (
                      <option key={class20Code} value={class20Code}>
                        {
                          class20s[`${class20Code}0`]?.name
                        }
                      </option>
                    );
                  })}
                </select>
      }

    </>
  );
};

const Home = () => {
  return <InputSelectBox />;
};

export default Home;

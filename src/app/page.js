'use client';
import React, { useEffect, useState } from "react";
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';

if (typeof Highcharts === `object`) {
  HighchartsExporting(Highcharts);
}

const InputSelectBox = () => {
  const [regions, setRegions] = useState([]);
  const [prefs, setPrefs] = useState([]);
  const [class10s, setClass10s] = useState([]);
  const [class15s, setClass15s] = useState([]);
  const [class20s, setClass20s] = useState([]);
  const [forecastAreas, setForecastAreas] = useState([]);
  const [amedases, setAmedases] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(``);
  const [selectedPrefs, setSelectedPrefs] = useState(``);
  const [selectedClass10s, setSelectedClass10s] = useState(``);
  const [selectedClass15s, setSelectedClass15s] = useState(``);
  const [selectedClass20s, setSelectedClass20s] = useState(``);
  const [amedasTemp, setAmedasTemp] = useState(null);
  const [amedasPressure, setAmedasPressure] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    (async () => {
      const res1 = await fetch(`https://www.jma.go.jp/bosai/common/const/area.json`);
      const res2 = await fetch(`https://www.jma.go.jp/bosai/forecast/const/forecast_area.json`);
      const res3 = await fetch(`https://www.jma.go.jp/bosai/amedas/const/amedastable.json`);
      const res4 = await fetch(`https://www.jma.go.jp/bosai/amedas/data/latest_time.txt`);
      const areaJson = await res1.json();
      const forecastAreasJson = await res2.json();
      const amedasesJson = await res3.json();
      const dateTimeText = await res4.text();

      console.log(`page.js 40`, { areaJson, forecastAreasJson, amedasesJson });

      const date = new Date(dateTimeText);
      date.setMinutes(0);
      const newTimes = [
        new Date(date.getTime()),
        new Date(date.getTime()),
        new Date(date.getTime()),
        date,
      ];
      newTimes[0].setHours(date.getHours() - 4);
      newTimes[1].setHours(date.getHours() - 3);
      newTimes[2].setHours(date.getHours() - 2);
      newTimes[3].setHours(date.getHours() - 1);
      // console.log(newTimes);

      setRegions(areaJson.centers);
      setPrefs(areaJson.offices);
      setClass10s(areaJson.class10s);
      setClass15s(areaJson.class15s);
      setClass20s(areaJson.class20s);
      setForecastAreas(forecastAreasJson);
      setAmedases(amedasesJson);
      setTimes(newTimes);
      setSelectedRegion(Object.keys(areaJson.centers)[0]);
      setSelectedPrefs(Object.keys(areaJson.offices)[0]);
      setSelectedClass10s(Object.keys(areaJson.class10s)[0]);
      setSelectedClass15s(Object.keys(areaJson.class15s)[0]);
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
        const class15Code = class10.children;
        setSelectedClass15s(class15Code[0]);
      }
    }
  }, [selectedClass10s, class10s]);

  useEffect(() => {
    if (selectedClass15s) {
      const class15 = class15s[selectedClass15s];
      if (class15) {
        const class20Code = class15.children;
        setSelectedClass20s(class20Code[0]);
      }
    }
  }, [selectedClass15s, class15s]);

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };
  const handlePrefChange = (e) => {
    setSelectedPrefs(e.target.value);
  };
  const handleClass10Change = (e) => {
    setSelectedClass10s(e.target.value);
  };
  const handleClass15Change = (e) => {
    setSelectedClass15s(e.target.value);
  };
  const handleClass20Change = async (e) => {
    // class20Code = 0121400
    // forecastAreas = array
    const class20Code = e.target.value;
    setSelectedClass20s(class20Code);

    const amedasCode = getAmedasCodeFromClass20Code(class20Code, forecastAreas);

    console.log(`page.js 127`,
      class20Code,
      forecastAreas,
      amedasCode
    );
    // ここで amedasCode = undefined になっているので、
    // なにかデータ構造とコードが一致してないと思います。

    const fetchs = [];
    const dateHourTexts = times.map(hour => {
      const yearText = hour.getFullYear();
      const monthText = (hour.getMonth() + 1).toString().padStart(2, `0`);
      const dateText = hour.getDate().toString().padStart(2, `0`);
      const hourText = hour.getHours().toString().padStart(2, `0`);
      return yearText + monthText + dateText + hourText;
    });
    for (const dateHourText of dateHourTexts) {
      fetchs.push(
        fetch(`https://www.jma.go.jp/bosai/amedas/data/map/${dateHourText}0000.json`)
      );
    }
    const resArray = await Promise.all(fetchs);
    const resultAmedasDatas = await Promise.all(resArray.map(res => res.json()));
    const resultAmedasData = resultAmedasDatas[resultAmedasDatas.length - 1];

    console.log(`page.js 144`,
      resultAmedasDatas,
      amedasCode
    );

    if (!resultAmedasData[amedasCode]) {
      console.log(`アメダスデータなし`);
      return;
    }

    setAmedasTemp(resultAmedasData[amedasCode].temp[0]);
    setAmedasPressure(resultAmedasData[amedasCode].pressure[0]);
    setChartData(
      resultAmedasDatas.map(data => {
        return data[amedasCode]?.temp[0];
      })
    );
  };

  const getAmedasCodeFromClass20Code = (class20Code, forecastAreasJson) => {
    for (const [key, value] of Object.entries(forecastAreasJson)) {
      console.log(`178`, value);
      for (const data of value) {
        console.log(`180`, data.class20);
        if (data.class20 === class20Code) {
          return data.amedas[0];
        }
      }
    }
  };

  const updateChart = {
    chart: { type: `line` },
    title: { text: `気温と気圧の変化` },
    xAxis: {
      title: { text: `時間` },
      categories: [...times],
    },
    yAxis: {
      title: { text: `気温` },
    },
    series: [{
      name: `気温`,
      data: [1, 2, 3],
    }]
  };

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
                : <select value={selectedClass15s} onChange={handleClass15Change}>
                  {class10s[selectedClass10s].children.map((class15Code) => {
                    return (
                      <option key={class15Code} value={class15Code}>
                        {class15s[class15Code].name}
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
                : class15s[selectedClass15s].children.length === 0 ? null
                  : <select value={selectedClass20s} onChange={handleClass20Change}>
                    {class15s[selectedClass15s].children.map((class20Code) => {
                      return (
                        <option key={class20Code} value={class20Code}>
                          {class20s[class20Code].name}
                        </option>
                      );
                    })}
                  </select>
      }
      <HighchartsReact highcharts={Highcharts} options={updateChart} />
    </>
  );
};

const Home = () => {
  return <InputSelectBox />;
};

export default Home;

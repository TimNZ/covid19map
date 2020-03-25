import { useState } from "react";
import Head from "next/head";
import styled, { css } from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import dailyCases from "../data/dailyCases";

const Stats = ({ data }) => {
  console.log(data);

  const {
    confirmedCases,
    probableCases,
    recoveredCases,
    alertlevel,
    deaths,
    comTrans,
    countriesAffected,
    casesPer1M
  } = data.staticData;
  const totalCases = confirmedCases + probableCases;

  const newCases =
    dailyCases[dailyCases.length - 1].cases -
    dailyCases[dailyCases.length - 2].cases;

  const {
    lastUpdated,
    cases,
    countMale,
    countFemale,
    countOther,
    ages: ageData
  } = data;

  const recoveryRate = Math.round((recoveredCases / totalCases) * 100);
  const percentWomen = Math.round((countFemale / totalCases) * 100);
  const percentMen = Math.round((countMale / totalCases) * 100);

  const top5inNZ = cases.slice(0, 5);

  const [currentAgeIndex, setcurrentAgeIndex] = useState(0);
  return (
    <div className="container">
      <Head>
        <title>Covid-19 Map NZ - Stats</title>
      </Head>
      <Infographic>
        <Header>{lastUpdated}</Header>
        <Row>
          <Total>
            <h1>
              Total cases <br />
              in New Zealand
            </h1>
            <TotalNumber num={totalCases}>
              {totalCases
                .toString()
                .split("")
                .map((digit, i) => (
                  <span key={i}>{digit}</span>
                ))}
            </TotalNumber>
          </Total>
          <div>
            <Alert>
              <div className="head" />
              <div className="body">
                Alert level<div>{alertlevel}</div>
              </div>
            </Alert>
          </div>
        </Row>
        <Row>
          <Cases>
            <div>
              <strong>{confirmedCases}</strong> Confirmed Cases
            </div>
            <div>
              <strong>{probableCases}</strong> Probable Cases
            </div>
          </Cases>
          <Recovered>
            <div>
              <strong>{recoveredCases}</strong> Recovered
            </div>
            <div>
              Recovery
              <br />
              Rate
              <br />
              <strong>{recoveryRate}%</strong>
            </div>
            <div>
              <People percent={recoveryRate} />
            </div>
          </Recovered>
          <Deaths>
            <strong>{deaths}</strong>Deaths
          </Deaths>
        </Row>
        <Row>
          <div className="flex-mobile">
            <NewCases>
              <strong>+{newCases}</strong> New
              <br />
              cases
              <br />
              <br />
              <img src="/infographic/nznewcases.svg" />
            </NewCases>
            <Transmissions>
              <strong>{comTrans}</strong>
              Cases of <br />
              community <br />
              transmission
              <img src="/infographic/commtrans.svg" />
            </Transmissions>
          </div>
          <div className="flex-mobile">
            <Genders>
              <div className="head">Patient genders</div>
              <div className="genders">
                <div className="female">
                  <div>
                    <strong>{percentWomen}</strong> women
                  </div>
                  <img src="/infographic/female.svg" />
                </div>
                <div className="male">
                  <div>
                    <strong>{percentMen}</strong> men
                  </div>
                  <img src="/infographic/male.svg" />
                </div>
              </div>
              {/* <div className="foot">
                {countMale !== countFemale && (
                  <>
                    More{" "}
                    <strong>
                      {countMale > countFemale ? "males" : "females"}
                    </strong>{" "}
                    have been infected
                  </>
                )}
              </div> */}
            </Genders>
            <Soap>
              <img src="/infographic/Washhands.svg" />
            </Soap>
          </div>

          <Chart>
            <div className="head">COVID-19 cases in New Zealand</div>
            <div className="chart-wrap">
              <ResponsiveContainer>
                <LineChart
                  data={dailyCases}
                  margin={{ left: 10, right: 30, bottom: 20 }}
                >
                  <XAxis
                    dataKey="days"
                    label={{
                      value: "Days since first case detected",
                      position: "bottom"
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Cases",
                      position: "left",
                      offset: -10,
                      angle: -90
                    }}
                  />
                  {/* <Tooltip /> */}
                  {/* <Legend /> */}
                  <Line
                    type="monotone"
                    dataKey="cases"
                    stroke="#51b6b0"
                    strokeWidth={4}
                    dot={false}
                    // activeDot={{ r: 8 }}
                  />
                  {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Chart>
        </Row>
        <Row>
          <Ages>
            <div className="head">Age Groups</div>
            <div className="chart">
              {ageData.map((item, i) => {
                const percent = Math.round(
                  (item.numCases / confirmedCases) * 100
                );
                return (
                  <Age
                    key={i}
                    percent={percent}
                    onMouseOver={() => setcurrentAgeIndex(i)}
                  >
                    {item.title}
                    <strong>{percent}%</strong>
                  </Age>
                );
              })}
            </div>
            <div className="foot">
              {currentAgeIndex !== null && (
                <>
                  <strong>{ageData[currentAgeIndex].title}:</strong>{" "}
                  {ageData[currentAgeIndex].numCases} confirmed{" "}
                  {ageData[currentAgeIndex].numCases === 1 ? "case" : "cases"}
                </>
              )}
              &nbsp;
            </div>
          </Ages>
        </Row>
        <Row>
          <Globe>
            <div className="globe">
              <img src="/infographic/world.svg" />
              <div className="text">
                <strong>{countriesAffected}</strong>
                Countries
                <br />
                Affected
              </div>
            </div>
            <img className="mag" src="/infographic/magnifyingglass.svg" />
          </Globe>
          <Ranking>
            <div className="head">Total cases per 1m population</div>
            {casesPer1M.map((item, i) => (
              <div key={i} className="country">
                <div className="count">{item.numCases}</div>
                <div className="title">{item.title}</div>
              </div>
            ))}
          </Ranking>
          <Clipboard>
            <div>
              <img src="/infographic/clipboard.svg" />
              <div className="head">
                Top 5 NZ
                <br /> affected
                <br /> areas
              </div>
              {top5inNZ.map((item, i) => (
                <div className="location">
                  <div className="count">{item.numCases}</div> {item.location}
                </div>
              ))}
            </div>
          </Clipboard>
        </Row>
        <Footer>
          <div className="head">Sources:</div>
          <a
            href="https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-cases"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ministry of Health
          </a>
          <br />
          <a
            href="https://www.worldometers.info/coronavirus/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Worldometers.info
          </a>
          <img src="/infographic/sth.svg" />
        </Footer>
      </Infographic>
    </div>
  );
};

export default Stats;

const Infographic = styled.div`
  ${({ theme }) => css`
    font-size: 2vw;
    background: #d9f4f3;
    @media (min-width: ${theme.sm}) {
      font-size: 1vw;
    }
  `}
`;

const Header = styled.div`
  ${({ theme }) => css`
    font-size: 1.2em;
    color: white;
    padding: 0 2.5em;
    height: 2.5em;
    display: flex;
    align-items: center;
    background: ${theme.navy};
  `}
`;

const Row = styled.div`
  ${({ theme }) => css`
    padding: 0 2em;
    margin: 2em 0 0;
    justify-content: space-between;
    > div {
      margin-top: 0.7em;
      margin-bottom: 0.7em;
    }
    @media (min-width: ${theme.sm}) {
      display: flex;
      padding: 0 2.5em;
      > div {
        margin-top: 0;
        margin-bottom: 0;
      }
    }
    .flex-mobile {
      display: flex;
      justify-content: space-between;
      align-items: center;

      @media (min-width: ${theme.sm}) {
        display: block;
      }
    }
  `}
`;

const Total = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    font-size: 1em;
    padding-top: 14em;
    @media (min-width: ${theme.sm}) {
      padding-top: 0;
      margin-right: 16em;
      font-size: 1.45em;
    }
    h1 {
      font-weight: normal;
      margin: 0 1em 0 0;
      font-size: 3em;
      font-family: ${theme.fontFancy};
      color: ${theme.teal};
      text-transform: uppercase;
      line-height: 1.1;
    }
  `}
`;

const TotalNumber = styled.div`
  ${({ theme, num }) => css`
    display: flex;
    color: ${theme.green};
    font-size: 5em;
    ${num > 999 &&
      css`
        font-size: 4.5em;
      `}

    span {
      background: white;
      display: inline-block;
      border-radius: 0.1em;
      padding: 0.1em 0.12em;
      margin: 0.03em;
      font-weight: bold;
      line-height: 1;
    }
    @media (min-width: ${theme.sm}) {
      font-size: 6em;
    }
  `}
`;

const Alert = styled.div`
  ${({ theme }) => css`
    width: 21em;
    background: #fff1c1;
    position: absolute;
    top: 0;
    right: 2.5em;

    .head {
      height: 3em;
      background: url(/infographic/alertlevel.svg) no-repeat;
      background-size: cover;
    }
    .body {
      display: grid;
      grid-template-columns: 2fr auto;
      grid-gap: 0 0.5em;
      align-items: center;
      line-height: 1.1;
      color: ${theme.yellow};
      font-size: 3em;
      font-family: ${theme.fontFancy};
      font-weight: normal;
      text-transform: uppercase;
      padding: 0.5em;
      div {
        font-family: ${theme.font};
        font-weight: bold;
        font-size: 3em;
      }
    }

    @media (min-width: ${theme.sm}) {
    }
  `}
`;

const Cases = styled.div`
  ${({ theme }) => css`
    background: #a6e5e3;
    border-radius: 0.3em;
    padding: 0.5em 1em 0.5em 3em;
    font-size: 2.8em;
    color: ${theme.dark};
    position: relative;

    :before {
      content: "";
      position: absolute;
      top: 50%;
      left: -0.5em;
      width: 3em;
      height: 3em;
      background: url(/infographic/cases.svg) center center no-repeat;
      background-size: contain;
      transform: translateY(-50%);
    }
    strong {
      color: ${theme.teal};
      display: inline-block;
      min-width: 2em;
    }
  `}
`;

const Recovered = styled.div`
  ${({ theme }) => css`
    flex: 1;
    background: ${theme.green};
    font-size: 2.2em;
    border-radius: 0.3em;
    color: ${theme.dark};
    display: grid;
    grid-template-columns: 1fr 0.8fr auto;
    grid-gap: 0 0.6em;
    align-items: center;
    justify-content: space-between;
    padding: 0.5em 1em;
    @media (min-width: ${theme.sm}) {
      margin: 0 1em;
    }
    > div:first-child {
      border-right: solid ${theme.dark} 0.1em;
      padding-right: 0.6em;
      strong {
        display: block;
        line-height: 1;
        font-size: 2.3em;
        color: white;
      }
    }
    > div:nth-child(2) {
      font-size: 0.8em;
      line-height: 1;
      strong {
        margin-top: 0.2em;
        display: block;
        line-height: 1;
        font-size: 1.9em;
        color: white;
      }
    }
    > div:last-child {
      display: flex;
      flex-wrap: wrap;
    }
  `}
`;

const People = ({ percent }) => {
  const peopleToFill = Math.floor(percent / 10);
  const partPersonToFill = (percent % 10) / 10;
  return (
    <>
      {[...Array(10)].map((item, i) => {
        // console.log(i);
        let fill;
        if (i === peopleToFill) {
          fill = partPersonToFill;
        } else if (i < peopleToFill) {
          fill = 1;
        } else {
          fill = 0;
        }
        // console.log(fill);
        return (
          <Person key={i} fill={fill}>
            <div className="fill"></div>
            <div
              dangerouslySetInnerHTML={{
                __html: require(`../public/infographic/recovery.svg?include`)
              }}
            />
          </Person>
        );
      })}
    </>
  );
};

const Person = styled.div`
  ${({ theme, fill }) => css`
    display: inline;
    width: 18%;
    margin: 0.06em;
    position: relative;
    overflow: hidden;
    background: ${theme.dark};
    .fill {
      position: absolute;
      z-index: 1;
      bottom: 0;
      left: 0;
      width: 100%;
      height: ${fill * 100}%;
      background: white;
    }
    svg {
      position: relative;
      z-index: 2;
      width: 100%;

      display: block;
    }
  `}
`;

const Deaths = styled.div`
  ${({ theme }) => css`
    padding: 0.5em 1em;
    background: ${theme.green};
    font-size: 2.2em;
    border-radius: 0.3em;
    color: ${theme.dark};
    strong {
      display: block;
      line-height: 1;
      font-size: 2.3em;
      color: white;
    }
  `}
`;

const NewCases = styled.div`
  ${({ theme }) => css`
    font-family: ${theme.fontFancy};
    font-size: 1.9em;
    text-transform: uppercase;
    color: ${theme.dark};
    line-height: 1.1;
    position: relative;
    strong {
      display: block;
      font-size: 3em;
      color: ${theme.green};
      margin-bottom: 0.1em;
    }
    img {
      width: 6em;
      position: absolute;
      top: 0em;
      left: 5.4em;
    }
  `}
`;

const Transmissions = styled.div`
  ${({ theme }) => css`
    padding: 2em 1.3em 1.3em;
    background: white;
    border-radius: 0.4em;
    font-family: ${theme.fontFancy};
    font-size: 1.9em;
    text-transform: uppercase;
    color: ${theme.dark};
    line-height: 1.1;
    position: relative;
    @media (min-width: ${theme.sm}) {
      margin-top: 2em;
    }
    strong {
      display: block;
      font-size: 3em;
      color: ${theme.yellow};
      margin-bottom: 0.1em;
    }
    img {
      width: 6em;
      position: absolute;
      top: 0.5em;
      left: 3.9em;
    }
  `}
`;

const Genders = styled.div`
  ${({ theme }) => css`
    color: ${theme.dark};
    @media (min-width: ${theme.sm}) {
      /* font-size: 6em; */
      margin: 0 3.5em 1.2em;
    }
    .head {
      font-family: ${theme.fontFancy};
      font-size: 2.1em;
      text-transform: uppercase;
      margin-bottom: 0.3em;
    }
    .genders {
      display: flex;
    }
    .female,
    .male {
      position: relative;
      div {
        position: absolute;
        font-size: 1.5em;
        color: white;
        text-align: center;
        line-height: 1.1;
      }
      strong {
        display: block;
        font-size: 1.9em;
        font-family: ${theme.fontFancy};
        :after {
          content: "%";
          font-size: 0.6em;
          position: relative;
          top: -0.5em;
          left: 0.1em;
        }
      }
    }
    .female {
      margin-right: 2em;
      div {
        top: 1.4em;
        left: 1em;
      }
      img {
        height: 13.5em;
      }
    }
    .male {
      div {
        top: 3.2em;
        left: 0.8em;
      }
      img {
        width: 11em;
      }
    }
    .foot {
      font-size: 1.5em;
      strong {
        font-weight: normal;
        color: ${theme.teal};
      }
    }
  `}
`;

const Soap = styled.div`
  ${({ theme }) => css`
    text-align: right;
    /* position: relative; */
    /* left: 2em; */
    /* @media (min-width: ${theme.sm}) {
    } */
    img {
      width: 25em;
    }
  `}
`;

const Chart = styled.div`
  ${({ theme }) => css`
    background: white;
    border-radius: 0.5em;
    padding: 2.5em 2em;
    .head {
      text-align: center;
      color: ${theme.dark};
      font-family: ${theme.fontFancy};
      font-size: 2.1em;
      text-transform: uppercase;
      margin-bottom: 1.2em;
      line-height: 1.1;
    }
    .chart-wrap {
      width: 40em;
      height: 25em;
    }
  `}
`;

const Ages = styled.div`
  ${({ theme }) => css`
    width: 100%;
    .head {
      color: ${theme.dark};
      font-family: ${theme.fontFancy};
      font-size: 2.1em;
      text-transform: uppercase;
      margin-bottom: 0.5em;
      line-height: 1.1;
    }
    .chart {
      display: flex;
      flex-direction: column;
      height: 90em;
      @media (min-width: ${theme.sm}) {
        flex-direction: row;
        height: auto;
      }
    }
    .foot {
      display: none;
      background-color: white;
      padding: 0.6em 0.8em;
      font-size: 1.6em;
      color: ${theme.dark};
      strong {
        display: block;
        color: ${theme.green};
      }
    }
  `}
`;

const Age = styled.div`
  ${({ theme, percent }) => css`
    cursor: pointer;
    font-size: 2em;
    color: white;
    text-align: center;
    height: ${percent}%;
    display: flex;
    align-items: center;
    justify-content: center;

    line-height: 1.1;
    min-height: 2.6em;
    min-width: 2.6em;
    @media (min-width: ${theme.sm}) {
      font-size: 1.2em;
      width: ${percent}%;
      height: 9em;
      flex-direction: column;
    }
    strong {
      font-weight: normal;
      opacity: 0.9;
      display: block;
      :before {
        content: " - ";
        margin-left: 0.4em;
        @media (min-width: ${theme.sm}) {
          display: none;
        }
      }
    }
    :nth-child(1) {
      background-color: ${theme.teal};
    }
    :nth-child(2) {
      background-color: ${theme.dark};
    }
    :nth-child(3) {
      background-color: ${theme.green};
    }
    :nth-child(4) {
      background-color: #317c3f;
    }
    :nth-child(5) {
      background-color: #956828;
    }
    :nth-child(6) {
      background-color: #d4b074;
    }
    :nth-child(7) {
      background-color: ${theme.yellow};
    }
    :nth-child(8) {
      background-color: #e98e23;
    }
    :nth-child(9) {
      background-color: #af5434;
    }
    :nth-child(10) {
      background-color: #833f24;
    }
  `}
`;

const Globe = styled.div`
  ${({ theme }) => css`
    position: relative;

    font-size: 1.3em;
    @media (min-width: ${theme.sm}) {
      font-size: 1em;
    }

    .globe {
      position: relative;
      left: 1em;
      width: 25em;
      margin: 0 auto;
      display: block;
    }
    .mag {
      width: 25em;
      position: absolute;
      bottom: 0;
      left: -2.5em;
      display: none;
      @media (min-width: ${theme.sm}) {
        display: block;
      }
    }
    .text {
      position: absolute;
      top: 2em;
      left: 1.6em;
      font-size: 2.4em;
      font-family: ${theme.fontFancy};
      text-align: center;
      line-height: 1.1;
      color: white;
      text-transform: uppercase;
    }
    strong {
      display: block;
      font-size: 2.8em;
    }
  `}
`;

const Ranking = styled.div`
  ${({ theme }) => css`
    .head {
      color: ${theme.dark};
      font-size: 2em;
      text-transform: uppercase;
      font-family: ${theme.fontFancy};
      margin-bottom: 0.5em;
    }
    .country {
      color: ${theme.teal};
      background: white;
      margin-bottom: 0.75em;
      border-radius: 0.5em;
      display: flex;
      align-items: center;
      overflow: hidden;
    }
    .count {
      background: ${theme.green};
      color: white;
      text-align: center;
      font-family: ${theme.fontFancy};
      font-size: 2.6em;
      padding: 0.2em;
      width: 4em;
    }
    .title {
      padding: 0 1em;
      font-size: 2.8em;
      font-weight: bold;
    }
  `}
`;

const Clipboard = styled.div`
  ${({ theme }) => css`
    margin: 3em auto 0 !important;
    @media (min-width: ${theme.sm}) {
      width: 30em;
      margin: 0 !important;
      width: 20em;
    }
    > div {
      background: #a6e5e3;
      border-radius: 0.5em;
      position: relative;
      margin-top: 5em;
      padding: 2.5em 2em 2em;
      @media (min-width: ${theme.sm}) {
        margin-top: 3em;
      }
    }
    img {
      position: absolute;
      top: -2.5em;
      left: 50%;
      transform: translateX(-50%);
      width: 8.5em;
    }
    .head {
      color: ${theme.dark};
      font-size: 2em;
      text-transform: uppercase;
      font-family: ${theme.fontFancy};
      line-height: 1.1;
      margin-bottom: 0.6em;
      br {
        display: none;
        @media (min-width: ${theme.sm}) {
          display: block;
        }
      }
    }
    .location {
      font-size: 1.7em;
      display: flex;
      align-items: center;
      margin-bottom: 0.3em;
    }
    .count {
      background: white;
      border-radius: 50%;
      width: 2em;
      height: 2em;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      margin-right: 0.5em;
      color: ${theme.green};
    }
  `}
`;

const Footer = styled.div`
  ${({ theme }) => css`
    position: relative;
    background: ${theme.dark};
    padding: 2em 2.5em 3em;
    line-height: 1.5;
    .head {
      font-size: 1.5em;
      color: ${theme.green};
    }
    a {
      font-size: 1.5em;
      color: white;
    }
    img {
      position: absolute;
      right: 2.5em;
      bottom: 0;
      width: 16em;
    }
  `}
`;

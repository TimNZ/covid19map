import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import styled, { css, withTheme } from "styled-components";
import Row from "../components/Row";
import TotalCases from "../components/TotalCases";
import Cases from "../components/Cases";
import NewCases from "../components/NewCases";
import Deaths from "../components/Deaths";
import Recovered from "../components/Recovered";
import Hospital from "../components/Hospital";
import Genders from "../components/Genders";
import TotalChart from "../components/TotalChart";
import DailyChart from "../components/DailyChart";
import Ages from "../components/Ages";
import Terms from "../components/Terms";
import TransmissionChart from "../components/TransmissionChart";
import Tests from "../components/Tests";
import Slider from "../components/Slider";
import Reveal from "../components/Reveal";
import LocationBar from "../components/LocationBar";
import LocationDetails from "../components/LocationDetails";
import Legend from "../components/Legend";
import Alert from "../components/Alert";
import * as gtag from "../lib/gtag";
// import { Element, animateScroll as scroll, scroller } from "react-scroll";

// import { useTransition, animated } from "react-spring";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
});

const center = { lat: -41.0495881, lng: 173.2682669 };
const zoom = 6;
const outerBounds = [
  [-28.00178557, 160.67596054],
  [-51.57478991, 183.27441406],
];
const innerBounds = [
  [-34.76671725, 166.2361908],
  [-47.30251579, 177.66849518],
];

const MapView = ({ data = {}, news = {}, error, theme }) => {
  const infoRef = useRef();
  const detailsRef = useRef();

  const {
    locations,
    clusters,
    asAt,
    maxCases,
    history,
    summary,
    transmissions,
    testingData,
    genders,
    ages,
    regionAgesGenders,
    regionOverseas,
  } = data;
  const {
    combinedTotal,
    confirmedTotal,
    probableTotal,
    combined,
    deathsTotal,
    recoveredTotal,
    hospitalTotal,
  } = summary ? summary[summary.length - 1] : {};

  const [detailsOpened, setDetailsOpened] = useState(false);
  const [location, setLocation] = useState("");
  const [termsOpened, setTermsOpened] = useState(false);
  const [lv3Opened, setLv3Opened] = useState(false);

  const showLocation = (name) => {
    if (name) {
      setLocation(name);
    }
    setDetailsOpened(name);
  };

  const locationBarClick = (name) => {
    showLocation(name);
    window.scrollTo(0, 0);
    infoRef.current.scrollTo(0, 0);
  };

  // useEffect(() => {
  //   if (detailsRef.current) {
  //     if (window.scrollY > detailsRef.current.offsetTop) {
  //       window.scrollTo(0, detailsRef.current.offsetTop - 20);
  //     }
  //   }
  // }, [view]);

  // useEffect(() => {
  //   const options = {
  //     duration: 800,
  //     delay: 0,
  //     smooth: "easeInOutQuart",
  //     offset: -10,
  //   };
  //   // mobile
  //   // scroller.scrollTo(location, options);
  //   // desktop
  //   scroller.scrollTo(location, { ...options, containerId: "info" });
  // }, [location]);

  // const refs = locations?.map((item, i) => useRef());

  // useEffect(() => {
  //   if (location) {
  //     window.scrollTo(0, 0);
  //     infoRef.current.scrollTo(0, 0);
  //   }
  // }, [location]);

  // const transitions = useTransition(location, null, {
  //   from: { position: "absolute", opacity: 0 },
  //   enter: { opacity: 1 },
  //   leave: { opacity: 0 },
  // });

  // console.log(transitions);

  return (
    <Wrap>
      <Main>
        <Map
          center={center}
          zoom={zoom}
          markers={locations}
          clusters={clusters}
          onMarkerClick={showLocation}
          maxCases={maxCases}
          outerBounds={outerBounds}
          innerBounds={innerBounds}
          location={location}
        />
      </Main>
      <Info ref={infoRef} id="info">
        <div style={{ width: "100%", overflow: "hidden" }}>
          <Summary visible={!detailsOpened}>
            <Alert data={news.news} />

            <Logo>
              <img className="logo" src={require(`../public/logo.svg`)} />
              <div>
                <h1>Covid19map.nz</h1>
                <h2>Current Cases in New Zealand</h2>
              </div>
            </Logo>
            {locations && (
              <>
                <div className="meta">
                  <div>
                    <small>{asAt}</small>
                    <br />
                    <small>
                      Source:{" "}
                      <a
                        href="https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-cases"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ministry of Health
                      </a>
                    </small>
                  </div>
                  <div>
                    <Refresh
                      type="button"
                      onClick={() => {
                        gtag.event("Refresh");
                        window.location = `/?${new Date().getTime()}`;
                      }}
                    >
                      <div
                        className="inline-icon"
                        dangerouslySetInnerHTML={{
                          __html: require(`../public/refresh.svg?original&include`),
                        }}
                      />
                      Refresh
                    </Refresh>
                  </div>
                </div>
                <Share>
                  <small>Follow us</small>
                  <a
                    href="https://www.facebook.com/covid19mapnz"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => gtag.event("Follow", "", "Facebook")}
                  >
                    <img src={require(`../public/Facebook.svg`)} /> Facebook
                  </a>
                  <a
                    href="https://www.instagram.com/covid19mapnz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => gtag.event("Follow", "", "Instagram")}
                  >
                    <img src={require(`../public/IG.svg`)} /> Instagram
                  </a>
                </Share>
                <Row>
                  <TotalCases
                    total={combinedTotal - recoveredTotal - deathsTotal}
                  />
                </Row>

                <Row>
                  <Feature>
                    <Reveal
                      open={lv3Opened}
                      toggle={() => setLv3Opened(!lv3Opened)}
                      button={
                        <Heading className="head">
                          What does alert level 3 mean?{" "}
                          <div
                            className="icon"
                            dangerouslySetInnerHTML={{
                              __html: require(`../public/arrow.svg?include`),
                            }}
                          />
                        </Heading>
                      }
                      onToggle={() => {
                        gtag.event("Level 3 slideshow");
                      }}
                    >
                      <Slider full centerPadding="38px" padding>
                        {[...Array(10)].map((item, i) => (
                          // <img key={i} src={`/What L3 means/Lv3 ${i}.svg`} />
                          <img
                            key={i}
                            src={require(`../public/What L3 means/Lv3 ${i}.svg`)}
                          />
                        ))}
                      </Slider>
                    </Reveal>
                  </Feature>
                </Row>

                <Row>
                  <Cases
                    confirmedTotal={confirmedTotal}
                    probableTotal={probableTotal}
                    combinedTotal={combinedTotal}
                  />
                </Row>
                <Row>
                  <div className="grid">
                    <NewCases combined={combined} />
                    <Deaths deathsTotal={deathsTotal} />
                  </div>
                </Row>
                <Row>
                  <Recovered
                    recovered={recoveredTotal}
                    combined={combinedTotal}
                  />
                </Row>
                <Row>
                  <div className="grid">
                    <Hospital hospitalTotal={hospitalTotal} />
                    {genders && <Genders genders={genders} />}
                  </div>
                </Row>
                {testingData && (
                  <Row>
                    <Tests tests={testingData.yesterdayTotal} />
                  </Row>
                )}
                <Row>
                  <Slider full>
                    <DailyChart summary={summary} />
                    <TotalChart summary={summary} />
                  </Slider>
                </Row>

                <Row>
                  <TransmissionChart data={transmissions} />
                </Row>
                {/* <Bar>
                  Location
                  <span>Daily cases</span>
                </Bar> */}

                <Heading>Regional data</Heading>

                <Legend />

                {locations?.map((item, i) => (
                  <div key={i} onClick={() => setLocation(item.location)}>
                    <LocationBar
                      location={item}
                      history={history[item.name]}
                      onClick={locationBarClick}
                    />
                  </div>
                ))}
                {ages && (
                  <Row>
                    <Ages ages={ages} />
                  </Row>
                )}
                <Terms
                  termsOpened={termsOpened}
                  setTermsOpened={setTermsOpened}
                />
              </>
            )}
            {error && (
              <Error type="button" onClick={() => window.location.reload()}>
                Having trouble retrieving data, please <strong>refresh</strong>.
              </Error>
            )}
          </Summary>
          <Details ref={detailsRef} visible={detailsOpened}>
            <BackButton
              type="button"
              onClick={() => {
                showLocation("");
              }}
            >
              <div
                className="icon"
                dangerouslySetInnerHTML={{
                  __html: require(`../public/arrow.svg?include`),
                }}
              />{" "}
              Back
            </BackButton>

            {locations && (
              <LocationDetails
                // potential performance impact
                location={locations.find((x) => x.name === location)}
                data={[
                  regionAgesGenders[location],
                  regionOverseas[location],
                  history[location],
                ]}
              />
            )}
          </Details>
        </div>
      </Info>
    </Wrap>
  );
};

export default withTheme(MapView);

const Wrap = styled.div`
  ${({ theme }) => css`
    @media (min-width: ${theme.sm}) {
      display: flex;
    }
  `}
`;

const Main = styled.div`
  flex: 1;
`;

const Info = styled.div`
  ${({ theme }) => css`
    position: relative;
    font-size: 2vw;
    color: ${theme.dark};
    box-sizing: border-box;

    background: ${theme.light};
    @media (min-width: ${theme.sm}) {
      font-size: 0.55em;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      height: 100vh;
      width: 450px;
    }
    a {
      color: ${theme.dark};
    }
    hr {
      border: solid 2px ${theme.light};
      border-width: 0 0 1px 0;
      margin: 1em 0;
    }
  `}
`;

const Summary = styled.div`
  ${({ theme, visible }) => css`
    transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    padding: 20px;
    opacity: ${visible ? 1 : 0.5};
    h2 {
      font-size: 18px;
      color: ${theme.teal};
      margin: 0;
      line-height: 1.1;
      @media (min-width: ${theme.md}) {
        font-size: 23px;
      }
    }
    .total {
      margin-bottom: 1.5em;
    }
    h2 + .cases-breakdown {
      margin-top: 1px;
    }
    .cases-breakdown + h2 {
      margin-top: 0.5em;
    }
    .cases-breakdown {
      display: flex;
      justify-content: space-between;
    }
    h2.split {
      display: flex;
      justify-content: space-between;
    }
    .meta {
      font-size: 2em;
      margin: 0.5em 0;
      display: flex;
      justify-content: space-between;
    }
  `}
`;

const Logo = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;

    img {
      width: 6em;
      margin-right: 1.5em;
    }
    h1 {
      white-space: nowrap;
      font-size: 4.5em;
      color: ${theme.teal};
      margin: 0;

    }
    h2 {
      white-space: nowrap;
      font-size: 2em;
      color: ${theme.teal};
      margin: 0;
      line-height: 1.1;
      /* @media (min-width: ${theme.md}) {
        font-size: 18px;
      } */
    }
  `}
`;

const Details = styled.div`
  ${({ theme, visible }) => css`
    padding: 20px;
    transition: 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translateX(${visible ? "0%" : "-100%"});
    min-height: 100vh;
    background: ${theme.light};
    padding: 1em;
    font-size: 2em;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  `}
`;

const BackButton = styled.button`
  ${({ theme }) => css`
    background: none;
    border: none;
    color: ${theme.dark};
    margin-bottom: 1.5em;
    padding: 0;
    font-size: 0.8em;
    .icon {
      transform: rotate(180deg);
      display: inline-block;
      /* height: 1.5em; */
      width: 0.5em;
      position: relative;
      top: -0.15em;
    }
  `}
`;

const Share = styled.div`
  ${({ theme }) => css`
    margin-bottom: 0.8em;
    font-size: 2em;
    a {
      font-size: 0.8em;
      text-decoration: none;
      color: white;
      background: ${theme.navy};
      border-radius: 2em;
      padding: 0.26em 0.5em;
      margin-left: 0.5em;
    }
    img {
      height: 1.2em;
      vertical-align: middle;
      margin: 0 3px;
      position: relative;
      top: -1px;
    }
  `}
`;

const Error = styled.button`
  ${({ theme }) => css`
    font-size: 2em;
    margin-top: 50px;
    text-align: center;
    padding: 0 40px;
    border: none;
    background: none;
    strong {
      color: ${theme.teal};
    }
  `}
`;

const Refresh = styled.button`
  ${({ theme }) => css`
    border: none;
    background: ${theme.green};
    color: white;
    font-size: 0.8em;
    padding: 0.1em 0.5em;
    border-radius: 1em;
    .inline-icon {
      position: relative;
      top: 1px;
      width: 1em;
      height: 1em;
      margin-right: 0.2em;
    }
  `}
`;

const Heading = styled.div`
  ${({ theme }) => css`
    color: ${theme.dark};
    font-family: ${theme.fontFancy};
    font-size: 2.1em;
    text-transform: uppercase;
    margin-top: 1.6em;
    margin-bottom: 0.3em;
    line-height: 1.1;
  `}
`;

const Feature = styled.div`
  ${({ theme }) => css`
    border: solid ${theme.green} 0.4em;
    border-radius: 0.5em;
    padding: 1.3em 0 1.1em;
    background-color: ${theme.green};
    .head {
      color: white;
      font-size: 2em;
      margin: 0 0.8em;
    }
    .slick-dots li.slick-active button:before {
      color: white;
    }
  `}
`;

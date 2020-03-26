import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import styled, { css } from "styled-components";
import scraper from "../scraper";

const Map = dynamic(() => import("../components/Map"), {
  ssr: false
});

const Home = ({ data }) => {
  const {
    confirmedCases,
    probableCases,
    recoveredCases,
    toBeLocated,
    alertLevel
  } = data.staticData;
  const totalCases = confirmedCases + probableCases;

  const { lastUpdated, locations } = data;
  const center = { lat: -41.0495881, lng: 173.2682669 };
  const zoom = 6;

  const [view, setView] = useState("");
  const [location, setLocation] = useState();
  const [termsOpened, setTermsOpened] = useState(false);

  return (
    <div className="container">
      <Head>
        <title>Covid-19 Map NZ</title>
      </Head>
      <Wrap>
        <Main>
          <Map
            center={center}
            zoom={zoom}
            markers={locations}
            currentView={view}
          />
        </Main>
        <Info>
          <Summary>
            <Alert
              href="https://covid19.govt.nz/assets/COVID_Alert-levels_v2.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Alert Level {alertLevel}
            </Alert>
            <Logo>
              <img className="logo" src="/logo.svg" />
              <div>
                <h1>Covid-19 Map</h1>
                <h2>Current Cases in New Zealand</h2>
              </div>
            </Logo>
            <div className="meta">
              <small>{lastUpdated}</small>
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

            <Share>
              <small>Share:</small>
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=https://covid19map.nz/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/fb.svg" />
              </a>
              <a
                href="http://www.twitter.com/share?url=https://covid19map.nz/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/tw.svg" />
              </a>
            </Share>

            {/* <Link href="/stats">
              <a>Stats</a>
            </Link> */}
            <StatsLink href="/stats">
              View Covid-19 Stats
              <div
                className="inline-icon"
                dangerouslySetInnerHTML={{
                  __html: require(`../public/arrow.svg?include`)
                }}
              />
            </StatsLink>

            <div className="total">
              <h2 className="split">
                Total number of cases <span>{totalCases}</span>
              </h2>

              {/* <div className="cases-breakdown">
                Confirmed cases <span>{confirmedCases}</span>
              </div>
              <div className="cases-breakdown">
                Probable cases <span>{probableCases}</span>
              </div> */}

              <h2 className="split">
                Recovered <span>{recoveredCases}</span>
              </h2>

              {/* {toBeLocated > 0 && (
                <div>
                  <small>
                    Information on {toBeLocated} new cases yet to be released
                  </small>
                </div>
              )} */}
            </div>
            <SummaryTable cols={2}>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Case/s</th>

                  {/* <th>Recovered</th>
                    <th>Deaths</th> */}
                </tr>
              </thead>
              <tbody>
                {locations.map((item, i) => (
                  <tr key={i}>
                    <td>{item.location}</td>
                    <td>{item.totalCases}</td>
                  </tr>
                ))}
              </tbody>
            </SummaryTable>
            <p>
              <small>
                We are working with the official information released by the{" "}
                <a
                  href="https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-cases"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ministry of Health
                </a>
                . Confirmed cases are listed by District Health Board regions.
              </small>
            </p>

            <p>
              <small>
                Any feedback, ideas, or if you'd like to help, please contact{" "}
                <a href="mailto:contact@covid19map.nz">contact@covid19map.nz</a>{" "}
                |{" "}
                <a
                  href="https://github.com/dixoncheng/covid19map"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </a>
                <br />
                <LinkButton
                  type="button"
                  onClick={() => setTermsOpened(!termsOpened)}
                >
                  Disclaimer and Terms of use
                </LinkButton>
              </small>
            </p>
            {termsOpened && (
              <div>
                <p>
                  <small>
                    Covid-19 Map NZ sources its cases directly from the official{" "}
                    <a
                      href="https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-cases"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ministry of Health page
                    </a>
                    . We are in no way responsible for the accuracy of this
                    information.
                  </small>
                </p>
                <p>
                  <small>
                    Covid-19 Map NZ disclaims and excludes all liability for any
                    claim, loss, demand or damages of any kind whatsoever
                    (including for negligence) arising out of or in connection
                    with the use of either this website or the information,
                    content or materials included on this site or on any website
                    we link to.
                  </small>
                </p>
                <p>
                  <small>
                    By viewing and using the site, you will be deemed to agree
                    to these Terms of use.
                  </small>
                </p>
              </div>
            )}
            <p className="made-by">
              <small>Made by</small>{" "}
              <a
                href="https://www.linkedin.com/in/emilywongnz/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/linkedin.svg" />
              </a>{" "}
              <a
                href="https://www.linkedin.com/in/dixon-cheng/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/linkedin.svg" />
              </a>
            </p>
          </Summary>
        </Info>
      </Wrap>
    </div>
  );
};

export async function getStaticProps(context) {
  const data = await scraper();
  return {
    props: {
      data
    }
  };
}

export default Home;

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
    color: ${theme.dark};
    box-sizing: border-box;
    padding: 20px;
    background: ${theme.light};
    @media (min-width: ${theme.sm}) {
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      height: 100vh;
      width: 375px;
    }
    a {
      color: ${theme.dark};
    }
  `}
`;

const Summary = styled.div`
  ${({ theme }) => css`
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
      margin: 0.5em 0;
    }
    .made-by {
      small {
        position: relative;
        top: 1px;
      }
      img {
        width: 16px;
        vertical-align: middle;
      }
    }
  `}
`;

const Logo = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;

    img {
      width: 42px;
      margin-right: 15px;
      @media (min-width: ${theme.md}) {
        width: 60px;
      }
    }
    h1 {
      white-space: nowrap;
      font-size: 34px;
      color: ${theme.teal};
      margin: 0;
      @media (min-width: ${theme.md}) {
        font-size: 38px;
      }
    }
    h2 {
      white-space: nowrap;
      font-size: 16px;
      color: ${theme.teal};
      margin: 0;
      line-height: 1.1;
      @media (min-width: ${theme.md}) {
        font-size: 18px;
      }
    }
  `}
`;

const SummaryTable = styled.table`
  ${({ theme, cols }) => css`
    width: 100%;
    border-collapse: collapse;

    /* tr:hover td {
      transition: 0.3s ease;
      background: #bee1dd;
    } */
    td,
    th {
      line-height: 1.2;
      text-align: center;
      font-size: 16px;
      padding: 7px;
      &:first-child {
        text-align: left;
        padding-left: 15px;
      }
      ${cols === 2 &&
        css`
          font-size: 20px;
          &:last-child {
            text-align: right;
            padding-right: 15px;
          }
        `}
    }
    th {
      background: ${theme.green};
      color: white;
    }
    td {
      /* cursor: pointer; */
      /* text-decoration: underline; */
      background: white;
      border-top: solid ${theme.light} 4px;
    }
    .inline-icon {
      opacity: 0.3;
    }
  `}
`;

const Details = styled.div``;

const Bar = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    background: ${theme.green};
    color: white;
    padding: 7px 15px;
    @media (min-width: ${theme.md}) {
      font-size: 24px;
    }
    span {
      text-align: right;
    }
  `}
`;

const Location = styled.button`
  ${({ theme }) => css`
    text-decoration: underline;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    background: white;
    padding: 7px 15px;
    margin-top: 4px;
    border: none;
    width: 100%;
    transition: 0.3s ease;
    color: ${theme.dark};
    /* @media (min-width: ${theme.md}) {
      font-size: 24px;
    } */
    :hover {
      background: #bee1dd;
    }
    span {
        width: 90px;
        text-align: center;
        :first-child {
            flex: 1;
            text-align: left;
        }
        /* :last-child {
            text-align: right;
        } */
    }
  `}
`;

const Case = styled.div`
  ${({ theme, status }) => css`
    font-size: 14px;
    margin-top: 4px;
    h3 {
      margin: 0;
      font-size: 14px;
      color: white;
      background: ${theme.teal};
      padding: 2px 15px;
      ${status === "Probable" &&
        css`
          background: ${theme.green};
        `}
    }
    .age {
      color: ${theme.teal};
      ${status === "Probable" &&
        css`
          color: ${theme.green};
        `}
    }
    .details {
      background: white;
      padding: 10px 15px;
    }
  `}
`;

const BackButton = styled.button`
  ${({ theme }) => css`
    background: none;
    border: none;
    color: ${theme.dark};
    margin-bottom: 1.5em;
    padding: 0;
    font-size: 14px;
  `}
`;

const Alert = styled.a`
  padding: 5px 20px;
  color: white !important;
  font-size: 24px;
  background: #ffcd38 url(/alert.svg) 174px 50% no-repeat;
  margin: -20px -20px 20px;
  display: block;
`;

const LinkButton = styled.button`
  ${({ theme }) => css`
    border: none;
    background: none;
    display: inline;
    padding: 0;
    text-decoration: underline;
    color: ${theme.dark};
  `}
`;

const StatsLink = styled.a`
  ${({ theme }) => css`
    display: flex;
    text-decoration: none;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    background: ${theme.teal};
    color: white !important;
    padding: 7px 15px;
    margin-bottom: 0.8em;
    color: white;
    border-radius: 3px;
    @media (min-width: ${theme.md}) {
      font-size: 20px;
    }
  `}
`;

const Share = styled.div`
  margin-bottom: 0.8em;
  img {
    height: 20px;
    vertical-align: middle;
    margin: 0 3px;
    position: relative;
    top: -1px;
  }
`;

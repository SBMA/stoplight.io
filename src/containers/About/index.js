import React from 'react';
import { withRouteData } from 'react-static';

import '@styles/about.scss';

import ActionBar from '@components/ActionBar';
import Hero from '@components/Hero';
import Section from '@components/Section';

const Quote = ({ image, company, quote, author, role }) => {
  return (
    <div className="py-8 px-4 shadow bg-white rounded-lg flex flex-col">
      <div className="px-2 py-2 pb-8 flex justify-center items-start">
        <img src={image} alt={company} />
      </div>

      <div className="px-4">
        <p className="leading-loose pb-6">{`"${quote}"`}</p>
        <div className="font-bold pb-1 uppercase text-blue">{author}</div>
        <div>
          {company}, {role}
        </div>
      </div>
    </div>
  );
};

const Member = ({ image, name, role, twitter }) => {
  return (
    <div className="text-center shadow bg-white py-10 px-4 w-64 rounded-lg">
      <div
        className="-mt-20 mx-auto rounded-full bg-cover shadow-sm border-grey border h-32 w-32 mb-10"
        style={{
          backgroundImage: `url(${image})`,
        }}
        alt={name}
      />

      <div className="font-bold uppercase text-green">{name}</div>
      {role && <div className="pt-2">{role}</div>}
      {twitter && (
        <div className="pt-2">
          <a href={`https://twitter.com/${twitter}`}>{twitter}</a>
        </div>
      )}
    </div>
  );
};

const Press = ({ image, description, publication, href }) => {
  return (
    <div className="py-8 px-6 shadow bg-white rounded-lg flex flex-col text-center">
      <div className="px-2 py-2 pb-8 flex justify-center items-start">
        <img src={image} alt={publication} />
      </div>

      <div className="px-4">
        <a href={href} target="_blank" className="font-semibold">
          {description}
        </a>
      </div>
    </div>
  );
};

class About extends React.Component {
  render() {
    const {
      color,
      hero,
      quotes = [],
      team = [],
      actionBar = {},
      press = [],
      investors = [],
    } = this.props;

    return (
      <div>
        <Hero key="hero" bgColor={color} {...hero} containerClassName="pb-24" />

        {team.length ? (
          <section className="bg-grey-lightest relative z-5" style={{ marginTop: -50 }}>
            <div className="container flex flex-wrap justify-center text-center">
              {team.map((member, index) => (
                <div key={index} className="mx-10 mb-48 -mt-24">
                  <Member {...member} />
                </div>
              ))}
            </div>

            {actionBar && actionBar.enabled ? (
              <div className="pb-40 -mt-10">
                <ActionBar className="bg-white" {...actionBar} />
              </div>
            ) : null}
          </section>
        ) : null}

        {press.length ? (
          <Section key="press">
            <div className="container">
              <h2 className="text-center mb-20 text-3xl md:mb-14">In the Press</h2>

              <div className="flex justify-center flex-wrap items-center -px-4 -mb-12">
                {press.map((quote, key) => {
                  return (
                    <div key={key} className="w-1/4 px-6 mb-12">
                      <Press {...quote} />
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>
        ) : null}

        {quotes.length ? (
          <Section key="businesses" bgClassName="bg-grey-lightest">
            <div className="container">
              <h2 className="text-center mb-20 text-3xl md:mb-14">
                Businesses Are Loving Stoplight
              </h2>

              <div className="flex justify-center flex-wrap items-center -px-4 -mb-12">
                {quotes.map((quote, key) => {
                  return (
                    <div key={key} className="w-1/3 px-6 mb-12">
                      <Quote {...quote} />
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>
        ) : null}

        {investors.length ? (
          <Section key="investors">
            <div className="container">
              <h2 className="text-center mb-20 text-3xl md:mb-14">Our Investors</h2>

              <div className="flex justify-center flex-wrap items-center -mx-10">
                {investors.map((investor, key) => {
                  return (
                    <div key={key} className="p-10 text-center">
                      <img className="h-24" src={investor.image} alt={investor.name} />
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>
        ) : null}
      </div>
    );
  }
}

export default withRouteData(About);

import cn from 'classnames';
import * as React from 'react';

import { Container } from '../Container';
import { Icon } from '../Icon';
import { Link } from '../Link';
import { Section } from '../Section';

export interface IDocPlanFeature {
  title: string;
  bold?: boolean;
  toolTip?: string;
  plans?: Array<IDocPlan['title']>;
}

export interface IDocPlan {
  title: string;
  price: string;
  domains: string;
  link?: string;
}

export interface IDocPlans {
  title: string;
  description: string;
  features: IDocPlanFeature[];
  plans: IDocPlan[];
  buttonUrl: string;
  buttonText: string;
}

export const DocPlans: React.FunctionComponent<IDocPlans> = ({
  title,
  description,
  features,
  plans,
  buttonUrl,
  buttonText,
}) => {
  return (
    <Section id="docPlans" noPaddingT>
      <Container className="mx-auto">
        <div className="mb-20 text-center">
          <div className="text-4xl font-bold">{title}</div>

          <div
            className="max-w-lg mx-auto mt-10 text-xl leading-loose opacity-50"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        <div className="container w-3/4 bg-white shadow-lg">
          <table className="bg-white hubs-table">
            <thead>
              <tr>
                <th></th>
                {plans &&
                  plans.length > 0 &&
                  plans.map((plan, index) => (
                    <th key={index}>
                      <div className="sticky flex flex-col pb-0 bg-white">
                        <p
                          className={cn({
                            'text-xl font-bold text-green ': plan.title === 'Free',
                            'text-xl font-bold text-indigo': plan.title === 'Team',
                            'text-xl font-bold text-purple': plan.title === 'Enterprise',
                          })}
                        >
                          {plan.title}
                        </p>
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {features &&
                features.length > 0 &&
                features.map((feature, index) => {
                  return (
                    <tr key={index}>
                      {feature.bold ? (
                        <h3 className="pt-10 pl-6 font-xl">{feature.title}</h3>
                      ) : (
                        <div className="flex flex-row">
                          <td>
                            {feature.toolTip && (
                              <>
                                <div className="tooltip">
                                  <div className="relative mx-2">
                                    <div className="right-0 px-4 py-1 text-sm text-white bg-black rounded bottom-full">
                                      {feature.toolTip}
                                      <svg
                                        className="absolute left-0 w-full h-2 text-black top-full"
                                        x="0px"
                                        y="0px"
                                        viewBox="0 0 255 255"
                                      >
                                        <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                            {feature.title}
                            {feature.toolTip && <Icon icon="question-circle" size="sm" className="ml-2" />}
                          </td>
                        </div>
                      )}

                      {plans.map((plan, planIndex) => {
                        return (
                          <td key={planIndex}>
                            {feature.plans && feature.plans.includes(plan.title) && (
                              <Icon className="text-green" icon="check" size="lg" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  );
};

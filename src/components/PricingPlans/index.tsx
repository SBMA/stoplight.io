import cn from 'classnames';
import * as React from 'react';

import { Button, IButton } from '../Button';
import { Container } from '../Container';
import { Icon } from '../Icon';
import { Link } from '../Link';

export interface IPlanFeature {
  name: string;
}

export interface IPricingPlan {
  title: string;
  description: string;
  price: IPrice;
  unit: string;
  features: IPlanFeature[];
  titleColor: string;
  button: IButton;
}
export interface IPrice {
  title?: string;
  button?: IButton;
}
export interface IPricingPlans {
  color: string;
  plans: IPricingPlan[];
}

export const PlanFeature: React.FunctionComponent<IPlanFeature> = ({ name }) => {
  return (
    <div className="flex items-center py-2">
      <Icon icon={['fad', 'check-circle']} className={`mr-3 text-blue`} /> <div className="text-lg">{name}</div>
    </div>
  );
};

export const PricingPlan: React.FunctionComponent<IPricingPlan> = ({
  title,
  description,
  price,
  unit,
  features,
  titleColor,
  button,
}) => {
  return (
    <div className={`flex-1 flex flex-col h-full mx-3 rounded-lg md:my-6 md:flex-auto md:w-full bg-${titleColor}`}>
      <div className="items-start flex-1 p-10 pb-20 mt-2 bg-white shadow-md ">
        <div className="px-8 py-8 mb-10 -mx-10 -mt-10 bg-grey-lightest ">
          <div className="items-center mb-2 text-3xl font-extrabold text-center">{title}</div>
          {price.button ? (
            <div className="pb-8 text-center">
              <div className="mt-4 text-xl font-bold leading-loose ">{price.title}</div>
            </div>
          ) : (
            <div className="text-6xl font-bold leading-loose text-center ">
              <div className="flex justify-center">
                {price.title}
                <div className="flex flex-col mt-4 ml-1 text-lg font-normal text-left">
                  <p>per user</p>
                  <p>per month</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="items-start">
          <div className="pb-10">
            {features.map((feature, key) => (
              <PlanFeature key={key} name={feature.name} />
            ))}
          </div>
        </div>
      </div>
      {button && (
        <div className="rounded-lg shadow-lg">
          <Button className="w-full h-16 text-xl" {...button} />
        </div>
      )}
    </div>
  );
};

export const PricingPlans: React.FunctionComponent<IPricingPlans> = ({ color, plans }) => {
  if (!plans || !plans.length) {
    return null;
  }

  return (
    <>
      <Container className="relative pb-32 border-b -mt-96 z-5">
        <div className="flex md:mx-0">
          {plans.map((pricingPlan, key) => (
            <div
              className={cn('w-128', {
                'pt-48': pricingPlan.title === 'Free',
                'pt-32': pricingPlan.title === 'Team',
                'pt-16': pricingPlan.title === 'Enterprise',
              })}
            >
              <PricingPlan key={key} titleColor={color} {...pricingPlan} />
            </div>
          ))}
        </div>
      </Container>
    </>
  );
};

import cn from 'classnames';
import * as React from 'react';

import { useBanner } from '../../hooks/useBanner';
import { convertMarkdownToHTML } from '../../utils/markdown/index.js';
import { CallToAction } from '../CallToAction';
import { IInfo } from '../Info';
import { IQuote } from '../Quote';

export interface IContent {
  body: string;
  sidebar?: {
    info?: IInfo;
    quotes?: IQuote[];
  };
  includeToc?: boolean;
  className?: string;
}

export const Content: React.FunctionComponent<IContent> = ({ sidebar, includeToc, className, body }) => {
  const [isBannerShowing] = useBanner();
  const html = convertMarkdownToHTML(body, { includeToc: !sidebar && includeToc });

  return (
    <>
      {!sidebar && includeToc ? (
        <div
          className="sticky flex flex-col items-end w-1/6 m-auto -mb-40 -mr-20 z-1 md:-mr-6 sm:-mb-48 sm:py-8"
          style={{ top: isBannerShowing ? 140 : 80, marginRight: 0, marginTop: 76, marginBottom: -200 }}
        >
          <div className="p-4 bg-white border rounded-lg md:hidden">
            <p className="text-sm font-bold">Design Quality APIs 10x Faster</p>
            <CallToAction
              className="mt-4 z-5 bg-grey-lightest"
              href="https://stoplight.io/welcome/?utm_campaign=studio_blog"
              title="Try Stoplight"
              color="purple"
              rightIcon="arrow-right"
              outlined
              shadow="none"
            />
          </div>
        </div>
      ) : null}

      <div className={cn('markdown-body pt-20 md:mt-20', { 'has-banner': isBannerShowing })}>
        <div
          className={cn(className, { 'm-auto': !sidebar && !includeToc })}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </>
  );
};

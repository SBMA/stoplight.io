import info from 'src/components/Info/config';
import metaTags from 'src/components/MetaTags/config';
import actionBar from 'src/components/ActionBar/config';
import quote from 'src/components/Quote/config';

import { addFields } from '../../utils/netlify';

export const SubpageConfig = {
  label: 'Subpages',
  label_singular: 'Subpage',
  name: 'subpage',
  folder: 'netlify/subpages',
  create: true,
  delete: true,
  slug: '{{slug}}',
  extension: 'md',
  format: 'yaml-frontmatter',
  fields: [
    {
      label: 'URL path',
      name: 'path',
      widget: 'string',
    },
    {
      label: 'Tags',
      name: 'tags',
      widget: 'list',
      required: false,
      field: { label: 'tag', name: 'tag', widget: 'string', required: false },
    },
    {
      label: 'Related Tags',
      name: 'relatedTags',
      widget: 'list',
      required: false,
      field: { label: 'tag', name: 'tag', widget: 'string', required: false },
    },
    {
      label: 'Publish Date',
      name: 'publishedDate',
      widget: 'date',
      dateFormat: 'MMM DD, YYYY',
      required: false,
    },
    {
      label: 'Author',
      name: 'author',
      widget: 'relation',
      collection: 'author',
      searchFields: ['title'],
      valueField: 'title',
      required: false,
    },
    {
      label: 'Title',
      name: 'title',
      widget: 'string',
      required: false,
    },
    {
      label: 'SubTitle',
      name: 'subtitle',
      widget: 'string',
      required: false,
    },
    {
      label: 'Short Description',
      hint: 'A short description of this page that will only be displayed on list item cards and "Related Articles"',
      name: 'listSubtitle',
      widget: 'string',
      required: false,
    },
    {
      label: 'Image',
      name: 'image',
      widget: 'image',
      required: false,
    },
    {
      label: 'Color',
      name: 'color',
      widget: 'string',
      default: 'black',
      required: false,
    },
    {
      name: 'tabs',
      widget: 'list',
      required: false,
      fields: [
        {
          name: 'title',
          widget: 'string',
          required: false,
        },
        {
          name: 'href',
          widget: 'string',
          required: false,
        },
      ],
    },
    {
      label: 'Include table of contents? (default: true)',
      name: 'includeToc',
      widget: 'boolean',
      required: false,
      default: true,
    },
    {
      label: 'Content',
      name: 'body',
      widget: 'markdown',
      required: false,
    },
    actionBar,
    metaTags,
  ],
};

export const CaseStudyConfig = {
  ...SubpageConfig,
  label: 'Case Studies',
  label_singular: 'Case Study',
  name: 'caseStudy',
  folder: 'netlify/case-studies',
  fields: addFields(SubpageConfig.fields, SubpageConfig.fields.length - 3, [
    {
      label: 'Sidebar',
      name: 'sidebar',
      widget: 'object',
      fields: [info, quote],
    },
  ]).map(field => {
    // Don't allow ToC for case studies page
    if (field && field.name === 'includeToc') {
      return {
        label: 'Include table of contents? (default: false)',
        name: 'includeToc',
        widget: 'hidden',
        required: false,
        default: false,
      };
    }

    return field;
  }),
};

export const BlogPostConfig = {
  ...SubpageConfig,
  label: 'Blog Posts',
  label_singular: 'Blog Post',
  name: 'blogPost',
  folder: 'netlify/blog-posts',
  fields: [
    ...SubpageConfig.fields,
    {
      name: 'disqus',
      widget: 'object',
      required: false,
      fields: [
        {
          label: 'Enabled?',
          name: 'enabled',
          widget: 'boolean',
          required: false,
        },
      ],
    },
  ],
};

---
path: /what-is-api-testing/
publishedDate: 2020-06-25
title: What is the Meaning of API Testing?
subtitle: >-
  How and why to use various types of API testing
titleImage: /images/formulas-and-equations.jpg
tabs:
  - {}
actionBar:
  enabled: false
meta:
  description: How and why to use various types of API testing
  robots: 'index, follow'
  title: What is the Meaning of API Testing? | Stoplight API Intersection
  image: /images/formulas-and-equations.jpg
  twitter:
    description: How and why to use OpenAPI contract testing for your API
    title: What is the Meaning of API Testing? | Stoplight API Intersection
    image: /images/formulas-and-equations.jpg
    username: '@stoplightio'
  url: https://stoplight.io/what-is-api-testing/
---

[By Phil Sturgeon](https://stoplight.io/blog/author/phil-sturgeon/)

API testing is a software process which validates that an API is working as expected. Once declared, API tests can run automatically, such as part of a test suite on a continuos integration server, a development environment, or even done in production.

Ok, sure, but what does "working as expected" mean?

- Does it accept the same data your API design/documentation says it does?
- Does it output the same data your API design/documentation says it does?
- Does it create good error objects or blow up with a 500?
- Does it perform quickly?
- Does it perform quickly under pressure?
- Does it have gaping security holes?

This topic is further confused by providers and consumers wanting to test different things in different contexts.

Settle in, grab a beverage, and I promise we'll unravel this mess.

## Providers & Consumers

When people talk about "API testing", a consumer might be speaking about testing the API calls they are making to another API, and providers might be talking about making sure their API works.

A consumer needs to know if it is sending information that the API will not understand, and maybe they want to be sure that the API continues to give them the information they expect.

A provider needs to know if their API is working according to the API design they initially created, the documentation that has been shared since, and that changes to the code do not accidentally change the API interface or wreck expectations that the consumers now have.

An application could absolutely be both a provider and a consumer, because it might be calling an upstream dependency to find information which it then sends back to another system. This could be a [Backend for Frontend](https://samnewman.io/patterns/architectural/bff/), [submitting a payment to Stripe](https://stripe.com/docs/api), or [sending a SMS with Twilio](https://www.twilio.com/docs/usage/api).

Mistakes by either providers or consumers can set off expensive alarm bells which cause headaches for your support staff, on-call engineers, and ram up your corporate Twitter feed with complaints.

## Different Types of Testing

There is no one thing that is "API testing", but there are lots of different bits of code and functionality to test at various points in the API lifecycle. Let's learn about unit testing, integration testing, acceptance testing, end-to-end testing, contract testing, and let's keep in mind that the terms are different for providers and consumers.

### Unit Testing

Testing that some sort of unit of code is working as expected. This could be a function, class, module, etc. Maybe you have an `add()` function, so check that when you call `add(1, 2)` it returns `3`. If you throw in `1` and `"HELLO THERE"` you get a NaN or an exception.

If the function contains a call to some other function, class, or library, you may well "isolate" that unit of code you are trying to test by replacing the other code with a fake: known as a "mock" or "stub".

#### Providers

Some people consider a test which makes a HTTP call to a specific API endpoint to be a unit test, because a "unit" of functionality could be anything, not just a function or a class. Maybe, if you're stubbing out other APIs with mock servers like [Prism](https://stoplight.io/open-source/prism)... The orchestration of this is tough, so it's common to make a more classic unit test against the "controller" code.

An API controller is just like any other controller in MVC-based web application frameworks, it just returns JSON instead of HTML. Unit tests can stub out calls to the database, and see what happens when the controller is called with certain properties, and see what JSON comes back to see if it worked.

Avoid these tests, use integration tests instead, because calling your controller directly as code, or calling it through HTTP via the web application server, are usually not as similar as people think. Subtle differences in how a `foo=false` form value is actually `string("false")` instead of `bool(false)` lead to all sorts of false positives.

If these tests are used, they're almost always in the repository with the functionality they are testing.

#### Consumers

If an application is talking to an API then various best practices suggest wrapping that API interaction logic in some sort of service.

For example, if we have a venue controller in our content management system which needs to geocode an address, we would make a `Geocoder` class which then uses the Open Street Map HTTP API, but our unit test doesn't need to care about that.

```ruby
RSpec.describe VenueController do
  describe '.create' do
    it 'will geocode address to lat lon' do
      allow(Geocoder).to receive(:address).with('123 Main Street') do
        {
          lat: 23.534,
          lon: 45.432
        }
      }
      subject.update(address: '123 Main Street')
      expect(subject.lat).to eql(23.534)
      expect(subject.lon).to eql(45.432)
    end
  end
end
```

Completely skipping the API logic in the unit test is kinda what unit tests are about, we just wanna make sure this controller is doing the right thing with the information it has, but beware: if the Geocoder changes, or the API it's returning information from changes, this unit test is garbage.

Most of the types of testing below are designed to solve this problem.

### Integration Testing

This type of testing checks that multiple bits of code play nicely together.

> Integration tests check small sections of your product and it’s interaction with external tools or systems e.g. databases or external APIs.
>
> **-- [Kayleigh Oliver](http://kayleigholiver.com/difference-acceptance-integration-tests/)**

Instead of focusing purely on one piece of code and stubbing out any of its dependencies, you let them talk to each other and you see if things blow up or work as expected.

Involving more layers of code and dependencies results in slower tests, but this does not make them worse or less valuable. It's common to write more unit tests to cover subtle variations, trying to trigger every error condition or possible output, then write a smaller number of integration tests just to check that errors are handled and a few positive and negative outcomes work as expected.

Integration tests almost always live in the repository with functionality they are testing.

### Acceptance Tests

Acceptance and Integration are often throw around interchangeably, but a common difference is the way they're written and who is writing them.

> Acceptance tests give feedback to the state of a system in from a user’s perspective.
>
> Acceptance tests can be written for the integration or system/end-to-end testing level of your product.
>
> Acceptance tests are very business focused meaning that the name of the test and it’s result should be very easy to understand, even by someone that’s not part of the development team.
>
> **-- [Kayleigh Oliver](http://kayleigholiver.com/difference-acceptance-integration-tests/)**

Whilst an integration test might be making sure that various bits of code are working the things it's expected to as far as a developer is concerned, the acceptance test is checking that things work as a user expects.

Sometimes developers will write tests that are very similar to integration tests but they'll test important workflows, chaining various requests and responses together, using the data from the response to try the next bit, following HATEOAS links to see if the REST API is working like the state machine it's designed to be.

Acceptance tests also often describe automated business rules, maybe written by a developer, but could be written by folks in the business. To make this easier, instead of writing tests in a programming language like Go or Ruby, acceptance tests are often written with a more text-based syntax like [Cucumber](https://cucumber.io/docs/guides/overview/):

```cucumber
Feature: Link Click
  Scenario: User clicks the link
    Given I am on the homepage
    When I click the provided link
    Then I should see the link click confirmation
```

This might be used for some easy interface testing, but could be used for really complex stuff like testing all sorts of pricing logic for tax codes, VAT, partial refunds, coupons  and discounts, which a business person would know better than the average developer.

Acceptance tests may or may not live in the repository with the functionality they are testing.

## Contract Testing

In API, the I stands for interface, and it's surprising how often that part is overlooked. Some companies just bash out new functionality, throw some tests in for certain functionality, but the interface is generally considered to be whatever they're spitting out at the time, and code changes over time, so... consumers break.

Let me mention a scenario, see if it sounds familiar to you. Working on a new API integration between the frontend consumer and a new API in development. The frontend developer writes their side of the code, and the backend developer writes theirs. As they go, the fields and types are explained verbally, DMed over Slack, dumped into a Google Doc somewhere, shoved in a Wiki, or written up in HTML.

> **Fred:** Hey Sarah, there's a new "fudge" field and it can be "blah" or "whatever"
> **Sarah:** Great! Thanks I'll chuck that in now.

Telling somebody about it on Slack is not particularly scaleable, and writing it into a Google Doc is not exactly "machine readable", so these approaches to writing down the contract are just a snapshot of the contract at a certain point in time, and they're usually not kept up to date.

Contract testing solves this, by writing down what the contract should be: the URLs, HTTP statuses expected, the JSON properties expected, which are required, optional, nullable, which could be strings or binary data, some validation rules, etc...

As always, the term can be used differently by different people.

### Producer Contract Testing

Most of the time when talking to API people, when they say "contract testing" they're talking about Producer Contract Testing. The API provider will create a test which records all the parts of the interface, and run these tests on pull requests to the API repository, to make sure that the code didn't accidentally change.

Sometimes people will try and use whole other test suites for contract testing, but there's no need. Your existing integration or acceptance tests are a great home for this sort of assertion.

Some people will spend a bunch of time writing out rules like this:

```cucumber
Feature: User API
Scenario: Show action
    When I visit "/users/1"
    Then the JSON response at "first_name" should be "John"
    And the JSON response at "last_name" should be "Smith"
    And the JSON response should have "username"
    And the JSON response at "email" should be a string
    And the JSON response at "email" should be an email
    And the JSON response should have "created_at"
    And the JSON response at "created_at" should be a string
```

This can be rather frustrating to write out, but there's no need to do it. Providers following the [API Design-first Workflow](https://stoplight.io/api-design-guide/basics/) use an API Description Format like OpenAPI, which is all about creating  API descriptions as an early artifact around which a team can refine an API. That same document is perfect for contract testing!

Instead of writing all the properties, data formats, validations, etc. again into a test suite, you can just take the schemas and assert that the response matches it.

```rb
# specs/test_helper.rb
require "json_matchers/rspec"
JsonMatchers.schema_root = "api/schemas"
# specs/users_spec.rb
it 'should return HTTP OK (200)' do
  get "/users/#{subject.id}"
  expect(response).to have_http_status(:ok)
end
it 'should conform to user schema' do
  get "/users/#{subject.id}"
  expect(response).to match_json_schema('user')
end
```

That'll go looking for `api/schemas/user.json` which might look this.

```json
{
  "type": "object",
  "properties": {
    "id": {
      "readOnly": true,
      "type": "string",
      "example": "123"
    },
     "first_name": {
       "type": "string",
       "example": "John"
     },
     "last_name": {
       "type": "string",
       "example": "Smith"
     },
     "email": {
       "type": "string",
       "format": "email",
       "example": "john@example.com"
     },
     "created_at": {
       "readOnly": true,
       "type": ["string", "null"],
       "format": "date-time",
       "example": "2018-04-09T15:45:44.358Z"
     }
  },
  "required": [
    "first_name",
    "last_name",
    "email",
    "name"
  ]
}
```

If any required properties are missing, data types mismatch, or formats are not aorrect, the JSON Schema validator this assertion library wraps will trigger an error and the test case will fail.

One of many handy side-effects to using OpenAPI and JSON Schema files for contract testing your API responses, is that as well as double checking your code does what the descriptions say, but it confirms the API descriptions are correct against what the code is doing, and this extra check helps you make sure your documentation is up to date - cutting out the need for tools like [Dredd](https://dredd.org/).

These tests live in the same repository as the API so that docs, code and tests can all be updated in the same pull request by the same person, block PRs which are incorrect, and immediately update documentation when PRs are merged. 🥳

Read more about provider contract testing on APIs You Won't Hate's _[Writing Documentation via Contract Testing](https://apisyouwonthate.com/blog/writing-documentation-via-contract-testing)_.

### Consumer Contract Testing

Any consumer that is talking to another API is just hoping they don't make breaking changes to parts of the API that they use. API developers _should_ be using a [sensible API Versioning strategy](https://www.apisyouwonthate.com/blog/api-versioning-has-no-right-way) which does not allow for breaking changes, or [using API Evolution](https://apisyouwonthate.com/blog/api-evolution-for-rest-http-apis) where breaking change is extremely limited and only when its unavoidable do people deprecate entire endpoints with the [`Sunset` header](https://tools.ietf.org/html/rfc8594).

If the API providers are adding `Sunset` headers but the consumers didn't notice, then applications will break.

If the API providers are not doing their own contract testing and accidentally push out a breaking change, then applications will break.

Either way, consumer contract testing can help keep an eye on if various dependency APIs are doing what the consumer wants to be doing.

Tooling for this is very similar to the sort of tests you see in an API providers acceptance test, and its really similar. Instead of the API provider guessing at what a consumer is trying to do and testing that functionality in their own test suite, the API consumer is testing only what they need. The provider could have removed some fields and deleted an endpoint, but if the client doesn't care about that then it's not going to trigger a failure on the test suite.

Here's an example of a test using [Pact](https://pact.io/).

```js
describe('Pact with Order API', () => {
  describe('given there are orders', () => {
    describe('when a call to the API is made', () => {
      before(() => {
        return provider.addInteraction({
          state: 'there are orders',
          uponReceiving: 'a request for orders',
          withRequest: {
            path: '/orders',
            method: 'GET',
          },
          willRespondWith: {
            body: eachLike({
              id: 1,
              items: eachLike({
                name: 'burger',
                quantity: 2,
                value: 100,
              }),
            }),
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            },
          },
        })
      })
      it('will receive the list of current orders', () => {
        return expect(fetchOrders()).to.eventually.have.deep.members([
          new Order(orderProperties.id, [itemProperties]),
        ])
      })
    })
  })
})
```

Creating a test suite of expectations for your codebase is one way of doing it, but I worry that the tests here and the actual code have subtly different expectations.

If you are very lucky, the provider will provide SDKs, version them with SemVer, and you can enable something like [Dependabot](https://dependabot.com/) to get updates for those SDKs, at which point your test suite will let you know if a used method or property has vanished from the SDK. If this is the case, you might not need consumer-driver contract testing.

If that is not the case, but you're still lucky enough that the provider has provided OpenAPI descriptions (thanks [Stripe](https://github.com/stripe/openapi) 🙌) then you can point Prism at those and use the validation proxy.

```shell
prism proxy --errors https://raw.githubusercontent.com/stripe/openapi/master/openapi/spec3.yaml https://api.stripe.com
```

Running this will create a [Prism Validation Proxy](https://stoplight.io/p/docs/gh/stoplightio/prism/docs/guides/03-validation-proxy.md) which is going to see what HTTP traffic comes through it, validate the request, and if it spots any trouble it'll blow up thanks to `--errors`.

If the request is good it'll remake that request to `https://api.stripe.com`, then validate the response too.

If the response is bad, you'll see output like this in the logs:

```log
› ✖  error  Request terminated with error: https://stoplight.io/prism/errors#UNPROCESSABLE_ENTITY: Invalid request body payload
```

This curl command came from their documentation and I removed the currency parameter. I expected that to cause the error, but looking at the JSON that Prism returned, the error is actually that the Stripe OpenAPI is wrong. 🤣

```curl
curl -i http://localhost:4010/v1/charges \
  -u sk_test_f5ssPbJNt4fzBElsVbbR3OLk0024dqCRk1: \
  -d amount=2000 \
  -d source=tok_visa \
  -d description="My First Test Charge (created for API docs)"
HTTP/1.1 422 Unprocessable Entity
content-type: application/problem+json
Content-Length: 647
Date: Wed, 17 Jun 2020 18:02:57 GMT
Connection: keep-alive
{"type":"https://stoplight.io/prism/errors#UNPROCESSABLE_ENTITY","title":"Invalid request body payload","status":422,"detail":"Your request is not valid and no HTTP validation response was found in the spec, so Prism is generating this error for you.","validation":[{"location":["body","shipping","address"],"severity":"Error","code":"required","message":"should have required property 'line1'"},{"location":["body","shipping"],"severity":"Error","code":"required","message":"should have required property 'name'"},{"location":["body","transfer_data"],"severity":"Error","code":"required","message":"should have required property 'destination'"}]}%
```

The `shipping` property should be entirely optional, but _if_ `shipping` is passed then the `line1` and `name` is required. There's a valid way to do that in OpenAPI, but it's not this, so... success for Prism. I'll let them know. 👋

## End-to-End Testing

End to end testing is the biggest, scariest, slowest, and most valuable type of testing around. They don't interact at a code level, they interact like they're a real user doing real things. They're usually not going to cover every little thing, they're more about ensuring critical paths through the ecosystem are supported, touching multiple applications and APIs as they go.

The interactions are real, maybe a few config variables are using "Test" keys for sending emails and making payments, but everything else is actually happening.

These sorts of tests are slow and hard to set up, they need to have real records created in the database and real users need to exist to do that. If the tests are run in a QA environment maybe they can do a big reset script to make all the APIs start from scratch, or its creating a new user every time - which can make the database _huge_ if these tests run hourly.

As always end-to-end tests are different for providers and consumers.

### E2E Testing for API Consumers

For frontend development end-to-end testing usually involves running the entire application, and also running all of its dependencies. For web apps the tests are run in a [headless browser](https://www.keycdn.com/blog/headless-browsers) pretending to be a human clicking around, and mobile apps use a [simulator to automate tests](https://www.browserstack.com/app-automate) in a similar way.

To run those APIs it's pretty common to use Docker or Kubernetes to run the services, then the frontend application can talk to those APIs for real. This can be complex to orchestrate and time consuming, but it's crucial for making sure your application actually works in the real world, not just in the repository test suites.

These end-to-end tests probably live in the repository for the frontend application they are testing, and can be run in CI on pull requests, after merges to master, and/or nightly.

### E2E Testing for API Providers

Similarly to E2E for API consumers, you could have a E2E test suite for every single API testing it directly and seeing how it plays with other APIs, but that might be better handled with Integration Testing for API Providers (with tools like VCR).

E2E for API providers is commonly higher level than any one particular project, and is testing the ecosystem itself, through making real calls to real APIs. Seeing as multiple APIs could be involved, it is hard to put end-to-end tests in with the functionality it is targeting, unless your APIs are all in a [monorepo](https://www.atlassian.com/git/tutorials/monorepos). For the vast majority of people not using a monorepo, the "E2E tests" will live on their own, either in their repository, or in some external test suite system.

The tests could be triggered every time any provider in the entire ecosystem wants to deploy.

Developers often find this jarring at first, because they are mostly used to having their tests under their control in their repo. Having them in another system means things need to be updated in another repo or testing application when changes occur, but that is actually a benefit.

When tests are owned by the API, the tests can be changed to show that the API is "all good", but that might involve a change that would break expectations of other consumers. Having these tests under the control of a Software Testing or Quality Assurance team means these sort of accidental or unintentional breakages cannot slip through. If a breaking change is made to an API and the E2E testing is being run before deployments can go to production, then this breaking change will be caught safely.

Finding out which consumers could or would be effected by the change can be tricky, but it could be a case of running the Consumers E2E tests with that API updated in their test suite to see if it all works.

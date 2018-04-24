Site Analytics
==============

# Background

In this project, we'll be building an analytics framework, like [Google
Analytics][google-analytics] or [Mixpanel][mixpanel]. Companies use analytics
to learn about what people do on their websites and webapps, for exammple,
seeing what percentage of users who see the create account page go on to create
an account, or which blog posts are generating the most traffic.

Analytics is an interesting problem because of how much data there is: a
small online business can easily have millions of page visits a month.
And to gain useful insights, developers and product managers will want
to ask questions about all of that data. In order to handle all these
data points, we need to think carefully about how we store our data.

# Overview

We've provided the frontend for this project for you. You'll be responsible
for the backend, AWS setup and integration, and deployment.

## This project consists of four parts:

1. Writing a backend that supports the necessary analytics queries
2. Deploying your app to AWS
3. Speeding up analytics queries by modifying your schema
4. Writing a full-stack feature to improve the vizualization

These parts are detailed below.


# Getting started

To get started, clone this repository and run `npm start`:

```sh
git clone git@github.com:horizons-school-of-technology/analytics-project.git
cd analytics-project
npm start
```

This program consists of three pieces, the client (or frontend), the server
(or backend), and the tracking script.

## The client

The client code is located in `src/client/`, and is provided for you. ***You
should not need to modify the client for this project***. This code is built
with webpack and served with webpack-dev-server on port 3000 for development.

## The server

The server code should be placed in `src/server`, starting from the root file
of `src/server/app.js`. The server should run on port 3001.

## The tracking script

A tracking script is a small javascript script that websites include to
make an http request to an analytics service. You will write this static
JavaScript file, which should be located in `public/logvisit.js` (we've
provided an empty file for you to start).

## Running the project

For development, webpack-dev-server provides a reverse proxy that forwards
requests to `/api/*` to your backend on port 3001. This lets you access the
project on port 3000, while only the api is running on port 3001.

To get started, run `npm start` to launch both webpack-dev-server (via react
scripts) and your backend server located at src/server/app.js). This will start
the project on port 3000, which you can open in your browser at
[http://localhost:3000/](http://localhost:3000/).

For deployment you won't use webpack-dev-server, but will precompile your
javascript and serve it with [nginx][nginx], which can also proxy your api
traffic to your backend server.

-----

# Part 1: Building a backend & tracking snippet

For part 1, we'll create an express server that responds to several endpoints (below).

In order to do this, you'll need to:

1. Set up an express app in `src/server/app.js`
2. [Set up a postgres database][postgres-local-setup].
3. Come up with a schema and initialize your database.

Your express app should respond to the following endpoints:

-----

## `GET /api/log/visit/:uuid?timestamp=<timestamp>`

This route records a page visit by the user represented by `uuid`, a
[UUID][uuid] token assigned for that user's web browser. This is the endpoint
that our tracking snippet (`public/logvisit.js`) will send a GET request to.

This route will be used by the tracking snipped to record page visits.

<table><tr></tr><tr><td><details><summary><strong>
Example
</strong></summary><hr>

```
GET /api/log/visit/4116a0f9-af63-4a56-87d3-4c71d9e32319?timestamp=2018-01-01T00:00:00.000Z&path=%2Findex.html

200 OK
```

</details></td></tr></table>

<table><tr></tr><tr><td><details><summary><strong>
Specification
</strong></summary><hr>

**This route should record:**

 * `uuid`, the [UUID][uuid] representing the user
    (53b1b8fb-467b-4217-9ae8-ed9cf16d72dc)

    * This is provided in the `:uuid` part of the `/api/log/visit/:uuid` route's url

 * `timestamp`, the [ISO 8601][iso-dates] timestamp (year-month-day T hour:minute)
   at which the page visit event happened.

    * This may be provided as a [query parameter][query-params]
    * It may also be not present, in which case this should default to the
      current time: `new Date().toISOString()`
    * This timestamp will be provided in [ISO 8601][iso-dates] format, a standard
      [timestamp][timestamp] format that works well with both
      [JavaScript `Date` objects][js-dates] and
      [PostGres timestamp values][postgres-datetime].

 * `path`, the [pathname][window-location] (/path/to/file.html) of the page
   the user visited.

    * This will be provided as a [query parameter][query-params].

 * `browser`, the web browser making the request (Chrome, Safari, Firefox, ...)

    * This can be learned by parsing the [User-Agent header][user-agent-header].
      Like all HTTP requests, requests to this route will include a
      [User-Agent header][user-agent-header], which contains (convoluted) information
      about the browser and operating system of the browser sending the request.
    * You should use [the `useragent` package][npm-useragent] to parse the
      User-Agent header, and store the browser name (ex: Chrome, Firefox, Safari)

 * `os`, the operating system the request came from (Mac OS X, Windows, iOS,
   Android)

    * This can also be learned by parsing the
      [User-Agent header][user-agent-header].
    * Again, you should use the [`useragent`][npm-useragent] package to parse
      the User-Agent header, and store the operating system name
      (ex: Windows, Mac OS X, Windows, Android)

**This route should return HTTP status 200 (OK)** if it succeeds (which it
should, unless the format is incorrect). It does not need to return anything in
the response body.

</details></td></tr></table>

<table><tr></tr><tr><td><details><summary><strong>
Implementation Guidelines
</strong></summary><hr>

We recommend implementing this function in the following order, testing after each part:

1. Implement `uuid` saving
1. Implement `timestamp` defaulting and saving
1. Implement `path` saving
1. Implement `User-Agent` parsing

</details></td></tr></table>

<table><tr></tr><tr><td><details><summary><strong>
Testing
</strong></summary><hr>

To test this route, you should use [Postman][postman] to send some requests to
`/api/log/visit`, then check that the correct data is showing up in your
database using `psql`.

</details></td></tr></table>

-----

## `Tracking snippet`

While this isn't strictly a backend endpoint, we recommend you write it next
to simplify testing 🙂.

The tracking snippet is a small JavaScript file that makes a request to
`/api/log/visit` when loaded into an html page.

<table><tr></tr><tr><td><details><summary><strong>
Example
</strong></summary><hr>

A site using a snippet called `logvisit.js` would include the following html:

```html
<script src="http://localhost:3000/logvisit.js"></script>
```

</details></td></tr></table>

<table><tr></tr><tr><td><details><summary><strong>
Specification
</strong></summary><hr>

You should make a `.js` file in the `/public` folder—this is the folder of
files that get served directly to the web in a `create-react-app` setup
(in development mode, create-react-app's `webpack-dev-server` will serve
these files; in production, you'll configure nginx to serve the public
files).

This `.js` file should:

1. Generate a random UUID for the client and cache it using
   [localStorage][localStorage].
    * subsequent page loads should use the same UUID.
    * cookies also work for caching, but are a bit trickier to set up.
2. Find the current [path][window-location] (ex: `'/route/to/html-page.html'`)
3. Make an HTTP request to your `/api/log/visit` endpoint (with the UUID and
   path specified)
4. Avoid [CORS][CORS] errors using either an image tag to make a request that
   is not subject to CORS, or by setting the correct
   `Access-Control-Allow-Origin` header for the `/api/log/visit` endpoint.

</details></td></tr></table>

<table><tr></tr><tr><td><details><summary><strong>
Implementation Guidelines
</strong></summary><hr>

There are two ways we could go about generating a UUID:

1. Set up webpack and node_modules to build this file using
   a uuid module on npm.
2. Find a non-npm UUID generator.

We think the latter is easier, but both are feasible :).

</details></td></tr></table>

<table><tr></tr><tr><td><details><summary><strong>
Testing
</strong></summary><hr>

1. You should make an html file that requests your tracking snippet script,
   and open that file in a web browser.
2. Use `psql` to verify that every time you reload the page, another event
   is added to your database.

</details></td></tr></table>

-----

## `GET /api/events?start=<timestamp>&end=<timestamp>`

This route should return all events that occured between the `start` and `end`
query params, which will be [ISO 8601][iso-dates] formatted datetimes, which
work well with [JavaScript `Date` objects][js-dates] and [postgres timestamp
values][postgres-datetime].

This route is used primarily for testing. (It is helpful to implement next so
you can test your `GET /api/log/visit/:uuid` route 🙂).

<table><tr></tr><tr><td><details><summary><strong>
Example
</strong></summary><hr>

```
GET /api/events?start=2018-04-16T00:00:00.000Z&end=2018-04-17T00:00:00.000Z

200 OK
[
    {
        "timestamp": "2018-04-16T04:22:25.230Z",
        "uuid": "79f1d5a4-cb49-4f09-8ae2-8e5ee49c5402",
        "path": "/index.html",
        "browser": "Chrome",
        "os": "Mac OS X"
    }
]
```

</details></td></tr></table>

<table><tr></tr><tr><td><details><summary><strong>
Specification
</strong></summary><hr>

#### Input:

[Query params][query-params] `start` and `end`,
[ISO 8601 timestamps][iso-dates].

#### Output:

This should return all events between `start` and `end`. The return value
should be a JSON array of objects with the following fields
(see above for an example)

 * `uuid`: the [UUID][uuid] token of the user who initiated the page visit
 * `timestamp`: the [timestamp] of when the event occurred as a string in
   [ISO 8601][iso-dates] format.
 * `path`: the [pathname][window-location] of the page visited (ex: '/' or
   '/index/html')
 * `browser`: the browser name (Chrome, Firefox, Safari, ...)
 * `os`: the operating system name (Windows, Mac OS X, Android, iOS, ...)

</details></td></tr></table>

<table><tr></tr><tr><td><details><summary><strong>
Implementation Guidelines
</strong></summary><hr>

This should be more straightforward to implement than the other methods.
The main trick here is getting the output format correct, which you can
use [Postman][postman] and the provided tests (see **Testing**, below)
to check.

The provided test cases are written so that you should be able to work
through them in order, so it may be helpful to start running those each
change you make while developing this endpoint.

</details></td></tr></table>

<table><tr></tr><tr><td><details><summary><strong>
Testing
</strong></summary><hr>

We've provided you some test cases (located in `src/test/server.test.js`).
To run them, type:

```
npm test
```

Once you're finished with this endpoint, the test cases for
`GET /log/visit/:uuid` and `GET /api/events` should all be passing. If some
or all aren't, try debugging, and ask a TA if you get stuck.

</details></td></tr></table>

-----

## `GET /api/statistics/:timeunit?` (query parameters detailed below)

This route powers the analytics dashboard. It allows queries for aggregated
[time-series][time-series] statistics about the logged visit events.

For example, you might want to ask "Over the past month, how has mobile traffic to
`/blog/how-to-ace-the-sat` performed on Android?" (This might let you
know whether your efforts to improve that blog post's [SEO][SEO] had paid off.)

<table><tr></tr><tr><td><details><summary><strong>
Example
</strong></summary><hr>

```
GET /api/statistics/hour?os=Android&start=2018-04-11T05:00:00.000Z&end=2018-04-11T07:59:59.999Z

200 OK
[
    {
        "timebucket": "2018-04-11T05:00:00.000Z",
        "count": "21",
        "uniquecount": "14"
    },
    {
        "timebucket": "2018-04-11T06:00:00.000Z",
        "count": "16",
        "uniquecount": "15"
    },
    {
        "timebucket": "2018-04-11T07:00:00.000Z",
        "count": "78",
        "uniquecount": "23"
    }
]
```

</details></td></tr></table>

<table><tr></tr><tr><td><details><summary><strong>
Specification
</strong></summary><hr>

#### Input:

 * `:timeunit` represents the size of the timebuckets to return
  
    * This will be either `minute` or `hour` (depending on whether the frontend
      is in the default live minute-by-minute view, or a past aggregated view;
      for days, the client aggregates hour for you so as to avoid timezone
      issues).
    * For example, if you send a request to `/api/statistics/minute` with a
      time range (`end` - `start`) of an hour, the server should respond with
      at most 60 objects representing the 60 minute-time-buckets.

 * `start` and `end` query parameters. Like in `/api/events`, `start` and `end`
   represent the start and end timestamps to consider, and are passed in
   [ISO 8601 format][iso-dates].

 * **Filters:** This route will take a number of filters as
   [query parameters][query-params]. These filters specify what subset of the
   event data the client is interested in: specifically, what operating system,
   browser, or path the user wants information about.

    * `browser`: the `browser` query parameter is a string representing the
      specific browser name (as parsed by [useragent][npm-useragent]) the client
      wants to filter by. When provided, this route should only count events
      where the browser information (parsed from the `User-Agent` header
      during `/api/log/visit`) matches the specified browser filter string
      exactly.

    * `os`: the `os` query parameter is a string representing the operating
      system name  the client wants to filter by. This route should only count
      events where the operating system information matches the specified os
      filter string exactly.

    * `path`: **unlike the other filters**, `path` is a ***prefix*** filter.
      This endpoint should return all matching visit events where the provided
      `path` filter is a *prefix* of full pathname provided in `/api/log/visit`.
      
       * For example, filtering for '/' should return all paths starting with
         '/', and filtering for '/i' should match both '/index.html' and
         '/interesting', as well as any other paths beginning with '/i'

#### Output:

It should return an array of objects, which each contain:

 * `timebucket`: an [ISO 8601][iso-dates] timestamp of an hour or
   minute identifier for that unit of time.

    * For example `2018-04-24T09:12:00.000Z` would represent the minute
      between 9:12am \[inclusive\] and 9:13am (exclusive) UTC on April 24th.

 * `count`: the number of total visits which occured during that time bucket

 * `uniquecount`: the number of unique UUIDs (that is, unique visitors, as
   represented by unique UUID tokens) that visited the site during that
   time bucket.

</details></td></tr></table>

<table><tr></tr><tr><td><details><summary><strong>
Implementation Guidelines
</strong></summary><hr>

This route is one of the largest parts of this project, so it's important to
divide it up into parts when implementing it. If you try to implement it all
at once, you'll probably run into more issues than if you build it piece by
piece.

To that end, we recommend writing this endpoint in the following steps:

1. Implement returning timebuckets and counts when `:timeunit` is 'minute' and
   there are no filters. This is what the analytics frontend shows you when
   you open the app.

   * Don't worry about returning `uniquecount`s for now.
   * We found Postgres's [`date_trunc`][date_trunc] function very helpful
     for writing this query (there are other ways to write this, but we
     recommend trying using `date_trunc`).
   * Your analytics frontend should be functional now! Try it out!

2. Add support for `start` and `end` time ranges. Once you've done this, you
   should see data from only the last hour when you open the frontend.

3. Add in `uniquecount`s. *Hint: you'll have to modify your query to ask
   for non-duplicates. Try googling for a refresher on how to do this.*

    * You should now be able to toggle between 'All Visits' and 'Unique
      Visitors' on the analytics frontend. What happens to the graphs and
      counts when you switch to unique visitors only?

4. Add support for `browser=` and `os=` filters.

    * You'll have to test these in [postman][postman] for now, until
      you've implemented `/api/values` (below)

5. Add support for `path=` filter

    * Note that the `path` filter takes a *prefix*. That is, filtering
      for '/' will return all paths starting with '/', and filtering
      for '/i' would return both '/index.html' and '/interesting' (if
      both those paths were present in the data)

6. Add support for a `:timeunit` value of 'hour'

Once you've done all of those, your analytics frontend should be pretty
functional! You've just got one more endpoint (`/api/values`) needed to
bring all of the features online.

</details></td></tr></table>

<table><tr></tr><tr><td><details><summary><strong>
Testing
</strong></summary><hr>

We've provided some small test cases in `src/test/server.test.js`, but these
are not comprehensive.

You should test this primarily using the analytics frontend and your tracked
html file (from earlier). [Postman][postman] and `npm test` may both be
useful in developing and debugging this route, however.

</details></td></tr></table>

-----

## `GET /api/values`

In order to populate the frontend's list of possible browser and operating
system values to filter by, we need to know what values are possible. This
route answers the client's request for what possible browsers and operating
systems to populate in its filter dropdowns.

<table><tr></tr><tr><td><details><summary><strong>
Example
</strong></summary><hr>

```
GET /api/values

200 OK
{
  "browser": [
    "Firefox",
    "Safari Mobile",
    "Chrome"
  ],
  "os": [
    "Mac OS X",
    "Android",
    "iOS"
  ]
}
```

</details></td></tr></table>

<table><tr></tr><tr><td><details><summary><strong>
Specification
</strong></summary><hr>

You should return all unique possible values by which to filter, for both
browsers and operating systems. This should be all unique values provided to
`/api/log/visit` for the browser/os parameters.

You should return a JSON response of an object with two keys: 'browser' and 'os',
and each key should map to an array of values corresponding with that key.

</details></td></tr></table>

<table><tr></tr><tr><td><details><summary><strong>
Implementation Guidelines
</strong></summary><hr>

Like `/api/events`, the implementation here shouldn't be very complicated,
but make sure you match the expected results format correctly (See the example
above).

</details></td></tr></table>

<table><tr></tr><tr><td><details><summary><strong>
Testing
</strong></summary><hr>

Use `postman` and `npm test` to verify that this is returning the correct
format.

Once this is working, you should be able to visit the app at
http://localhost:3000 and use the filter dropdowns to filter the
input to certain browsers.

Try opening your tracking html page in Firefox/Safari/Edge and check that
that visit shows up on your analytics dashboard.

</details></td></tr></table>

-----

# Part 2: Deploying to AWS

For Part 2, you'll be deploying your code to AWS using EC2 for your server and
RDS for your database. (*NOTE: Don't use Elastic Beanstalk; you should set up
and configure your EC2 and RDS instances and security groups by hand.*)

Some of the things you'll need to do are:

1. [Set up an EC2 instance][ec2-setup]
2. [Set up an RDS instance][rds-setup]
    * RDS is AWS's relational database hosting, which we'll use to host our
      remote postgres instance
3. Create security groups for both instances that allows:
    * access to a webserver running on your ec2 instance from the internet
    * the EC2 instance to communicate to the RDS instance
    * ssh access to your ec2 instance from your current location
4. Set up [ssh access for your EC2 instance][ec2-ssh-keys]
5. [Deploy your code to your EC2 instance][deploy-to-ec2]
6. Build a [production build of the client][cra-build] using `npm run build`
7. Set up [nginx][nginx] to serve the client files in `build/` and proxy
   requests to /api/ to your server.
8. Use [pm2][pm2] to [daemonize][daemonize] your server so that it can keep
   running after you disconnect from ssh


# Part 3: Speeding up your stats

## A) Load testing

For part three, we need to get a large amount of data in our analytics database,
so that we can see how our app and server perform with higher load.

There are several load testing utilities that we could use to generate a lot of
data, but we recommend [k6][k6], a load testing utility that is scriptable with
JavaScript. This means we'll be able to easily generate requests with different
data to send to our app, so that our database is filled with lots of different
data and our benchmarking is more representative of real world usage.

Use [k6][k6] to generate traffic to your `/api/log/visit` endpoint on AWS EC2.

<table><tr></tr><tr><td><details><summary><strong>
Specification
</strong></summary><hr>

Your [k6][k6] traffic should:

 * Be sent to **your AWS EC2 server**, not your local server. (Your local
   server may be much faster and not as representative of real world
   performance.)

 * Simulate several users (see the k6 option -u / --vus) each with a constant,
   but unique, UUID.

 * Simulate randomly choosing different paths to visit.

 * Generate a total of >=5 million requests

    * *Note: This will take a while, so you should start with a much smaller
      number, until you're confident in your k6 script. You can check how many
      you've added in total directly in your database using `psql`.*

</details></td></tr></table>

Once you've done that, open your stats dashboard in your browser, and try
switching filters. How long does the loading of the graph take? (You can reload
to repeat this load easily.) You should see this loading take a second or two.
For many use-cases, a couple seconds is an okay loading time. But if we get
more data this would get even slower, and if we want to differentiate our stats
platform, we'll need to be even faster (in fact, we can be a *lot* faster).

-----

## B) Speeding it up!

We might note that all our analytics queries are repeating a lot of the same
work, scanning over all events that happen within the time range.

If you haven't already, now would be a good time to add some indexes! Most
of our scans work through timestamp ranges, so it would help our smaller
time-range queries to have an index where we can find a particular timestamp
range quickly.

But that won't speed up our larger queries as much as we'd like, since we're
still recomputing counts and distinct counts for a large number of events
on every query. Those numbers don't change very much, especially in the
past!

If we can modify our schema to cache these calculations for previous time
intervals, we can speed up our queries a lot. We can then have a repeating
job update our cached statistics, and run queries over that cached table,
rather than the full table of all events.

To keep this cache up to date, we'll use an [AWS Lambda][aws-lambda] function.

<table><tr></tr><tr><td><details><summary><strong>
Specification
</strong></summary><hr>

1. figure out a schema for your statistics caching, and get this approved by a
   TA

2. Set up an AWS lambda function to connect to your database and update recent
   timebuckets in the cache every minute.

3. Modify your backend to use the new cached statistics table, and redeploy on
   AWS.

    * In order to access RDS, you'll need to set up a custom IAM role with VPC
      access and add your lambda to your VPC and a security group that has
      access to your RDS instance.

    * If you don't set up your VPC/security group access correctly, your
      lambda function will hang and time out.

</details></td></tr></table>

<table><tr></tr><tr><td><details><summary><strong>
Testing
</strong></summary><hr>

You should test this lambda function locally first. To do so, you'll need to
run your the code for your aws lambda function (or similar code) locally,
and use psql and the frontend client to test your updater function code and
modified backend.

Once you have it working locally, compress it and its dependencies into a
zip file and upload that to AWS. (Like last week, you'll probably want
at least 'pg' as a dependency, but you may have more.)

</details></td></tr></table>

-----

# Part 4: Segmentation

For Week 2: Build a full-stack feature for comparing multiple values.

Coming soon!

-----

# Reference

### Terms:

1. [UUID][uuid]
1. [ISO 8601][iso-dates]
1. [window.location][window-location]
1. [User-Agent header][user-agent-header]
1. [npm useragent package][npm-useragent]
1. [JavaScript Date objects][js-dates]
1. [PostGreSQL Date/Time formats][postgres-datetime]
1. [k6][k6]
1. [pm2][pm2]
1. [daemonize][daemonize]

### Useful guides:

1. [Setting up Postgres locally][postgres-local-setup]
1. [Setting up EC2 ssh access][ec2-ssh-keys]
1. [Setting up an EC2 instance][ec2-setup]
1. [Setting up an postgres database on RDS][rds-setup]
1. [Deploying your code to EC2][deploy-to-ec2]
1. [Setting up nginx][nginx]
1. [Building/deploying with create-react-app][cra-build]
1. [Using AWS Lambda][aws-lambda]

### Info:

 * This project was bootstrapped with [create-react-app][create-react-app]
 * [How to customize create-react-app setups][latest-cra-readme]


[google-analytics]: https://www.google.com/analytics/analytics/features/
[mixpanel]: https://mixpanel.com
[uuid]: https://en.wikipedia.org/wiki/Universally_unique_identifier
[iso-dates]: https://xkcd.com/1179/
[window-location]: https://www.w3schools.com/js/js_window_location.asp
[user-agent-header]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
[npm-useragent]: https://www.npmjs.com/package/useragent
[timestamp]: https://en.wikipedia.org/wiki/Timestamp
[js-dates]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
[postgres-datetime]: https://www.postgresql.org/docs/current/static/datatype-datetime.html
[date_trunc]: https://www.postgresql.org/docs/9.5/static/functions-datetime.html#FUNCTIONS-DATETIME-TRUNC
[params]: https://expressjs.com/en/api.html#req.params
[query-params]: https://expressjs.com/en/api.html#req.query
[time-series]: https://en.wikipedia.org/wiki/Time_series
[SEO]: https://en.wikipedia.org/wiki/Search_engine_optimization
[create-react-app]: https://github.com/facebookincubator/create-react-app
[latest-cra-readme]: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md
[k6]: https://k6.io
[pm2]: https://www.npmjs.com/package/pm2
[daemonize]: https://en.wikipedia.org/wiki/Daemon_(computing)
[nginx]: https://github.com/horizons-school-of-technology/aws-devops/blob/master/day2/nginx.md
[deploy-to-ec2]: https://github.com/horizons-school-of-technology/aws-devops/blob/master/day2/node-nginx.md
[cra-build]: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#deployment
[ec2-ssh-keys]: https://github.com/horizons-school-of-technology/aws-devops/blob/master/day2/ec2.md#ssh-key-setup
[ec2-setup]: https://github.com/horizons-school-of-technology/aws-devops/blob/master/day2/connect.md
[rds-setup]: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.CreatingConnecting.PostgreSQL.html
[postgres-local-setup]: https://github.com/horizons-school-of-technology/sql/blob/master/day1/setup.md
[postman]: https://www.getpostman.com/
[CORS]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
[aws-lambda]: https://github.com/horizons-school-of-technology/aws-devops/blob/master/day4/sqs-lambda.md

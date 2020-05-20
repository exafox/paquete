# paquete

> A Preview Channel for livestreams.

## Installation and Setup

As a pre-requisite, you'll need to [download and install Node](https://nodejs.org/en/).

```bash
# install dependencies
$ npm install

# copy environment variables
$ cp sample.env .env

# serve with hot reload at localhost:3000
$ npm run dev

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Technical Overview

### The Front End

Paquete is a web app built in [Nuxt](https://nuxtjs.org/) and [Vue](https://vuejs.org/). [TailwindCSS](https://tailwindcss.com/) is the preferred method for styling components. Linting is enforced via ESLint, Prettier, and Stylelint.

### The Back End

Data is pulled from a JSON feed created and managed by a Google Spreadsheet. This spreadsheet has two tabs of note, "New Schedule" and "Demo Schedule". New Schedule is considered "production" data, and the Demo Schedule is "test" data.

When creating changes to the data schema (e.g. adding new columns to the spreadsheets), changes should be first made on the demo schedule and then migrated to the new schedule. Caution should be taken when changing column headers in the spreadsheet as that will affect [mapping of data on the front-end](https://github.com/exafox/paquete/blob/master/services/api.js).

## Deployment and Hosting

This project is hosted on [Netlify](https://www.netlify.com/) and uses a Github-centric workflow. Any changes to `master` will trigger a rebuild and deployment using Nuxt's static generation method. A Gitub action is also used to push any changes made on the `master` branch to the `demo` branch. A branch deploy for master will also be triggered on Netlify at this point. Finally, any pull requests attempting to merge into master will create a deploy preview in Netlify.

This gives us several environments.

- [https://paquete.netlify.app/](https://paquete.netlify.app/) - Production code using production data
- [https://demo--paquete.netlify.app/](https://demo--paquete.netlify.app/) - Production code using test data
- Deploy previews (urls vary and are avaialable within pull requests) - New code using test data

Environment variables are used to specify which deployment context points to which data source. On Netlify, that's via the [netlify.toml file](https://github.com/exafox/paquete/blob/master/netlify.toml). In local development, that's via the `.env` file.

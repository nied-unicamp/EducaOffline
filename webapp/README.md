# AVA-Offline

## Setup

Requirements:

- NodeJS >=12
- @angular/cli (npm)

After cloning the project, download the project dependencies by running:

```bash
cd webapp/
npm ci
```

We are using `npm ci` instead of `npm install` so we do not change the `package-lock.json` unless we are doing a package version upgrade.

Finally, to run a local server, execute:

```bash
ng serve
```

If you want to use a local api that is already running, you can use the following command instead:

```bash
ng serve -c local
```

## Building

If we are build the production or staging files for proteo, there is already an automation made for this using GitLab CI/CD. Check the `proteoStag` or `proteoProd` on the angular.json file and the `gitlab-ci.yml` for reference.

For building it locally to test service workers, we need first to choose which api we want to use:

- For a local api, that you should run on localhost:8082, do:

```bash
npm run sw-build-local
```

- Otherwise, use the staging api on Proteo

```bash
npm run sw-build
```

Once the files are compiled, run the app with:

```bash
npm run sw-run
```

<div align="center">
<h1>🏎 Formula 1 quotes API 🏎</h1>

<p>
<img alt="Version" src="https://img.shields.io/badge/version-0.7.0-greenyellow.svg"/>
<img src="https://img.shields.io/badge/npm-%3E%3D8.5.0-blue.svg"/>
<img src="https://img.shields.io/badge/node-%3E%3D16.14.2-blue.svg"/>
</p>
</div>

##### An API showing several quotes said by famous Formula 1 drivers and Formula 1 personalities. It scraps all the quotes from certain webs.

##### Very easy to use. GET ```/``` shows all the F1 drivers or personalities who have quotes saved in this API, and their code to access them. For example: Max Verstappen's quotes: ```/quotes/verstappen```. Please, realize that there are people with the same last name, so you will have to write the name-last name. Example: `/quotes/michael-schumacher` and `/quotes/mick-schumacher`.

## Endpoints
#### GET list of F1 drivers or personalities with the available author endpoints
```
/
```

#### GET 10 interesting quotes of F1 drivers or personalities
```
/quotes
```

#### GET list of F1 drivers or personalities with their photos
```
/authors
```

#### GET F1 driver or personality with his photo
```
/authors/:authors_last_name
```

#### GET all saved quotes from a specific F1 driver
```
/quotes/:drivers_last_name
```

#### GET a specific quote from a specific F1 driver 
```
/quotes/:drivers_last_name/:quote_id
```

#### GET 10 quotes in each page of a specific F1 driver
```
/quotes/:drivers_last_name/p/:page
```
  

## Development setup
`npm install`

`npm run tsc`

`npm run dev`

## Testing
`npm run test`

`npm run test:watch`

## Production setup
`npm start`

## Contributing
Please report any issue you find in the issues page. Pull requests are more than welcome.

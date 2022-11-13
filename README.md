<h1 align="center">F1 quotes api 🏎</h1>

<p>
<img alt="Version" src="https://img.shields.io/badge/version-0.6.9-green.svg"/>
<img src="https://img.shields.io/badge/npm-%3E%3D8.5.0-blue.svg"/>
<img src="https://img.shields.io/badge/node-%3E%3D16.14.2-blue.svg"/>
</p>
  

##### An API showing several quotes said by famous Formula 1 drivers and Formula 1 personalities. It scraps all the quotes from certain webs.

##### Very easy to use. GET ```/``` shows all the F1 drivers or personalities who have quotes saved in this API, and their code to access them. For example: Max Verstappen's quotes: ```/quotes/verstappen```. Note that there are people with the same last name, so you will have to write the name-last name. Example: `/quotes/michael-schumacher` and `/quotes/mick-schumacher`.

#### Please don't hesitate to give me feedback if something doesn't work or you want to ask something or make a suggestion.  

## Endpoints

#### GET list of F1 drivers or personalities **->** GET ```/```

#### GET 10 interesting quotes of F1 drivers or personalities **->** GET ```/quotes```

#### GET all saved quotes from an specific F1 driver **->** GET ```/quotes/:drivers_last_name```

#### GET a specific quote from an specific F1 driver **->** GET ```/quotes/:drivers_last_name/:quote_id```

#### GET 10 quotes in each page of an specific F1 driver **->** GET ```/quotes/:drivers_last_name/p/:page```
  

## Dev:

```npm install```

```npm run tsc```

```npm run dev```

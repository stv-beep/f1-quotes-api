<h1 align="center">F1 quotes api 🏎</h1>

<p>
<img alt="Version" src="https://img.shields.io/badge/version-0.5.2-cyan.svg"/>
<img src="https://img.shields.io/badge/npm-%3E%3D8.5.0-blue.svg"/>
<img src="https://img.shields.io/badge/node-%3E%3D16.14.2-blue.svg"/>
</p>
  

##### An API showing several quotes said by famous Formula 1 drivers and Formula 1 personalities.

##### Very easy to use. GET ```/``` shows all the F1 drivers or personalities who have quotes saved in this API, and their code to access them. For example: Max Verstappen's quotes: ```/quotes/verstappen```

## Endpoints

#### GET list of F1 drivers or personalities **->** GET ```/```

#### GET 10 interesting quotes of F1 drivers or personalities **->** GET ```/quotes```

#### GET all saved quotes from an specific F1 driver **->** GET ```/quotes/:drivers_last_name```

  

## Dev:

```npm install```

```npm run tsc```

```npm run dev```
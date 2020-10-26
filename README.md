# Published Authoritative Data

- Versioned Data ( / Schema )
- Published as JSON
- Deployed as:
  - static routes
  - IPFS hash
- Provenance / Signature

## Example: [Canadian Provinces and Territories](https://www.thecanadianencyclopedia.ca/en/article/confederation)

| Province or Territory | Joined Confederation |
|---|--:|
| Alberta | 1905 |
| British Columbia | 1871 |
| Manitoba | 1870 |
| New Brunswick | 1867 |
| Newfoundland | 1949 |
| Northwest Territories | 1870 |
| Nova Scotia | 1867 |
| Nunavut | 1999 |
| Ontario | 1867 |
| Prince Edward Island | 1873 |
| Quebec | 1867 |
| Saskatchewan | 1905 |
| Yukon | 1898 |

## Usage

To regenerate all data in `./public/data/{named|immutable}` from `./data/historical.json`:

```bash
npm run generate
```

## Setup

```bash
npx create-next-app
```

## TODO

- publish as static site (next.js) - vercel
  - with static json assets (named and immutable)
- publish data as ipfs
- publish site with ipfs

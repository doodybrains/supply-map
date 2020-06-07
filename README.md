# SUPPLY MAP

Live site is here, updated daily: http://supply-map.net/

## To run locally:

`npm install`

`npm run start`

note: You'll need an API key for Mapbox and a link to a Google spreadsheet in order to pull in live data. The Google Sheet is output as a csv. To use this code with your own data you will need to add a `.env.development` file to the root of the project and then add the following keys:

```
REACT_APP_GOOGLE_SHEET=link-for-your-google-sheet-output-as-csv

REACT_APP_MAPBOX=api-key-for-your-mapbox-account
```

How and where to deploy the site is up to you. If you have a Netlify account its easy to connect your GitHub repo and push the code up there. We are currently hosting this site on Digital Ocean (s/o to Dan Shiffman for helping us do that!)

## How to get involved:

We are looking for help in either:
1. __Maintaining or contributing to the spreadsheet__ of supply location information that's powering this site. If you are an organization that is compiling similar resources we'd love to collaborate with you!
2. __Contributing to the code.__ Please submit issues to this github repo as they come up. Feel free to fork for your own purposes, or open pull requests to contribute to this one!

Contact @doodybrains or @jackieis_online on Twitter to get involved in this project!

Thank you to Dan Shiffman for the technical resources and all of our volunteers.


#### coders take note:

We removed the "master" branch and renamed it. [There is power in naming things.](https://listen.datasociety.net/episodes/race-after-technology/transcript)

*to do this on your own project follow these steps:*

```
git checkout -b adifferentname master 
git push -u origin adifferentname       

go to project on github.com, go to Settings > Branches 
change default branch to adifferentname branch

git branch -d master            
git push --delete origin master  
git remote prune origin        
```

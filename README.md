### Detector Inspector – Engineer Evaluation

#### Assumptions/Limitations

1.  Target the first "table" find in the page.
2.  Numeric values will be displayed through Y axis ("values from table"). X axis have hard code value ("not getting from the table")
3.  Numeric values will be filtered. (Ex: if cell value is "168.2 cm (5 ft 6 in)", value 168.2 will be used in chart removing other values)

#### How to install

1.  Clone the repository.
2.  Run `npm install`.
3.  Create any chart by providing the URL via CML `npm run start -- {{url}}`
4.  Chart file/graph will created in root folder

#### NPM Scripts for run the program

    npm run start -- 'https://en.wikipedia.org/wiki/Women%27s_high_jump_world_record_progression'

    npm run start -- 'https://en.wikipedia.org/wiki/Average_human_height_by_country'

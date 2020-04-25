This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Go to the react project folder and run:
`yarn build`

Go to the root folder of the project and copy:
`mv <project/build/*> ./nederlands-oefening/`

This will copy the entire project that was built inside the build folder to the folder that Github will display.

### Converting CSV to JSON

Make sure you have `csvtojson` installed globally:
`npm -i -g csvtojson`

Run: csvtojson <file.csv> > <destination.json>


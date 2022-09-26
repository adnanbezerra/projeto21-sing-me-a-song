# <p align = "center"> Projeto 21 - Sing Me A Song </p>

<p align="center">
   <img src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f399-fe0f.svg" width="300px"/>
</p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-adnanbezerra-4dae71?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/adnanbezerra/projeto21-sing-me-a-song?color=4dae71&style=flat-square" />
</p>


##  :clipboard: Description

That's a project focused mainly on the development of my testing skills. I didn't code any of the API, database, frontend nor anything like that; I've only made sure that it was well tested, with almost 100% of code coverage. To do so, I've used integrated, unitary and E2E testing by using Jest and Cypress; I've also used testing database and mocking functions.

***

## :computer:	 Technologies and Concepts

- Integrated and unitary testings with Jest
- End-to-end testing with Cypress
- Testing database with Prisma

***

## 🏁 Running the application

In order to run all the testing made in this project, you need to make sure you have [Node.js](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/)'s latest stable versions on your machine.

First of all, clone this repository onto your machine:

```
git clone https://github.com/adnanbezerra/projeto21-sing-me-a-song
```

Then, inside your directory, you need to navigate towards the front and the back-ends directories and run `npm install` on them:

```
cd front-end
npm install
```

```
cd ../back-end
npm install
```

Once it's done, to test the back-end, you need to once again navigate towards the back-end directory and run `npm run test`:

```
cd back-end
npm run test
```

And, to test the front-end, you have to navigate towards the front-end directory and then run `npx cypress open`:

```
cd ../front-end
npx cypress open
```

And then click Run Integration Tests
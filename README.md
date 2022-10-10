![chemistry.jpg](https://cdn.hashnode.com/res/hashnode/image/upload/v1665417002730/UXMk3dAKI.jpg align="left")

>

<p align="center">
    <a href="https://unsplash.com/photos/JeInkKlI2Po" target="_blank">
         Photo by Louis Reed
    </a>
</p>

Setting up a next.js project for testing is fairly easy. For this setup we would be following the official guide on the [Next.js documentation](https://nextjs.org/docs/testing#jest-and-react-testing-library), however I would be explaining why we use certain things hence this article.

For our setup we would be making use of

- Jest
- React Testing Library
- Typescript

I always choose React Testing Library becomes it is built in such a way that it prevents you from testing implementation details. Want to know why you shouldn't be testing implementation details? Check out this article by [Kent C. Dodds](https://kentcdodds.com/blog/testing-implementation-details)

## Initialize the project

Let's get on with it. Initialize your project with this command

```
yarn create next-app --typescript
```

## Install the necessary dependencies

If you are using Next.js 12 or any version higher, It has built in configuration for jest. Normally It is wise to update versions of techs you use, so I would suggest you upgrade your Next app to version 12 or higher if it is currently a lower version.
With that said, our next step would be to install jest and the associated pakages we need for testing. Open your command line and run:

```
yarn add -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

## Create configuration file

With our required packages installed, the next thing we need to do is to create a jest config file. Note that your jest configuration could exist in your package.json file as a key value pair, however for seperation of concerns let's store it in a seperate file. Since configuration files really do not really need type checking you can simply create a `jest.config.js` file. However since we already make use of typescript, lets create a `jest.config.ts` file instead. In order for the us to create that we need to install `ts-node` so run:

```
yarn add -D ts-node
```

So to reiterate:

- `jest.config.js` - No need for ts-node
- `jest.config.ts` - Install ts-node

If we create our jest.config file as a typescript file and don't have ts-node installed, we would get an error like what we have in the screenshot below

![Screenshot 2022-10-09 at 10.16.53.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1665307139899/5B5KvfyTn.png align="left")

Now in our config file write this "required" lines of code

```
import nextJest from "next/jest";

const createJestConfig = nextJest({
	dir: "./", //Path to our Next App, which is basically the root of our project, if your next app wasn't in the same directory as your jest config, then this value would be different
});

const config = {
    testEnvironment: "jest-environment-jsdom"
}

export default createJestConfig(config);

```

So what are we doing in this file. First of all we import `next/jest`, since it already has the built in configurations we need. Secondly we make reference to the root path of our application in the `createJestConfig` section. Thirdly we create an extra `config` object where we would be putting any configurations we need. Fourthly, we add the `testEnvironment` to the configurations we create. Finally we export our configurations.

## Create our first test

We have successfully created the "required" configurations for our test so we can spin up a test now.
Following the [jest default configuration to detect test files](https://jestjs.io/docs/configuration#testmatch-arraystring), in your root folder create a `__test__` folder. After which create a simple test file called `app.test.tsx`. Jest would automatically look for all files that end with a `test.ts`, `test.tsx`, `test.js`, `test.jsx` extension and consider the code in it as tests

In your app.test file, write the following code down:

```
import { render } from "@testing-library/react";
import Home from "../pages/index";

describe("Application", () => {
	it("renders correctly", () => {
		render(<Home />);
	});
});
```

What have we done here? We have created our first test by importing our index page and rendering it on our jest-dom.
We have to new keywords in our file, `describe` and `it`.

- describe : Creates a block that groups several related tests [See here](https://jestjs.io/docs/api#describename-fn)
- it: This is where you write the logic for your test. "it" is an alias of the ["test"](https://jestjs.io/docs/api#testname-fn-timeout) keyword

With our first test written (even though we are just rendering and not actually testing anything yet), it's time to run our test. You can run the command I am about to give directly in the terminal, but for consistency sake, I like to add it to the list of scripts in the package.json file so it can be run the exact same way as other scripts. Open your package.json file and add a test script like this

![Screenshot 2022-10-08 at 20.06.26.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1665256003531/-HT_ZtXPQ.png align="left")

We have now added:

```
jest --watch
```

Like I said earlier on, you can equally simply run that command on your terminal and you would get the needed result, but I just prefer putting it in the package.json. With all finally set lets now run the test command:

```
yarn run test
```

We should then see this in our terminal as we are good to go

![Screenshot 2022-10-08 at 21.36.47.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1665261420580/RTfOGRE9w.png align="left")

If we run our application by entering `yarn run dev` in the command line, we should have an output that looks like this (i.e with the exception of the red circle 😄)

![Screenshot 2022-10-08 at 21.45.19.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1665262090934/xt2hE-xVH.png align="left")

For our first actual test, let's check that the "Next.js" text we circled in the picture above is actually shown in the DOM.

```
import { render, screen } from "@testing-library/react";
import Home from "../pages/index";

describe("Application", () => {
	it("renders correctly", () => {
		render(<Home />);
		expect(screen.getByText(/Next.js!/)).toBeInTheDocument();
	});
});
```

We have added a test assertion saying we expect the "Next.js" test to be in the Document. Unfortunately when our tests automatically compile, an error occurs. You should see something like this in your terminal

![Screenshot 2022-10-09 at 09.22.47.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1665304312168/s2F-3UY9o.png align="left")

The `toBeInTheDocument` function we used, is part of a group called "custom matchers". In that same group we have functions like `toBeDisabled`, `toBeEnabled` e.t.c. As you can see by their nomenclature, they make it very easy for you to make assertions because of their descriptive nature. Now for our custom matchers to work we need to import "extend-expect" from our testing library dom. "extend-expect", like the name implies is used to add more functions or extend the "expect" function that we already use in our assertions.
So lets import extend-expect from our testing library

```
import { render, screen } from "@testing-library/react";
import Home from "../pages/index";
import "@testing-library/jest-dom/extend-expect";

describe("Application", () => {
	it("renders correctly", () => {
		render(<Home />);
		expect(screen.getByText(/Next.js!/)).toBeInTheDocument();
	});
});
```

When our code compiles again, you would notice that the error is gone and our test now passes. Good job 🎉

## Common Configurations

Now even though we have just one test file in our application, it is often common to have more than one test file and usually we would need some setup to be run before each of our tests. Some of the things we might need to run before each of our test files might include:

- Making sure we extend-expect, like we did in the last step
- Initializing a `dotenv` file
  and so much more.

To have these kind of setups run before each of our tests, we need to add them into a `jest.setup.ts` file and then make a reference to that file in our jest.config.ts.
So lets:

Create a `jest.setup.ts` file

```
touch jest.setup.ts
```

Add the common setup we need to our file. For now that is extending expect

```
import "@testing-library/jest-dom/extend-expect";
```

Make a reference to this file in our jest.config.ts by adding `setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"]` into our config object. Our config file should now look like this

```
const nextJest = require("next/jest");

const createJestConfig = nextJest({
	dir: "./",
});

const config = {
	testEnvironment: "jest-environment-jsdom",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default createJestConfig(config);
```

Remove the `import "@testing-library/jest-dom/extend-expect"` import from our `app.test.tsx`, so that it is no longer referenced in the file. `app.test.tsx` should now look like this:

```
import { render, screen } from "@testing-library/react";
import Home from "../pages/index";

describe("Application", () => {
	it("renders correctly", () => {
		render(<Home />);
		expect(screen.getByText(/Next.js!/)).toBeInTheDocument();
	});
});
```

Restart your tests.

Hurray 🎉🎉🎉. Everything works perfectly and our test passes.

CONCLUSION
Testing next.js apps is fun, and it is something you would do often in order to ensure that your app is stable and doesn't break down unnecessarily. The setup process can be quite repetitive so having this base setup down is good.

What have we learnt:

1. The necessarily packages to help run tests in next.js
2. How to make typescript configs work using ts-node
3. The default configurations in order to make our tests to run
4. How to add custom matchers to our app
5. How to make some setup, available to all of our test

In the next series of articles, we would be diving in to more details about testing a react.js/next.js application

- Live Site:
  https://testing-next.netlify.app/
- Github Repo
  %[https://github.com/davidobodo/setting-up-nextjs-test]

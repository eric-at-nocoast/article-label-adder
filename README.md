# Label your Zendesk Help Center articles with the user segment

<!-- Description of project-->

This app loops through your articles and checks to see if they have a user_segment. If it does, then it will add a corresponding label to the article that can be used to filter the articles in the [mobile sdk](https://developer.zendesk.com/documentation/classic-web-widget-sdks/support-sdk/ios/help_center/#filter-articles-by-label)
​

​

## Getting started

​
Follow these steps to get a local copy up and running.
​

<!-- Any required packages or dependencies prior to installation of the app-->

### Prerequisites

​

- npm

```
npm install npm@latest -g
```

<!-- Steps to get the app running locally -->

### Installation

1. Clone the repo

```
git clone https://github.com/eric-at-zd/article-label-adder
```

2. Install dependancies

```
npm install
```

3. Copy the .env.example file into an .env

4. Replace placeholder values with one's relevant to your account 

5. Run the app. Unless otherwise specified, this will open on localhost:5000

```
npm run start
```

​

# Serverless App using DynamoDB built with SAM

https://awstut.com/en/2022/03/11/serverless-app-using-dynamodb-built-with-sam/

# Architecture

![dva-01-001-diagram](https://user-images.githubusercontent.com/84276199/209225197-a378e121-72cc-4fb2-822a-e5d6f251ed1a.png)

# Requirements

* AWS SAM CLI

# Usage

```bash
sam init
Which template source would you like to use?
        1 - AWS Quick Start Templates
        2 - Custom Template Location
Choice: 1
What package type would you like to use?
        1 - Zip (artifact is a zip uploaded to S3)
        2 - Image (artifact is an image uploaded to an ECR image repository)
Package type: 1

Which runtime would you like to use?
        1 - nodejs12.x
        2 - python3.8
        3 - ruby2.7
        4 - go1.x
        5 - java11
        6 - dotnetcore3.1
        7 - nodejs10.x
        8 - python3.7
        9 - python3.6
        10 - python2.7
        11 - ruby2.5
        12 - java8.al2
        13 - java8
        14 - dotnetcore2.1
Runtime: 2

Project name [sam-app]: dva-01-001

Cloning app templates from https://github.com/aws/aws-sam-cli-app-templates

AWS quick start application templates:
        1 - Hello World Example
        2 - EventBridge Hello World
        3 - EventBridge App from scratch (100+ Event Schemas)
        4 - Step Functions Sample App (Stock Trader)
        5 - Elastic File System Sample App
Template selection: 1

    -----------------------
    Generating application:
    -----------------------
    Name: dva-01-001
    Runtime: python3.8
    Dependency Manager: pip
    Application Template: hello-world
    Output Directory: .
    
    Next steps can be found in the README file at ./dva-01-001/README.md
```

#Place Files

```bash
tree dva-01-001/
dva-01-001/
├── events
│   └── event.json
├── hello_world
│   ├── app.py
│   ├── __init__.py
│   └── requirements.txt
├── __init__.py
├── README.md
├── template.yaml
└── tests
    ├── __init__.py
    ├── integration
    │   ├── __init__.py
    │   └── test_api_gateway.py
    ├── requirements.txt
    └── unit
        ├── __init__.py
        └── test_handler.py
```

## SAM App Deploy

```bash
sam build --use-container

sam deploy --guided
```

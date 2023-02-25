# Storing session data from web apps created with API Gateway and Lambda in DynamoDB

https://awstut.com/en/2023/02/26/storing-session-data-from-web-apps-created-with-api-gateway-and-lambda-in-dynamodb-en/

# Architecture

![dva-03-006-diagram](https://user-images.githubusercontent.com/84276199/221382200-c18c8b5a-538a-4730-847b-bfde4f88cf7e.png)

# Requirements

* AWS CLI
* S3 Bucket(Here, the bucket name is *my-bucket* and region is *ap-northeast-1*)

# Usage

## Tempalte File Modification

Modify the following locations in dva-03-006.yaml.

```yaml
Parameters:
  TemplateBucketName:
    Type: String
    Default: [bucket-name]
```

## Upload  Template Files to S3 Bucket

```bash
aws s3 cp . s3://my-bucket/dva-03-006/ --recursive
```

## CloudFormation Stack Creation

```bash
aws cloudformation create-stack \
--stack-name dva-03-006 \
--template-url https://my-bucket.s3.ap-northeast-1.amazonaws.com/dva-03-006/dva-03-006.yaml \
--capabilities CAPABILITY_IAM
```

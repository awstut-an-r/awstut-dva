# Data received by Kinesis Data Streams and stored in OpenSearch Serverless via Firehose

https://awstut.com/en/2024/05/01/data-received-by-kinesis-data-streams-and-stored-in-opensearch-serverless-via-firehose-en/

# Architecture

![dva-03-010-diagram](https://github.com/awstut-an-r/awstut-fa/assets/84276199/0855204c-d2f0-4ebd-8090-9e89dd7cc3d8)

# Requirements

* AWS CLI
* S3 Bucket(Here, the bucket name is *my-bucket* and region is *ap-northeast-1*)

# Usage

## Tempalte File Modification

Modify the following locations in dva-03-010.yaml.

```yaml
Parameters:
  TemplateBucketName:
    Type: String
    Default: [bucket-name]
```

## Upload  Template Files to S3 Bucket

```bash
aws s3 cp . s3://my-bucket/dva-03-010/ --recursive
```

## CloudFormation Stack Creation

```bash
aws cloudformation create-stack \
--stack-name dva-03-009 \
--template-url https://my-bucket.s3.ap-northeast-1.amazonaws.com/dva-03-009/dva-03-009.yaml \
--capabilities CAPABILITY_NAMED_IAM
```

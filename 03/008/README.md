# Introduction to SQS FIFO Queues

https://awstut.com/en/2023/07/29/introduction-to-sqs-fifo-queues-en/

# Architecture

![dva-03-008-diagram](https://github.com/awstut-an-r/awstut-fa/assets/84276199/7159bc38-3823-44af-b6c6-4957acaf80ed)

# Requirements

* AWS CLI
* S3 Bucket(Here, the bucket name is *my-bucket* and region is *ap-northeast-1*)

# Usage

## Tempalte File Modification

Modify the following locations in dva-03-008.yaml.

```yaml
Parameters:
  TemplateBucketName:
    Type: String
    Default: [bucket-name]
```

## Upload  Template Files to S3 Bucket

```bash
aws s3 cp . s3://my-bucket/dva-03-008/ --recursive
```

## CloudFormation Stack Creation

```bash
aws cloudformation create-stack \
--stack-name dva-03-008 \
--template-url https://my-bucket.s3.ap-northeast-1.amazonaws.com/dva-03-008/dva-03-008.yaml \
--capabilities CAPABILITY_IAM
```

# Server-side encryption of Kinesis Data Streams and Firehose using KMS

https://awstut.com/en/2024/05/18/server-side-encryption-of-kinesis-data-streams-and-firehose-using-kms-en/

# Architecture

![dva-02-005-diagram](https://github.com/awstut-an-r/awstut-fa/assets/84276199/e65e2596-ca48-48e1-b5b8-bc1b31e7a95b)

# Requirements

* AWS CLI
* S3 Bucket(Here, the bucket name is *my-bucket* and region is *ap-northeast-1*)

# Usage

## Tempalte File Modification

Modify the following locations in dva-02-005.yaml.

```yaml
Parameters:
  TemplateBucketName:
    Type: String
    Default: [bucket-name]
```

## Upload  Template Files to S3 Bucket

```bash
aws s3 cp . s3://my-bucket/dva-02-005/ --recursive
```

## CloudFormation Stack Creation

```bash
aws cloudformation create-stack \
--stack-name dva-02-005 \
--template-url https://my-bucket.s3.ap-northeast-1.amazonaws.com/dva-02-005/dva-02-005.yaml \
--capabilities CAPABILITY_IAM
```

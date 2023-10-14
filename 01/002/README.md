# Checking the behavior of .extensions in Elastic Beanstalk

https://awstut.com/en/2023/10/14/checking-the-behavior-of-extensions-in-elastic-beanstalk-en/

# Architecture

![dva-01-002-diagram](https://github.com/awstut-an-r/awstut-fa/assets/84276199/cafdbcd7-2c74-4249-be5e-2d1b996aa69c)

# Requirements

* AWS CLI
* S3 Bucket(Here, the bucket name is *my-bucket* and region is *ap-northeast-1*)

# Usage

## Tempalte File Modification

Modify the following locations in dva-01-002.yaml.

```yaml
Parameters:
  TemplateBucketName:
    Type: String
    Default: [bucket-name]
```

## Upload  Template Files to S3 Bucket

```bash
aws s3 cp . s3://my-bucket/dva-01-002/ --recursive
```

## CloudFormation Stack Creation

```bash
aws cloudformation create-stack \
--stack-name dva-01-002 \
--template-url https://my-bucket.s3.ap-northeast-1.amazonaws.com/dva-01-002/dva-01-002.yaml \
--capabilities CAPABILITY_IAM
```

# Set threshold values for CloudWatch custom metrics and email notification via SNS

https://awstut.com/en/2023/04/02/set-threshold-values-for-cloudwatch-custom-metrics-and-email-notification-via-sns-en/

# Architecture

![dva-05-003-diagram](https://user-images.githubusercontent.com/84276199/229330509-081eadfe-2f09-4392-9ef4-93817a6c3fb7.png)

# Requirements

* AWS CLI
* S3 Bucket(Here, the bucket name is *my-bucket* and region is *ap-northeast-1*)

# Usage

## Tempalte File Modification

Modify the following locations in dva-05-003.yaml.

```yaml
Parameters:
  TemplateBucketName:
    Type: String
    Default: [bucket-name]
```

## Upload  Template Files to S3 Bucket

```bash
aws s3 cp . s3://my-bucket/dva-05-003/ --recursive
```

## CloudFormation Stack Creation

```bash
aws cloudformation create-stack \
--stack-name dva-05-003 \
--template-url https://my-bucket.s3.ap-northeast-1.amazonaws.com/dva-05-003/dva-05-003.yaml \
--capabilities CAPABILITY_IAM
```

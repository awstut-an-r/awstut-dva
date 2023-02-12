# Email notification via SNS when error occurs in CodePipeline

https://awstut.com/en/2023/02/12/email-notification-via-sns-when-error-occurs-in-codepipeline-en/

# Architecture

![dva-05-002-diagram](https://user-images.githubusercontent.com/84276199/218297230-a0c5dc15-5214-4b07-8308-b6950a9b8fc2.png)

# Requirements

* AWS CLI
* S3 Bucket(Here, the bucket name is *my-bucket* and region is *ap-northeast-1*)

# Usage

## Tempalte File Modification

Modify the following locations in dva-05-002.yaml.

```yaml
Parameters:
  TemplateBucketName:
    Type: String
    Default: [bucket-name]
```

## Upload  Template Files to S3 Bucket

```bash
aws s3 cp . s3://my-bucket/dva-05-002/ --recursive
```

## CloudFormation Stack Creation

```bash
aws cloudformation create-stack \
--stack-name dva-05-002 \
--template-url https://my-bucket.s3.ap-northeast-1.amazonaws.com/dva-05-002/dva-05-002.yaml \
--capabilities CAPABILITY_IAM
```

# Trigger an image upload to S3 invokes Lambda function to create thumbnails

https://awstut.com/en/2023/01/15/trigger-image-upload-to-s3-invokes-lambda-function-to-create-thumbnails-en/

# Architecture

![dva-03-005-diagram](https://user-images.githubusercontent.com/84276199/212537296-172a2cd7-3b44-454c-82fa-ac3748241243.png)

# Requirements

* AWS CLI
* S3 Bucket(Here, the bucket name is *my-bucket* and region is *ap-northeast-1*)

# Usage

## Tempalte File Modification

Modify the following locations in dva-03-005.yaml.

```yaml
Parameters:
  TemplateBucketName:
    Type: String
    Default: [bucket-name]
```

## Upload  Template Files to S3 Bucket

```bash
aws s3 cp . s3://my-bucket/dva-03-005/ --recursive
```

## CloudFormation Stack Creation

```bash
aws cloudformation create-stack \
--stack-name dva-03-005 \
--template-url https://my-bucket.s3.ap-northeast-1.amazonaws.com/dva-03-005/dva-03-005.yaml \
--capabilities CAPABILITY_IAM
```

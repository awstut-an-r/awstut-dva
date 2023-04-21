# Scaling based on CloudWatch custom metrics – number of connections version

https://awstut.com/en/2023/04/22/scaling-based-on-cloudwatch-custom-metrics-number-of-connections-version-en/

# Architecture

![dva-03-007-diagram](https://user-images.githubusercontent.com/84276199/233736051-16b439be-6b35-4b87-842a-22d95894662c.png)

# Requirements

* AWS CLI
* S3 Bucket(Here, the bucket name is *my-bucket* and region is *ap-northeast-1*)

# Usage

## Tempalte File Modification

Modify the following locations in dva-03-007.yaml.

```yaml
Parameters:
  TemplateBucketName:
    Type: String
    Default: [bucket-name]
```

## Upload  Template Files to S3 Bucket

```bash
aws s3 cp . s3://my-bucket/dva-03-007/ --recursive
```

## CloudFormation Stack Creation

```bash
aws cloudformation create-stack \
--stack-name dva-03-007 \
--template-url https://my-bucket.s3.ap-northeast-1.amazonaws.com/dva-03-007/dva-03-007.yaml \
--capabilities CAPABILITY_IAM
```

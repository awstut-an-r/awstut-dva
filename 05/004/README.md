# Enable Lambda Insight using CloudFormation

https://awstut.com/en/2023/05/27/enable-lambda-insight-using-cloudformation-en/

# Architecture

![dva-05-004-diagram](https://github.com/awstut-an-r/awstut-fa/assets/84276199/3198fce4-d3bc-4a73-bf03-01defae86cbf)

# Requirements

* AWS CLI
* S3 Bucket(Here, the bucket name is *my-bucket* and region is *ap-northeast-1*)

# Usage

## Tempalte File Modification

Modify the following locations in dva-05-004.yaml.

```yaml
Parameters:
  TemplateBucketName:
    Type: String
    Default: [bucket-name]
```

## Upload  Template Files to S3 Bucket

```bash
aws s3 cp . s3://my-bucket/dva-05-004/ --recursive
```

## CloudFormation Stack Creation

```bash
aws cloudformation create-stack \
--stack-name dva-05-004 \
--template-url https://my-bucket.s3.ap-northeast-1.amazonaws.com/dva-05-004/dva-05-004.yaml \
--capabilities CAPABILITY_IAM
```

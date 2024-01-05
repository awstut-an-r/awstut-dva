# Check the public address from EC2 metadata

https://awstut.com/en/2024/01/06/check-the-public-address-from-ec2-metadata-en/

# Architecture

![dva-03-009-diagram](https://github.com/awstut-an-r/awstut-fa/assets/84276199/199ea04d-53d6-41b1-a785-69c2fc98f37d)

# Requirements

* AWS CLI
* S3 Bucket(Here, the bucket name is *my-bucket* and region is *ap-northeast-1*)

# Usage

## Tempalte File Modification

Modify the following locations in dva-03-009.yaml.

```yaml
Parameters:
  TemplateBucketName:
    Type: String
    Default: [bucket-name]
```

## Upload  Template Files to S3 Bucket

```bash
aws s3 cp . s3://my-bucket/dva-03-009/ --recursive
```

## CloudFormation Stack Creation

```bash
aws cloudformation create-stack \
--stack-name dva-03-009 \
--template-url https://my-bucket.s3.ap-northeast-1.amazonaws.com/dva-03-009/dva-03-009.yaml \
--capabilities CAPABILITY_IAM
```

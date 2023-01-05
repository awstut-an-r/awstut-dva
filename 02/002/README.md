# Delegate access rights between AWS accounts using cross-account roles

https://awstut.com/en/2023/01/04/delegate-access-rights-between-aws-accounts-using-cross-account-roles-en/

# Architecture

![dva-02-002-diagram](https://user-images.githubusercontent.com/84276199/210528646-a1db235e-0faf-4083-840b-e94c043aa486.png)

# Requirements

* AWS CLI
* S3 Bucket(Here, the bucket name is *my-bucket* and region is *ap-northeast-1*)

# Usage

## Tempalte File Modification

Modify the following locations in dva-02-002.yaml.

```yaml
Parameters:
  TemplateBucketName:
    Type: String
    Default: [bucket-name]
```

## Upload  Template Files to S3 Bucket

```bash
aws s3 cp . s3://my-bucket/dva-02-002/ --recursive
```

## CloudFormation Stack Creation

```bash
aws cloudformation create-stack \
--stack-name dva-02-002 \
--template-url https://my-bucket.s3.ap-northeast-1.amazonaws.com/dva-02-002/dva-02-002.yaml \
--capabilities CAPABILITY_IAM
```

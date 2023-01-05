# Deliver custom metrics periodically with SSM Run Command

https://awstut.com/en/2021/12/30/deliver-custom-metrics-periodically-with-ssm-run-command/

# Architecture

![dva-02-001-diagram](https://user-images.githubusercontent.com/84276199/210880113-7d1915cb-f0fd-4561-a8ca-1472b9b6d729.png)

# Requirements

* AWS CLI
* S3 Bucket(Here, the bucket name is *my-bucket* and region is *ap-northeast-1*)

# Usage

## Tempalte File Modification

Modify the following locations in dva-02-001.yaml.

```yaml
Parameters:
  TemplateBucketName:
    Type: String
    Default: [bucket-name]
```

## Upload  Template Files to S3 Bucket

```bash
aws s3 cp . s3://my-bucket/dva-02-001/ --recursive
```

## CloudFormation Stack Creation

```bash
aws cloudformation create-stack \
--stack-name dva-02-001 \
--template-url https://my-bucket.s3.ap-northeast-1.amazonaws.com/dva-02-001/dva-02-001.yaml \
--capabilities CAPABILITY_IAM
```

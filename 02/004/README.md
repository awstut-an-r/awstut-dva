# Create Web app using DynamoDB with ECS (Fargate)

https://awstut.com/en/2023/05/04/create-web-app-using-dynamodb-with-ecs-fargate-en/

# Architecture

![dva-02-004-diagram-01](https://user-images.githubusercontent.com/84276199/236060242-8e9b1152-6344-4950-b412-585df5c5d725.png)

# Requirements

* AWS CLI
* S3 Bucket(Here, the bucket name is *my-bucket* and region is *ap-northeast-1*)

# Usage

## Tempalte File Modification

Modify the following locations in dva-02-004.yaml.

```yaml
Parameters:
  TemplateBucketName:
    Type: String
    Default: [bucket-name]

  DockerHubPassword:
    Type: String
    Default: [password]
    
  DockerHubUsername:
    Type: String
    Default: [username]
```

## Upload  Template Files to S3 Bucket

```bash
aws s3 cp . s3://my-bucket/dva-02-004/ --recursive
```

## CloudFormation Stack Creation

```bash
aws cloudformation create-stack \
--stack-name dva-02-004 \
--template-url https://my-bucket.s3.ap-northeast-1.amazonaws.com/dva-02-004/dva-02-004.yaml \
--capabilities CAPABILITY_IAM
```

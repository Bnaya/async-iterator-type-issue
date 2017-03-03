import "source-map-support/register";
import * as aws from "aws-sdk";
import { S3 } from "aws-sdk";
import S3BucketAsyncIterator from './S3BucketAsyncIterator';
import { S3IteratorOptions } from './S3BucketIterable';


const bucket = "foo";


export default class S3BucketIterable implements AsyncIterable<S3.Types.Object> {
  constructor(private s3: S3, private options: S3IteratorOptions) {
  }

  [Symbol.asyncIterator]() {
    return new S3BucketAsyncIterator(this.s3, this.options);
  }
}


const s3Client = new aws.S3({
  credentials: {
    accessKeyId: "",
    secretAccessKey: ""
  }
});


const fooBucket2: AsyncIterable<string> = {
  [Symbol.asyncIterator]() {
    return new S3BucketAsyncIterator(s3Client, {
      Bucket: bucket,
      Prefix: 'events/',
      MaxKeys: 20,
      // Delimiter: '/'
    });
  }
};

const oBucket = new S3BucketIterable(s3Client, {
  Bucket: bucket,
  Prefix: 'events/',
  MaxKeys: 20,
  // Delimiter: '/'
});

async function foo() {

  for await (const s3obj of fooBucket2) {

  }

  // why error ????
  for await (const s3obj of oBucket) {

  }
}

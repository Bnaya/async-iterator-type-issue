import { S3 } from "aws-sdk";

import { S3IteratorOptions } from './S3BucketIterable'

export class S3BucketIterable implements AsyncIterable<S3.Types.Object> {
  constructor(private s3: S3, private options: S3IteratorOptions) {
  }

  [Symbol.asyncIterator]() {
    return new S3BucketAsyncIterator(this.s3, this.options);
  }
}

export default class S3BucketAsyncIterator implements AsyncIterator<S3.Types.Object> {
  private lastKey: S3.StartAfter | undefined;
  private locationInCurrentResponse = 0;
  private currentResponse: S3.ListObjectsV2Output | undefined;
  private lock = false;
  private isDone = false;
  private continuationToken: string | undefined;

  constructor(private s3: S3, private options: S3IteratorOptions) {
    this.lastKey = options.StartAfter;
  }

  // async next(): Promise<{ value: S3.Types.Object | undefined, done: boolean }> {
  next(value?: any)/*: Promise<IteratorResult<S3.Types.Object | undefined>>*/ {
    if (this.lock) {
      throw new Error('You must wait until the previous `next` operation to finish');
    }

    if (this.isDone) {
      return Promise.resolve<IteratorResult<S3.Types.Object>>({
        done: true,
        value: undefined
      });
    }

    this.lock = true;

    return Promise.resolve()
      .then(() => {
        if (this.currentResponse) {
          return this.currentResponse;
        } else {
          return this.s3.listObjectsV2({
            Bucket: this.options.Bucket,
            ContinuationToken: this.continuationToken,
            MaxKeys: this.options.MaxKeys,
            Prefix: this.options.Prefix,
            Delimiter: this.options.Delimiter
          }).promise()
            .then((response) => {
              this.currentResponse = response;
              this.continuationToken = response.ContinuationToken;
              this.locationInCurrentResponse = 0;

              return response;
            });
        }
      })
      .then((response): IteratorResult<S3.Types.Object> => {
        this.lock = false;
        if (response.Contents === undefined) {
          this.isDone = true;
          return {
            done: true,
            value: undefined
          };
        }

        const ret = response.Contents[this.locationInCurrentResponse++];

        if (this.locationInCurrentResponse === response.KeyCount) {
          this.currentResponse = undefined;
          this.locationInCurrentResponse = 0;

          if (!response.IsTruncated) {
            this.isDone = true;
          }
        }

        return {
          done: false,
          value: ret
        };
      });
  }
}

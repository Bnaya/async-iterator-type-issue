import { S3 } from "aws-sdk";

import S3BucketAsyncIterator from './S3BucketAsyncIterator';

export interface S3IteratorOptions {
  /**
   * Name of the bucket to list.
   */
  Bucket: S3.BucketName;
  /**
   * A delimiter is a character you use to group keys.
   */
  Delimiter?: S3.Delimiter;
  /**
   * Encoding type used by Amazon S3 to encode object keys in the response.
   */
  EncodingType?: S3.EncodingType;
  /**
   * Sets the maximum number of keys returned in the response. The response might contain fewer keys but will never contain more.
   */
  MaxKeys?: S3.MaxKeys;
  /**
   * Limits the response to keys that begin with the specified prefix.
   */
  Prefix?: S3.Prefix;
  // /**
  //  * ContinuationToken indicates Amazon S3 that the list is being continued on this bucket with a token. ContinuationToken is obfuscated and is not a real key
  //  */
  // ContinuationToken?: S3.Token;
  /**
   * The owner field is not present in listV2 by default, if you want to return owner field with each key in the result then set the fetch owner field to true
   */
  FetchOwner?: S3.FetchOwner;
  /**
   * StartAfter is where you want Amazon S3 to start listing from. Amazon S3 starts listing after this specified key. StartAfter can be any key in the bucket
   */
  StartAfter?: S3.StartAfter;
  /**
   * Confirms that the requester knows that she or he will be charged for the list objects request in V2 style. Bucket owners need not specify this parameter in their requests.
   */
  RequestPayer?: S3.RequestPayer;
}

export default class S3BucketIterable implements AsyncIterable<S3.Types.Object> {
  constructor(private s3: S3, private options: S3IteratorOptions) {
  }

  [Symbol.asyncIterator]() {
    return new S3BucketAsyncIterator(this.s3, this.options);
  }
}

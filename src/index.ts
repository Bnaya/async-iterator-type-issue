class FooAsyncIterator implements AsyncIterator<string> {
  next(value?: any) {
    return Promise.resolve({
      value: 'foooo',
      done: true
    });

  }
}

class FooAsyncIterable implements AsyncIterable<string> {

  [Symbol.asyncIterator]() {
    return new FooAsyncIterator()
  }
}

const fooBucket2: AsyncIterable<string> = {
  [Symbol.asyncIterator]() {
    return new FooAsyncIterator();
  }
};

const fooAsyncIterable = new FooAsyncIterable();

async function foo() {

  // no type error here
  for await (const s3obj of fooBucket2) {

  }

  // fooAsyncIterable has type error:
  /*
  [ts] The type returned by the 'next()' method of an iterator must have a 'value' property.
  */
  for await (const s3obj of fooAsyncIterable) {

  }
}

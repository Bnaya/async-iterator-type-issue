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
    return new FooAsyncIterator()
  }
};

const fooAsyncIterable = new FooAsyncIterable();

async function foo() {

  for await (const s3obj of fooBucket2) {

  }

  // why error ????
  for await (const s3obj of fooAsyncIterable) {

  }
}

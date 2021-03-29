const err = (message: string, statusCode: number) => ({
  errors: [
    {
      message,
      statusCode,
    },
  ],
});

export default err;

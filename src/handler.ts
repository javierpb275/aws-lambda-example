import { hello } from "./index";

const mockEvent = {
  body: JSON.stringify({ name: "John" }),
};

hello(mockEvent as any)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });

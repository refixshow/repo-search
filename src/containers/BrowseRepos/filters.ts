interface IAnyObject {
  [key: string]: any;
}

export const filterValuesOfArrayOfObjects = <T extends IAnyObject>(
  arrOfObjects: T[],
  phrase: string,
  skipWithout?: {
    key: keyof T;
    phrase: string;
  }
) =>
  arrOfObjects.filter((object) => {
    if (skipWithout && skipWithout?.phrase.length > 0) {
      const current = object[skipWithout.key];
      if (current !== undefined) {
        const isString = typeof current === "string";
        if (!isString) return false;

        if (!current.toLowerCase().includes(skipWithout.phrase.toLowerCase()))
          return false;
      }
    }

    // shallow
    const objectValues = Object.values(object);

    return objectValues.some((el) => {
      const isElementString = typeof el === "string";

      if (isElementString) {
        // non case sensitive
        return el.toLowerCase().includes(phrase.toLowerCase());
      }
      return false;
    });
  });

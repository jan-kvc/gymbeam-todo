import qs from "qs";

export async function fetchAPI(
  path: string,
  urlParamsObject = {},
  options = {}
) {
  try {
    // Merge default and user options
    const mergedOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    // Build request URL
    const queryString = qs.stringify(urlParamsObject, {
      encodeValuesOnly: true,
    });

    const requestUrl = `${process.env.NEXT_PUBLIC_API_URL}${`/api/${path}${
      queryString ? `?${queryString}` : ""
    }`}`;

    // console.info(`Fetching ${requestUrl}`);

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(
      `FetchAPI: An error occurred while fetching ${path}: ${error}`
    );
  }
}

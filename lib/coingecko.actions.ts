'use server';

import qs from 'query-string';

const BASE_URL = process.env.COINGECKO_BASE_URL ;
const API_KEY = process.env.COINGECKO_API_KEY ;

if(!BASE_URL) throw new Error('Could not get base url');
if(!API_KEY) throw new Error('Could not get api key');



export async function fetcher<T>(
    endpoint: string,
    params?: QueryParams,
    revalidate = 60,
): Promise<T> {
    const url =qs.stringifyUrl({
        url: `${BASE_URL}${endpoint}`,
        query: params,
    }, {skipEmptyString: true, skipNull: true});

    const response = await fetch(url, { 
        headers:{
            // "x-cg-demo-api-key": API_KEY,
             "x-cg-demo-api-key": API_KEY,
            "Content-Type": "application/json",
        } as Record<string, string>,
        next: { revalidate },
    });
    if (!response.ok) {
        const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({}));

        // throw new Error(`API Error: ${response.status} : ${errorBody.error || response.statusText}`);
      throw new Error(
                `API Error: ${response.status} : ${JSON.stringify(errorBody)}`
);
    }

    return response.json();
}


// export async function searchCoins(query:string) {

//   const data = await fetcher<{
//     coins: SearchCoin[];
//   }>(
//     "/search",
//     {
//       query,
//     },
//     300
//   );


//   return data.coins;
// }
export async function searchCoins(query: string) {

  // Step 1: search coins
  const searchData = await fetcher<{
    coins: SearchCoin[];
  }>(
    "/search",
    {
      query,
    },
    300
  );


  const coins = searchData.coins.slice(0, 10);


  const ids = coins
    .map((coin) => coin.id)
    .join(",");


  // Step 2: get market data
  const marketData = await fetcher<CoinMarketData[]>(
    "/coins/markets",
    {
      vs_currency: "usd",
      ids,
    },
    300
  );


  // Step 3: merge both
  return coins.map((coin) => {

    const market = marketData.find(
      (item) => item.id === coin.id
    );


    return {
      ...coin,

      data: {
        price: market?.current_price ?? 0,

        price_change_percentage_24h:
          market?.price_change_percentage_24h ?? 0,
      },

    };

  });

}
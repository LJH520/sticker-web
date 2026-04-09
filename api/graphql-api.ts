import {
  serverStorefrontRequest,
  type StorefrontError,
  type StorefrontRequestOptions,
  type StorefrontResponse,
} from './server-storefront-api';

/**
 * Shopify Storefront GraphQL 的服务端封装层。
 *
 * 这一层的职责：
 * 1. 暴露一个通用的 GraphQL 请求入口，供后续自定义 query/mutation 复用
 * 2. 收口当前项目常用的产品、购物车请求
 * 3. 为服务端组件提供稳定的返回类型，避免页面里手写大量 inline type
 */
type StorefrontVariables = Record<string, unknown>;

export type StorefrontImage = {
  id: string;
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type StorefrontProduct = {
  id: string;
  title: string;
  handle: string;
  featuredImage: StorefrontImage | null;
  images: {
    nodes: StorefrontImage[];
  };
};

export type ProductsQueryData = {
  shop: {
    name: string;
  };
  products: {
    nodes: StorefrontProduct[];
  };
};

type ProductsQueryVariables = {
  first: number;
  imagesFirst: number;
};

export type StorefrontAttribute = {
  key: string;
  value: string;
};

export type StorefrontAttributeInput = {
  key: string;
  value: string;
};

export type StorefrontSelectedOption = {
  name: string;
  value: string;
};

export type StorefrontProductVariant = {
  id: string;
  title: string;
  selectedOptions: StorefrontSelectedOption[];
  product: {
    id: string;
    title: string;
    handle: string;
    featuredImage: StorefrontImage | null;
  };
};

export type StorefrontCartLine = {
  id: string;
  quantity: number;
  attributes: StorefrontAttribute[];
  merchandise: StorefrontProductVariant;
};

export type StorefrontCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  attributes: StorefrontAttribute[];
  lines: {
    nodes: StorefrontCartLine[];
  };
};

export type StorefrontUserError = {
  field: string[] | null;
  message: string;
};

type GetCartData = {
  cart: StorefrontCart | null;
};

type GetCartVariables = {
  cartId: string;
  linesFirst: number;
};

export type StorefrontCartLineInput = {
  merchandiseId: string;
  quantity?: number;
  attributes?: StorefrontAttributeInput[];
  sellingPlanId?: string;
};

export type StorefrontCartBuyerIdentityInput = {
  countryCode?: string;
  customerAccessToken?: string;
  email?: string;
  phone?: string;
};

export type StorefrontCartInput = {
  attributes?: StorefrontAttributeInput[];
  buyerIdentity?: StorefrontCartBuyerIdentityInput;
  lines?: StorefrontCartLineInput[];
  note?: string;
};

type CreateCartData = {
  cartCreate: {
    cart: StorefrontCart | null;
    userErrors: StorefrontUserError[];
  };
};

type CreateCartVariables = {
  input?: StorefrontCartInput;
  linesFirst: number;
};

type AddCartLinesData = {
  cartLinesAdd: {
    cart: StorefrontCart | null;
    userErrors: StorefrontUserError[];
  };
};

type AddCartLinesVariables = {
  cartId: string;
  lines: StorefrontCartLineInput[];
  linesFirst: number;
};

export type StorefrontGraphQLOptions<TVariables extends StorefrontVariables = StorefrontVariables> =
  StorefrontRequestOptions<TVariables>;

export type StorefrontSuccessResult<TData> = {
  ok: true;
  data: TData;
};

export type StorefrontFailureResult = {
  ok: false;
  error: StorefrontError;
};

export type StorefrontResult<TData> = StorefrontSuccessResult<TData> | StorefrontFailureResult;

/** 常用商品列表查询，兼顾列表页封面图和少量商品图片。 */
const PRODUCTS_QUERY = `#graphql
  query Products($first: Int!, $imagesFirst: Int!) {
    shop {
      name
    }
    products(first: $first) {
      nodes {
        id
        title
        handle
        featuredImage {
          id
          url
          altText
          width
          height
        }
        images(first: $imagesFirst) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

/** 购物车对象公共字段，供 query 和 mutation 复用，避免字段漂移。 */
const CART_FIELDS = `#graphql
  id
  checkoutUrl
  totalQuantity
  attributes {
    key
    value
  }
  lines(first: $linesFirst) {
    nodes {
      id
      quantity
      attributes {
        key
        value
      }
      merchandise {
        __typename
        ... on ProductVariant {
          id
          title
          selectedOptions {
            name
            value
          }
          product {
            id
            title
            handle
            featuredImage {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

const GET_CART_QUERY = `#graphql
  query GetCart($cartId: ID!, $linesFirst: Int!) {
    cart(id: $cartId) {
      ${CART_FIELDS}
    }
  }
`;

const CREATE_CART_MUTATION = `#graphql
  mutation CreateCart($input: CartInput, $linesFirst: Int!) {
    cartCreate(input: $input) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const ADD_CART_LINES_MUTATION = `#graphql
  mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!, $linesFirst: Int!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/** 统一处理 Storefront 返回值，确保上层直接拿到可用 data。 */
function assertStorefrontData<TData>(response: StorefrontResponse<TData>) {
  const result = toStorefrontResult(response);

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.data;
}

/** 统一处理 mutation 的 userErrors，避免页面层重复判断。 */
function assertUserErrors(userErrors: StorefrontUserError[]) {
  const error = getUserError(userErrors);

  if (error) {
    throw new Error(error.message);
  }
}

function createStorefrontError(message: string): StorefrontError {
  return { message };
}

function getUserError(userErrors: StorefrontUserError[]) {
  if (userErrors.length === 0) {
    return null;
  }

  return createStorefrontError(userErrors[0]?.message || 'Storefront mutation failed.');
}

function toStorefrontResult<TData>(response: StorefrontResponse<TData>): StorefrontResult<TData> {
  if (response.errors) {
    return {
      ok: false,
      error: response.errors,
    };
  }

  if (response.data === undefined) {
    return {
      ok: false,
      error: createStorefrontError('Storefront API returned no data.'),
    };
  }

  return {
    ok: true,
    data: response.data,
  };
}

/**
 * 通用 GraphQL 请求入口。
 *
 * 适合两类场景：
 * 1. 当前封装里还没有的 Storefront query/mutation
 * 2. 页面或 server action 需要直接写自定义 GraphQL 文档
 */
export async function requestStorefrontGraphQL<
  TData,
  TVariables extends StorefrontVariables = StorefrontVariables,
>(operation: string, options?: StorefrontGraphQLOptions<TVariables>) {
  const response = await serverStorefrontRequest<TData, TVariables>(operation, options);
  return assertStorefrontData(response);
}

/**
 * 安全版 GraphQL 请求入口。
 *
 * 不抛出业务错误，统一返回 `ok/data/error` 结构，
 * 适合服务端组件直接做空状态或降级渲染。
 */
export async function safeRequestStorefrontGraphQL<
  TData,
  TVariables extends StorefrontVariables = StorefrontVariables,
>(
  operation: string,
  options?: StorefrontGraphQLOptions<TVariables>,
): Promise<StorefrontResult<TData>> {
  const response = await serverStorefrontRequest<TData, TVariables>(operation, options);
  return toStorefrontResult(response);
}

/** 获取商品列表，默认走可缓存请求。 */
export async function getProducts({
  first = 12,
  imagesFirst = 1,
  cache = 'force-cache',
  next,
}: {
  first?: number;
  imagesFirst?: number;
  cache?: RequestCache;
  next?: StorefrontRequestOptions['next'];
} = {}) {
  return requestStorefrontGraphQL<ProductsQueryData, ProductsQueryVariables>(PRODUCTS_QUERY, {
    variables: {
      first,
      imagesFirst,
    },
    cache,
    next,
  });
}

/** 获取商品列表的安全版，不抛错。 */
export async function safeGetProducts({
  first = 12,
  imagesFirst = 1,
  cache = 'force-cache',
  next,
}: {
  first?: number;
  imagesFirst?: number;
  cache?: RequestCache;
  next?: StorefrontRequestOptions['next'];
} = {}): Promise<StorefrontResult<ProductsQueryData>> {
  return safeRequestStorefrontGraphQL<ProductsQueryData, ProductsQueryVariables>(PRODUCTS_QUERY, {
    variables: {
      first,
      imagesFirst,
    },
    cache,
    next,
  });
}

/** 获取购物车，购物车属于用户实时状态，默认不缓存。 */
export async function getCart({
  cartId,
  linesFirst = 20,
}: {
  cartId: string;
  linesFirst?: number;
}) {
  const data = await requestStorefrontGraphQL<GetCartData, GetCartVariables>(GET_CART_QUERY, {
    variables: {
      cartId,
      linesFirst,
    },
    cache: 'no-store',
  });

  return data.cart;
}

/** 获取购物车的安全版，不抛错。 */
export async function safeGetCart({
  cartId,
  linesFirst = 20,
}: {
  cartId: string;
  linesFirst?: number;
}): Promise<StorefrontResult<StorefrontCart | null>> {
  const result = await safeRequestStorefrontGraphQL<GetCartData, GetCartVariables>(GET_CART_QUERY, {
    variables: {
      cartId,
      linesFirst,
    },
    cache: 'no-store',
  });

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: result.data.cart,
  };
}

/** 创建购物车，返回创建后的完整购物车对象。 */
export async function createCart({
  input,
  linesFirst = 20,
}: {
  input?: StorefrontCartInput;
  linesFirst?: number;
} = {}) {
  const data = await requestStorefrontGraphQL<CreateCartData, CreateCartVariables>(
    CREATE_CART_MUTATION,
    {
      variables: {
        input,
        linesFirst,
      },
      cache: 'no-store',
    },
  );

  assertUserErrors(data.cartCreate.userErrors);

  if (!data.cartCreate.cart) {
    throw new Error('Storefront cartCreate returned no cart.');
  }

  return data.cartCreate.cart;
}

/** 创建购物车的安全版，不抛错。 */
export async function safeCreateCart({
  input,
  linesFirst = 20,
}: {
  input?: StorefrontCartInput;
  linesFirst?: number;
} = {}): Promise<StorefrontResult<StorefrontCart>> {
  const result = await safeRequestStorefrontGraphQL<CreateCartData, CreateCartVariables>(
    CREATE_CART_MUTATION,
    {
      variables: {
        input,
        linesFirst,
      },
      cache: 'no-store',
    },
  );

  if (!result.ok) {
    return result;
  }

  const userError = getUserError(result.data.cartCreate.userErrors);
  if (userError) {
    return {
      ok: false,
      error: userError,
    };
  }

  if (!result.data.cartCreate.cart) {
    return {
      ok: false,
      error: createStorefrontError('Storefront cartCreate returned no cart.'),
    };
  }

  return {
    ok: true,
    data: result.data.cartCreate.cart,
  };
}

/** 向购物车追加商品，注意这里传的是 variant id，不是 product id。 */
export async function addCartLines({
  cartId,
  lines,
  linesFirst = 20,
}: {
  cartId: string;
  lines: StorefrontCartLineInput[];
  linesFirst?: number;
}) {
  const data = await requestStorefrontGraphQL<AddCartLinesData, AddCartLinesVariables>(
    ADD_CART_LINES_MUTATION,
    {
      variables: {
        cartId,
        lines,
        linesFirst,
      },
      cache: 'no-store',
    },
  );

  assertUserErrors(data.cartLinesAdd.userErrors);

  if (!data.cartLinesAdd.cart) {
    throw new Error('Storefront cartLinesAdd returned no cart.');
  }

  return data.cartLinesAdd.cart;
}

/** 向购物车追加商品的安全版，不抛错。 */
export async function safeAddCartLines({
  cartId,
  lines,
  linesFirst = 20,
}: {
  cartId: string;
  lines: StorefrontCartLineInput[];
  linesFirst?: number;
}): Promise<StorefrontResult<StorefrontCart>> {
  const result = await safeRequestStorefrontGraphQL<AddCartLinesData, AddCartLinesVariables>(
    ADD_CART_LINES_MUTATION,
    {
      variables: {
        cartId,
        lines,
        linesFirst,
      },
      cache: 'no-store',
    },
  );

  if (!result.ok) {
    return result;
  }

  const userError = getUserError(result.data.cartLinesAdd.userErrors);
  if (userError) {
    return {
      ok: false,
      error: userError,
    };
  }

  if (!result.data.cartLinesAdd.cart) {
    return {
      ok: false,
      error: createStorefrontError('Storefront cartLinesAdd returned no cart.'),
    };
  }

  return {
    ok: true,
    data: result.data.cartLinesAdd.cart,
  };
}

/** 便于按命名空间直接调用的 API 对象。 */
export const storefrontGraphQLApi = {
  request: requestStorefrontGraphQL,
  safeRequest: safeRequestStorefrontGraphQL,
  getProducts,
  safeGetProducts,
  getCart,
  safeGetCart,
  createCart,
  safeCreateCart,
  addCartLines,
  safeAddCartLines,
};

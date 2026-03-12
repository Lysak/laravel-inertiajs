/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query DashboardQuery($limit: Int!) {\n  dashboardStats {\n    orders\n    drinks\n    customers\n    revenue\n  }\n  orders(limit: $limit) {\n    id\n    customer_name\n    status\n    items_count\n    total\n  }\n}": typeof types.DashboardQueryDocument,
    "query DrinksIndexQuery {\n  categories {\n    id\n    name\n  }\n  drinks(with_stats: true) {\n    id\n    name\n    price\n    is_available\n    category {\n      id\n      name\n    }\n    stats {\n      total_sold\n      revenue\n    }\n  }\n}\n\nmutation CreateDrinkMutation($input: CreateDrinkInput!) {\n  createDrink(input: $input) {\n    id\n    name\n    price\n    is_available\n    category {\n      id\n      name\n    }\n  }\n}": typeof types.DrinksIndexQueryDocument,
    "query OrdersQuery($limit: Int!) {\n  orders(limit: $limit) {\n    id\n    customer_name\n    status\n    items_count\n    total\n    created_at\n  }\n}\n\nquery OrderQuery($id: ID!) {\n  order(id: $id) {\n    id\n    customer_name\n    customer_email\n    status\n    total\n    items {\n      id\n      drink_name\n      quantity\n      unit_price\n      line_total\n    }\n  }\n}\n\nquery OrderCreateDataQuery {\n  orderCreateData {\n    anonymous_customer {\n      id\n      name\n    }\n    categories {\n      id\n      name\n      drinks {\n        id\n        name\n        price\n      }\n    }\n  }\n}\n\nmutation CreateOrderMutation($input: CreateOrderInput!) {\n  createOrder(input: $input) {\n    id\n    customer_name\n    status\n    items_count\n    total\n    created_at\n  }\n}\n\nmutation MarkOrderPaidMutation($orderId: ID!) {\n  markOrderPaid(order_id: $orderId) {\n    id\n    customer_name\n    status\n    items_count\n    total\n    created_at\n  }\n}": typeof types.OrdersQueryDocument,
};
const documents: Documents = {
    "query DashboardQuery($limit: Int!) {\n  dashboardStats {\n    orders\n    drinks\n    customers\n    revenue\n  }\n  orders(limit: $limit) {\n    id\n    customer_name\n    status\n    items_count\n    total\n  }\n}": types.DashboardQueryDocument,
    "query DrinksIndexQuery {\n  categories {\n    id\n    name\n  }\n  drinks(with_stats: true) {\n    id\n    name\n    price\n    is_available\n    category {\n      id\n      name\n    }\n    stats {\n      total_sold\n      revenue\n    }\n  }\n}\n\nmutation CreateDrinkMutation($input: CreateDrinkInput!) {\n  createDrink(input: $input) {\n    id\n    name\n    price\n    is_available\n    category {\n      id\n      name\n    }\n  }\n}": types.DrinksIndexQueryDocument,
    "query OrdersQuery($limit: Int!) {\n  orders(limit: $limit) {\n    id\n    customer_name\n    status\n    items_count\n    total\n    created_at\n  }\n}\n\nquery OrderQuery($id: ID!) {\n  order(id: $id) {\n    id\n    customer_name\n    customer_email\n    status\n    total\n    items {\n      id\n      drink_name\n      quantity\n      unit_price\n      line_total\n    }\n  }\n}\n\nquery OrderCreateDataQuery {\n  orderCreateData {\n    anonymous_customer {\n      id\n      name\n    }\n    categories {\n      id\n      name\n      drinks {\n        id\n        name\n        price\n      }\n    }\n  }\n}\n\nmutation CreateOrderMutation($input: CreateOrderInput!) {\n  createOrder(input: $input) {\n    id\n    customer_name\n    status\n    items_count\n    total\n    created_at\n  }\n}\n\nmutation MarkOrderPaidMutation($orderId: ID!) {\n  markOrderPaid(order_id: $orderId) {\n    id\n    customer_name\n    status\n    items_count\n    total\n    created_at\n  }\n}": types.OrdersQueryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query DashboardQuery($limit: Int!) {\n  dashboardStats {\n    orders\n    drinks\n    customers\n    revenue\n  }\n  orders(limit: $limit) {\n    id\n    customer_name\n    status\n    items_count\n    total\n  }\n}"): (typeof documents)["query DashboardQuery($limit: Int!) {\n  dashboardStats {\n    orders\n    drinks\n    customers\n    revenue\n  }\n  orders(limit: $limit) {\n    id\n    customer_name\n    status\n    items_count\n    total\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query DrinksIndexQuery {\n  categories {\n    id\n    name\n  }\n  drinks(with_stats: true) {\n    id\n    name\n    price\n    is_available\n    category {\n      id\n      name\n    }\n    stats {\n      total_sold\n      revenue\n    }\n  }\n}\n\nmutation CreateDrinkMutation($input: CreateDrinkInput!) {\n  createDrink(input: $input) {\n    id\n    name\n    price\n    is_available\n    category {\n      id\n      name\n    }\n  }\n}"): (typeof documents)["query DrinksIndexQuery {\n  categories {\n    id\n    name\n  }\n  drinks(with_stats: true) {\n    id\n    name\n    price\n    is_available\n    category {\n      id\n      name\n    }\n    stats {\n      total_sold\n      revenue\n    }\n  }\n}\n\nmutation CreateDrinkMutation($input: CreateDrinkInput!) {\n  createDrink(input: $input) {\n    id\n    name\n    price\n    is_available\n    category {\n      id\n      name\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query OrdersQuery($limit: Int!) {\n  orders(limit: $limit) {\n    id\n    customer_name\n    status\n    items_count\n    total\n    created_at\n  }\n}\n\nquery OrderQuery($id: ID!) {\n  order(id: $id) {\n    id\n    customer_name\n    customer_email\n    status\n    total\n    items {\n      id\n      drink_name\n      quantity\n      unit_price\n      line_total\n    }\n  }\n}\n\nquery OrderCreateDataQuery {\n  orderCreateData {\n    anonymous_customer {\n      id\n      name\n    }\n    categories {\n      id\n      name\n      drinks {\n        id\n        name\n        price\n      }\n    }\n  }\n}\n\nmutation CreateOrderMutation($input: CreateOrderInput!) {\n  createOrder(input: $input) {\n    id\n    customer_name\n    status\n    items_count\n    total\n    created_at\n  }\n}\n\nmutation MarkOrderPaidMutation($orderId: ID!) {\n  markOrderPaid(order_id: $orderId) {\n    id\n    customer_name\n    status\n    items_count\n    total\n    created_at\n  }\n}"): (typeof documents)["query OrdersQuery($limit: Int!) {\n  orders(limit: $limit) {\n    id\n    customer_name\n    status\n    items_count\n    total\n    created_at\n  }\n}\n\nquery OrderQuery($id: ID!) {\n  order(id: $id) {\n    id\n    customer_name\n    customer_email\n    status\n    total\n    items {\n      id\n      drink_name\n      quantity\n      unit_price\n      line_total\n    }\n  }\n}\n\nquery OrderCreateDataQuery {\n  orderCreateData {\n    anonymous_customer {\n      id\n      name\n    }\n    categories {\n      id\n      name\n      drinks {\n        id\n        name\n        price\n      }\n    }\n  }\n}\n\nmutation CreateOrderMutation($input: CreateOrderInput!) {\n  createOrder(input: $input) {\n    id\n    customer_name\n    status\n    items_count\n    total\n    created_at\n  }\n}\n\nmutation MarkOrderPaidMutation($orderId: ID!) {\n  markOrderPaid(order_id: $orderId) {\n    id\n    customer_name\n    status\n    items_count\n    total\n    created_at\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
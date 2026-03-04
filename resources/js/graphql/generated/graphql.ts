/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

/** Drink category */
export type Category = {
  __typename?: 'Category';
  drinks: Array<Drink>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

/** Input payload for creating drink */
export type CreateDrinkInput = {
  category_id: Scalars['ID']['input'];
  is_available: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
};

/** Input payload for creating order */
export type CreateOrderInput = {
  customer_name?: InputMaybe<Scalars['String']['input']>;
  items: Array<CreateOrderItemInput>;
  user_id?: InputMaybe<Scalars['ID']['input']>;
};

/** Single item for creating order */
export type CreateOrderItemInput = {
  drink_id: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

/** Dashboard counters and revenue totals */
export type DashboardStats = {
  __typename?: 'DashboardStats';
  customers: Scalars['Int']['output'];
  drinks: Scalars['Int']['output'];
  orders: Scalars['Int']['output'];
  revenue: Scalars['Float']['output'];
};

/** Drink item from catalog */
export type Drink = {
  __typename?: 'Drink';
  category?: Maybe<Category>;
  id: Scalars['ID']['output'];
  is_available: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  stats?: Maybe<DrinkStats>;
  total_sold: Scalars['Int']['output'];
};

/** Aggregated sales stats for drink */
export type DrinkStats = {
  __typename?: 'DrinkStats';
  revenue: Scalars['Float']['output'];
  total_sold: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a new catalog drink */
  createDrink?: Maybe<Drink>;
  /** Create a customer order */
  createOrder?: Maybe<Order>;
  /** Mark order as paid */
  markOrderPaid?: Maybe<Order>;
};


export type MutationCreateDrinkArgs = {
  input: CreateDrinkInput;
};


export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type MutationMarkOrderPaidArgs = {
  order_id: Scalars['ID']['input'];
};

/** Customer order */
export type Order = {
  __typename?: 'Order';
  created_at: Scalars['String']['output'];
  customer_email?: Maybe<Scalars['String']['output']>;
  customer_name: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  items: Array<OrderItem>;
  items_count: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  total: Scalars['Float']['output'];
  updated_at: Scalars['String']['output'];
  user?: Maybe<User>;
};

/** Anonymous customer fallback used by create order flow */
export type OrderCreateCustomer = {
  __typename?: 'OrderCreateCustomer';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

/** Create order screen data */
export type OrderCreateData = {
  __typename?: 'OrderCreateData';
  anonymous_customer: OrderCreateCustomer;
  categories: Array<Category>;
};

/** Single line item within order */
export type OrderItem = {
  __typename?: 'OrderItem';
  drink?: Maybe<Drink>;
  drink_name: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  line_total: Scalars['Float']['output'];
  quantity: Scalars['Int']['output'];
  unit_price: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Catalog categories ordered by name */
  categories: Array<Category>;
  /** Dashboard aggregate statistics */
  dashboardStats?: Maybe<DashboardStats>;
  /** Catalog drinks with eager loaded category */
  drinks: Array<Drink>;
  /** Catalog drinks with eager loaded category */
  drinksOptimized?: Maybe<Array<Maybe<Drink>>>;
  /** Drinks with eager loaded category and batched stats */
  drinksWithStats?: Maybe<Array<Maybe<Drink>>>;
  /** Drinks with eager loaded category and batched stats */
  drinksWithStatsOptimized?: Maybe<Array<Maybe<Drink>>>;
  /** Single order with nested details */
  order: Order;
  /** Data needed to build the create order screen */
  orderCreateData: OrderCreateData;
  /** Orders query with eager loaded nested relations */
  orders: Array<Order>;
  /** Orders query with eager loading to avoid N+1 */
  ordersOptimized?: Maybe<Array<Maybe<Order>>>;
};


export type QueryDrinksArgs = {
  category_id?: InputMaybe<Scalars['ID']['input']>;
  is_available?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  max_price?: InputMaybe<Scalars['Float']['input']>;
  min_price?: InputMaybe<Scalars['Float']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort_by?: InputMaybe<Scalars['String']['input']>;
  sort_direction?: InputMaybe<Scalars['String']['input']>;
  with_stats?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryDrinksOptimizedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDrinksWithStatsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDrinksWithStatsOptimizedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryOrderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrdersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryOrdersOptimizedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

/** Application user */
export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  orders?: Maybe<Array<Maybe<Order>>>;
  role: Scalars['String']['output'];
};

export type DashboardQueryQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
}>;


export type DashboardQueryQuery = { __typename?: 'Query', dashboardStats?: { __typename?: 'DashboardStats', orders: number, drinks: number, customers: number, revenue: number } | null, orders: Array<{ __typename?: 'Order', id: string, customer_name: string, status: string, items_count: number, total: number }> };

export type DrinksIndexQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type DrinksIndexQueryQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, name: string }>, drinks: Array<{ __typename?: 'Drink', id: string, name: string, price: number, is_available: boolean, category?: { __typename?: 'Category', id: string, name: string } | null, stats?: { __typename?: 'DrinkStats', total_sold: number, revenue: number } | null }> };

export type CreateDrinkMutationMutationVariables = Exact<{
  input: CreateDrinkInput;
}>;


export type CreateDrinkMutationMutation = { __typename?: 'Mutation', createDrink?: { __typename?: 'Drink', id: string, name: string, price: number, is_available: boolean, category?: { __typename?: 'Category', id: string, name: string } | null } | null };

export type OrdersQueryQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
}>;


export type OrdersQueryQuery = { __typename?: 'Query', orders: Array<{ __typename?: 'Order', id: string, customer_name: string, status: string, items_count: number, total: number, created_at: string }> };

export type OrderQueryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type OrderQueryQuery = { __typename?: 'Query', order: { __typename?: 'Order', id: string, customer_name: string, customer_email?: string | null, status: string, total: number, items: Array<{ __typename?: 'OrderItem', id: string, drink_name: string, quantity: number, unit_price: number, line_total: number }> } };

export type OrderCreateDataQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type OrderCreateDataQueryQuery = { __typename?: 'Query', orderCreateData: { __typename?: 'OrderCreateData', anonymous_customer: { __typename?: 'OrderCreateCustomer', id: string, name: string }, categories: Array<{ __typename?: 'Category', id: string, name: string, drinks: Array<{ __typename?: 'Drink', id: string, name: string, price: number }> }> } };

export type CreateOrderMutationMutationVariables = Exact<{
  input: CreateOrderInput;
}>;


export type CreateOrderMutationMutation = { __typename?: 'Mutation', createOrder?: { __typename?: 'Order', id: string, customer_name: string, status: string, items_count: number, total: number, created_at: string } | null };

export type MarkOrderPaidMutationMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
}>;


export type MarkOrderPaidMutationMutation = { __typename?: 'Mutation', markOrderPaid?: { __typename?: 'Order', id: string, customer_name: string, status: string, items_count: number, total: number, created_at: string } | null };


export const DashboardQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DashboardQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dashboardStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"}},{"kind":"Field","name":{"kind":"Name","value":"drinks"}},{"kind":"Field","name":{"kind":"Name","value":"customers"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer_name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"items_count"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<DashboardQueryQuery, DashboardQueryQueryVariables>;
export const DrinksIndexQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DrinksIndexQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"drinks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"with_stats"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"is_available"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total_sold"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"}}]}}]}}]}}]} as unknown as DocumentNode<DrinksIndexQueryQuery, DrinksIndexQueryQueryVariables>;
export const CreateDrinkMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDrinkMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDrinkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDrink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"is_available"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateDrinkMutationMutation, CreateDrinkMutationMutationVariables>;
export const OrdersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrdersQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer_name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"items_count"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<OrdersQueryQuery, OrdersQueryQueryVariables>;
export const OrderQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrderQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer_name"}},{"kind":"Field","name":{"kind":"Name","value":"customer_email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"drink_name"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unit_price"}},{"kind":"Field","name":{"kind":"Name","value":"line_total"}}]}}]}}]}}]} as unknown as DocumentNode<OrderQueryQuery, OrderQueryQueryVariables>;
export const OrderCreateDataQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrderCreateDataQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderCreateData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"anonymous_customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"drinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OrderCreateDataQueryQuery, OrderCreateDataQueryQueryVariables>;
export const CreateOrderMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOrderMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer_name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"items_count"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<CreateOrderMutationMutation, CreateOrderMutationMutationVariables>;
export const MarkOrderPaidMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkOrderPaidMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markOrderPaid"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer_name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"items_count"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<MarkOrderPaidMutationMutation, MarkOrderPaidMutationMutationVariables>;
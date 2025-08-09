/**
 * GraphQL 查询和变更定义
 * 包含所有与 DeepSeek API 交互的 GraphQL 操作
 */

import { gql } from '@apollo/client';

// 健康检查查询
export const HELLO_QUERY = gql`
  query Hello {
    hello
  }
`;

// 获取支持的模型列表
export const GET_MODELS_QUERY = gql`
  query GetModels {
    models
  }
`;

// 聊天查询 (作为 Query)
export const CHAT_QUERY = gql`
  query Chat($input: ChatInput!) {
    chat(input: $input) {
      id
      model
      message {
        role
        content
      }
      usage {
        promptTokens
        completionTokens
        totalTokens
      }
    }
  }
`;

// 聊天变更 (作为 Mutation) - 推荐使用这个
export const CHAT_MUTATION = gql`
  mutation Chat($input: ChatInput!) {
    chat(input: $input) {
      id
      model
      message {
        role
        content
      }
      usage {
        promptTokens
        completionTokens
        totalTokens
      }
    }
  }
`;

// 简单文本生成变更
export const GENERATE_TEXT_MUTATION = gql`
  mutation GenerateText($input: GenerateTextInput!) {
    generateText(input: $input) {
      id
      model
      text
      usage {
        promptTokens
        completionTokens
        totalTokens
      }
    }
  }
`;

// Fragment 定义 - 可复用的字段集合
export const MESSAGE_FRAGMENT = gql`
  fragment MessageFields on Message {
    role
    content
  }
`;

export const USAGE_FRAGMENT = gql`
  fragment UsageFields on Usage {
    promptTokens
    completionTokens
    totalTokens
  }
`;

export const CHAT_RESPONSE_FRAGMENT = gql`
  fragment ChatResponseFields on ChatResponse {
    id
    model
    message {
      ...MessageFields
    }
    usage {
      ...UsageFields
    }
  }
  ${MESSAGE_FRAGMENT}
  ${USAGE_FRAGMENT}
`;